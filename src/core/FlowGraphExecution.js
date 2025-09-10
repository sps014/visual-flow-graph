/**
 * Handles node execution and dependency management for FlowGraph.
 * 
 * This class manages the execution of nodes in the correct order based on
 * their dependencies, handles branch tracking for conditional execution,
 * and provides comprehensive execution control and monitoring.
 * 
 * @class FlowGraphExecution
 * 
 * @example
 * ```javascript
 * const execution = new FlowGraphExecution(flowGraph);
 * 
 * // Execute all nodes
 * await execution.execute();
 * 
 * // Execute only selected nodes
 * await execution.executeSelectedNodes();
 * ```
 */
export class FlowGraphExecution {
  /**
   * Creates a new FlowGraphExecution instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(flowGraph) {
    /** @type {FlowGraph} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    // Branch tracking system for conditional execution
    /** @type {Map<string, Set<number>>} Map of node IDs to active output indices */
    this.activeOutputs = new Map(); // nodeId -> Set of active output indices
    
    /** @type {Map<string, Set<number>>} Map of node IDs to active input indices */
    this.activeInputs = new Map(); // nodeId -> Set of active input indices
  }

  /**
   * Execute all nodes in the graph in dependency order.
   * 
   * @async
   * @returns {Promise<void>}
   * 
   * @example
   * ```javascript
   * await execution.execute();
   * ```
   */
  async execute() {
    // Fire start event
    this.flowGraph.container.dispatchEvent(new CustomEvent('graph:execute:start', {
      detail: { timestamp: Date.now() }
    }));
    
    // Clear previous execution trail
    this.flowGraph.animations.clearExecutionTrail();
    this.clearBranchTracking();
    
    // Get execution order based on dependencies
    const executionOrder = this.getExecutionOrder();
    
    if (executionOrder.length === 0) {
      this.flowGraph.container.dispatchEvent(new CustomEvent('graph:execute:complete', {
        detail: { executedNodes: 0, timestamp: Date.now() }
      }));
      return;
    }
    
    let executedCount = 0;
    const activeAnimations = new Set();
    
    // Execute nodes in order
    let executionError = null;
    
    for (const nodeId of executionOrder) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node && node.template && node.template.onExecute) {
        // Check if node should execute based on active branches
        const shouldExecute = this.shouldNodeExecute(nodeId);
        if (!shouldExecute) {
          continue;
        }
        
        try {
          // Highlight the executing node
          this.flowGraph.animations.highlightExecutingNode(node, true);
          
          // Start animations for edges connected to this node's inputs
          if (this.flowGraph.animations.animationConfig.enabled) {
            this.flowGraph.animations.startNodeAnimations(node, activeAnimations);
          }
          
          await node.execute();
          executedCount++;
          
          // Stop animations for this node's incoming edges after execution
          if (this.flowGraph.animations.animationConfig.enabled) {
            this.flowGraph.animations.stopNodeAnimations(node, activeAnimations);
          }
          
          // Remove highlighting from the executed node
          this.flowGraph.animations.highlightExecutingNode(node, false);
        } catch (error) {
          console.error(`Error executing node ${nodeId}:`, error);
          executionError = error;
          
          // Remove highlighting from failed node
          this.flowGraph.animations.highlightExecutingNode(node, false);
          
          // Stop all animations on error
          if (this.flowGraph.animations.animationConfig.enabled) {
            this.flowGraph.animations.stopAllAnimations(activeAnimations);
          }
          break; // Stop execution on first failure
        }
      }
    }
    
    // Stop any remaining animations and clear all highlighting
    if (this.flowGraph.animations.animationConfig.enabled) {
      this.flowGraph.animations.stopAllAnimations(activeAnimations);
    }
    
    // Clear any remaining node highlighting
    this.flowGraph.animations.clearAllNodeHighlighting();
    
    // Reset all edge colors after trail duration expires
    const trailDuration = this.flowGraph.animations.getTrailDuration();
    if (trailDuration > 0) {
      setTimeout(() => {
        this.flowGraph.animations.resetAllEdgeColors();
      }, trailDuration);
    } else {
      // If trail duration is 0 (infinite), don't auto-reset colors
      // User will need to manually reset
    }
    
    // Fire complete event
    this.flowGraph.container.dispatchEvent(new CustomEvent('graph:execute:complete', {
      detail: { 
        executedNodes: executedCount,
        totalNodes: executionOrder.length,
        error: executionError,
        timestamp: Date.now()
      }
    }));
    
    // Re-throw error if execution failed
    if (executionError) {
      throw executionError;
    }
  }

  /**
   * Get execution order using topological sort
   */
  getExecutionOrder() {
    const visited = new Set();
    const visiting = new Set();
    const result = [];
    
    // Build dependency graph
    const dependencies = new Map();
    
    // Initialize dependencies for all nodes
    this.flowGraph.nodes.forEach((node, nodeId) => {
      dependencies.set(nodeId, new Set());
    });
    
    // Add dependencies based on edges
    this.flowGraph.edges.forEach(edge => {
      const fromNodeId = edge.fromSocket.node.id;
      const toNodeId = edge.toSocket.node.id;
      dependencies.get(toNodeId).add(fromNodeId);
    });
    
    // Topological sort
    const visit = (nodeId) => {
      if (visiting.has(nodeId)) {
        console.warn(`Circular dependency detected involving node ${nodeId}`);
        return;
      }
      
      if (visited.has(nodeId)) {
        return;
      }
      
      visiting.add(nodeId);
      
      // Visit all dependencies first
      const deps = dependencies.get(nodeId) || new Set();
      for (const depId of deps) {
        visit(depId);
      }
      
      visiting.delete(nodeId);
      visited.add(nodeId);
      
      // Only add nodes that have onExecute methods
      const node = this.flowGraph.nodes.get(nodeId);
      if (node && node.template && node.template.onExecute) {
        result.push(nodeId);
      }
    };
    
    // Visit all nodes
    this.flowGraph.nodes.forEach((node, nodeId) => {
      if (!visited.has(nodeId)) {
        visit(nodeId);
      }
    });
    
    return result;
  }

  /**
   * Execute all selected nodes
   */
  async executeSelectedNodes() {
    if (this.flowGraph.selection.getSelection().length === 0) {
      return;
    }
    
    const selectedNodes = this.flowGraph.selection.getSelection();
    
    // Execute nodes in parallel
    const executionPromises = selectedNodes.map(nodeId => {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        return node.execute();
      }
      return Promise.resolve();
    });
    
    try {
      await Promise.all(executionPromises);
    } catch (error) {
      console.error('Error executing selected nodes:', error);
    }
  }

  /**
   * Activate an output socket (called when setOutput is used)
   */
  activateOutputSocket(nodeId, outputIndex) {
    if (!this.activeOutputs.has(nodeId)) {
      this.activeOutputs.set(nodeId, new Set());
    }
    this.activeOutputs.get(nodeId).add(outputIndex);
    // Mark connected input sockets as active
    this.markConnectedInputsAsActive(nodeId, outputIndex);
  }

  /**
   * Mark input sockets connected to an active output as active
   */
  markConnectedInputsAsActive(nodeId, outputIndex) {
    const node = this.flowGraph.nodes.get(nodeId);
    if (!node) return;
    
    const outputArray = Array.from(node.outputs.values());
    const outputSocket = outputArray[outputIndex];
    if (!outputSocket) return;
    
    // Find all edges connected to this output
    outputSocket.connections.forEach(edge => {
      if (edge.toSocket) {
        const targetNodeId = edge.toSocket.node.id;
        const inputIndex = this.getInputSocketIndex(edge.toSocket);
        
        if (!this.activeInputs.has(targetNodeId)) {
          this.activeInputs.set(targetNodeId, new Set());
        }
        this.activeInputs.get(targetNodeId).add(inputIndex);
      }
    });
  }

  /**
   * Get the index of an input socket within its node
   */
  getInputSocketIndex(socket) {
    const inputArray = Array.from(socket.node.inputs.values());
    return inputArray.indexOf(socket);
  }

  /**
   * Get the index of an output socket within its node
   */
  getOutputSocketIndex(socket) {
    const outputArray = Array.from(socket.node.outputs.values());
    return outputArray.indexOf(socket);
  }

  /**
   * Check if a node should execute based on active branches
   * By default, all nodes execute unless explicitly disabled
   */
  shouldNodeExecute(nodeId) {
    const node = this.flowGraph.nodes.get(nodeId);
    if (!node) return false;
    
    // If node has no input sockets, it can execute
    if (node.inputs.size === 0) {
      return true;
    }
    
    // By default, execute all nodes
    // Only skip if branch tracking is active and no inputs are marked as active
    if (this.activeInputs.size > 0) {
      const activeInputs = this.activeInputs.get(nodeId) || new Set();
      return activeInputs.size > 0;
    }
    
    // If no branch tracking is active, execute all nodes
    return true;
  }

  /**
   * Clear all branch tracking (called at start of execution)
   */
  clearBranchTracking() {
    this.activeOutputs.clear();
    this.activeInputs.clear();
  }

  /**
   * Check if a node has received any input values (legacy method - keeping for compatibility)
   */
  nodeHasInputValues(node) {
    return this.shouldNodeExecute(node.id);
  }
}

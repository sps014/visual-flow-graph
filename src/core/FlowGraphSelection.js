/**
 * Handles selection management and clipboard operations for FlowGraph.
 * 
 * This class manages node selection, multi-selection, and clipboard operations
 * including copy, paste, and delete functionality. It provides a comprehensive
 * selection system that integrates with the FlowGraph interface.
 * 
 * @class FlowGraphSelection
 * 
 * @example
 * ```javascript
 * const selection = new FlowGraphSelection(flowGraph);
 * 
 * // Select a node
 * selection.selectNode('node1');
 * 
 * // Multi-select nodes
 * selection.selectNode('node2', true);
 * 
 * // Copy selected nodes
 * selection.copySelectedNodes();
 * ```
 */
export class FlowGraphSelection {
  /**
   * Creates a new FlowGraphSelection instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(flowGraph) {
    /** @type {FlowGraph} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    /** @type {Set<string>} Set of selected node IDs */
    this.selection = new Set();
    
    /** @type {Object|null} Clipboard data for copy/paste operations */
    this.clipboard = null;
  }

  /**
   * Select a node, optionally adding to existing selection.
   * 
   * @param {string} nodeId - The ID of the node to select
   * @param {boolean} [addToSelection=false] - Whether to add to existing selection
   * 
   * @example
   * ```javascript
   * // Select single node
   * selection.selectNode('node1');
   * 
   * // Add to existing selection
   * selection.selectNode('node2', true);
   * ```
   */
  selectNode(nodeId, addToSelection = false) {
    const node = this.flowGraph.nodes.get(nodeId);
    if (!node) return;
    
    if (!addToSelection) {
      this.clearSelection();
    }
    
    this.selection.add(nodeId);
    node.setSelected(true);
    
    this.flowGraph.container.dispatchEvent(new CustomEvent('node:select', {
      detail: { nodeId, node, selection: Array.from(this.selection) }
    }));
  }

  /**
   * Deselect a node from the current selection.
   * 
   * @param {string} nodeId - The ID of the node to deselect
   * 
   * @example
   * ```javascript
   * selection.deselectNode('node1');
   * ```
   */
  deselectNode(nodeId) {
    const node = this.flowGraph.nodes.get(nodeId);
    if (!node) return;
    
    this.selection.delete(nodeId);
    node.setSelected(false);
    
    this.flowGraph.container.dispatchEvent(new CustomEvent('node:deselect', {
      detail: { nodeId, node, selection: Array.from(this.selection) }
    }));
  }

  /**
   * Clear all current selections.
   * 
   * @example
   * ```javascript
   * selection.clearSelection();
   * ```
   */
  clearSelection() {
    const previousSelection = Array.from(this.selection);
    
    this.selection.forEach(nodeId => {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) node.setSelected(false);
    });
    
    this.selection.clear();
    
    this.flowGraph.container.dispatchEvent(new CustomEvent('selection:clear', {
      detail: { previousSelection }
    }));
  }

  /**
   * Get current selection
   */
  getSelection() {
    return Array.from(this.selection);
  }

  /**
   * Check if a node is selected
   */
  has(nodeId) {
    return this.selection.has(nodeId);
  }

  /**
   * Select all nodes
   */
  selectAllNodes() {
    this.clearSelection();
    this.flowGraph.nodes.forEach((node, nodeId) => {
      this.selection.add(nodeId);
      node.setSelected(true);
    });
    
    this.flowGraph.container.dispatchEvent(new CustomEvent('selection:change', {
      detail: { selectedNodes: Array.from(this.selection) }
    }));
  }

  /**
   * Delete selected nodes
   */
  deleteSelectedNodes() {
    if (this.selection.size === 0) return;
    
    // Check if in readonly mode
    if (this.flowGraph.readonly) {
      return;
    }
    
    const selectedNodes = Array.from(this.selection);
    
    // Delete edges connected to selected nodes first
    const edgesToDelete = [];
    this.flowGraph.edges.forEach((edge, edgeId) => {
      if (selectedNodes.includes(edge.fromNodeId) || selectedNodes.includes(edge.toNodeId)) {
        edgesToDelete.push(edgeId);
      }
    });
    
    edgesToDelete.forEach(edgeId => {
      this.flowGraph.removeEdge(edgeId);
    });
    
    // Delete selected nodes
    selectedNodes.forEach(nodeId => {
      this.flowGraph.removeNode(nodeId);
    });
    
    this.clearSelection();
    
    // Dispatch bulk delete event
    this.flowGraph.container.dispatchEvent(new CustomEvent('nodes:delete', {
      detail: { deletedNodes: selectedNodes, deletedEdges: edgesToDelete }
    }));
  }

  /**
   * Copy selected nodes
   */
  copySelectedNodes() {
    if (this.selection.size === 0) return;
    
    const selectedNodes = Array.from(this.selection);
    const copyData = {
      nodes: [],
      edges: [],
      timestamp: Date.now()
    };
    
    // Collect node data (just type and position)
    selectedNodes.forEach(nodeId => {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        copyData.nodes.push({
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y
        });
      }
    });
    
    // Collect edge data for connections between selected nodes
    this.flowGraph.edges.forEach((edge, edgeId) => {
      if (selectedNodes.includes(edge.fromNodeId) && selectedNodes.includes(edge.toNodeId)) {
        copyData.edges.push({
          id: edgeId,
          fromNodeId: edge.fromNodeId,
          fromSocketId: edge.fromSocketId,
          toNodeId: edge.toNodeId,
          toSocketId: edge.toSocketId
        });
      }
    });
    
    // Store in clipboard
    this.clipboard = copyData;
    
    this.flowGraph.container.dispatchEvent(new CustomEvent('nodes:copy', {
      detail: { copiedNodes: selectedNodes, copyData }
    }));
  }

  /**
   * Paste nodes
   */
  pasteNodes() {
    if (!this.clipboard || !this.clipboard.nodes.length) {
      return;
    }
    
    // Check if in readonly mode
    if (this.flowGraph.readonly) {
      return;
    }
    
    const pasteOffset = { x: 20, y: 20 }; // Offset for pasted nodes
    const newNodes = [];
    const nodeIdMap = new Map(); // Map old IDs to new IDs
    
    // Clear current selection
    this.clearSelection();
    
    // Create new nodes
    this.clipboard.nodes.forEach(nodeData => {
      const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      nodeIdMap.set(nodeData.id, newNodeId);
      
      try {
        const newNode = this.flowGraph.addNode(nodeData.type, {
          id: newNodeId,
          x: nodeData.x + pasteOffset.x,
          y: nodeData.y + pasteOffset.y
        });
        
        if (newNode) {
          newNodes.push(newNode);
          this.selection.add(newNodeId);
          newNode.setSelected(true);
        }
      } catch (error) {
        console.warn(`Could not paste node of type ${nodeData.type}:`, error.message);
      }
    });
    
    // Create new edges with updated node IDs
    this.clipboard.edges.forEach(edgeData => {
      const newFromNodeId = nodeIdMap.get(edgeData.fromNodeId);
      const newToNodeId = nodeIdMap.get(edgeData.toNodeId);
      
      if (newFromNodeId && newToNodeId) {
        const fromNode = this.flowGraph.nodes.get(newFromNodeId);
        const toNode = this.flowGraph.nodes.get(newToNodeId);
        
        if (fromNode && toNode) {
          const fromSocket = fromNode.outputs.get(edgeData.fromSocketId);
          const toSocket = toNode.inputs.get(edgeData.toSocketId);
          
          if (fromSocket && toSocket && fromSocket.canConnect(toSocket)) {
            this.flowGraph.createEdge({
              fromNodeId: newFromNodeId,
              fromSocketId: edgeData.fromSocketId,
              toNodeId: newToNodeId,
              toSocketId: edgeData.toSocketId
            });
          }
        }
      }
    });
    
    this.flowGraph.container.dispatchEvent(new CustomEvent('nodes:paste', {
      detail: { pastedNodes: newNodes.map(n => n.id), nodeIdMap: Object.fromEntries(nodeIdMap) }
    }));
  }
}

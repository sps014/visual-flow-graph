/**
 * Handles all animation-related functionality for FlowGraph
 */
export class FlowGraphAnimations {
  constructor(flowGraph) {
    this.flowGraph = flowGraph;
    
    // Animation configuration
    this.animationConfig = {
      enabled: true,
      style: 'flowing', // 'flowing', 'pulsing', 'data-flow'
      speed: 'normal', // 'slow', 'normal', 'fast'
      duration: 1000 // Base duration for animations
    };
  }

  /**
   * Configure edge animations during execution
   */
  setAnimationConfig(config) {
    this.animationConfig = { ...this.animationConfig, ...config };
  }

  /**
   * Set trail duration for animations
   */
  setTrailDuration(duration) {
    this.animationConfig.duration = duration;
  }

  /**
   * Get trail duration for animations
   */
  getTrailDuration() {
    return this.animationConfig.duration;
  }

  /**
   * Highlight or unhighlight a node during execution
   */
  highlightExecutingNode(node, isExecuting) {
    if (!node.element) return;
    
    if (isExecuting) {
      node.element.classList.add('executing');
      // Add animation style class for color coordination
      const { style } = this.animationConfig;
      if (style) {
        node.element.classList.add(style);
      }
    } else {
      node.element.classList.remove('executing', 'flowing', 'pulsing', 'data-flow');
    }
  }

  /**
   * Clear all node highlighting
   */
  clearAllNodeHighlighting() {
    this.flowGraph.nodes.forEach(node => {
      if (node.element) {
        node.element.classList.remove('executing', 'flowing', 'pulsing', 'data-flow');
      }
    });
  }

  /**
   * Add edge to execution trail
   */
  addToExecutionTrail(edge) {
    if (!edge.element) return;
    
    const { style } = this.animationConfig;
    
    // Remove all animation classes first
    edge.element.classList.remove('flowing', 'flowing-fast', 'flowing-slow', 'pulsing', 'data-flow');
    
    // Add trail and color classes (no animations)
    edge.element.classList.add('trail');
    if (style) {
      edge.element.classList.add(style);
    }
  }

  /**
   * Clear execution trail
   */
  clearExecutionTrail() {
    this.flowGraph.edges.forEach(edge => {
      if (edge.element) {
        edge.element.classList.remove('trail', 'flowing', 'flowing-fast', 'flowing-slow', 'pulsing', 'data-flow');
      }
    });
  }

  /**
   * Reset all edge colors to default
   */
  resetAllEdgeColors() {
    this.flowGraph.edges.forEach(edge => {
      if (edge.element) {
        // Remove all animation and trail classes
        edge.element.classList.remove('trail', 'flowing', 'flowing-fast', 'flowing-slow', 'pulsing', 'data-flow');
        
        // Reset to default edge styling
        edge.element.setAttribute('stroke', '#10b981'); // Default green color
        edge.element.setAttribute('stroke-width', '2.5'); // Default stroke width
        edge.element.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'; // Default shadow
        edge.element.style.opacity = '1'; // Reset opacity
      }
    });
  }

  /**
   * Start animations for edges connected to a node's inputs
   * Output edges are animated separately based on execution results
   */
  startNodeAnimations(node, activeAnimations) {
    // Animate input edges (data coming into the node)
    node.inputs.forEach(inputSocket => {
      inputSocket.connections.forEach(edge => {
        if (!activeAnimations.has(edge.id)) {
          this.startEdgeAnimation(edge);
          activeAnimations.add(edge.id);
        }
      });
    });
  }

  /**
   * Stop animations for edges connected to a node's inputs
   */
  stopNodeAnimations(node, activeAnimations) {
    // Stop animations for all incoming edges that were animated
    node.inputs.forEach(inputSocket => {
      inputSocket.connections.forEach(edge => {
        if (activeAnimations.has(edge.id)) {
          this.stopEdgeAnimation(edge);
          // Mark edge as part of execution trail
          this.addToExecutionTrail(edge);
          activeAnimations.delete(edge.id);
        }
      });
    });
  }

  /**
   * Start animation for a specific edge
   */
  startEdgeAnimation(edge) {
    const { style, speed } = this.animationConfig;
    
    switch (style) {
      case 'flowing':
        edge.startFlow(speed);
        break;
      case 'pulsing':
        edge.startPulse();
        break;
      case 'data-flow':
        edge.startDataFlow();
        break;
      default:
        edge.startFlow(speed);
    }
  }

  /**
   * Stop animation for a specific edge
   */
  stopEdgeAnimation(edge) {
    edge.stopAnimation();
  }

  /**
   * Stop all active animations
   */
  stopAllAnimations(activeAnimations) {
    activeAnimations.forEach(edgeId => {
      const edge = this.flowGraph.edges.get(edgeId);
      if (edge) {
        edge.stopAnimation();
      }
    });
    activeAnimations.clear();
  }

  /**
   * Animate specific output edges based on execution results
   * This is used for conditional nodes where only certain branches should be animated
   */
  animateOutputEdges(node, outputSocketNames, activeAnimations) {
    if (!outputSocketNames || outputSocketNames.length === 0) return;
    
    outputSocketNames.forEach(socketName => {
      const outputSocket = node.outputs.get(socketName);
      if (outputSocket) {
        outputSocket.connections.forEach(edge => {
          if (!activeAnimations.has(edge.id)) {
            this.startEdgeAnimation(edge);
            activeAnimations.add(edge.id);
          }
        });
      }
    });
  }
}

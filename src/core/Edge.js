/**
 * Represents a connection between two sockets.
 * 
 * An Edge visually connects an output socket to an input socket,
 * creating a data flow path between nodes. Edges are rendered as
 * SVG paths and can be animated to show data flow.
 * 
 * @class Edge
 * 
 * @example
 * ```javascript
 * // Create an edge between two sockets
 * const edge = new Edge(flowGraph, outputSocket, inputSocket);
 * 
 * // Animate the edge
 * edge.startFlow('fast');
 * ```
 */
export class Edge {
  /**
   * Creates a new Edge instance connecting two sockets.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   * @param {Socket} fromSocket - The source (output) socket
   * @param {Socket} toSocket - The target (input) socket
   */
  constructor(flowGraph, fromSocket, toSocket) {
    /** @type {FlowGraph} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    /** @type {Socket} The source (output) socket */
    this.fromSocket = fromSocket;
    
    /** @type {Socket} The target (input) socket */
    this.toSocket = toSocket;
    
    /** @type {string} Unique identifier for this edge */
    this.id = `edge_${fromSocket.node.id}_${fromSocket.id}_${toSocket.node.id}_${toSocket.id}`;
    
    /** @type {SVGPathElement|null} The SVG path element for this edge */
    this.element = null;
    
    this.init();
  }
  
  /**
   * Initialize the edge after construction.
   * Creates the SVG element and registers with both sockets.
   * 
   * @private
   */
  init() {
    this.createElement();
    this.updatePath();
    
    // Register connection with sockets
    this.fromSocket.addConnection(this);
    this.toSocket.addConnection(this);
  }
  
  /**
   * Create the SVG path element for this edge.
   * Sets up styling and event handlers.
   * 
   * @private
   */
  createElement() {
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.element.setAttribute('stroke', '#10b981'); // Green color for better visibility
    this.element.setAttribute('stroke-width', '2.5'); // Reduced stroke width
    this.element.setAttribute('fill', 'none');
    this.element.setAttribute('stroke-linecap', 'round');
    this.element.classList.add('connection', 'edge');
    this.element.style.pointerEvents = 'stroke';
    this.element.style.cursor = 'pointer';
    
    // Add click handler for selection/deletion
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Could add edge selection logic here
    });
    
    this.flowGraph.edgeSvg.appendChild(this.element);
  }
  
  /**
   * Update the visual path of this edge.
   * Recalculates the bezier curve based on current socket positions.
   * 
   * @private
   */
  updatePath() {
    if (!this.fromSocket.element || !this.toSocket.element) return;
    
    const fromPos = this.fromSocket.getPosition();
    const toPos = this.toSocket.getPosition();
    
    const path = this.flowGraph.createCubicPath(fromPos, toPos, this.fromSocket, this.toSocket);
    this.element.setAttribute('d', path);
  }
  
  /**
   * Set the animation type and speed for this edge.
   * 
   * @param {string|null} animationType - Type of animation: 'flowing', 'pulsing', 'data-flow', or null
   * @param {string} [speed='normal'] - Speed for flowing animation: 'slow', 'normal', 'fast'
   * 
   * @example
   * ```javascript
   * edge.setAnimation('flowing', 'fast');
   * edge.setAnimation('pulsing');
   * edge.setAnimation(null); // Stop animation
   * ```
   */
  setAnimation(animationType, speed = 'normal') {
    // Remove all animation classes
    this.element.classList.remove('flowing', 'flowing-fast', 'flowing-slow', 'pulsing', 'data-flow');
    
    if (animationType) {
      this.element.classList.add(animationType);
      
      // Add speed modifier if applicable
      if (animationType === 'flowing' && speed !== 'normal') {
        this.element.classList.add(`flowing-${speed}`);
      }
    }
  }
  
  /**
   * Start flowing animation on this edge.
   * 
   * @param {string} [speed='normal'] - Animation speed: 'slow', 'normal', 'fast'
   * 
   * @example
   * ```javascript
   * edge.startFlow('fast'); // Start fast flowing animation
   * ```
   */
  startFlow(speed = 'normal') {
    this.setAnimation('flowing', speed);
  }
  
  /**
   * Start pulsing animation on this edge.
   * 
   * @example
   * ```javascript
   * edge.startPulse(); // Start pulsing animation
   * ```
   */
  startPulse() {
    this.setAnimation('pulsing');
  }
  
  /**
   * Start data flow animation on this edge.
   * 
   * @example
   * ```javascript
   * edge.startDataFlow(); // Start data flow animation
   * ```
   */
  startDataFlow() {
    this.setAnimation('data-flow');
  }
  
  /**
   * Stop all animations on this edge.
   * 
   * @example
   * ```javascript
   * edge.stopAnimation(); // Stop all animations
   * ```
   */
  stopAnimation() {
    this.setAnimation(null);
  }
  
  serialize() {
    return {
      id: this.id,
      fromNodeId: this.fromSocket.node.id,
      fromSocketId: this.fromSocket.id,
      toNodeId: this.toSocket.node.id,
      toSocketId: this.toSocket.id
    };
  }
  
  destroy() {
    // Unregister from sockets
    this.fromSocket.removeConnection(this);
    this.toSocket.removeConnection(this);
    
    // Remove from DOM
    if (this.element) {
      this.element.remove();
    }
  }
}

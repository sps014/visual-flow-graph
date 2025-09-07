export class Edge {
  constructor(flowGraph, fromSocket, toSocket) {
    this.flowGraph = flowGraph;
    this.fromSocket = fromSocket;
    this.toSocket = toSocket;
    this.id = `edge_${fromSocket.node.id}_${fromSocket.id}_${toSocket.node.id}_${toSocket.id}`;
    this.element = null;
    
    this.init();
  }
  
  init() {
    this.createElement();
    this.updatePath();
    
    // Register connection with sockets
    this.fromSocket.addConnection(this);
    this.toSocket.addConnection(this);
  }
  
  createElement() {
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.element.setAttribute('stroke', 'var(--fg-edge)');
    this.element.setAttribute('stroke-width', '3.5');
    this.element.setAttribute('fill', 'none');
    this.element.setAttribute('stroke-linecap', 'round');
    this.element.classList.add('connection');
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
  
  updatePath() {
    if (!this.fromSocket.element || !this.toSocket.element) return;
    
    const fromPos = this.fromSocket.getPosition();
    const toPos = this.toSocket.getPosition();
    
    const path = this.flowGraph.createCubicPath(fromPos, toPos, this.fromSocket, this.toSocket);
    this.element.setAttribute('d', path);
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

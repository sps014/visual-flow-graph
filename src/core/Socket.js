export class Socket {
  constructor(node, config = {}) {
    this.node = node;
    this.id = config.id;
    this.type = config.type; // 'input' or 'output'
    this.dataType = config.dataType || 'any';
    this.label = config.label || this.id;
    this.element = null;
    this.connections = new Set();
    this.maxConnections = config.maxConnections || (this.type === 'output' ? Infinity : 1);
  }
  
  canConnect(otherSocket) {
    if (!otherSocket) return false;
    if (otherSocket === this) return false;
    if (otherSocket.node === this.node) return false;
    if (otherSocket.type === this.type) return false;
    
    // Check connection limits
    if (this.connections.size >= this.maxConnections) return false;
    if (otherSocket.connections.size >= otherSocket.maxConnections) return false;
    
    // Check if already connected
    for (const connection of this.connections) {
      if (connection.fromSocket === otherSocket || connection.toSocket === otherSocket) {
        return false;
      }
    }
    
    return true;
  }
  
  addConnection(edge) {
    this.connections.add(edge);
  }
  
  removeConnection(edge) {
    this.connections.delete(edge);
  }
  
  getPosition() {
    if (!this.element) return { x: 0, y: 0 };
    
    const rect = this.element.getBoundingClientRect();
    const surfaceRect = this.node.flowGraph.surface.getBoundingClientRect();
    
    const x = (rect.left + rect.width / 2 - surfaceRect.left - this.node.flowGraph.viewport.x) / this.node.flowGraph.viewport.scale;
    const y = (rect.top + rect.height / 2 - surfaceRect.top - this.node.flowGraph.viewport.y) / this.node.flowGraph.viewport.scale;
    
    return { x, y };
  }
}

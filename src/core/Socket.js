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
  
  setupContextMenu() {
    if (!this.element) return;
    
    this.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Only show context menu if there are connections
      if (this.connections.size === 0) return;
      
      this.showContextMenu(e.clientX, e.clientY);
    });
  }
  
  showContextMenu(x, y) {
    // Remove existing context menu
    this.hideContextMenu();
    
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'socket-context-menu';
    menu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: var(--fg-panel);
      border: 1px solid var(--fg-muted);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      min-width: 120px;
      padding: 4px 0;
    `;
    
    // Add delete option for each connection
    this.connections.forEach(edge => {
      const item = document.createElement('div');
      item.className = 'context-menu-item';
      item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--fg-text);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      
      item.innerHTML = `
        <span style="color: var(--fg-error);">🗑️</span>
        <span>Delete connection to ${edge.toSocket?.node?.label || edge.fromSocket?.node?.label || 'node'}</span>
      `;
      
      item.addEventListener('click', () => {
        this.node.flowGraph.removeEdge(edge.id);
        this.hideContextMenu();
      });
      
      item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--fg-accent)';
        item.style.color = 'white';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
        item.style.color = 'var(--fg-text)';
      });
      
      menu.appendChild(item);
    });
    
    // Add separator if there are multiple connections
    if (this.connections.size > 1) {
      const separator = document.createElement('div');
      separator.style.cssText = `
        height: 1px;
        background: var(--fg-muted);
        margin: 4px 0;
      `;
      menu.appendChild(separator);
      
      // Add "Delete All" option
      const deleteAllItem = document.createElement('div');
      deleteAllItem.className = 'context-menu-item';
      deleteAllItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--fg-error);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
      `;
      
      deleteAllItem.innerHTML = `
        <span>🗑️</span>
        <span>Delete all connections</span>
      `;
      
      deleteAllItem.addEventListener('click', () => {
        const edgesToRemove = Array.from(this.connections);
        edgesToRemove.forEach(edge => {
          this.node.flowGraph.removeEdge(edge.id);
        });
        this.hideContextMenu();
      });
      
      deleteAllItem.addEventListener('mouseenter', () => {
        deleteAllItem.style.background = 'var(--fg-error)';
        deleteAllItem.style.color = 'white';
      });
      
      deleteAllItem.addEventListener('mouseleave', () => {
        deleteAllItem.style.background = 'transparent';
        deleteAllItem.style.color = 'var(--fg-error)';
      });
      
      menu.appendChild(deleteAllItem);
    }
    
    document.body.appendChild(menu);
    this.contextMenu = menu;
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        this.hideContextMenu();
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }
  
  hideContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }
  
  destroy() {
    this.hideContextMenu();
    if (this.element) {
      this.element.removeEventListener('contextmenu', this.showContextMenu);
    }
  }
}

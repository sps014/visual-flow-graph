/**
 * Represents a connection point on a node.
 * 
 * Sockets are the connection points that allow nodes to be linked together.
 * They can be either input or output sockets and handle connection validation,
 * value propagation, and visual representation.
 * 
 * @class Socket
 * 
 * @example
 * ```javascript
 * // Create an input socket
 * const inputSocket = new Socket(node, {
 *   id: 'input1',
 *   type: 'input',
 *   dataType: 'number',
 *   label: 'Value'
 * });
 * 
 * // Create an output socket
 * const outputSocket = new Socket(node, {
 *   id: 'output1',
 *   type: 'output',
 *   dataType: 'number',
 *   label: 'Result'
 * });
 * ```
 */
export class Socket {
  /**
   * Creates a new Socket instance.
   * 
   * @param {Node} node - The parent node this socket belongs to
   * @param {Object} [config={}] - Configuration object for the socket
   * @param {string} config.id - Unique identifier for this socket
   * @param {string} config.type - Socket type: 'input' or 'output'
   * @param {string} [config.dataType='any'] - Data type this socket accepts/provides
   * @param {string} [config.label] - Display label for the socket
   * @param {number} [config.maxConnections] - Maximum number of connections allowed
   */
  constructor(node, config = {}) {
    /** @type {Node} The parent node this socket belongs to */
    this.node = node;
    
    /** @type {string} The ID of the parent node */
    this.nodeId = node.id;
    
    /** @type {string} Unique identifier for this socket */
    this.id = config.id;
    
    /** @type {string} Socket type: 'input' or 'output' */
    this.type = config.type; // 'input' or 'output'
    
    /** @type {string} Data type this socket accepts/provides */
    this.dataType = config.dataType || 'any';
    
    /** @type {string} Display label for the socket */
    this.label = config.label || this.id;
    
    /** @type {HTMLElement|null} The DOM element for this socket */
    this.element = null;
    
    /** @type {Set<Edge>} Set of edges connected to this socket */
    this.connections = new Set();
    
      /** @type {number} Maximum number of connections allowed */
      this.maxConnections = config.maxConnections || (this.type === 'output' ? Infinity : 1);
      
      /** @type {Object|null} Original colors of the socket before any edge connections */
      this.originalColors = null;
    }
  
  /**
   * Check if this socket can connect to another socket.
   * Validates type compatibility, connection limits, and prevents duplicate connections.
   * 
   * @param {Socket} otherSocket - The socket to check connection compatibility with
   * @returns {boolean} True if the sockets can be connected
   * 
   * @example
   * ```javascript
   * if (inputSocket.canConnect(outputSocket)) {
   *   // Create connection
   * }
   * ```
   */
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
  
  /**
   * Add an edge connection to this socket.
   * 
   * @param {Edge} edge - The edge to add to this socket's connections
   */
  addConnection(edge) {
    this.connections.add(edge);
    
    // If this is an input socket, update its color to match the edge
    if (this.type === 'input') {
      this.updateColorFromEdge(edge);
    }
  }
  
  /**
   * Remove an edge connection from this socket.
   * 
   * @param {Edge} edge - The edge to remove from this socket's connections
   */
  removeConnection(edge) {
    this.connections.delete(edge);
    
    // If this is an input socket, reset to default color when disconnected
    if (this.type === 'input') {
      this.resetToDefaultColor();
    }
  }
  
  /**
   * Get the screen position of this socket.
   * Returns coordinates relative to the flow graph surface.
   * 
   * @returns {Object} Object with x and y coordinates
   * @returns {number} returns.x - X coordinate
   * @returns {number} returns.y - Y coordinate
   * 
   * @example
   * ```javascript
   * const pos = socket.getPosition();
   * console.log(`Socket at ${pos.x}, ${pos.y}`);
   * ```
   */
  getPosition() {
    if (!this.element) return { x: 0, y: 0 };
    
    const rect = this.element.getBoundingClientRect();
    const surfaceRect = this.node.flowGraph.surface.getBoundingClientRect();
    
    // Offset by socket width based on type
    let xOffset = rect.width / 2;
    if (this.type === 'output') {
      xOffset = rect.width / 2; // +width/2 for output sockets
    } else if (this.type === 'input') {
      xOffset = -rect.width / 2; // -width/2 for input sockets
    }
    
    const x = (rect.left + rect.width / 2 + xOffset - surfaceRect.left - this.node.flowGraph.viewport.x) / this.node.flowGraph.viewport.scale;
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
      
      // Get the connected node (the one that's not this socket's node)
      const connectedNode = edge.fromSocket?.node === this.node ? edge.toSocket?.node : edge.fromSocket?.node;
      const nodeLabel = connectedNode?.label || connectedNode?.type || 'node';
      
      item.innerHTML = `
        <span style="color: var(--fg-error);">🗑️</span>
        <span>Delete connection to ${nodeLabel}</span>
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
  
  /**
   * Store the original colors of the socket before any modifications.
   * 
   * @private
   */
  storeOriginalColors() {
    if (!this.element || this.originalColors) return;
    
    // Find the actual socket element - could be .socket class or custom shape
    let socketElement = this.element.querySelector('.socket');
    
    // If no .socket class found, look for any span element (custom shapes)
    if (!socketElement) {
      socketElement = this.element.querySelector('span');
    }
    
    if (!socketElement) return;
    
    // Store original colors
    this.originalColors = {
      borderColor: socketElement.style.borderColor || getComputedStyle(socketElement).borderColor,
      background: socketElement.style.background || getComputedStyle(socketElement).background
    };
  }
  
  /**
   * Update the socket color to match the connected edge.
   * 
   * @param {Edge} edge - The edge to get the color from
   * @private
   */
  updateColorFromEdge(edge) {
    if (!this.element) return;
    
    const edgeColor = edge.color;
    if (!edgeColor) return;
    
    // Store original colors if not already stored
    this.storeOriginalColors();
    
    // Find the actual socket element - could be .socket class or custom shape
    let socketElement = this.element.querySelector('.socket');
    
    // If no .socket class found, look for any span element (custom shapes)
    if (!socketElement) {
      socketElement = this.element.querySelector('span');
    }
    
    if (!socketElement) return;
    
    // Update the socket element's border color
    socketElement.style.borderColor = edgeColor;
    
    // Use fully opaque color for background
    socketElement.style.background = edgeColor;
  }
  
  /**
   * Reset the socket to its original color.
   * 
   * @private
   */
  resetToDefaultColor() {
    if (!this.element) return;
    
    // Find the actual socket element - could be .socket class or custom shape
    let socketElement = this.element.querySelector('.socket');
    
    // If no .socket class found, look for any span element (custom shapes)
    if (!socketElement) {
      socketElement = this.element.querySelector('span');
    }
    
    if (!socketElement) return;
    
    // If we have stored original colors, restore them
    if (this.originalColors) {
      socketElement.style.borderColor = this.originalColors.borderColor;
      socketElement.style.background = this.originalColors.background;
    } else {
      // Fallback to default input socket color if no original colors stored
      const defaultColor = '#10b981';
      socketElement.style.borderColor = defaultColor;
      socketElement.style.background = defaultColor;
    }
    
    // Update tempPath color if there's an active connection from this socket
    if (this.node.flowGraph.connections.connectionState.active && 
        this.node.flowGraph.connections.connectionState.fromSocket === this) {
      this.node.flowGraph.connections.updateTempPathColor(this);
    }
  }
  
  /**
   * Convert a color to rgba format with specified alpha.
   * 
   * @param {string} color - The color to convert
   * @param {number} alpha - The alpha value (0-1)
   * @returns {string} The rgba color string
   * @private
   */
  colorToRgba(color, alpha) {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
      }
    }
    
    // Fallback
    return `rgba(16, 185, 129, ${alpha})`;
  }
  
  destroy() {
    this.hideContextMenu();
    if (this.element) {
      this.element.removeEventListener('contextmenu', this.showContextMenu);
    }
  }
}

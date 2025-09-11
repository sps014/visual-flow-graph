/**
 * Handles socket connections and edge creation for FlowGraph.
 * 
 * This class manages the connection system between nodes, including
 * socket interaction, edge creation, connection validation, and
 * visual feedback during connection operations.
 * 
 * @class FlowGraphConnections
 * 
 * @example
 * ```javascript
 * const connections = new FlowGraphConnections(flowGraph);
 * 
 * // Check if two sockets can connect
 * const canConnect = connections.canConnect(socket1, socket2);
 * 
 * // Get socket position
 * const position = connections.getSocketPosition(socket);
 * ```
 */
export class FlowGraphConnections {
  /**
   * Creates a new FlowGraphConnections instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(flowGraph) {
    /** @type {FlowGraph} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    // Connection state
    /** @type {Object} Current connection operation state */
    this.connectionState = {
      active: false,
      fromSocket: null,
      toSocket: null
    };
  }

  /**
   * Setup event listeners for connection operations.
   * Handles pointer events for socket interactions.
   * 
   * @private
   */
  setupEventListeners() {
    // Socket connection handling
    this.flowGraph.container.addEventListener('pointerdown', this.handleSocketPointerDown.bind(this));
    this.flowGraph.container.addEventListener('pointermove', this.handleSocketPointerMove.bind(this));
    this.flowGraph.container.addEventListener('pointerup', this.handleSocketPointerUp.bind(this));
  }

  /**
   * Handle socket pointer down
   */
  handleSocketPointerDown(e) {
    // Check for flow-socket component
    const flowSocket = e.target.closest('flow-socket');
    
    if (!flowSocket) return;
    
    // Check if in readonly mode
    if (this.flowGraph.readonly) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const nodeElement = flowSocket.closest('.node');
    const nodeId = nodeElement?.dataset.id;
    const socketId = flowSocket.getAttribute('name');
    const actualSocketElement = flowSocket.shadowRoot?.querySelector('flow-socket-anchor');
    
    if (!nodeId || !socketId) return;
    
    const node = this.flowGraph.nodes.get(nodeId);
    const socketObj = node?.getSocket(socketId);
    
    if (!socketObj) return;
    
    this.connectionState.active = true;
    this.connectionState.fromSocket = socketObj;
    
    // Add visual feedback to the inner socket element
    const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
    if (innerSocket) {
      innerSocket.classList.add('socket-active');
    }
    
    // Show temp path
    this.flowGraph.tempPath.style.display = 'block';
    this.updateTempPath(e.clientX, e.clientY);
  }

  /**
   * Handle socket pointer move
   */
  handleSocketPointerMove(e) {
    if (!this.connectionState.active) return;
    
    this.updateTempPath(e.clientX, e.clientY);
    
    // Check for socket hover - flow-socket components only
    const flowSocket = e.target.closest('flow-socket');
    
    if (flowSocket && flowSocket !== this.connectionState.fromSocket?.element?.closest('flow-socket')) {
      const nodeElement = flowSocket.closest('.node');
      const nodeId = nodeElement?.dataset.id;
      const socketId = flowSocket.getAttribute('name');
      
      if (nodeId && socketId) {
        const node = this.flowGraph.nodes.get(nodeId);
        const socketObj = node?.getSocket(socketId);
        
        if (socketObj && this.canConnect(this.connectionState.fromSocket, socketObj)) {
          // Add visual feedback to the inner socket element
          const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
          if (innerSocket) {
            innerSocket.classList.add('socket-hover');
          }
          this.connectionState.toSocket = socketObj;
        } else {
          // Remove visual feedback from the inner socket element
          const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
          if (innerSocket) {
            innerSocket.classList.remove('socket-hover');
          }
          this.connectionState.toSocket = null;
        }
      }
    } else {
      // Remove hover from all sockets
      this.flowGraph.container.querySelectorAll('.socket-hover').forEach(s => {
        s.classList.remove('socket-hover');
      });
      // Also remove hover from flow-socket inner elements
      this.flowGraph.container.querySelectorAll('flow-socket').forEach(flowSocket => {
        const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
        if (innerSocket) {
          innerSocket.classList.remove('socket-hover');
        }
      });
      this.connectionState.toSocket = null;
    }
  }

  /**
   * Handle socket pointer up
   */
  handleSocketPointerUp(e) {
    if (!this.connectionState.active) return;
    
    // Clean up visual feedback - both legacy sockets and flow-socket components
    this.flowGraph.container.querySelectorAll('.socket-active').forEach(s => {
      s.classList.remove('socket-active');
    });
    this.flowGraph.container.querySelectorAll('.socket-hover').forEach(s => {
      s.classList.remove('socket-hover');
    });
    
    // Also clean up socket elements in flow-socket shadow DOMs
    this.flowGraph.container.querySelectorAll('flow-socket').forEach(flowSocket => {
      const socketElement = flowSocket.shadowRoot?.querySelector('.socket');
      if (socketElement) {
        socketElement.classList.remove('socket-active', 'socket-hover');
      }
    });
    
    this.flowGraph.tempPath.style.display = 'none';
    
    // Create connection if valid
    if (this.connectionState.fromSocket && this.connectionState.toSocket) {
      this.flowGraph.createEdge(this.connectionState.fromSocket, this.connectionState.toSocket);
    }
    
    // Reset state
    this.connectionState.active = false;
    this.connectionState.fromSocket = null;
    this.connectionState.toSocket = null;
  }

  /**
   * Update temporary path during connection
   */
  updateTempPath(clientX, clientY) {
    if (!this.connectionState.fromSocket) return;
    
    const fromSocket = this.connectionState.fromSocket;
    const fromPos = this.getSocketPosition(fromSocket);
    
    // Convert client coordinates to surface coordinates
    const surfaceRect = this.flowGraph.surface.getBoundingClientRect();
    const toX = (clientX - surfaceRect.left - this.flowGraph.viewport.x) / this.flowGraph.viewport.scale;
    const toY = (clientY - surfaceRect.top - this.flowGraph.viewport.y) / this.flowGraph.viewport.scale;
    
    const path = this.createCubicPath(fromPos, { x: toX, y: toY }, fromSocket);
    this.flowGraph.tempPath.setAttribute('d', path);
  }

  /**
   * Get socket position in world coordinates
   */
  getSocketPosition(socket) {
    let element = socket.element;
    
    // If element is null, try to find it again (for flow-socket components)
    if (!element) {
      const node = this.flowGraph.nodes.get(socket.nodeId);
      if (node) {
        // Try to find the flow-socket component and get its anchor
        const flowSocket = node.element.querySelector(`flow-socket[name="${socket.id}"]`);
        if (flowSocket) {
          element = flowSocket.shadowRoot?.querySelector('flow-socket-anchor');
          if (element) {
            socket.element = element; // Update the socket's element reference
          }
        }
      }
    }
    
    if (!element) {
      console.warn(`Socket element not found for socket ${socket.id}`);
      return { x: 0, y: 0 };
    }
    
    const rect = element.getBoundingClientRect();
    const surfaceRect = this.flowGraph.surface.getBoundingClientRect();
    
    const x = (rect.left + rect.width / 2 - surfaceRect.left - this.flowGraph.viewport.x) / this.flowGraph.viewport.scale;
    const y = (rect.top + rect.height / 2 - surfaceRect.top - this.flowGraph.viewport.y) / this.flowGraph.viewport.scale;
    
    return { x, y };
  }

  /**
   * Create cubic bezier path between two points
   */
  createCubicPath(from, to, fromSocket = null, toSocket = null) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const offset = Math.min(200, dist * 0.5);
    
    let c1, c2;
    
    if (fromSocket) {
      const isOutput = fromSocket.type === 'output';
      if (isOutput) {
        c1 = { x: from.x + offset, y: from.y };
        c2 = { x: to.x - offset, y: to.y };
      } else {
        c1 = { x: from.x - offset, y: from.y };
        c2 = { x: to.x + offset, y: to.y };
      }
    } else {
      c1 = { x: from.x + offset, y: from.y };
      c2 = { x: to.x - offset, y: to.y };
    }
    
    return `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
  }

  /**
   * Check if two sockets can be connected
   */
  canConnect(fromSocket, toSocket) {
    if (!fromSocket || !toSocket) return false;
    if (fromSocket === toSocket) return false;
    if (fromSocket.node === toSocket.node) return false;
    if (fromSocket.type === toSocket.type) return false;
    
    // Check if connection already exists
    for (const edge of this.flowGraph.edges.values()) {
      if ((edge.fromSocket === fromSocket && edge.toSocket === toSocket) ||
          (edge.fromSocket === toSocket && edge.toSocket === fromSocket)) {
        return false;
      }
    }
    
    return true;
  }
}

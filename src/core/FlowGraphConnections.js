/**
 * Utility function to extract color from a socket element.
 * Looks for border-color in the socket's computed styles or inline styles.
 * 
 * @param {HTMLElement} socketElement - The socket DOM element
 * @returns {string} The extracted color or default color
 */
function extractSocketColor(socketElement) {
  if (!socketElement) return '#10b981';
  
  // Try to get the actual socket span element within the anchor
  let socketSpan = socketElement.querySelector('.socket');
  
  // If no .socket class found, look for any span with border-color style
  if (!socketSpan) {
    socketSpan = socketElement.querySelector('span[style*="border-color"]');
  }
  
  // If still not found, use the element itself
  if (!socketSpan) {
    socketSpan = socketElement;
  }
  
  // First try to get color from inline style attribute
  const inlineStyle = socketSpan.getAttribute('style');
  if (inlineStyle) {
    const borderColorMatch = inlineStyle.match(/border-color:\s*([^;]+)/);
    if (borderColorMatch) {
      const color = borderColorMatch[1].trim();
      // Convert rgb/rgba to hex if needed
      if (color.startsWith('rgb')) {
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
      }
      // Handle hex values
      if (color.startsWith('#')) {
        return color;
      }
    }
  }
  
  // Fallback to computed styles
  const computedStyle = window.getComputedStyle(socketSpan);
  const borderColor = computedStyle.borderColor;
  
  // Convert rgb/rgba to hex if needed
  if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)') {
    // Handle rgb/rgba values
    if (borderColor.startsWith('rgb')) {
      const rgbMatch = borderColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
    // Handle hex values
    if (borderColor.startsWith('#')) {
      return borderColor;
    }
  }
  
  // Fallback to default color
  return '#10b981';
}

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
    
    // Flag to prevent node dragging during socket interactions
    this.socketInteractionActive = false;
    
    // Long press state for mobile context menu
    this.longPressState = {
      timer: null,
      target: null,
      startTime: 0,
      threshold: 500, // 500ms for long press
      moved: false,
      connectionDelayed: false
    };
  }

  /**
   * Setup event listeners for connection operations using event delegation.
   * OPTIMIZED: Uses single delegated listeners instead of individual listeners.
   * Implements optimization from report: Event delegation.
   * 
   * @private
   */
  setupEventListeners() {
    // Use event delegation for better performance - single listener handles all socket events
    this.flowGraph.container.addEventListener('mousedown', this.handleDelegatedMouseEvent.bind(this));
    this.flowGraph.container.addEventListener('mousemove', this.handleDelegatedMouseEvent.bind(this));
    this.flowGraph.container.addEventListener('mouseup', this.handleDelegatedMouseEvent.bind(this));
    
    // Add global mouse listeners for connection operations
    // This ensures mousemove and mouseup work even when mouse leaves the container
    document.addEventListener('mousemove', this.handleGlobalMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleGlobalMouseUp.bind(this));
    
    // Delegated touch event listeners for better mobile support
    this.flowGraph.container.addEventListener('touchstart', this.handleDelegatedTouchEvent.bind(this), { passive: false });
    this.flowGraph.container.addEventListener('touchmove', this.handleDelegatedTouchEvent.bind(this), { passive: false });
    this.flowGraph.container.addEventListener('touchend', this.handleDelegatedTouchEvent.bind(this), { passive: false });
  }

  /**
   * Handle delegated mouse events for all socket interactions.
   * OPTIMIZED: Single event handler for all mouse events.
   * 
   * @param {MouseEvent} e - Mouse event
   * @private
   */
  handleDelegatedMouseEvent(e) {
    // For mousedown, only handle if target is a socket anchor or socket span
    if (e.type === 'mousedown') {
      if (!this.isSocketTarget(e.target)) return;
      this.handleSocketMouseDown(e);
      return;
    }
    
    // For mousemove and mouseup, handle if connection is active OR if target is a socket
    if (e.type === 'mousemove' || e.type === 'mouseup') {
      if (this.connectionState.active) {
        // Always handle mousemove/mouseup during active connection
        if (e.type === 'mousemove') {
          this.handleSocketMouseMove(e);
        } else {
          this.handleSocketMouseUp(e);
        }
        return;
      }
      
      // If not in active connection, only handle if target is a socket
      if (!this.isSocketTarget(e.target)) return;
      
      if (e.type === 'mousemove') {
        this.handleSocketMouseMove(e);
      } else {
        this.handleSocketMouseUp(e);
      }
    }
  }

  /**
   * Check if the target element is a valid socket target for connections.
   * Only allows connections when clicking on the actual socket anchor or socket span.
   * 
   * @param {HTMLElement} target - The target element
   * @returns {boolean} True if the target is a valid socket target
   * @private
   */
  isSocketTarget(target) {
    // Reject socket labels immediately
    if (target.classList.contains('socket-label')) {
      return false;
    }
    
    // Check if target is a flow-socket-anchor element
    if (target.tagName === 'FLOW-SOCKET-ANCHOR') {
      return true;
    }
    
    // Check if target is inside a flow-socket-anchor (handles both DOM and shadow DOM)
    const socketAnchor = target.closest('flow-socket-anchor');
    if (socketAnchor) {
      return true;
    }
    
    // Check if target is inside a flow-socket and traverse shadow DOM
    const flowSocket = target.closest('flow-socket');
    if (flowSocket) {
      // If target is the flow-socket itself, allow it
      if (target === flowSocket) {
        return true;
      }
      
      const shadowRoot = flowSocket.shadowRoot;
      if (shadowRoot) {
        const socketAnchor = shadowRoot.querySelector('flow-socket-anchor');
        if (socketAnchor && socketAnchor.contains(target)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Handle global mouse move events during connection operations.
   * OPTIMIZED: Ensures mouse tracking works even when mouse leaves container.
   * 
   * @param {MouseEvent} e - Mouse event
   * @private
   */
  handleGlobalMouseMove(e) {
    // Only handle if connection is active
    if (this.connectionState.active) {
      this.handleSocketMouseMove(e);
    }
  }

  /**
   * Handle global mouse up events during connection operations.
   * OPTIMIZED: Ensures mouse up is captured even when mouse leaves container.
   * 
   * @param {MouseEvent} e - Mouse event
   * @private
   */
  handleGlobalMouseUp(e) {
    // Only handle if connection is active
    if (this.connectionState.active) {
      this.handleSocketMouseUp(e);
    }
  }

  /**
   * Handle delegated touch events for all socket interactions.
   * OPTIMIZED: Single event handler for all touch events.
   * 
   * @param {TouchEvent} e - Touch event
   * @private
   */
  handleDelegatedTouchEvent(e) {
    // For touchstart, only handle if target is a socket anchor or socket span
    if (e.type === 'touchstart') {
      if (!this.isSocketTarget(e.target)) return;
      this.handleSocketTouchStart(e);
      return;
    }
    
    // For touchmove and touchend, handle if connection is active OR if target is a socket
    if (e.type === 'touchmove' || e.type === 'touchend') {
      if (this.connectionState.active) {
        // Always handle touchmove/touchend during active connection
        if (e.type === 'touchmove') {
          this.handleSocketTouchMove(e);
        } else {
          this.handleSocketTouchEnd(e);
        }
        return;
      }
      
      // If not in active connection, only handle if target is a socket
      if (!this.isSocketTarget(e.target)) return;
      
      if (e.type === 'touchmove') {
        this.handleSocketTouchMove(e);
      } else {
        this.handleSocketTouchEnd(e);
      }
    }
  }

  /**
   * Handle socket mouse down
   */
  handleSocketMouseDown(e) {
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
    
    // Set temporary path color based on socket color
    this.updateTempPathColor(socketObj);
    
    // Show temp path
    this.flowGraph.tempPath.style.display = 'block';
    this.updateTempPath(e.clientX, e.clientY);
  }

  /**
   * Handle socket mouse move
   */
  handleSocketMouseMove(e) {
    if (!this.connectionState.active) return;
    
    this.updateTempPath(e.clientX, e.clientY);
    
    // Check for hover targets
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const flowSocket = element?.closest('flow-socket');
    
    if (flowSocket) {
      const nodeElement = flowSocket.closest('.node');
      const nodeId = nodeElement?.dataset.id;
      const socketId = flowSocket.getAttribute('name');
      
      if (nodeId && socketId) {
        const node = this.flowGraph.nodes.get(nodeId);
        const socketObj = node?.getSocket(socketId);
        
        if (socketObj && this.canConnect(this.connectionState.fromSocket, socketObj)) {
          // Use optimized cleanup and hover update
          this.updateSocketHover(flowSocket);
          
          this.connectionState.toSocket = socketObj;
          
          // Update temporary path color to show the output socket's color
          const outputSocket = this.connectionState.fromSocket.type === 'output' ? 
            this.connectionState.fromSocket : socketObj;
          this.updateTempPathColor(outputSocket);
        } else if (socketObj) {
          // Provide specific feedback for max connections reached
          if (socketObj.connections.size >= socketObj.maxConnections) {
            this.showMaxConnectionsFeedback(socketObj);
          }
        }
      }
    } else {
      // Use optimized cleanup for all sockets
      this.clearAllSocketHover();
      this.connectionState.toSocket = null;
    }
  }

  /**
   * Handle socket mouse up
   */
  handleSocketMouseUp(e) {
    if (!this.connectionState.active) return;
    
    // Create connection if valid
    if (this.connectionState.fromSocket && this.connectionState.toSocket) {
      // Determine which socket is output and which is input
      let fromSocket, toSocket;
      
      if (this.connectionState.fromSocket.type === 'output' && this.connectionState.toSocket.type === 'input') {
        fromSocket = this.connectionState.fromSocket;
        toSocket = this.connectionState.toSocket;
      } else if (this.connectionState.fromSocket.type === 'input' && this.connectionState.toSocket.type === 'output') {
        fromSocket = this.connectionState.toSocket;
        toSocket = this.connectionState.fromSocket;
      } else {
        // Invalid connection - both same type or other invalid combination
        this.fireConnectionFailed(this.connectionState.fromSocket, this.connectionState.toSocket, 'Invalid socket type combination - both sockets are the same type');
        this.cleanupConnection();
        return;
      }
      
      // Check if connection is valid (this will fire the failure event if needed)
      if (this.canConnect(fromSocket, toSocket)) {
        this.flowGraph.createEdge(fromSocket, toSocket);
      }
    }
    
    // Clean up visual feedback with a slight delay to ensure connection is processed
    setTimeout(() => {
      this.cleanupSocketStates();
    }, 0);
    
    this.flowGraph.tempPath.style.display = 'none';
    
    // Reset state
    this.connectionState.active = false;
    this.connectionState.fromSocket = null;
    this.connectionState.toSocket = null;
  }

  /**
   * Clean up connection state and visual feedback
   * @private
   */
  cleanupConnection() {
    // Clean up visual feedback with a slight delay to ensure connection is processed
    setTimeout(() => {
      this.cleanupSocketStates();
    }, 0);
    
    this.flowGraph.tempPath.style.display = 'none';
    
    // Reset state
    this.connectionState.active = false;
    this.connectionState.fromSocket = null;
    this.connectionState.toSocket = null;
  }





  /**
   * Handle socket touch start
   */
  handleSocketTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      // Check if this is a socket interaction first
      const flowSocket = touch.target.closest('flow-socket');
      
      if (flowSocket) {
        // Set flag to prevent node dragging
        this.socketInteractionActive = true;
        
        // Only prevent default for socket interactions
        e.preventDefault();
        e.stopPropagation();
        
        // Start long press detection
        this.startLongPressDetection(touch.target, touch.clientX, touch.clientY);
        
        // Delay connection start to allow long press detection
        setTimeout(() => {
          if (!this.longPressState.connectionDelayed) {
            // Create a synthetic event object that matches pointer event structure
            const syntheticEvent = {
              target: touch.target,
              clientX: touch.clientX,
              clientY: touch.clientY,
              preventDefault: () => e.preventDefault(),
              stopPropagation: () => e.stopPropagation()
            };
            this.handleSocketMouseDown(syntheticEvent);
          }
        }, 100); // Small delay to allow long press detection
      }
    }
  }

  /**
   * Handle socket touch move
   */
  handleSocketTouchMove(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      
      // Mark as moved to cancel long press
      if (this.longPressState.target) {
        this.longPressState.moved = true;
        this.cancelLongPress();
      }
      
      if (this.connectionState.active) {
        // Only prevent default when actively connecting
        e.preventDefault();
        
        // Create a synthetic event object that matches pointer event structure
        const syntheticEvent = {
          target: touch.target,
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation()
        };
        this.handleSocketMouseMove(syntheticEvent);
      }
    }
  }

  /**
   * Handle socket touch end
   */
  handleSocketTouchEnd(e) {
    // Always clear the flag when touch ends
    this.socketInteractionActive = false;
    
    // Cancel long press
    this.cancelLongPress();
    
    if (e.changedTouches.length === 1 && this.connectionState.active) {
      const touch = e.changedTouches[0];
      // Only prevent default when actively connecting
      e.preventDefault();
      
      // Create a synthetic event object that matches pointer event structure
      const syntheticEvent = {
        target: touch.target,
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      };
      this.handleSocketMouseUp(syntheticEvent);
    }
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
   * Update socket hover state efficiently.
   * OPTIMIZED: Uses cached elements and batch operations.
   * 
   * @param {HTMLElement} flowSocket - The flow-socket element to hover
   * @private
   */
  updateSocketHover(flowSocket) {
    // Clear all existing hover states first
    this.clearAllSocketHover();
    
    // Add hover to current socket
    const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
    if (innerSocket) {
      innerSocket.classList.add('socket-hover');
    }
  }

  /**
   * Show visual feedback when socket has reached maximum connections
   * 
   * @param {Socket} socket - The socket that has reached max connections
   * @private
   */
  showMaxConnectionsFeedback(socket) {
    if (!socket.element) return;
    
    // Add a visual indicator that max connections reached
    socket.element.classList.add('socket-max-connections');
    
    // Remove the indicator after a short delay
    setTimeout(() => {
      if (socket.element) {
        socket.element.classList.remove('socket-max-connections');
      }
    }, 1000);
  }

  /**
   * Clear all socket hover states efficiently.
   * OPTIMIZED: Uses cached elements and batch operations.
   * 
   * @private
   */
  clearAllSocketHover() {
    // Use cached socket elements for better performance
    const sockets = this.flowGraph.getCachedElements ? 
      this.flowGraph.getCachedElements('sockets') : 
      this.flowGraph.container.querySelectorAll('flow-socket');
      
    // Batch all hover removal operations
    const hoverRemovalTasks = [];
    
    sockets.forEach(flowSocket => {
      hoverRemovalTasks.push(() => {
        const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
        if (innerSocket) {
          innerSocket.classList.remove('socket-hover');
        }
      });
    });
    
    // Execute all hover removal tasks in batch
    hoverRemovalTasks.forEach(task => task());
  }

  /**
   * Clean up all socket visual states using optimized DOM queries.
   * OPTIMIZED: Uses cached elements and batch DOM updates.
   */
  cleanupSocketStates() {
    // Use DOM batcher for efficient cleanup
    if (this.flowGraph.domBatcher) {
      this.flowGraph.domBatcher.schedule('update', () => {
        this.performSocketCleanup();
      });
    } else {
      this.performSocketCleanup();
    }
  }

  /**
   * Perform the actual socket cleanup operations.
   * OPTIMIZED: Uses cached elements and batch operations.
   * 
   * @private
   */
  performSocketCleanup() {
    // Use cached socket elements for better performance
    const sockets = this.flowGraph.getCachedElements ? 
      this.flowGraph.getCachedElements('sockets') : 
      this.flowGraph.container.querySelectorAll('flow-socket');
      
    // Batch all cleanup operations
    const cleanupTasks = [];
    
    sockets.forEach(flowSocket => {
      cleanupTasks.push(() => {
        // Clean up standard .socket elements
        const socketElement = flowSocket.shadowRoot?.querySelector('.socket');
        if (socketElement) {
          socketElement.classList.remove('socket-active', 'socket-hover');
        }
        
        // Clean up custom socket elements (spans with inline styles)
        const customSocketElements = flowSocket.shadowRoot?.querySelectorAll('span[style*="border-color"]');
        if (customSocketElements) {
          customSocketElements.forEach(span => {
            span.classList.remove('socket-active', 'socket-hover');
          });
        }
      });
    });
    
    // Execute all cleanup tasks in batch
    cleanupTasks.forEach(task => task());
  }

  /**
   * Cancel current connection and clean up states
   */
  cancelConnection() {
    if (this.connectionState.active) {
      this.cleanupSocketStates();
      this.flowGraph.tempPath.style.display = 'none';
      this.connectionState.active = false;
      this.connectionState.fromSocket = null;
      this.connectionState.toSocket = null;
    }
  }

  /**
   * Update temporary path color based on socket color
   */
  updateTempPathColor(socket) {
    const color = this.extractSocketColor(socket.element);
    this.flowGraph.tempPath.setAttribute('stroke', color);
  }

  /**
   * Extract color from a socket element
   */
  extractSocketColor(socketElement) {
    if (!socketElement) return '#10b981';
    
    // Look for socket span element within the anchor
    let socketSpan = socketElement.querySelector('.socket') || 
                     socketElement.querySelector('span[style*="border-color"]') || 
                     socketElement.querySelector('span[style*="background"]');
    
    // For custom shapes like diamond, try to find any span with styling
    if (!socketSpan) {
      socketSpan = socketElement.querySelector('span');
    }
    
    // If we still don't have a span, don't use the anchor element
    if (!socketSpan || socketSpan === socketElement) return '#10b981';
    
    // Try inline style first
    const inlineStyle = socketSpan.getAttribute('style');
    if (inlineStyle) {
      // Look for border-color first (most reliable for socket colors)
      const borderColorMatch = inlineStyle.match(/border-color:\s*([^;]+)/);
      if (borderColorMatch) {
        const color = borderColorMatch[1].trim();
        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
          return color;
        }
      }
      
      // For custom shapes, check background color only if no border color found
      const backgroundColorMatch = inlineStyle.match(/background:\s*([^;]+)/);
      if (backgroundColorMatch) {
        const bgColor = backgroundColorMatch[1].trim();
        // Skip gradients and complex backgrounds, only use solid colors
        if (bgColor && !bgColor.includes('gradient') && !bgColor.includes('url') && 
            bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
          return bgColor;
        }
      }
    }
    
    // Fallback to computed styles
    const computedStyle = window.getComputedStyle(socketSpan);
    const borderColor = computedStyle.borderColor;
    
    // Check if we got a valid color
    if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
      return borderColor;
    }
    
    // Try to get background color as fallback
    const backgroundColor = computedStyle.backgroundColor;
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
      return backgroundColor;
    }
    
    // Final fallback to default color
    return '#10b981';
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
    
    // Offset by socket width based on type
    let xOffset = rect.width / 2;
    if (socket.type === 'output') {
      xOffset = rect.width / 2; // +width/2 for output sockets
    } else if (socket.type === 'input') {
      xOffset = -rect.width / 2; // -width/2 for input sockets
    }
    
    const x = (rect.left + rect.width / 2 + xOffset - surfaceRect.left - this.flowGraph.viewport.x) / this.flowGraph.viewport.scale;
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
    if (!fromSocket || !toSocket) {
      this.fireConnectionFailed(fromSocket, toSocket, 'Invalid sockets provided');
      return false;
    }
    if (fromSocket === toSocket) {
      this.fireConnectionFailed(fromSocket, toSocket, 'Cannot connect socket to itself');
      return false;
    }
    if (fromSocket.node === toSocket.node) {
      this.fireConnectionFailed(fromSocket, toSocket, 'Cannot connect sockets from the same node');
      return false;
    }
    if (fromSocket.type === toSocket.type) {
      this.fireConnectionFailed(fromSocket, toSocket, `Cannot connect two ${fromSocket.type} sockets`);
      return false;
    }
    
    // Check data type compatibility
    if (!this.isDataTypeCompatible(fromSocket.dataType, toSocket.dataType)) {
      this.fireConnectionFailed(fromSocket, toSocket, `Data type mismatch: ${fromSocket.dataType} cannot connect to ${toSocket.dataType}`);
      return false;
    }
    
    // Check connection limits
    if (fromSocket.connections.size >= fromSocket.maxConnections) {
      this.fireConnectionFailed(fromSocket, toSocket, `Source socket has reached maximum connections (${fromSocket.maxConnections})`);
      return false;
    }
    if (toSocket.connections.size >= toSocket.maxConnections) {
      this.fireConnectionFailed(fromSocket, toSocket, `Target socket has reached maximum connections (${toSocket.maxConnections})`);
      return false;
    }
    
    // Check if connection already exists
    for (const edge of this.flowGraph.edges.values()) {
      if ((edge.fromSocket === fromSocket && edge.toSocket === toSocket) ||
          (edge.fromSocket === toSocket && edge.toSocket === fromSocket)) {
        this.fireConnectionFailed(fromSocket, toSocket, 'Connection already exists between these sockets');
        return false;
      }
    }
    
    return true;
  }

  /**
   * Fire connection failed event
   * @private
   */
  fireConnectionFailed(fromSocket, toSocket, reason) {
    this.flowGraph.container.dispatchEvent(new CustomEvent('edge:connection:failed', {
      detail: { fromSocket, toSocket, reason }
    }));
  }

  /**
   * Check if two data types are compatible for connection
   * @param {string} fromDataType - Source socket data type
   * @param {string} toDataType - Target socket data type
   * @returns {boolean} True if types are compatible
   */
  isDataTypeCompatible(fromDataType, toDataType) {
    // If target socket is 'any' or 'object', it can accept anything
    if (toDataType === 'any' || toDataType === 'object') {
      return true;
    }
    
    // If source socket is 'any', it can connect to anything
    if (fromDataType === 'any' || fromDataType === 'object') {
      return true;
    }
    
    // Exact type match
    return fromDataType === toDataType;
  }
  
  /**
   * Start long press detection for mobile context menu
   * @param {HTMLElement} target - The target element
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  startLongPressDetection(target, x, y) {
    this.cancelLongPress();
    
    this.longPressState.target = target;
    this.longPressState.startTime = Date.now();
    this.longPressState.moved = false;
    
    this.longPressState.timer = setTimeout(() => {
      if (!this.longPressState.moved) {
        this.handleLongPress(target, x, y);
      }
    }, this.longPressState.threshold);
  }
  
  /**
   * Cancel long press detection
   */
  cancelLongPress() {
    if (this.longPressState.timer) {
      clearTimeout(this.longPressState.timer);
      this.longPressState.timer = null;
    }
    
    // Clean up socket active state if connection was delayed
    if (this.longPressState.connectionDelayed && this.longPressState.target) {
      const flowSocket = this.longPressState.target.closest('flow-socket');
      if (flowSocket) {
        const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
        if (innerSocket) {
          innerSocket.classList.remove('socket-active');
        }
      }
    }
    
    this.longPressState.target = null;
    this.longPressState.moved = false;
    this.longPressState.connectionDelayed = false;
  }
  
  /**
   * Handle long press - show context menu
   * @param {HTMLElement} target - The target element
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  handleLongPress(target, x, y) {
    // Prevent connection start
    this.longPressState.connectionDelayed = true;
    
    // Find the socket element (flow-socket-anchor)
    let socketElement = target.closest('flow-socket-anchor');
    if (!socketElement) {
      // If target is flow-socket, look for flow-socket-anchor inside it
      if (target.tagName === 'FLOW-SOCKET') {
        socketElement = target.shadowRoot?.querySelector('flow-socket-anchor');
      }
    }
    if (!socketElement) return;
    
    // Get the socket instance from the element reference
    let socket = socketElement._socket;
    
    if (!socket) {
      // Fallback: find socket by traversing the DOM
      const nodeElement = target.closest('.node');
      if (nodeElement) {
        const nodeId = nodeElement.dataset.id;
        const flowSocket = target.closest('flow-socket');
        const socketId = flowSocket?.getAttribute('name');
        
        if (nodeId && socketId) {
          const node = this.flowGraph.nodes.get(nodeId);
          if (node) {
            socket = node.getSocket(socketId);
          }
        }
      }
      
      if (!socket) return;
    }
    
    // Only show context menu if there are connections
    if (socket.connections.size === 0) return;
    
    // Find the actual .socket element for visual feedback
    const actualSocketElement = socketElement.querySelector('.socket');
    if (actualSocketElement) {
      // Add visual feedback
      actualSocketElement.classList.add('long-press-active');
      
      // Remove visual feedback after a short delay
      setTimeout(() => {
        actualSocketElement.classList.remove('long-press-active');
      }, 500);
    }
    
    
    // Cancel any active connection
    this.connectionState.active = false;
    this.connectionState.fromSocket = null;
    this.connectionState.toSocket = null;
    
    // Hide temp path
    this.flowGraph.tempPath.style.display = 'none';
    
    // Remove socket active state
    const flowSocket = target.closest('flow-socket');
    if (flowSocket) {
      const innerSocket = flowSocket.shadowRoot?.querySelector('.socket');
      if (innerSocket) {
        innerSocket.classList.remove('socket-active');
      }
    }
    
    // Show the context menu
    socket.showContextMenu(x, y);
  }

  /**
   * Clean up event listeners and resources.
   * 
   * @public
   */
  destroy() {
    // Remove global event listeners
    document.removeEventListener('mousemove', this.handleGlobalMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleGlobalMouseUp.bind(this));
    
    // Cancel any active connection
    this.cancelConnection();
  }
}

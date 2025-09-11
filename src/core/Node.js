import { Socket } from './Socket.js';

/**
 * Represents a single node in the flow graph.
 * 
 * A Node is a visual element that can contain input and output sockets,
 * execute logic, and maintain data state. Nodes are created from templates
 * and can be connected to other nodes via edges.
 * 
 * @class Node
 * 
 * @example
 * ```javascript
 * // Create a node from a template
 * const node = new Node(flowGraph, {
 *   type: 'math-add',
 *   x: 100,
 *   y: 100,
 *   template: mathAddTemplate
 * });
 * 
 * // Execute the node
 * await node.execute();
 * ```
 */
export class Node {
  /**
   * Creates a new Node instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   * @param {Object} [config={}] - Configuration object for the node
   * @param {string} [config.id] - Custom ID for the node (auto-generated if not provided)
   * @param {string} config.type - The node type identifier
   * @param {string} [config.label] - Display label for the node
   * @param {number} [config.x=0] - X position of the node
   * @param {number} [config.y=0] - Y position of the node
   * @param {number} [config.width=160] - Width of the node
   * @param {number} [config.height=100] - Height of the node
   * @param {boolean} [config.selected=false] - Whether the node is initially selected
   * @param {Object} config.template - Node template defining sockets and HTML
   * @param {Object} [config.initialData] - Initial data values for data-bound elements
   */
  constructor(flowGraph, config = {}) {
    /** @type {FlowGraph} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    /** @type {string} Unique identifier for this node */
    this.id = config.id || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    /** @type {string} The node type identifier */
    this.type = config.type;
    
    /** @type {string} Display label for the node */
    this.label = config.label || config.type;
    
    /** @type {number} X position of the node */
    this.x = config.x || 0;
    
    /** @type {number} Y position of the node */
    this.y = config.y || 0;
    
    /** @type {number} Width of the node */
    this.width = config.width || 160;
    
    /** @type {number} Height of the node */
    this.height = config.height || 100;
    
    /** @type {boolean} Whether the node is currently selected */
    this.selected = config.selected || false;
    
    /** @type {Object} Node template defining sockets and HTML structure */
    this.template = config.template;
    
    /** @type {Map<string, Socket>} Map of input socket IDs to Socket instances */
    this.inputs = new Map();
    
    /** @type {Map<string, Socket>} Map of output socket IDs to Socket instances */
    this.outputs = new Map();
    
    /** @type {HTMLDivElement|null} The DOM element for this node */
    this.element = null;

    /** @type {Map<string, Object>} Map of data keys to DOM elements for data binding */
    this.dataKeyMap = new Map();
    
    this.init();
    
    // Populate DOM with initial data after element is created
    if (config.initialData) {
      this.setDataObject(config.initialData);
    }
  }
  
  /**
   * Initialize the node after construction.
   * Creates DOM elements, sockets, and sets up event handlers.
   * 
   * @private
   */
  init() {
    this.createElement();
    this.createSockets();
    this.setupDragging();
    this.createDataKeyMap();
  }
  
  /**
   * Create the DOM element for this node.
   * Applies styling, template HTML, and adds it to the flow graph.
   * 
   * @private
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = `node type-${this.type}`;
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.element.dataset.id = this.id;
    
    // Add category-based styling
    if (this.template && this.template.category) {
      this.element.dataset.category = this.template.category.toLowerCase();
    }
    
    // Add color patch styling from node definition
    if (this.template && this.template.colorPatch) {
      this.element.dataset.colorPatch = 'true';
      if (this.template.colorPatch.background) {
        this.element.style.setProperty('--node-color-bg', this.template.colorPatch.background);
      }
      if (this.template.colorPatch.color) {
        this.element.style.setProperty('--node-color-text', this.template.colorPatch.color);
      }
    }
    
    if (this.selected) {
      this.element.classList.add('selected');
    }
    
    // Use template HTML if available, otherwise generate default structure
    if (this.template && this.template.html) {
      this.element.innerHTML = this.template.html;
    } else {
      console.warn(`No HTML template found for node ${this.id}`);
    }
    
    
    // Add to DOM
    this.flowGraph.nodesRoot.appendChild(this.element);
  }



  /**
   * Create a mapping of data keys to DOM elements for data binding.
   * Scans the node's HTML for elements with data-key attributes.
   * 
   * @private
   */
  createDataKeyMap() {
    this.element.querySelectorAll('[data-key]').forEach(element => {
      const dataKey = element.getAttribute('data-key');
      const parsedDataKey = this.parseDataKey(dataKey);
      this.dataKeyMap.set(parsedDataKey.key, 
        {
          el: element,
          property: parsedDataKey.property
        }
      );
    });
  }
  
  /**
   * Disable all form controls in the node for readonly mode.
   * 
   * @private
   */
  disableFormControls() {
    this.dataKeyMap.forEach(({ el }) => {
      // Disable if it's a form control
      if ('disabled' in el) {
        el.disabled = true;
      }
      el.style.opacity = '0.6';
      el.style.cursor = 'not-allowed';
    });
  }
  
  /**
   * Enable all form controls in the node for edit mode.
   * 
   * @private
   */
  enableFormControls() {
    this.dataKeyMap.forEach(({ el }) => {
      // Enable if it's a form control
      if ('disabled' in el) {
        el.disabled = false;
      }
      el.style.opacity = '1';
      el.style.cursor = '';
    });
  }
  

  
  /**
   * Create input and output sockets based on the node template.
   * Sockets are created and linked to their corresponding DOM elements.
   * 
   * @private
   */
  createSockets() {
    if (!this.template) return;
    
    // Create input sockets
    this.template.inputs.forEach(inputConfig => {
      const socket = new Socket(this, {
        id: inputConfig.id,
        type: 'input',
        dataType: inputConfig.type,
        label: inputConfig.label
      });
      this.inputs.set(inputConfig.id, socket);
    });
    
    // Create output sockets
    this.template.outputs.forEach(outputConfig => {
      const socket = new Socket(this, {
        id: outputConfig.id,
        type: 'output',
        dataType: outputConfig.type,
        label: outputConfig.label
      });
      this.outputs.set(outputConfig.id, socket);
    });
    
    // Link socket elements - delay to allow flow-socket components to render
    requestAnimationFrame(() => {
      this.linkSocketElements();
    });
  }
  
  linkSocketElements() {
    // Link input socket elements - use flow-socket components
    this.inputs.forEach(socket => {
      const flowSocket = this.element.querySelector(`flow-socket[name="${socket.id}"]`);
      if (flowSocket) {
        // First try to find flow-socket-anchor in shadow DOM (default sockets)
        let element = flowSocket.shadowRoot?.querySelector('flow-socket-anchor');
        
        // If not found, try to find it as a direct child (custom slot content)
        if (!element) {
          element = flowSocket.querySelector('flow-socket-anchor');
        }
        
        if (element) {
          socket.element = element;
          // Store socket reference on the element for easy access
          element._socket = socket;
          socket.setupContextMenu();
        } else {
          console.warn(`Socket element not found for socket ${socket.id} - flow-socket found but no flow-socket-anchor`);
        }
      } else {
        console.warn(`Flow-socket not found for socket ${socket.id}`);
      }
    });
    
    // Link output socket elements - use flow-socket components
    this.outputs.forEach(socket => {
      const flowSocket = this.element.querySelector(`flow-socket[name="${socket.id}"]`);
      if (flowSocket) {
        // First try to find flow-socket-anchor in shadow DOM (default sockets)
        let element = flowSocket.shadowRoot?.querySelector('flow-socket-anchor');
        
        // If not found, try to find it as a direct child (custom slot content)
        if (!element) {
          element = flowSocket.querySelector('flow-socket-anchor');
        }
        
        if (element) {
          socket.element = element;
          // Store socket reference on the element for easy access
          element._socket = socket;
          socket.setupContextMenu();
        } else {
          console.warn(`Socket element not found for socket ${socket.id} - flow-socket found but no flow-socket-anchor`);
        }
      } else {
        console.warn(`Flow-socket not found for socket ${socket.id}`);
      }
    });
  }
  
  /**
   * Check if an element is interactive and should not trigger node dragging
   */
  isInteractiveElement(element) {
    // Explicit control via data attributes
    if (element.dataset.draggable === 'false') return true;  // Prevent dragging
    if (element.dataset.draggable === 'true') return false;  // Allow dragging
    
    // Socket elements always prevent dragging
    if (element.classList.contains('socket')) return true;
    
    // Check if element is inside a flow-socket-anchor (in shadow DOM)
    if (element.closest('flow-socket-anchor')) return true;
    
    // Check if element is a flow-socket-anchor itself
    if (element.tagName === 'FLOW-SOCKET-ANCHOR') return true;
    
    // Check if element is inside a flow-socket component's shadow DOM
    const flowSocket = element.closest('flow-socket');
    if (flowSocket && flowSocket !== element) {
      // Only check if the element is inside the shadow DOM of a different flow-socket
      const shadowRoot = flowSocket.shadowRoot;
      if (shadowRoot && shadowRoot.contains(element)) {
        // Check if it's inside the anchor or is the socket span
        const anchor = shadowRoot.querySelector('flow-socket-anchor');
        if (anchor && (anchor.contains(element) || element === anchor)) {
          return true;
        }
        // Also check if it's the socket span itself
        if (element.classList.contains('socket')) {
          return true;
        }
      }
    }
    
    // Check if element is a flow-socket itself (prevent dragging when clicking on the component)
    if (element.tagName === 'FLOW-SOCKET') return true;
    
    // Form elements are naturally interactive
    if (element.matches('input, textarea, select, button, a[href]')) return true;
    
    // Contenteditable elements
    if (element.isContentEditable) return true;
    
    // Everything else allows dragging by default
    return false;
  }

  setupDragging() {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let touchStartTime = 0;
    let touchStartTarget = null;
    
    // Long press state for mobile context menu
    let longPressState = {
      timer: null,
      startTime: 0,
      threshold: 500, // 500ms for long press
      moved: false
    };
    
    const handlePointerDown = (e) => {
      // Don't start dragging if clicking on interactive elements
      if (this.isInteractiveElement(e.target)) return;
      
      // For touch events, add a small delay to prevent conflicts with scrolling
      if (e.pointerType === 'touch') {
        touchStartTime = Date.now();
        // Don't prevent default immediately for touch events
        return;
      }
      
      // Select node on click (unless Ctrl/Cmd is held for multi-select)
      const isMultiSelect = e.ctrlKey || e.metaKey;
      this.flowGraph.selectNode(this.id, isMultiSelect);
      
      // Check if this node is in the current selection
      const isSelected = this.flowGraph.selection.has(this.id);
      
      // Only start dragging if this node is selected
      if (!isSelected) return;
      
      isDragging = true;
      this.element.classList.add('dragging');
      
      // Store initial positions of all selected nodes for multi-drag
      this.flowGraph.startMultiDrag(e, this);
      
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handlePointerMove = (e) => {
      // For touch events, only start dragging after a small delay
      if (e.pointerType === 'touch' && !isDragging) {
        const touchDelay = Date.now() - touchStartTime;
        if (touchDelay > 50) { // 50ms delay
          // Select node and start dragging
          this.flowGraph.selectNode(this.id, false);
          const isSelected = this.flowGraph.selection.has(this.id);
          
          if (isSelected) {
            isDragging = true;
            this.element.classList.add('dragging');
            this.flowGraph.startMultiDrag(e, this);
          }
        }
        return;
      }
      
      if (!isDragging) return;
      
      // Use the multi-drag system to move all selected nodes
      this.flowGraph.updateMultiDrag(e);
      
      e.preventDefault();
    };
    
    const handlePointerUp = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      this.element.classList.remove('dragging');
      
      // End multi-drag
      this.flowGraph.endMultiDrag();
    };
    
    // Long press helper methods
    const startLongPressDetection = (target, x, y) => {
      cancelLongPress();
      
      longPressState.target = target;
      longPressState.startTime = Date.now();
      longPressState.moved = false;
      
      longPressState.timer = setTimeout(() => {
        if (!longPressState.moved) {
          handleLongPress(target, x, y);
        }
      }, longPressState.threshold);
    };
    
    const cancelLongPress = () => {
      if (longPressState.timer) {
        clearTimeout(longPressState.timer);
        longPressState.timer = null;
      }
      longPressState.moved = false;
    };
    
    const handleLongPress = (target, x, y) => {
      // Add visual feedback
      this.element.classList.add('long-press-active');
      
      
      // Use existing context menu system
      this.flowGraph.showNodeContextMenu(x, y, [
        {
          label: 'Delete Node',
          icon: '🗑️',
          action: () => this.flowGraph.removeNode(this.id)
        }
      ]);
      
      // Remove visual feedback after a short delay
      setTimeout(() => {
        this.element.classList.remove('long-press-active');
      }, 500);
    };

    // Handle touch events specifically
    const handleTouchStart = (e) => {
      if (this.isInteractiveElement(e.target)) return;
      
      touchStartTime = Date.now();
      touchStartTarget = e.target;
      
      // Start long press detection
      const touch = e.touches[0];
      startLongPressDetection(e.target, touch.clientX, touch.clientY);
      
      // Don't prevent default to allow natural touch behavior initially
    };
    
    const handleTouchMove = (e) => {
      // Cancel long press if user moved
      if (longPressState.target) {
        longPressState.moved = true;
        cancelLongPress();
      }
      
      if (!isDragging) {
        // Check if socket interaction is active
        if (this.flowGraph.connections.socketInteractionActive) {
          return; // Don't start dragging if socket interaction is active
        }
        
        // Check if the original touch target was interactive
        if (touchStartTarget && this.isInteractiveElement(touchStartTarget)) {
          return; // Don't start dragging if original target was interactive
        }
        
        const touchDelay = Date.now() - touchStartTime;
        if (touchDelay > 50) {
          // Select node and start dragging
          this.flowGraph.selectNode(this.id, false);
          const isSelected = this.flowGraph.selection.has(this.id);
          
          if (isSelected) {
            isDragging = true;
            this.element.classList.add('dragging');
            this.flowGraph.startMultiDrag(e.touches[0], this);
            e.preventDefault(); // Prevent scrolling
          }
        }
        return;
      }
      
      // Use the multi-drag system to move all selected nodes
      this.flowGraph.updateMultiDrag(e.touches[0]);
      
      e.preventDefault();
    };
    
    const handleTouchEnd = (e) => {
      // Cancel long press
      cancelLongPress();
      
      if (!isDragging) {
        // Reset touch state
        touchStartTarget = null;
        return;
      }
      
      isDragging = false;
      this.element.classList.remove('dragging');
      touchStartTarget = null;
      
      // End multi-drag
      this.flowGraph.endMultiDrag();
    };
    
    // Use mouse events instead of pointer events
    this.element.addEventListener('mousedown', handlePointerDown);
    this.element.addEventListener('mousemove', handlePointerMove);
    this.element.addEventListener('mouseup', handlePointerUp);
    
    // Add touch event listeners
    this.element.addEventListener('touchstart', handleTouchStart, { passive: true });
    this.element.addEventListener('touchmove', handleTouchMove, { passive: false });
    this.element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Add double-click to execute
    this.element.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.execute();
    });
  }
  
  setPosition(x, y) {
    const oldPosition = { x: this.x, y: this.y };
    this.x = x;
    this.y = y;
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
    
    // Fire move event
    this.flowGraph.container.dispatchEvent(new CustomEvent('node:move', {
      detail: { 
        nodeId: this.id, 
        node: this, 
        oldPosition, 
        newPosition: { x, y } 
      }
    }));
  }
  
  getSocket(socketId) {
    return this.inputs.get(socketId) || this.outputs.get(socketId);
  }
  
  getAllSockets() {
    return [...this.inputs.values(), ...this.outputs.values()];
  }
  
  setSelected(selected) {
    this.selected = selected;
    if (selected) {
      this.element.classList.add('selected');
    } else {
      this.element.classList.remove('selected');
    }
  }
  
  /**
   * Execute the node's logic by calling its onExecute function.
   * The function is looked up in the global scope and called with a context object.
   * 
   * @async
   * @returns {Promise<any>} The result of the execution function
   * 
   * @example
   * ```javascript
   * // Define a global execution function
   * window.executeMathAdd = async (context) => {
   *   const a = context.getInput(0) || 0;
   *   const b = context.getInput(1) || 0;
   *   const result = a + b;
   *   context.setOutput(0, result);
   *   return result;
   * };
   * 
   * // Execute the node
   * await node.execute();
   * ```
   */
  async execute() {
    if (!this.template || !this.template.onExecute) {
      console.warn(`Node ${this.id} has no onExecute method defined`);
      return;
    }
    
    // Get the function from the global scope
    const executeFunction = window[this.template.onExecute];
    if (typeof executeFunction !== 'function') {
      console.error(`onExecute method '${this.template.onExecute}' not found for node ${this.id}`);
      return;
    }
    
    // Prepare context with element access and helper methods
    const context = {
      nodeId: this.id,
      nodeType: this.type,
      element: this.element,
      inputs: this.inputs,
      outputs: this.outputs,
      setOutput: (index, value) => this.setOutputValue(index, value),
      getInput: (index) => this.getInputValue(index),
      getData: (key) => this.getData(key),
      setData: (key, value) => this.setData(key, value)
    };
    
    try {
      const result = await executeFunction(context);
      
      // Fire execution event
      this.flowGraph.container.dispatchEvent(new CustomEvent('node:execute', {
        detail: { 
          nodeId: this.id, 
          node: this, 
          result,
          context
        }
      }));
      
    } catch (error) {
      console.error(`Error executing node ${this.id}:`, error);
      this.flowGraph.container.dispatchEvent(new CustomEvent('node:execute:error', {
        detail: { 
          nodeId: this.id, 
          node: this, 
          error: error.message
        }
      }));
    }
  }
  
  
  /**
   * Set the value of an output socket by index.
   * Also propagates the value to connected input sockets.
   * 
   * @param {number} index - The index of the output socket
   * @param {any} value - The value to set
   * 
   * @example
   * ```javascript
   * node.setOutputValue(0, 42); // Set first output to 42
   * ```
   */
  setOutputValue(index, value) {
    const outputArray = Array.from(this.outputs.values());
    const socket = outputArray[index];
    if (socket) {
      socket.value = value;
      
      // Activate this output socket for branch tracking
      this.flowGraph.activateOutputSocket(this.id, index);
      
      // Propagate value to connected input sockets
      socket.connections.forEach(edge => {
        if (edge.toSocket) {
          edge.toSocket.value = value;
        }
      });
    } else {
      console.warn(`Output socket [${index}] not found for node ${this.id}`);
    }
  }
  
  /**
   * Get the value of an input socket by index.
   * 
   * @param {number} index - The index of the input socket
   * @returns {any} The value of the input socket, or undefined if not found
   * 
   * @example
   * ```javascript
   * const value = node.getInputValue(0); // Get first input value
   * ```
   */
  getInputValue(index) {
    const inputArray = Array.from(this.inputs.values());
    const socket = inputArray[index];
    return socket?.value;
  }
  
  // Data binding methods for DOM elements with data-key attributes
  
  /**
   * Parse a data key string to extract key and property.
   * Format: "key" or "key:property"
   * 
   * @param {string} dataKey - The data key string to parse
   * @returns {Object} Object with key and property
   * @returns {string} returns.key - The data key
   * @returns {string} returns.property - The property name (defaults to 'value')
   * 
   * @private
   */
  parseDataKey(dataKey) {
    const parts = dataKey.split(':');
    return {
      key: parts[0],
      property: parts[1] || 'value'
    };
  }
  
  /**
   * Get data from a DOM element by its data-key attribute.
   * 
   * @param {string} key - The data key to retrieve
   * @returns {any} The value from the DOM element, or undefined if not found
   * 
   * @example
   * ```javascript
   * const value = node.getData('myInput'); // Get value from element with data-key="myInput"
   * ```
   */
  getData(key) {
    const element = this.dataKeyMap.get(key).el;
    if (!element) return undefined;
    
    const { property } = this.parseDataKey(key);
    return element[property];
  }
  
  /**
   * Set data on a DOM element by its data-key attribute.
   * 
   * @param {string} key - The data key to set
   * @param {any} value - The value to set
   * @returns {boolean} True if the element was found and updated, false otherwise
   * 
   * @example
   * ```javascript
   * node.setData('myInput', 'Hello World'); // Set value on element with data-key="myInput"
   * ```
   */
  setData(key, value) {
    const element = this.dataKeyMap.get(key).el;
    if (!element) return false;
    
    const { property } = this.parseDataKey(key);
    element[property] = value;
    return true;
  }
  
  /**
   * Get all data values from all data-bound elements as an object.
   * 
   * @returns {Object} Object with all data key-value pairs
   * 
   * @example
   * ```javascript
   * const allData = node.getDataObject();
   * console.log(allData); // { myInput: 'Hello', myNumber: 42 }
   * ```
   */
  getDataObject() {
    const dataObj = {};

    for(const [k,v] of this.dataKeyMap) {
      dataObj[k] = v.el[v.property];
    }

    return dataObj;
  }
  
  /**
   * Set multiple data values from an object.
   * 
   * @param {Object} dataObj - Object with key-value pairs to set
   * 
   * @example
   * ```javascript
   * node.setDataObject({ myInput: 'Hello', myNumber: 42 });
   * ```
   */
  setDataObject(dataObj) {
    Object.entries(dataObj).forEach(([key, value]) => {
      this.setData(key, value);
    });
  }
  
  serialize() {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      selected: this.selected,
      data: this.getDataObject() // Include data binding values
    };
  }
  
  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

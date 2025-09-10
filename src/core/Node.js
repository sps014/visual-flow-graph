import { Socket } from './Socket.js';

export class Node {
  constructor(flowGraph, config = {}) {
    this.flowGraph = flowGraph;
    this.id = config.id || `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = config.type;
    this.label = config.label || config.type;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.width || 160;
    this.height = config.height || 100;
    this.selected = config.selected || false;
    this.template = config.template;
    
    this.inputs = new Map();
    this.outputs = new Map();
    this.element = null;

    this.dataKeyMap = new Map();
    
    this.init();
    
    // Populate DOM with initial data after element is created
    if (config.initialData) {
      this.setDataObject(config.initialData);
    }
    console.log(`Node ${this.id} initialized with data:`, config.initialData);
  }
  
  init() {
    this.createElement();
    this.createSockets();
    this.setupDragging();
    this.createDataKeyMap();
  }
  
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
    
    // Link socket elements
    this.linkSocketElements();
  }
  
  linkSocketElements() {
    // Link input socket elements
    this.inputs.forEach(socket => {
      const element = this.element.querySelector(`[data-sock="${socket.id}"]`);
      if (element) {
        socket.element = element;
        socket.setupContextMenu();
      }
    });
    
    // Link output socket elements
    this.outputs.forEach(socket => {
      const element = this.element.querySelector(`[data-sock="${socket.id}"]`);
      if (element) {
        socket.element = element;
        socket.setupContextMenu();
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
    
    const handlePointerDown = (e) => {
      // Don't start dragging if clicking on interactive elements
      if (this.isInteractiveElement(e.target)) return;
      
      // Select node on click (unless Ctrl/Cmd is held for multi-select)
      const isMultiSelect = e.ctrlKey || e.metaKey;
      this.flowGraph.selectNode(this.id, isMultiSelect);
      
      // Check if this node is in the current selection
      const isSelected = this.flowGraph.selection.has(this.id);
      
      // Only start dragging if this node is selected
      if (!isSelected) return;
      
      isDragging = true;
      this.element.classList.add('dragging');
      this.element.setPointerCapture(e.pointerId);
      
      // Store initial positions of all selected nodes for multi-drag
      this.flowGraph.startMultiDrag(e, this);
      
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      
      // Use the multi-drag system to move all selected nodes
      this.flowGraph.updateMultiDrag(e);
      
      e.preventDefault();
    };
    
    const handlePointerUp = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      this.element.classList.remove('dragging');
      this.element.releasePointerCapture(e.pointerId);
      
      // End multi-drag
      this.flowGraph.endMultiDrag();
    };
    
    this.element.addEventListener('pointerdown', handlePointerDown);
    this.element.addEventListener('pointermove', handlePointerMove);
    this.element.addEventListener('pointerup', handlePointerUp);
    
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
   * Execute the node's onExecuteMethod if defined
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
   * Set output socket value by index
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
   * Get input socket value by index
   */
  getInputValue(index) {
    const inputArray = Array.from(this.inputs.values());
    const socket = inputArray[index];
    return socket?.value;
  }
  
  // Data binding methods for DOM elements with data-key attributes
  parseDataKey(dataKey) {
    const parts = dataKey.split(':');
    return {
      key: parts[0],
      property: parts[1] || 'value'
    };
  }
  
  getData(key) {
    const element = this.dataKeyMap.get(key).el;
    if (!element) return undefined;
    
    const { property } = this.parseDataKey(key);
    return element[property];
  }
  
  setData(key, value) {
    const element = this.dataKeyMap.get(key).el;
    if (!element) return false;
    
    const { property } = this.parseDataKey(key);
    element[property] = value;
    return true;
  }
  
  getDataObject() {
    const dataObj = {};
    const dataValuesStore = this.dataKeyMap.values();

    for(const [k,v] of dataValuesStore) {
      dataObj[k] = v.el[v.property];
    }

    return dataObj;
  }
  
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

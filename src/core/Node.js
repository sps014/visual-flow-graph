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
    
    this.init();
  }
  
  init() {
    this.createElement();
    this.createSockets();
    this.setupDragging();
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.className = `node type-${this.type}`;
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.element.dataset.id = this.id;
    
    if (this.selected) {
      this.element.classList.add('selected');
    }
    
    // Use template HTML if available, otherwise generate default structure
    if (this.template && this.template.html) {
      this.element.innerHTML = this.template.html;
    } else {
      this.element.innerHTML = this.generateDefaultHTML();
    }
    
    // Add to DOM
    this.flowGraph.nodesRoot.appendChild(this.element);
  }
  
  generateDefaultHTML() {
    let inputsHTML = '';
    let outputsHTML = '';
    
    if (this.template) {
      // Generate inputs
      this.template.inputs.forEach(input => {
        inputsHTML += `<div class="line"><span class="socket in" data-sock="${input.id}"></span> ${input.label}</div>`;
      });
      
      // Generate outputs  
      this.template.outputs.forEach(output => {
        outputsHTML += `<div class="line" style="text-align:right"><span class="socket out" data-sock="${output.id}"></span> ${output.label}</div>`;
      });
    }
    
    const separator = inputsHTML && outputsHTML ? '<div style="height:8px"></div>' : '';
    
    return `
      <div class="title">${this.label}</div>
      <div class="body">
        ${inputsHTML}
        ${separator}
        ${outputsHTML}
      </div>
    `;
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
      }
    });
    
    // Link output socket elements
    this.outputs.forEach(socket => {
      const element = this.element.querySelector(`[data-sock="${socket.id}"]`);
      if (element) {
        socket.element = element;
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
  
  serialize() {
    return {
      id: this.id,
      type: this.type,
      label: this.label,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      selected: this.selected
    };
  }
  
  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}

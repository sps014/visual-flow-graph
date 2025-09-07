/**
 * FlowScript - A high-performance visual scripting library
 * Based on the working connection logic from the original implementation
 */

// ===== CORE UTILITIES =====

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const NS = "http://www.w3.org/2000/svg";

let idCounter = 1;
function uid(prefix = 'id') { 
  return prefix + (idCounter++); 
}

/**
 * Convert rect to center point (viewport-aware method)
 */
function rectCenter(el, flow = null) {
  const r = el.getBoundingClientRect();
  const surfaceRect = flow.surface.getBoundingClientRect();
  
  // Calculate position relative to the surface
  const relativeX = (r.left + r.width / 2) - surfaceRect.left;
  const relativeY = (r.top + r.height / 2) - surfaceRect.top;
  
  // Convert to world coordinates (undo the surface scaling and pan offset)
  return {
    x: (relativeX - flow.viewport.x) / flow.viewport.scale,
    y: (relativeY - flow.viewport.y) / flow.viewport.scale
  };
}

/**
 * Compute cubic bezier control points path string between p0 and p3
 * Enhanced to handle proper direction based on socket types and viewport scaling
 */
function makeCubicPath(p0, p3, fromSocket = null, toSocket = null, flow = null) {
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const dist = Math.hypot(dx, dy);
  
  // Use a consistent offset that works well at all zoom levels
  const offset = Math.min(200, dist * 0.5);
  
  // Determine control point directions based on socket types
  let c1, c2;
  
  if (fromSocket && toSocket) {
    // Output sockets go right, input sockets come from left
    const fromIsOutput = fromSocket.kind === 'out';
    const toIsInput = toSocket.kind === 'in';
    
    if (fromIsOutput && toIsInput) {
      // Normal flow: output -> input
      c1 = { x: p0.x + offset, y: p0.y };
      c2 = { x: p3.x - offset, y: p3.y };
    } else if (!fromIsOutput && !toIsInput) {
      // Reverse flow: input -> output
      c1 = { x: p0.x - offset, y: p0.y };
      c2 = { x: p3.x + offset, y: p3.y };
    } else if (!fromIsOutput && toIsInput) {
      // Input to input
      c1 = { x: p0.x - offset, y: p0.y };
      c2 = { x: p3.x - offset, y: p3.y };
    } else {
      // Output to output
      c1 = { x: p0.x + offset, y: p0.y };
      c2 = { x: p3.x + offset, y: p3.y };
    }
  } else {
    // Fallback to original behavior for temp connections
    c1 = { x: p0.x + offset, y: p0.y };
    c2 = { x: p3.x - offset, y: p3.y };
  }
  
  return `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`;
}

// ===== NODE REGISTRY =====

/**
 * Predefined node configurations
 */
const NODE_TYPES = {
  number: {
    type: 'number',
    color: '#3b82f6',
    inputs: [],
    outputs: [{ name: 'Value', id: 'value' }],
    hasInputBox: true
  },
  sum: {
    type: 'sum',
    color: '#a855f7',
    inputs: [
      { name: 'A', id: 'a' },
      { name: 'B', id: 'b' }
    ],
    outputs: [{ name: 'Result', id: 'result' }]
  },
  watch: {
    type: 'watch',
    color: '#22c55e',
    inputs: [{ name: 'Input', id: 'in' }],
    outputs: []
  },
  multiply: {
    type: 'multiply',
    color: '#8b5cf6',
    inputs: [
      { name: 'A', id: 'a' },
      { name: 'B', id: 'b' }
    ],
    outputs: [{ name: 'Product', id: 'product' }]
  },
  split: {
    type: 'split',
    color: '#06b6d4',
    inputs: [{ name: 'Input', id: 'in' }],
    outputs: [
      { name: 'A', id: 'a' },
      { name: 'B', id: 'b' },
      { name: 'C', id: 'c' }
    ]
  }
};

// ===== MAIN FLOW CLASS =====

/**
 * Basic Graph container - using original working logic
 */
class Flow {
  constructor(surface) {
    this.surface = surface;
    this.svg = $('#edge-svg', surface);
    this.nodesRoot = $('#nodes-root', surface);
    
    // Create content container that holds both nodes and edges
    this.contentContainer = document.createElement('div');
    this.contentContainer.style.position = 'absolute';
    this.contentContainer.style.left = '0';
    this.contentContainer.style.top = '0';
    this.contentContainer.style.width = '100%';
    this.contentContainer.style.height = '100%';
    this.contentContainer.style.pointerEvents = 'auto';
    this.contentContainer.style.transformOrigin = '0px 0px';
    
    // Move both nodes and edges into content container
    this.contentContainer.appendChild(this.nodesRoot);
    this.contentContainer.appendChild(this.svg);
    this.surface.appendChild(this.contentContainer);
    
    this.nodes = new Map();
    this.edges = new Map();
    this.dragState = null; // {type: 'node'|'edge', ...}
    
    // Viewport transform state
    this.viewport = {
      scale: 1,
      x: 0,
      y: 0
    };
    
    // Pan state
    this.panState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      startViewportX: 0,
      startViewportY: 0
    };

    // interactive temporary drag-edge path
    this.tempPath = document.createElementNS(NS, 'path');
    this.tempPath.setAttribute('stroke', 'rgba(124,58,237,0.95)');
    this.tempPath.setAttribute('stroke-width', 3.5);
    this.tempPath.setAttribute('fill', 'none');
    this.tempPath.setAttribute('stroke-linecap', 'round');
    this.tempPath.style.pointerEvents = 'none';
    this.svg.appendChild(this.tempPath);

    // pointer tracking for temp connections
    this._mouse = { x: 0, y: 0 };
    this._raf = null;
    window.addEventListener('pointermove', e => {
      this._mouse.x = e.clientX + window.scrollX;
      this._mouse.y = e.clientY + window.scrollY;
    });

    // rAF loop to update temp edge while dragging
    const loop = () => {
      if (this.dragState && this.dragState.type === 'edge-drag') {
        const fromPos = this.dragState.fromPos;
        const toPos = this.screenToWorld(this._mouse.x, this._mouse.y);
        const fromSocket = this.dragState.fromSocket;
        
        // Create a temporary "to" socket for direction calculation
        const tempToSocket = { kind: fromSocket.kind === 'out' ? 'in' : 'out' };
        
        this.tempPath.setAttribute('d', makeCubicPath(fromPos, toPos, fromSocket, tempToSocket, this));
      }
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
    
    // Initialize viewport controls
    this.initViewportControls();
  }
  
  // ===== VIEWPORT TRANSFORM METHODS =====
  
  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX, screenY) {
    // Get the surface's bounding rect to account for its transform
    const surfaceRect = this.surface.getBoundingClientRect();
    const relativeX = screenX - surfaceRect.left;
    const relativeY = screenY - surfaceRect.top;
    
    return {
      x: (relativeX - this.viewport.x) / this.viewport.scale,
      y: (relativeY - this.viewport.y) / this.viewport.scale
    };
  }
  
  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX, worldY) {
    // Get the surface's bounding rect to account for its transform
    const surfaceRect = this.surface.getBoundingClientRect();
    
    return {
      x: worldX * this.viewport.scale + this.viewport.x + surfaceRect.left,
      y: worldY * this.viewport.scale + this.viewport.y + surfaceRect.top
    };
  }
  
  /**
   * Apply viewport transform to the content container
   */
  applyViewportTransform() {
    const transform = `translate(${this.viewport.x}px, ${this.viewport.y}px) scale(${this.viewport.scale})`;
    this.contentContainer.style.transform = transform;
    
    // Update grid position to move with viewport
    const gridSize = 50;
    const minorGridSize = 10;
    this.surface.style.backgroundPosition = 
      `${this.viewport.x % gridSize}px ${this.viewport.y % gridSize}px, ` +
      `${this.viewport.x % gridSize}px ${this.viewport.y % gridSize}px, ` +
      `${this.viewport.x % minorGridSize}px ${this.viewport.y % minorGridSize}px, ` +
      `${this.viewport.x % minorGridSize}px ${this.viewport.y % minorGridSize}px`;
    
    // Update status bar if available
    if (this.updateStatusBar) {
      this.updateStatusBar();
    }
  }
  
  /**
   * Set viewport scale and position
   */
  setViewport(scale, x, y) {
    this.viewport.scale = Math.max(0.1, Math.min(5, scale)); // Clamp between 0.1x and 5x
    this.viewport.x = x;
    this.viewport.y = y;
    this.applyViewportTransform();
  }
  
  /**
   * Pan the viewport by delta amounts
   */
  panBy(deltaX, deltaY) {
    this.viewport.x += deltaX;
    this.viewport.y += deltaY;
    this.applyViewportTransform();
  }
  
  /**
   * Zoom the viewport by a factor around a center point
   */
  zoomBy(factor, centerX, centerY) {
    const oldScale = this.viewport.scale;
    const newScale = Math.max(0.1, Math.min(5, oldScale * factor));
    
    // Adjust pan to zoom around the center point
    const scaleDiff = newScale - oldScale;
    this.viewport.x -= (centerX - this.viewport.x) * (scaleDiff / oldScale);
    this.viewport.y -= (centerY - this.viewport.y) * (scaleDiff / oldScale);
    this.viewport.scale = newScale;
    
    this.applyViewportTransform();
  }
  
  /**
   * Reset viewport to default state
   */
  resetViewport() {
    this.setViewport(1, 0, 0);
  }
  
  /**
   * Initialize viewport controls (pan, zoom)
   */
  initViewportControls() {
    // Mouse wheel zoom
    this.surface.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.surface.getBoundingClientRect();
      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoomBy(factor, centerX, centerY);
    });
    
    // Pan controls
    this.surface.addEventListener('pointerdown', (e) => {
      // Only start panning if not clicking on a node or socket
      const isSurface = e.target === this.surface;
      const isContentContainer = e.target === this.contentContainer;
      const isNodesRoot = e.target === this.nodesRoot;
      const isNode = e.target.closest('.node');
      const isSocket = e.target.classList.contains('socket');
      
      if ((isSurface || isContentContainer || isNodesRoot) && !isNode && !isSocket) {
        this.startPan(e);
      }
    });
    
    // Touch gestures for mobile
    let lastTouchDistance = 0;
    this.surface.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        lastTouchDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    });
    
    this.surface.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        if (lastTouchDistance > 0) {
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;
          const rect = this.surface.getBoundingClientRect();
          const factor = distance / lastTouchDistance;
          this.zoomBy(factor, centerX - rect.left, centerY - rect.top);
        }
        
        lastTouchDistance = distance;
      }
    });
  }
  
  /**
   * Start panning operation
   */
  startPan(e) {
    this.panState.isPanning = true;
    this.panState.startX = e.clientX;
    this.panState.startY = e.clientY;
    this.panState.startViewportX = this.viewport.x;
    this.panState.startViewportY = this.viewport.y;
    
    this.surface.setPointerCapture(e.pointerId);
    this.surface.style.cursor = 'grabbing';
    
    const onPointerMove = (e) => {
      if (this.panState.isPanning) {
        const deltaX = e.clientX - this.panState.startX;
        const deltaY = e.clientY - this.panState.startY;
        this.setViewport(
          this.viewport.scale,
          this.panState.startViewportX + deltaX,
          this.panState.startViewportY + deltaY
        );
      }
    };
    
    const onPointerUp = (e) => {
      this.panState.isPanning = false;
      this.surface.style.cursor = '';
      this.surface.releasePointerCapture(e.pointerId);
      this.surface.removeEventListener('pointermove', onPointerMove);
      this.surface.removeEventListener('pointerup', onPointerUp);
    };
    
    this.surface.addEventListener('pointermove', onPointerMove);
    this.surface.addEventListener('pointerup', onPointerUp);
  }

  addNode(x = 100, y = 100, title = 'Node', config = {}) {
    const n = new Node(this, x, y, title, config);
    this.nodes.set(n.id, n);
    this.nodesRoot.appendChild(n.el);
    return n;
  }

  /**
   * Create a node from a predefined type
   */
  addNodeByType(x = 100, y = 100, typeName, title = null) {
    const typeConfig = NODE_TYPES[typeName];
    if (!typeConfig) {
      throw new Error(`Unknown node type: ${typeName}`);
    }
    
    const config = { ...typeConfig };
    if (title) config.title = title;
    
    return this.addNode(x, y, title || typeConfig.type, config);
  }

  /**
   * Register a new node type
   */
  registerNodeType(name, config) {
    NODE_TYPES[name] = config;
  }

  /**
   * Get all available node types
   */
  getNodeTypes() {
    return Object.keys(NODE_TYPES);
  }

  /**
   * Create a node with custom socket configuration
   */
  addCustomNode(x = 100, y = 100, title = 'Custom', inputs = [], outputs = [], color = '#7c3aed') {
    const config = {
      type: 'custom',
      color: color,
      inputs: inputs,
      outputs: outputs
    };
    return this.addNode(x, y, title, config);
  }

  /**
   * Create a node with a specific number of inputs and outputs
   */
  addNodeWithSockets(x = 100, y = 100, title = 'Node', inputCount = 1, outputCount = 1, color = '#7c3aed') {
    const inputs = Array.from({ length: inputCount }, (_, i) => ({
      name: `Input ${i + 1}`,
      id: `in${i + 1}`
    }));
    
    const outputs = Array.from({ length: outputCount }, (_, i) => ({
      name: `Output ${i + 1}`,
      id: `out${i + 1}`
    }));
    
    return this.addCustomNode(x, y, title, inputs, outputs, color);
  }

  removeNode(node) {
    // remove attached edges
    for (let [id, edge] of Array.from(this.edges)) {
      if (edge.from.node === node || edge.to.node === node) this.removeEdge(edge);
    }
    this.nodes.delete(node.id);
    node.el.remove();
  }

  addEdge(fromSocket, toSocket) {
    // create edge object and svg path
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('stroke', 'rgba(124,58,237,0.95)');
    p.setAttribute('stroke-width', 3.5);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke-linecap', 'round');
    p.classList.add('edge');
    this.svg.appendChild(p);
    const edge = { id: uid('e'), el: p, from: fromSocket, to: toSocket };
    this.edges.set(edge.id, edge);
    this.updateEdge(edge);
    return edge;
  }

  updateEdge(edge) {
    // evaluate socket positions (center) - viewport-aware method
    const fromPos = rectCenter(edge.from.el, this);
    const toPos = rectCenter(edge.to.el, this);
    edge.el.setAttribute('d', makeCubicPath(fromPos, toPos, edge.from, edge.to, this));
  }

  removeEdge(edge) {
    this.edges.delete(edge.id);
    edge.el.remove();
  }

  startEdgeDrag(fromSocket) {
    this.dragState = { type: 'edge-drag', fromSocket, fromPos: rectCenter(fromSocket.el, this) };
    this.tempPath.style.display = '';
  }

  endEdgeDrag(targetSocket) {
    if (!this.dragState || this.dragState.type !== 'edge-drag') return;
    const fromSocket = this.dragState.fromSocket;
    // if dropped on valid socket, create edge
    if (targetSocket && targetSocket !== fromSocket) {
      this.addEdge(fromSocket, targetSocket);
    }
    this.dragState = null;
    this.tempPath.style.display = 'none';
    this.tempPath.setAttribute('d', '');
  }

  // update all edges connected to a node (call after move)
  updateEdgesForNode(node) {
    for (let edge of this.edges.values()) {
      if (edge.from.node === node || edge.to.node === node) this.updateEdge(edge);
    }
  }

  // Enhanced methods for compatibility
  createNode(x, y, config = {}) {
    return this.addNode(x, y, config.title || 'Node');
  }

  createConnection(fromSocket, toSocket) {
    return this.addEdge(fromSocket, toSocket);
  }

  removeConnection(connection) {
    this.removeEdge(connection);
  }

  clear() {
    // remove edges and nodes
    for (let e of Array.from(this.edges.values())) this.removeEdge(e);
    for (let n of Array.from(this.nodes.values())) this.removeNode(n);
  }

  serialize() {
    const nodesData = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      title: node.title,
      x: parseFloat(node.el.style.left) || 0,
      y: parseFloat(node.el.style.top) || 0
    }));
    
    const connectionsData = Array.from(this.edges.values()).map(edge => ({
      id: edge.id,
      from: edge.from.el.dataset.socketId,
      to: edge.to.el.dataset.socketId
    }));
    
    return {
      nodes: nodesData,
      connections: connectionsData
    };
  }

  deserialize(data) {
    this.clear();
    
    // Create nodes first
    const nodeMap = new Map();
    data.nodes.forEach(nodeData => {
      const node = this.addNode(nodeData.x, nodeData.y, nodeData.title);
      nodeMap.set(nodeData.id, node);
    });
    
    // Create connections
    data.connections.forEach(connectionData => {
      const fromSocket = this.findSocketById(connectionData.from);
      const toSocket = this.findSocketById(connectionData.to);
      
      if (fromSocket && toSocket) {
        this.addEdge(fromSocket, toSocket);
      }
    });
  }

  findSocketById(socketId) {
    for (let node of this.nodes.values()) {
      for (let socket of node.sockets) {
        if (socket.el.dataset.socketId === socketId) {
          return socket;
        }
      }
    }
    return null;
  }
}

// ===== NODE CLASS =====

/**
 * Node implementation - using original working logic
 */
class Node {
  constructor(flow, x = 100, y = 100, title = 'Node', config = {}) {
    this.flow = flow;
    this.id = uid('n');
    this.el = document.createElement('div');
    this.el.className = 'node';
    this.el.style.left = x + 'px';
    this.el.style.top = y + 'px';
    this.el.dataset.id = this.id;
    this.title = title;
    this.type = config.type || 'default';
    this.config = {
      type: 'default',
      color: '#7c3aed',
      inputs: [{ name: 'Input', id: 'in' }],
      outputs: [{ name: 'Output', id: 'out' }],
      ...config
    };

    // Add type class
    this.el.classList.add(`type-${this.type}`);

    // Generate content based on configuration
    this.el.innerHTML = this.generateNodeContent();

    // sockets
    this.sockets = [];
    const sEls = this.el.querySelectorAll('.socket');
    sEls.forEach(sEl => {
      const socketType = sEl.classList.contains('out') ? 'out' : 'in';
      const sock = new Socket(this, sEl, socketType);
      this.sockets.push(sock);
    });

    // Initialize dragging
    this.initDragging();
  }

  generateNodeContent() {
    const { inputs, outputs, hasInputBox } = this.config;
    
    // Generate input sockets
    const inputSockets = inputs.map(input => 
      `<div class="line"><span class="socket in" data-sock="${input.id}"></span> ${input.name}</div>`
    ).join('');
    
    // Generate output sockets
    const outputSockets = outputs.map(output => 
      `<div class="line" style="text-align:right"><span class="socket out" data-sock="${output.id}"></span> ${output.name}</div>`
    ).join('');
    
    // Generate input box for number nodes
    const inputBox = hasInputBox ? `
      <div class="input-box-container">
        <input type="number" class="input-box" value="0" placeholder="Enter value" />
      </div>
    ` : '';
    
    // Add spacing between inputs and outputs if both exist
    const spacing = inputs.length > 0 && outputs.length > 0 ? '<div style="height:8px"></div>' : '';
    
    return `
      <div class="title">${this.title}</div>
      <div class="body">
        ${inputSockets}
        ${inputBox}
        ${spacing}
        ${outputSockets}
      </div>
    `;
  }

  // dragging - original working implementation
  initDragging() {
    this._dragging = false;
    this._dragOffset = { x: 0, y: 0 };
    this.el.addEventListener('pointerdown', (e) => {
      // don't start node drag if starting on a socket
      if (e.target.classList.contains('socket')) return;
      this.el.setPointerCapture(e.pointerId);
      this._dragging = true;
      this.el.classList.add('dragging');
      const rect = this.el.getBoundingClientRect();
      this._dragOffset.x = e.clientX - rect.left;
      this._dragOffset.y = e.clientY - rect.top;
      this._onPointerMove = (ev) => {
        // Convert screen coordinates to world coordinates for proper positioning
        const screenX = ev.clientX - this._dragOffset.x;
        const screenY = ev.clientY - this._dragOffset.y;
        const worldCoords = this.flow.screenToWorld(screenX, screenY);
        
        this.el.style.left = worldCoords.x + 'px';
        this.el.style.top = worldCoords.y + 'px';
        
        // update connected edges (throttled via rAF)
        if (!this._edgeRaf) {
          this._edgeRaf = requestAnimationFrame(() => {
            this.flow.updateEdgesForNode(this);
            this._edgeRaf = null;
          });
        }
      };
      this.el.addEventListener('pointermove', this._onPointerMove);
    });
    this.el.addEventListener('pointerup', (e) => {
      if (this._dragging) {
        this._dragging = false;
        this.el.classList.remove('dragging');
        this.el.releasePointerCapture(e.pointerId);
        this.el.removeEventListener('pointermove', this._onPointerMove);
      }
    });
  }
}

// ===== SOCKET CLASS =====

/**
 * Socket - using original working logic
 */
class Socket {
  constructor(node, el, kind = 'in') {
    this.node = node;
    this.el = el;
    this.kind = kind; // 'in' or 'out'
    this.el.dataset.socketId = uid('s');
    
    // pointer handling: start a drag on pointerdown - original working method
    this._onDown = (e) => {
      e.stopPropagation();
      // start an edge drag from here
      this.node.flow.startEdgeDrag(this);
      // add temporary hover target detection
      document.addEventListener('pointerup', this._onUp);
    };
    
    this._onUp = (e) => {
      // on pointerup, detect if we are over another socket
      document.removeEventListener('pointerup', this._onUp);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const target = el && el.classList && el.classList.contains('socket') ? el : null;
      const targetSocket = target ? this._findSocketByElement(target) : null;
      this.node.flow.endEdgeDrag(targetSocket);
    };
    
    this.el.addEventListener('pointerdown', this._onDown);
  }
  
  _findSocketByElement(el) {
    // search flow nodes for socket object
    for (let node of this.node.flow.nodes.values()) {
      for (let s of node.sockets) {
        if (s.el === el) return s;
      }
    }
    return null;
  }
}

// ===== DEMO INITIALIZATION =====

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const surface = $('#surface');
  if (!surface) return;
  
  const flow = new Flow(surface);
  
  // Status bar updates
  function updateStatusBar() {
    document.getElementById('node-count').textContent = `Nodes: ${flow.nodes.size}`;
    document.getElementById('connection-count').textContent = `Connections: ${flow.edges.size}`;
    document.getElementById('zoom-level').textContent = `Zoom: ${Math.round(flow.viewport.scale * 100)}%`;
  }
  
  // Make updateStatusBar available to the flow instance
  flow.updateStatusBar = updateStatusBar;
  
  // Create the 5 node types you requested
  const n1 = flow.addNodeByType(100, 100, 'number', 'Number'); // Input box + output
  const n2 = flow.addNodeByType(300, 100, 'sum', 'Sum'); // 2 inputs + 1 output
  const n3 = flow.addNodeByType(500, 100, 'watch', 'Watch'); // 1 input only
  const n4 = flow.addNodeByType(100, 250, 'multiply', 'Multiply'); // 2 inputs + 1 output
  const n5 = flow.addNodeByType(300, 250, 'split', 'Split'); // 1 input + 3 outputs

  // Setup UI controls
  document.getElementById('add-node').addEventListener('click', () => {
    const nx = 80 + Math.random() * 600;
    const ny = 50 + Math.random() * 300;
    const types = flow.getNodeTypes();
    const type = types[Math.floor(Math.random() * types.length)];
    flow.addNodeByType(nx, ny, type, type.charAt(0).toUpperCase() + type.slice(1));
    updateStatusBar();
  });

  // Add a button to create custom nodes with random socket counts
  const addCustomButton = document.createElement('button');
  addCustomButton.textContent = '+ Add Custom Node';
  addCustomButton.style.marginLeft = '10px';
  addCustomButton.addEventListener('click', () => {
    const nx = 80 + Math.random() * 600;
    const ny = 50 + Math.random() * 300;
    const inputCount = Math.floor(Math.random() * 6); // 0-5 inputs
    const outputCount = Math.floor(Math.random() * 6); // 0-5 outputs
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    flow.addNodeWithSockets(nx, ny, `Custom ${inputCount}-${outputCount}`, inputCount, outputCount, color);
    updateStatusBar();
  });
  document.getElementById('panel').appendChild(addCustomButton);

  document.getElementById('clear').addEventListener('click', () => {
    flow.clear();
    updateStatusBar();
  });

  // Save/Load functionality
  document.getElementById('save').addEventListener('click', () => {
    const data = flow.serialize();
    localStorage.setItem('flowscript-demo', JSON.stringify(data));
    
    // Visual feedback
    const btn = document.getElementById('save');
    const originalText = btn.textContent;
    btn.textContent = 'Saved!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1000);
  });

  document.getElementById('load').addEventListener('click', () => {
    const saved = localStorage.getItem('flowscript-demo');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        flow.deserialize(data);
        updateStatusBar();
        
        // Visual feedback
        const btn = document.getElementById('load');
        const originalText = btn.textContent;
        btn.textContent = 'Loaded!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1000);
      } catch (e) {
        console.error('Failed to load saved flow:', e);
      }
    }
  });

  // Reset view button
  document.getElementById('reset-view').addEventListener('click', () => {
    flow.resetViewport();
    
    // Visual feedback
    const btn = document.getElementById('reset-view');
    const originalText = btn.textContent;
    btn.textContent = 'Reset!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 500);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Clear all with Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      flow.clear();
      updateStatusBar();
    }
    
    // Save with Ctrl+S
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      document.getElementById('save').click();
    }
    
    // Load with Ctrl+O
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      document.getElementById('load').click();
    }
  });

  // Make edges update on window resize
  window.addEventListener('resize', () => {
    for (let e of flow.edges.values()) flow.updateEdge(e);
  });

  // Demo: connect n1.out -> n2.in automatically
  setTimeout(() => {
    const out = n1.sockets.find(s => s.kind === 'out');
    const in2 = n2.sockets.find(s => s.kind === 'in');
    if (out && in2) flow.addEdge(out, in2);
    updateStatusBar();
  }, 120);

  // Initial status update
  updateStatusBar();
  
  // Make flow available globally for debugging
  window.demoFlow = flow;
  window.Flow = Flow;
  window.Node = Node;
  window.Socket = Socket;
});
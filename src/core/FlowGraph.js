import { Node } from './Node.js';
import { Edge } from './Edge.js';
import { Viewport } from './Viewport.js';

export class FlowGraph extends EventTarget {
  constructor(container) {
    super();
    
    this.container = container;
    this.nodes = new Map();
    this.edges = new Map();
    this.templates = new Map();
    this.selection = new Set();
    
    // Create surface elements
    this.surface = document.createElement('div');
    this.surface.className = 'surface';
    
    this.edgeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.edgeSvg.id = 'edge-svg';
    this.edgeSvg.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      width: 100%;
      height: 100%;
      overflow: visible;
      z-index: 1;
    `;
    
    this.nodesRoot = document.createElement('div');
    this.nodesRoot.id = 'nodes-root';
    this.nodesRoot.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 2;
    `;
    
    // Temp path for drawing connections
    this.tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.tempPath.setAttribute('stroke', 'var(--fg-edge)');
    this.tempPath.setAttribute('stroke-width', '3.5');
    this.tempPath.setAttribute('fill', 'none');
    this.tempPath.setAttribute('stroke-linecap', 'round');
    this.tempPath.style.pointerEvents = 'none';
    this.tempPath.style.display = 'none';
    this.edgeSvg.appendChild(this.tempPath);
    
    // Create content container that holds both nodes and edges (like original lib.js)
    this.contentContainer = document.createElement('div');
    this.contentContainer.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      transform-origin: 0px 0px;
    `;
    
    // Move both nodes and edges into content container
    this.contentContainer.appendChild(this.nodesRoot);
    this.contentContainer.appendChild(this.edgeSvg);
    
    // Assemble surface
    this.surface.appendChild(this.contentContainer);
    this.container.appendChild(this.surface);
    
    // Initialize viewport with content container
    this.viewport = new Viewport(this.surface, this.contentContainer);
    
    // Connection state
    this.connectionState = {
      active: false,
      fromSocket: null,
      toSocket: null
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Socket connection handling
    this.container.addEventListener('pointerdown', this.handleSocketPointerDown.bind(this));
    this.container.addEventListener('pointermove', this.handleSocketPointerMove.bind(this));
    this.container.addEventListener('pointerup', this.handleSocketPointerUp.bind(this));
    
    // Prevent context menu on right click
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  handleSocketPointerDown(e) {
    const socket = e.target.closest('.socket');
    if (!socket) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const nodeElement = socket.closest('.node');
    const nodeId = nodeElement?.dataset.id;
    const socketId = socket.dataset.sock;
    
    if (!nodeId || !socketId) return;
    
    const node = this.nodes.get(nodeId);
    const socketObj = node?.getSocket(socketId);
    
    if (!socketObj) return;
    
    this.connectionState.active = true;
    this.connectionState.fromSocket = socketObj;
    
    // Add visual feedback
    socket.classList.add('socket-active');
    
    // Show temp path
    this.tempPath.style.display = 'block';
    this.updateTempPath(e.clientX, e.clientY);
  }
  
  handleSocketPointerMove(e) {
    if (!this.connectionState.active) return;
    
    this.updateTempPath(e.clientX, e.clientY);
    
    // Check for socket hover
    const socket = e.target.closest('.socket');
    if (socket && socket !== this.connectionState.fromSocket?.element) {
      const nodeElement = socket.closest('.node');
      const nodeId = nodeElement?.dataset.id;
      const socketId = socket.dataset.sock;
      
      if (nodeId && socketId) {
        const node = this.nodes.get(nodeId);
        const socketObj = node?.getSocket(socketId);
        
        if (socketObj && this.canConnect(this.connectionState.fromSocket, socketObj)) {
          socket.classList.add('socket-hover');
          this.connectionState.toSocket = socketObj;
        } else {
          socket.classList.remove('socket-hover');
          this.connectionState.toSocket = null;
        }
      }
    } else {
      // Remove hover from all sockets
      this.container.querySelectorAll('.socket-hover').forEach(s => {
        s.classList.remove('socket-hover');
      });
      this.connectionState.toSocket = null;
    }
  }
  
  handleSocketPointerUp(e) {
    if (!this.connectionState.active) return;
    
    // Clean up visual feedback
    this.container.querySelectorAll('.socket-active').forEach(s => {
      s.classList.remove('socket-active');
    });
    this.container.querySelectorAll('.socket-hover').forEach(s => {
      s.classList.remove('socket-hover');
    });
    
    this.tempPath.style.display = 'none';
    
    // Create connection if valid
    if (this.connectionState.fromSocket && this.connectionState.toSocket) {
      this.createEdge(this.connectionState.fromSocket, this.connectionState.toSocket);
    }
    
    // Reset state
    this.connectionState.active = false;
    this.connectionState.fromSocket = null;
    this.connectionState.toSocket = null;
  }
  
  updateTempPath(clientX, clientY) {
    if (!this.connectionState.fromSocket) return;
    
    const fromSocket = this.connectionState.fromSocket;
    const fromPos = this.getSocketPosition(fromSocket);
    
    // Convert client coordinates to surface coordinates
    const surfaceRect = this.surface.getBoundingClientRect();
    const toX = (clientX - surfaceRect.left - this.viewport.x) / this.viewport.scale;
    const toY = (clientY - surfaceRect.top - this.viewport.y) / this.viewport.scale;
    
    const path = this.createCubicPath(fromPos, { x: toX, y: toY }, fromSocket);
    this.tempPath.setAttribute('d', path);
  }
  
  getSocketPosition(socket) {
    const element = socket.element;
    const rect = element.getBoundingClientRect();
    const surfaceRect = this.surface.getBoundingClientRect();
    
    const x = (rect.left + rect.width / 2 - surfaceRect.left - this.viewport.x) / this.viewport.scale;
    const y = (rect.top + rect.height / 2 - surfaceRect.top - this.viewport.y) / this.viewport.scale;
    
    return { x, y };
  }
  
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
  
  canConnect(fromSocket, toSocket) {
    if (!fromSocket || !toSocket) return false;
    if (fromSocket === toSocket) return false;
    if (fromSocket.node === toSocket.node) return false;
    if (fromSocket.type === toSocket.type) return false;
    
    // Check if connection already exists
    for (const edge of this.edges.values()) {
      if ((edge.fromSocket === fromSocket && edge.toSocket === toSocket) ||
          (edge.fromSocket === toSocket && edge.toSocket === fromSocket)) {
        return false;
      }
    }
    
    return true;
  }
  
  addNodeTemplate(name, template) {
    this.templates.set(name, template);
  }
  
  addNode(type, config = {}) {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Unknown node type: ${type}`);
    }
    
    const node = new Node(this, { ...config, type, template });
    this.nodes.set(node.id, node);
    
    this.dispatchEvent(new CustomEvent('node:create', { 
      detail: { node } 
    }));
    
    return node;
  }
  
  removeNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    
    // Remove all connected edges
    const edgesToRemove = [];
    for (const edge of this.edges.values()) {
      if (edge.fromSocket.node === node || edge.toSocket.node === node) {
        edgesToRemove.push(edge.id);
      }
    }
    edgesToRemove.forEach(edgeId => this.removeEdge(edgeId));
    
    // Remove node
    node.destroy();
    this.nodes.delete(nodeId);
    
    this.dispatchEvent(new CustomEvent('node:remove', { 
      detail: { nodeId } 
    }));
  }
  
  createEdge(fromSocket, toSocket) {
    if (!this.canConnect(fromSocket, toSocket)) return null;
    
    const edge = new Edge(this, fromSocket, toSocket);
    this.edges.set(edge.id, edge);
    
    this.dispatchEvent(new CustomEvent('edge:create', { 
      detail: { edge } 
    }));
    
    return edge;
  }
  
  removeEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (!edge) return;
    
    edge.destroy();
    this.edges.delete(edgeId);
    
    this.dispatchEvent(new CustomEvent('edge:remove', { 
      detail: { edgeId } 
    }));
  }
  
  updateEdgesForNode(node) {
    for (const edge of this.edges.values()) {
      if (edge.fromSocket.node === node || edge.toSocket.node === node) {
        edge.updatePath();
      }
    }
  }
  
  clear() {
    // Remove all edges
    for (const edgeId of this.edges.keys()) {
      this.removeEdge(edgeId);
    }
    
    // Remove all nodes
    for (const nodeId of this.nodes.keys()) {
      this.removeNode(nodeId);
    }
  }
  
  serialize() {
    const nodes = Array.from(this.nodes.values()).map(node => node.serialize());
    const edges = Array.from(this.edges.values()).map(edge => edge.serialize());
    
    return {
      nodes,
      edges,
      viewport: this.viewport.serialize()
    };
  }
  
  deserialize(data) {
    this.clear();
    
    // Restore nodes
    if (data.nodes) {
      data.nodes.forEach(nodeData => {
        this.addNode(nodeData.type, nodeData);
      });
    }
    
    // Restore edges
    if (data.edges) {
      data.edges.forEach(edgeData => {
        const fromNode = this.nodes.get(edgeData.fromNodeId);
        const toNode = this.nodes.get(edgeData.toNodeId);
        
        if (fromNode && toNode) {
          const fromSocket = fromNode.getSocket(edgeData.fromSocketId);
          const toSocket = toNode.getSocket(edgeData.toSocketId);
          
          if (fromSocket && toSocket) {
            this.createEdge(fromSocket, toSocket);
          }
        }
      });
    }
    
    // Restore viewport
    if (data.viewport) {
      this.viewport.deserialize(data.viewport);
    }
  }
  
  destroy() {
    this.clear();
    this.surface.remove();
  }
}
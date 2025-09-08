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
    this.tempPath.setAttribute('stroke', '#10b981'); // Green color for better visibility
    this.tempPath.setAttribute('stroke-width', '2.5'); // Reduced stroke width
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
    this.viewport = new Viewport(this.surface, this.contentContainer, this);
    
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
    
    // Clear selection when clicking on empty space
    this.surface.addEventListener('click', (e) => {
      // Only clear if clicking directly on surface (not on nodes)
      if (e.target === this.surface) {
        this.clearSelection();
      }
    });
    
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
    
    this.container.dispatchEvent(new CustomEvent('node:create', { 
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
    
    this.container.dispatchEvent(new CustomEvent('node:remove', { 
      detail: { nodeId } 
    }));
  }
  
  createEdge(fromSocket, toSocket) {
    if (!this.canConnect(fromSocket, toSocket)) return null;
    
    const edge = new Edge(this, fromSocket, toSocket);
    this.edges.set(edge.id, edge);
    
    this.container.dispatchEvent(new CustomEvent('edge:create', { 
      detail: { edge } 
    }));
    
    return edge;
  }
  
  removeEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (!edge) return;
    
    edge.destroy();
    this.edges.delete(edgeId);
    
    this.container.dispatchEvent(new CustomEvent('edge:remove', {
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
  
  // ===== MULTI-DRAG SYSTEM =====
  
  /**
   * Start multi-drag operation
   */
  startMultiDrag(e, draggedNode) {
    this.multiDragState = {
      active: true,
      draggedNode: draggedNode,
      startX: e.clientX,
      startY: e.clientY,
      initialPositions: new Map()
    };
    
    // Store initial positions of all selected nodes and add dragging class
    for (const nodeId of this.selection) {
      const node = this.nodes.get(nodeId);
      if (node) {
        this.multiDragState.initialPositions.set(nodeId, {
          x: node.x,
          y: node.y
        });
        // Add dragging class to all selected nodes
        node.element.classList.add('dragging');
      }
    }
  }
  
  /**
   * Update multi-drag operation
   */
  updateMultiDrag(e) {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    const deltaX = e.clientX - this.multiDragState.startX;
    const deltaY = e.clientY - this.multiDragState.startY;
    
    // Convert screen delta to world delta
    const worldDeltaX = deltaX / this.viewport.scale;
    const worldDeltaY = deltaY / this.viewport.scale;
    
    // Update all selected nodes
    for (const nodeId of this.selection) {
      const node = this.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
        const newX = initialPos.x + worldDeltaX;
        const newY = initialPos.y + worldDeltaY;
        
        // Update position without firing events (we'll fire one batch event)
        node.x = newX;
        node.y = newY;
        node.element.style.left = newX + 'px';
        node.element.style.top = newY + 'px';
      }
    }
    
    // Update edges for all moved nodes
    requestAnimationFrame(() => {
      for (const nodeId of this.selection) {
        const node = this.nodes.get(nodeId);
        if (node) {
          this.updateEdgesForNode(node);
        }
      }
    });
  }
  
  /**
   * End multi-drag operation
   */
  endMultiDrag() {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    // Fire move events for all moved nodes and remove dragging class
    for (const nodeId of this.selection) {
      const node = this.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
        this.container.dispatchEvent(new CustomEvent('node:move', {
          detail: { 
            nodeId: node.id, 
            node: node, 
            oldPosition: initialPos,
            newPosition: { x: node.x, y: node.y }
          }
        }));
        // Remove dragging class
        node.element.classList.remove('dragging');
      }
    }
    
    this.multiDragState = null;
  }
  
  /**
   * Select a node
   */
  selectNode(nodeId, addToSelection = false) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    
    if (!addToSelection) {
      this.clearSelection();
    }
    
    this.selection.add(nodeId);
    node.setSelected(true);
    
    this.container.dispatchEvent(new CustomEvent('node:select', {
      detail: { nodeId, node, selection: Array.from(this.selection) }
    }));
  }
  
  /**
   * Deselect a node
   */
  deselectNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    
    this.selection.delete(nodeId);
    node.setSelected(false);
    
    this.container.dispatchEvent(new CustomEvent('node:deselect', {
      detail: { nodeId, node, selection: Array.from(this.selection) }
    }));
  }
  
  /**
   * Clear all selections
   */
  clearSelection() {
    const previousSelection = Array.from(this.selection);
    
    this.selection.forEach(nodeId => {
      const node = this.nodes.get(nodeId);
      if (node) node.setSelected(false);
    });
    
    this.selection.clear();
    
    this.container.dispatchEvent(new CustomEvent('selection:clear', {
      detail: { previousSelection }
    }));
  }
  
  /**
   * Get current selection
   */
  getSelection() {
    return Array.from(this.selection);
  }
  
  /**
   * Move a node and fire event
   */
  moveNode(nodeId, x, y) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    
    const oldPosition = { x: node.x, y: node.y };
    node.setPosition(x, y);
    
    this.container.dispatchEvent(new CustomEvent('node:move', {
      detail: { nodeId, node, oldPosition, newPosition: { x, y } }
    }));
    
    // Update connected edges
    this.updateEdgesForNode(node);
  }
  
  /**
   * Select an edge
   */
  selectEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (!edge) return;
    
    // Add visual selection class
    edge.element.classList.add('selected');
    
    this.container.dispatchEvent(new CustomEvent('edge:select', {
      detail: { edgeId, edge }
    }));
  }
  
  /**
   * Deselect an edge
   */
  deselectEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (!edge) return;
    
    edge.element.classList.remove('selected');
    
    this.container.dispatchEvent(new CustomEvent('edge:deselect', {
      detail: { edgeId, edge }
    }));
  }
  
  /**
   * Handle viewport changes
   */
  onViewportChange() {
    this.container.dispatchEvent(new CustomEvent('viewport:change', {
      detail: { 
        x: this.viewport.x, 
        y: this.viewport.y, 
        scale: this.viewport.scale 
      }
    }));
  }
  
  /**
   * Handle viewport zoom
   */
  onViewportZoom(scale) {
    this.container.dispatchEvent(new CustomEvent('viewport:zoom', {
      detail: { scale, x: this.viewport.x, y: this.viewport.y }
    }));
  }
  
  /**
   * Handle viewport pan
   */
  onViewportPan(x, y) {
    this.container.dispatchEvent(new CustomEvent('viewport:pan', {
      detail: { x, y, scale: this.viewport.scale }
    }));
  }
  
  // Keyboard shortcut methods
  selectAllNodes() {
    this.clearSelection();
    this.nodes.forEach((node, nodeId) => {
      this.selection.add(nodeId);
      node.setSelected(true);
    });
    
    this.container.dispatchEvent(new CustomEvent('selection:change', {
      detail: { selectedNodes: Array.from(this.selection) }
    }));
  }
  
  deleteSelectedNodes() {
    if (this.selection.size === 0) return;
    
    const selectedNodes = Array.from(this.selection);
    
    // Delete edges connected to selected nodes first
    const edgesToDelete = [];
    this.edges.forEach((edge, edgeId) => {
      if (selectedNodes.includes(edge.fromNodeId) || selectedNodes.includes(edge.toNodeId)) {
        edgesToDelete.push(edgeId);
      }
    });
    
    edgesToDelete.forEach(edgeId => {
      this.removeEdge(edgeId);
    });
    
    // Delete selected nodes
    selectedNodes.forEach(nodeId => {
      this.removeNode(nodeId);
    });
    
    this.clearSelection();
    
    // Dispatch bulk delete event
    this.container.dispatchEvent(new CustomEvent('nodes:delete', {
      detail: { deletedNodes: selectedNodes, deletedEdges: edgesToDelete }
    }));
  }
  
  copySelectedNodes() {
    if (this.selection.size === 0) return;
    
    const selectedNodes = Array.from(this.selection);
    const copyData = {
      nodes: [],
      edges: [],
      timestamp: Date.now()
    };
    
    // Collect node data (just type and position)
    selectedNodes.forEach(nodeId => {
      const node = this.nodes.get(nodeId);
      if (node) {
        copyData.nodes.push({
          id: node.id,
          type: node.type,
          x: node.x,
          y: node.y
        });
      }
    });
    
    // Collect edge data for connections between selected nodes
    this.edges.forEach((edge, edgeId) => {
      if (selectedNodes.includes(edge.fromNodeId) && selectedNodes.includes(edge.toNodeId)) {
        copyData.edges.push({
          id: edgeId,
          fromNodeId: edge.fromNodeId,
          fromSocketId: edge.fromSocketId,
          toNodeId: edge.toNodeId,
          toSocketId: edge.toSocketId
        });
      }
    });
    
    // Store in clipboard
    this.clipboard = copyData;
    
    this.container.dispatchEvent(new CustomEvent('nodes:copy', {
      detail: { copiedNodes: selectedNodes, copyData }
    }));
    
    console.log(`Copied ${selectedNodes.length} nodes and ${copyData.edges.length} edges`);
  }
  
  pasteNodes() {
    if (!this.clipboard || !this.clipboard.nodes.length) {
      console.log('No nodes in clipboard to paste');
      return;
    }
    
    const pasteOffset = { x: 20, y: 20 }; // Offset for pasted nodes
    const newNodes = [];
    const nodeIdMap = new Map(); // Map old IDs to new IDs
    
    // Clear current selection
    this.clearSelection();
    
    // Create new nodes
    this.clipboard.nodes.forEach(nodeData => {
      const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      nodeIdMap.set(nodeData.id, newNodeId);
      
      try {
        const newNode = this.addNode(nodeData.type, {
          id: newNodeId,
          x: nodeData.x + pasteOffset.x,
          y: nodeData.y + pasteOffset.y
        });
        
        if (newNode) {
          newNodes.push(newNode);
          this.selection.add(newNodeId);
          newNode.setSelected(true);
        }
      } catch (error) {
        console.warn(`Could not paste node of type ${nodeData.type}:`, error.message);
      }
    });
    
    // Create new edges with updated node IDs
    this.clipboard.edges.forEach(edgeData => {
      const newFromNodeId = nodeIdMap.get(edgeData.fromNodeId);
      const newToNodeId = nodeIdMap.get(edgeData.toNodeId);
      
      if (newFromNodeId && newToNodeId) {
        const fromNode = this.nodes.get(newFromNodeId);
        const toNode = this.nodes.get(newToNodeId);
        
        if (fromNode && toNode) {
          const fromSocket = fromNode.outputs.get(edgeData.fromSocketId);
          const toSocket = toNode.inputs.get(edgeData.toSocketId);
          
          if (fromSocket && toSocket && fromSocket.canConnect(toSocket)) {
            this.createEdge({
              fromNodeId: newFromNodeId,
              fromSocketId: edgeData.fromSocketId,
              toNodeId: newToNodeId,
              toSocketId: edgeData.toSocketId
            });
          }
        }
      }
    });
    
    this.container.dispatchEvent(new CustomEvent('nodes:paste', {
      detail: { pastedNodes: newNodes.map(n => n.id), nodeIdMap: Object.fromEntries(nodeIdMap) }
    }));
    
    console.log(`Pasted ${newNodes.length} nodes and ${this.clipboard.edges.length} edges`);
  }
  
  
  destroy() {
    this.clear();
    this.surface.remove();
  }
}
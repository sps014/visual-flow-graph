import { Node } from './Node.js';
import { Edge } from './Edge.js';
import { Viewport } from './Viewport.js';
import { FlowGraphAnimations } from './FlowGraphAnimations.js';
import { FlowGraphExecution } from './FlowGraphExecution.js';
import { FlowGraphSelection } from './FlowGraphSelection.js';
import { FlowGraphConnections } from './FlowGraphConnections.js';
import { FlowGraphDrag } from './FlowGraphDrag.js';

export class FlowGraph extends EventTarget {
  constructor(container) {
    super();
    
    this.container = container;
    this.nodes = new Map();
    this.edges = new Map();
    this.templates = new Map();
    
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
    
    // Initialize modular components
    this.animations = new FlowGraphAnimations(this);
    this.execution = new FlowGraphExecution(this);
    this.selection = new FlowGraphSelection(this);
    this.connections = new FlowGraphConnections(this);
    this.drag = new FlowGraphDrag(this);
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Delegate to modular components
    this.connections.setupEventListeners();
    
    // Clear selection when clicking on empty space
    this.surface.addEventListener('click', (e) => {
      // Only clear if clicking directly on surface (not on nodes)
      if (e.target === this.surface) {
        this.selection.clearSelection();
      }
    });
    
    // Prevent context menu on right click
    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  // ===== DELEGATION METHODS =====
  
  // Connection methods
  canConnect(fromSocket, toSocket) {
    return this.connections.canConnect(fromSocket, toSocket);
  }
  
  getSocketPosition(socket) {
    return this.connections.getSocketPosition(socket);
  }
  
  createCubicPath(from, to, fromSocket, toSocket) {
    return this.connections.createCubicPath(from, to, fromSocket, toSocket);
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
  
  /**
   * Get edge by ID
   */
  getEdge(edgeId) {
    return this.edges.get(edgeId);
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
  
  
  // Execution methods
  async execute() {
    return this.execution.execute();
  }
  
  async executeSelectedNodes() {
    return this.execution.executeSelectedNodes();
  }
  
  activateOutputSocket(nodeId, outputIndex) {
    return this.execution.activateOutputSocket(nodeId, outputIndex);
  }
  
  shouldNodeExecute(nodeId) {
    return this.execution.shouldNodeExecute(nodeId);
  }
  
  clearBranchTracking() {
    return this.execution.clearBranchTracking();
  }
  
  nodeHasInputValues(node) {
    return this.execution.nodeHasInputValues(node);
  }
  
  // Animation methods
  setAnimationConfig(config) {
    return this.animations.setAnimationConfig(config);
  }
  
  highlightExecutingNode(node, isExecuting) {
    return this.animations.highlightExecutingNode(node, isExecuting);
  }
  
  clearAllNodeHighlighting() {
    return this.animations.clearAllNodeHighlighting();
  }
  
  addToExecutionTrail(edge) {
    return this.animations.addToExecutionTrail(edge);
  }
  
  clearExecutionTrail() {
    return this.animations.clearExecutionTrail();
  }
  
  resetAllEdgeColors() {
    return this.animations.resetAllEdgeColors();
  }

  animateOutputEdges(node, outputSocketNames, activeAnimations) {
    return this.animations.animateOutputEdges(node, outputSocketNames, activeAnimations);
  }
  
  setTrailDuration(duration) {
    return this.animations.setTrailDuration(duration);
  }
  
  getTrailDuration() {
    return this.animations.getTrailDuration();
  }
  
  // Selection methods
  selectNode(nodeId, addToSelection = false) {
    return this.selection.selectNode(nodeId, addToSelection);
  }
  
  deselectNode(nodeId) {
    return this.selection.deselectNode(nodeId);
  }
  
  clearSelection() {
    return this.selection.clearSelection();
  }
  
  getSelection() {
    return this.selection.getSelection();
  }
  
  selectAllNodes() {
    return this.selection.selectAllNodes();
  }
  
  deleteSelectedNodes() {
    return this.selection.deleteSelectedNodes();
  }
  
  copySelectedNodes() {
    return this.selection.copySelectedNodes();
  }
  
  pasteNodes() {
    return this.selection.pasteNodes();
  }
  
  // Drag methods
  startMultiDrag(e, draggedNode) {
    return this.drag.startMultiDrag(e, draggedNode);
  }
  
  updateMultiDrag(e) {
    return this.drag.updateMultiDrag(e);
  }
  
  endMultiDrag() {
    return this.drag.endMultiDrag();
  }
  
  
  destroy() {
    this.clear();
    this.surface.remove();
  }
}
import { LitElement, html, css } from 'lit';
import { FlowGraph } from '../core/FlowGraph.js';
import './flow-context-menu.js';

export class FlowGraphElement extends LitElement {
  static properties = {
    theme: { type: String },
    snapToGrid: { type: Boolean, attribute: 'snap-to-grid' },
    gridSize: { type: Number, attribute: 'grid-size' },
    zoomMin: { type: Number, attribute: 'zoom-min' },
    zoomMax: { type: Number, attribute: 'zoom-max' },
    defaultZoom: { type: Number, attribute: 'default-zoom' }
  };
  
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: 
        /* Main grid lines */
        linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px),
        /* Minor grid lines */
        linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
      background-size: 
        50px 50px,  /* Main grid */
        50px 50px,  /* Main grid */
        10px 10px,  /* Minor grid */
        10px 10px;  /* Minor grid */
      background-position: 
        0 0,        /* Main grid */
        0 0,        /* Main grid */
        0 0,        /* Minor grid */
        0 0;        /* Minor grid */
      transform-origin: 0px 0px;
    }
    
    :host([theme="dark"]) {
      --fg-bg: #111827;
      --fg-panel: #0b1220;
      --fg-node: #0f1724;
      --fg-accent: #7c3aed;
      --fg-muted: #94a3b8;
      --fg-edge: rgba(124,58,237,0.95);
      --fg-success: #10b981;
      --fg-warning: #f59e0b;
      --fg-error: #ef4444;
    }
    
    :host([theme="light"]) {
      --fg-bg: #f8fafc;
      --fg-panel: #ffffff;
      --fg-node: #ffffff;
      --fg-accent: #7c3aed;
      --fg-muted: #64748b;
      --fg-edge: rgba(124,58,237,0.95);
      --fg-success: #10b981;
      --fg-warning: #f59e0b;
      --fg-error: #ef4444;
    }
  `;
  
  constructor() {
    super();
    this.theme = 'dark';
    this.snapToGrid = false;
    this.gridSize = 20;
    this.zoomMin = 0.1;
    this.zoomMax = 3;
    this.defaultZoom = 1;
    this.flowGraph = null;
  }
  
  firstUpdated() {
    this.flowGraph = new FlowGraph(this);
    this.processChildren();
    
    // Forward events
    this.flowGraph.addEventListener('node:create', (e) => {
      this.dispatchEvent(new CustomEvent('node:create', { detail: e.detail }));
    });
    
    this.flowGraph.addEventListener('edge:create', (e) => {
      this.dispatchEvent(new CustomEvent('edge:create', { detail: e.detail }));
    });
    
    // Add right-click handler for context menu
    this.addEventListener('contextmenu', this.handleViewportRightClick.bind(this));
    
    // Add surface event listener after flowGraph is initialized
    setTimeout(() => {
      if (this.flowGraph && this.flowGraph.viewport && this.flowGraph.viewport.surface) {
        this.flowGraph.viewport.surface.addEventListener('contextmenu', this.handleViewportRightClick.bind(this));
      }
    }, 100);
  }
  
  processChildren() {
    // Process definitions first
    const definitions = this.querySelector('flow-definitions');
    if (definitions) {
      this.processDefinitions(definitions);
    }
    
    // Then process nodes
    const nodes = this.querySelector('flow-nodes');
    if (nodes) {
      this.processNodes(nodes);
    }
    
    // Finally process edges
    const edges = this.querySelector('flow-edges');
    if (edges) {
      setTimeout(() => this.processEdges(edges), 10); // Allow nodes to be created first
    }
  }
  
  processDefinitions(definitions) {
    const nodeDefs = definitions.querySelectorAll('flow-node-def');
    nodeDefs.forEach(def => {
      const name = def.getAttribute('name');
      const label = def.getAttribute('label') || name;
      const width = parseInt(def.getAttribute('width')) || 160;
      const height = parseInt(def.getAttribute('height')) || 100;
      const category = def.getAttribute('category') || 'General';
      const description = def.getAttribute('description') || '';
      const icon = def.getAttribute('icon') || '';
      
      // Parse color patch attributes
      const colorPatch = {};
      const colorBg = def.getAttribute('color-bg');
      const colorText = def.getAttribute('color-text');
      
      if (colorBg) {
        colorPatch.background = colorBg;
      }
      if (colorText) {
        colorPatch.color = colorText;
      }
      
      const nodeBody = def.querySelector('node-body');
      const inputs = def.querySelectorAll('flow-input');
      const outputs = def.querySelectorAll('flow-output');
      
      const template = {
        name,
        label,
        width,
        height,
        category,
        description,
        icon,
        colorPatch: Object.keys(colorPatch).length > 0 ? colorPatch : null,
        html: nodeBody ? nodeBody.innerHTML : null,
        inputs: Array.from(inputs).map(input => ({
          id: input.getAttribute('socket')?.split(':')[1] || input.getAttribute('socket'),
          label: input.getAttribute('label'),
          type: input.getAttribute('type') || 'any'
        })),
        outputs: Array.from(outputs).map(output => ({
          id: output.getAttribute('socket')?.split(':')[1] || output.getAttribute('socket'),
          label: output.getAttribute('label'),
          type: output.getAttribute('type') || 'any'
        }))
      };
      
      this.flowGraph.addNodeTemplate(name, template);
    });
  }
  
  processNodes(nodes) {
    const nodeElements = nodes.querySelectorAll('flow-node');
    nodeElements.forEach(nodeEl => {
      const type = nodeEl.getAttribute('type');
      const id = nodeEl.getAttribute('id');
      const x = parseFloat(nodeEl.getAttribute('x')) || 0;
      const y = parseFloat(nodeEl.getAttribute('y')) || 0;
      const selected = nodeEl.hasAttribute('selected');
      
      if (!this.flowGraph.nodes.has(id)) {
        this.flowGraph.addNode(type, { id, x, y, selected });
      }
    });
  }
  
  processEdges(edges) {
    // Clear existing edges first
    this.flowGraph.edges.forEach(edge => {
      this.flowGraph.removeEdge(edge.id);
    });
    
    const edgeElements = edges.querySelectorAll('flow-edge');
    edgeElements.forEach(edgeEl => {
      const from = edgeEl.getAttribute('from'); // "nodeId:socketId"
      const to = edgeEl.getAttribute('to');     // "nodeId:socketId"
      
      if (from && to) {
        const [fromNodeId, fromSocketId] = from.split(':');
        const [toNodeId, toSocketId] = to.split(':');
        
        const fromNode = this.flowGraph.nodes.get(fromNodeId);
        const toNode = this.flowGraph.nodes.get(toNodeId);
        
        if (fromNode && toNode) {
          const fromSocket = fromNode.getSocket(fromSocketId);
          const toSocket = toNode.getSocket(toSocketId);
          
          if (fromSocket && toSocket) {
            this.flowGraph.createEdge(fromSocket, toSocket);
          }
        }
      }
    });
  }
  
  // Public API methods
  addNode(type, config) {
    return this.flowGraph.addNode(type, config);
  }
  
  removeNode(nodeId) {
    return this.flowGraph.removeNode(nodeId);
  }
  
  addEdge(from, to, config) {
    const [fromNodeId, fromSocketId] = from.split(':');
    const [toNodeId, toSocketId] = to.split(':');
    
    const fromNode = this.flowGraph.nodes.get(fromNodeId);
    const toNode = this.flowGraph.nodes.get(toNodeId);
    
    if (fromNode && toNode) {
      const fromSocket = fromNode.getSocket(fromSocketId);
      const toSocket = toNode.getSocket(toSocketId);
      
      if (fromSocket && toSocket) {
        return this.flowGraph.createEdge(fromSocket, toSocket);
      }
    }
    
    return null;
  }
  
  removeEdge(edgeId) {
    return this.flowGraph.removeEdge(edgeId);
  }
  
  clear() {
    return this.flowGraph.clear();
  }
  
  serialize() {
    return this.flowGraph.serialize();
  }
  
  deserialize(data) {
    return this.flowGraph.deserialize(data);
  }
  
  handleViewportRightClick(e) {
    // Only show context menu if clicking on empty space (not on nodes)
    // Check if the target is a node or inside a node, but allow clicks on the nodes-root container
    if (e.target.classList.contains('node') || e.target.closest('.node')) {
      return;
    }
    
    // Also check if clicking on sockets
    if (e.target.classList.contains('socket')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Get all available node definitions
    const nodeDefinitions = Array.from(this.flowGraph.templates.values()).map(template => ({
      name: template.name,
      label: template.label,
      category: template.category || 'General',
      description: template.description,
      icon: template.icon,
      inputs: template.inputs,
      outputs: template.outputs
    }));
    
    // Show context menu
    const contextMenu = this.shadowRoot.getElementById('context-menu');
    if (contextMenu) {
      contextMenu.show(e.clientX, e.clientY, nodeDefinitions, this.addNodeFromContextMenu.bind(this));
    }
  }
  
  addNodeFromContextMenu(nodeDef) {
    // Get the context menu element to get its position
    const contextMenu = this.shadowRoot.getElementById('context-menu');
    if (!contextMenu) return;
    
    // Convert screen coordinates to world coordinates, accounting for pan and zoom
    const rect = this.getBoundingClientRect();
    const viewport = this.flowGraph.viewport;
    
    // Convert screen coordinates to world coordinates
    // First, convert to local viewport coordinates, then apply inverse transform
    const localX = contextMenu.x - rect.left;
    const localY = contextMenu.y - rect.top;
    
    // Apply inverse viewport transform: (local - pan) / scale
    const worldX = (localX - viewport.x) / viewport.scale;
    const worldY = (localY - viewport.y) / viewport.scale;
    
    // Add the node
    this.addNode(nodeDef.name, { x: worldX, y: worldY });
  }
  
  render() {
    return html`
      <slot></slot>
      <flow-context-menu id="context-menu"></flow-context-menu>
    `;
  }
}

customElements.define('flow-graph', FlowGraphElement);

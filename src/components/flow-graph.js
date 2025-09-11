import { LitElement, html, css } from 'lit';
import { FlowGraph } from '../core/FlowGraph.js';
import './flow-context-menu.js';

/**
 * Main FlowGraph web component.
 * 
 * This is the primary web component that provides the visual scripting interface.
 * It wraps the core FlowGraph functionality in a Lit-based custom element,
 * making it easy to use in HTML and providing a declarative API.
 * 
 * @class FlowGraphElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-graph 
 *   theme="dark" 
 *   snap-to-grid 
 *   grid-size="20"
 *   zoom-min="0.1"
 *   zoom-max="3">
 * </flow-graph>
 * ```
 * 
 * @example
 * ```javascript
 * const flowGraphElement = document.querySelector('flow-graph');
 * const flowGraph = flowGraphElement.flowGraph;
 * 
 * // Add a node template
 * flowGraph.addNodeTemplate('math-add', {
 *   inputs: [{ id: 'a', type: 'number', label: 'A' }],
 *   outputs: [{ id: 'result', type: 'number', label: 'Result' }],
 *   html: '<div>Add: <input data-key="a" type="number"></div>'
 * });
 * ```
 */
export class FlowGraphElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} Visual theme for the flow graph */
    theme: { type: String },
    
    /** @type {Boolean} Whether to snap nodes to a grid */
    snapToGrid: { type: Boolean, attribute: 'snap-to-grid' },
    
    /** @type {Number} Size of the grid for snapping */
    gridSize: { type: Number, attribute: 'grid-size' },
    
    /** @type {Number} Minimum zoom level */
    zoomMin: { type: Number, attribute: 'zoom-min' },
    
    /** @type {Number} Maximum zoom level */
    zoomMax: { type: Number, attribute: 'zoom-max' },
    
    /** @type {Number} Default zoom level */
    defaultZoom: { type: Number, attribute: 'default-zoom' },
    
    /** @type {Boolean} Whether the flow graph is in readonly mode */
    readonly: { type: Boolean }
  };
  
  /**
   * CSS styles for the component.
   * @static
   * @type {CSSResult}
   */
  static styles = css`
    :host {
      background-color: #f8f9fa;
      background-image: 
        /* Main grid lines */
        linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px),
        /* Minor grid lines */
        linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px);
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
    }
  `;
  
  /**
   * Creates a new FlowGraphElement instance.
   * Initializes default property values and sets up the component.
   */
  constructor() {
    super();
    
    /** @type {string} Visual theme for the flow graph */
    this.theme = 'dark';
    
    /** @type {boolean} Whether to snap nodes to a grid */
    this.snapToGrid = false;
    
    /** @type {number} Size of the grid for snapping */
    this.gridSize = 20;
    
    /** @type {number} Minimum zoom level */
    this.zoomMin = 0.1;
    
    /** @type {number} Maximum zoom level */
    this.zoomMax = 3;
    
    /** @type {number} Default zoom level */
    this.defaultZoom = 1;
    
    /** @type {boolean} Whether the flow graph is in readonly mode */
    this.readonly = false;
    
    /** @type {FlowGraph|null} The core FlowGraph instance */
    this.flowGraph = null;
  }
  
  /**
   * Called after the component's DOM has been updated for the first time.
   * Initializes the FlowGraph instance and sets up event forwarding.
   * 
   * @override
   */
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
      
      // Set initial readonly state AFTER nodes are processed and rendered
      if (this.readonly) {
        this.flowGraph.setReadonly(true);
      }
    }, 200); // Increased timeout to ensure nodes are fully rendered
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
      const onExecute = def.getAttribute('onExecute');
      
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
      const flowSockets = def.querySelectorAll('flow-socket');
      
      // Process flow-socket components
      const inputSockets = [];
      const outputSockets = [];
      
      Array.from(flowSockets).forEach(socket => {
        const socketId = socket.getAttribute('name');
        const socketType = socket.getAttribute('type');
        const socketLabel = socket.getAttribute('label');
        const socketDataType = socket.getAttribute('data-type') || 'any';
        
        if (socketType === 'input') {
          inputSockets.push({
            id: socketId,
            label: socketLabel,
            type: socketDataType
          });
        } else if (socketType === 'output') {
          outputSockets.push({
            id: socketId,
            label: socketLabel,
            type: socketDataType
          });
        }
      });
      
      const template = {
        name,
        label,
        width,
        height,
        category,
        description,
        icon,
        onExecute,
        colorPatch: Object.keys(colorPatch).length > 0 ? colorPatch : null,
        html: nodeBody ? nodeBody.innerHTML : null,
        inputs: inputSockets,
        outputs: outputSockets
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
    // Don't show context menu in readonly mode
    if (this.readonly) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Check if clicking on a node
    if (e.target.classList.contains('node') || e.target.closest('.node')) {
      this.handleNodeRightClick(e);
      return;
    }
    
    // Check if clicking on sockets
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
  
  handleNodeRightClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't show context menu in readonly mode
    if (this.readonly) {
      return;
    }
    
    // Find the node element
    const nodeElement = e.target.classList.contains('node') ? e.target : e.target.closest('.node');
    if (!nodeElement) return;
    
    // Get the node ID
    const nodeId = nodeElement.getAttribute('data-id');
    if (!nodeId) return;
    
    // Create node context menu items
    const nodeContextItems = [
      {
        label: 'Delete Node',
        icon: '🗑️',
        action: () => this.deleteNode(nodeId)
      }
    ];
    
    // Show node context menu
    this.showNodeContextMenu(e.clientX, e.clientY, nodeContextItems);
  }
  
  showNodeContextMenu(x, y, items) {
    // Create a simple context menu for nodes
    const existingMenu = document.querySelector('.node-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'node-context-menu';
    menu.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      background: var(--fg-panel, #0b1220);
      border: 1px solid var(--fg-muted, #94a3b8);
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      min-width: 150px;
      font-family: inherit;
      user-select: none;
      overflow-x: hidden;
    `;
    
    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'context-menu-item';
      itemEl.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--fg-text, #ffffff);
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
      `;
      
      itemEl.innerHTML = `
        <span>${item.icon}</span>
        <span>${item.label}</span>
      `;
      
      itemEl.addEventListener('click', () => {
        item.action();
        menu.remove();
      });
      
      itemEl.addEventListener('mouseenter', () => {
        itemEl.style.background = 'var(--fg-accent, #7c3aed)';
        itemEl.style.color = 'white';
      });
      
      itemEl.addEventListener('mouseleave', () => {
        itemEl.style.background = 'transparent';
        itemEl.style.color = 'var(--fg-text, #ffffff)';
      });
      
      menu.appendChild(itemEl);
    });
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }
  
  deleteNode(nodeId) {
    // Remove the node
    this.removeNode(nodeId);
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('node:remove', { 
      detail: { nodeId } 
    }));
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
  
  setTrailDuration(duration) {
    if (this.flowGraph) {
      this.flowGraph.setTrailDuration(duration);
    }
  }
  
  // Property change handler
  updated(changedProperties) {
    super.updated(changedProperties);
    
    if (changedProperties.has('readonly') && this.flowGraph) {
      // Use a small delay to ensure the flowGraph is fully initialized
      setTimeout(() => {
        if (this.flowGraph) {
          this.flowGraph.setReadonly(this.readonly);
        }
      }, 50);
    }
  }
  
  // Readonly control methods
  setReadonly(readonly) {
    this.readonly = readonly;
    if (this.flowGraph) {
      // Use a small delay to ensure the flowGraph is fully initialized
      setTimeout(() => {
        if (this.flowGraph) {
          this.flowGraph.setReadonly(readonly);
        }
      }, 50);
    }
  }
  
  isReadonly() {
    return this.readonly;
  }
  
  toggleReadonly() {
    this.setReadonly(!this.readonly);
    return this.readonly;
  }
  
  render() {
    return html`
      <slot></slot>
      <flow-context-menu id="context-menu"></flow-context-menu>
    `;
  }
}

customElements.define('flow-graph', FlowGraphElement);

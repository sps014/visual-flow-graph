import { Node } from "./Node.js";
import { Edge } from "./Edge.js";
import { Viewport } from "./Viewport.js";
import { FlowGraphAnimations } from "./FlowGraphAnimations.js";
import { FlowGraphExecution } from "./FlowGraphExecution.js";
import { FlowGraphSelection } from "./FlowGraphSelection.js";
import { FlowGraphConnections } from "./FlowGraphConnections.js";
import { FlowGraphDrag } from "./FlowGraphDrag.js";

/**
 * Main FlowGraph class that manages the visual scripting interface.
 *
 * The FlowGraph is the central orchestrator that manages nodes, edges, viewport,
 * and all user interactions. It provides a comprehensive API for creating,
 * manipulating, and executing visual scripts.
 *
 * @class FlowGraph
 * @extends EventTarget
 *
 * @example
 * ```javascript
 * const container = document.getElementById('flow-container');
 * const flowGraph = new FlowGraph(container);
 *
 * // Add a node template
 * flowGraph.addNodeTemplate('math-add', {
 *   inputs: [{ id: 'a', type: 'number', label: 'A' }],
 *   outputs: [{ id: 'result', type: 'number', label: 'Result' }],
 *   html: '<div>Add: <input data-key="a" type="number"></div>'
 * });
 *
 * // Create a node
 * const node = flowGraph.addNode('math-add', { x: 100, y: 100 });
 * ```
 */
export class FlowGraph extends EventTarget {
  /**
   * Creates a new FlowGraph instance.
   *
   * @param {HTMLElement} container - The DOM element that will contain the flow graph interface
   *
   * @example
   * ```javascript
   * const container = document.getElementById('my-flow-graph');
   * const flowGraph = new FlowGraph(container);
   * ```
   */
  constructor(container) {
    super();

    /** @type {HTMLElement} The container element for the flow graph */
    this.container = container;

    /** @type {Map<string, Node>} Map of node IDs to Node instances */
    this.nodes = new Map();

    /** @type {Map<string, Edge>} Map of edge IDs to Edge instances */
    this.edges = new Map();

    /** @type {Map<string, Object>} Map of node type names to node templates */
    this.templates = new Map();

    /** @type {boolean} Whether the flow graph is in readonly mode */
    this.readonly = false;

    // Create surface elements
    /** @type {HTMLDivElement} The main surface element containing all flow graph content */
    this.surface = document.createElement("div");
    this.surface.className = "surface";
    this.surface.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
      transform-origin: 0px 0px;
    `;

    /** @type {SVGSVGElement} SVG element for rendering edges and connections */
    this.edgeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    this.edgeSvg.id = "edge-svg";
    this.edgeSvg.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      width: 100%;
      height: 100%;
      overflow: visible;
      z-index: 1;
    `;

    /** @type {HTMLDivElement} Container element for all node elements */
    this.nodesRoot = document.createElement("div");
    this.nodesRoot.id = "nodes-root";
    this.nodesRoot.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 2;
    `;

    // Temp path for drawing connections
    /** @type {SVGPathElement} Temporary path element for drawing new connections */
    this.tempPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.tempPath.setAttribute("stroke", "#10b981"); // Green color for better visibility
    this.tempPath.setAttribute("stroke-width", "2.5"); // Reduced stroke width
    this.tempPath.setAttribute("fill", "none");
    this.tempPath.setAttribute("stroke-linecap", "round");
    this.tempPath.style.pointerEvents = "none";
    this.tempPath.style.display = "none";
    this.edgeSvg.appendChild(this.tempPath);

    // Create content container that holds both nodes and edges (like original lib.js)
    /** @type {HTMLDivElement} Container that holds both nodes and edges for viewport transformations */
    this.contentContainer = document.createElement("div");
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
    /** @type {Viewport} Manages pan, zoom, and viewport transformations */
    this.viewport = new Viewport(this.surface, this.contentContainer, this);

    // Initialize modular components
    /** @type {FlowGraphAnimations} Handles node and edge animations */
    this.animations = new FlowGraphAnimations(this);

    /** @type {FlowGraphExecution} Manages node execution and data flow */
    this.execution = new FlowGraphExecution(this);

    /** @type {FlowGraphSelection} Handles node and edge selection */
    this.selection = new FlowGraphSelection(this);

    /** @type {FlowGraphConnections} Manages socket connections and edge creation */
    this.connections = new FlowGraphConnections(this);

    /** @type {FlowGraphDrag} Handles dragging operations for nodes and edges */
    this.drag = new FlowGraphDrag(this);

    /** @type {ResizeObserver|null} Graph-level resize observer for all nodes */
    this.resizeObserver = null;

    /** @type {Map<HTMLElement, Node>} Reverse lookup map from DOM element to Node instance */
    this.elementToNodeMap = new Map();

    this.init();
  }

  /**
   * Initialize the FlowGraph after construction.
   * Sets up event listeners and prepares the interface for interaction.
   *
   * @private
   */
  init() {
    this.setupEventListeners();
    this.setupResizeObserver();
  }

  /**
   * Set up all event listeners for the FlowGraph interface.
   * Delegates to modular components and handles global interactions.
   *
   * @private
   */
  setupEventListeners() {
    // Delegate to modular components
    this.connections.setupEventListeners();

    // Clear selection when clicking on empty space
    this.surface.addEventListener("click", (e) => {
      // Clear if clicking on surface or any non-node element
      if (e.target === this.surface || !e.target.closest(".node")) {
        this.selection.clearSelection();
        // Also cancel any active connection
        this.connections.cancelConnection();
      }
    });

    // Prevent context menu on right click
    this.container.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  /**
   * Set up a graph-level ResizeObserver to monitor all nodes for size changes.
   * This is more efficient than having individual ResizeObservers on each node.
   * 
   * @private
   */
  setupResizeObserver() {
    if (!window.ResizeObserver) return;
    
    this.resizeObserver = new ResizeObserver((entries) => {
      // Process all resize entries in a single batch
      const nodesToUpdate = new Set();
      
      
      for (const entry of entries) {
        // The entry.target should be a node element directly
        const node = this.elementToNodeMap.get(entry.target);
        
        if (node) {
          nodesToUpdate.add(node);
        } else {
          console.warn('No node found for resized element:', entry.target);
        }
      }
      
      // Update edges for all affected nodes
      for (const node of nodesToUpdate) {
        this.updateEdgesForNode(node);
      }
    });
    
    // We'll observe individual nodes as they're added
    // The observer is ready but not observing anything yet
  }

  /**
   * Find a node by its DOM element.
   * 
   * @param {HTMLElement} element - The DOM element to search for
   * @returns {Node|null} The node that owns this element, or null if not found
   * @private
   */
  findNodeByElement(element) {
    // Check if the element is a node element or is contained within one
    const nodeElement = element.closest('.node');
    if (!nodeElement) return null;
    
    // Use reverse lookup map for O(1) performance
    return this.elementToNodeMap.get(nodeElement) || null;
  }

  // ===== DELEGATION METHODS =====

  // Connection methods
  /**
   * Check if two sockets can be connected.
   *
   * @param {Socket} fromSocket - The source socket
   * @param {Socket} toSocket - The target socket
   * @returns {boolean} True if the sockets can be connected
   */
  canConnect(fromSocket, toSocket) {
    return this.connections.canConnect(fromSocket, toSocket);
  }

  /**
   * Get the screen position of a socket.
   *
   * @param {Socket} socket - The socket to get position for
   * @returns {Object} Object with x and y coordinates
   */
  getSocketPosition(socket) {
    return this.connections.getSocketPosition(socket);
  }

  /**
   * Create a cubic bezier path between two points.
   *
   * @param {Object} from - Starting position {x, y}
   * @param {Object} to - Ending position {x, y}
   * @param {Socket} fromSocket - Source socket
   * @param {Socket} toSocket - Target socket
   * @returns {string} SVG path string
   */
  createCubicPath(from, to, fromSocket, toSocket) {
    return this.connections.createCubicPath(from, to, fromSocket, toSocket);
  }

  /**
   * Add a node template that defines how nodes of a specific type should be created.
   *
   * @param {string} name - The type name for the node template
   * @param {Object} template - Template configuration object
   * @param {Array} template.inputs - Array of input socket configurations
   * @param {Array} template.outputs - Array of output socket configurations
   * @param {string} template.html - HTML template for the node's visual representation
   * @param {string} [template.category] - Optional category for styling
   * @param {Object} [template.colorPatch] - Optional color theming
   * @param {string} [template.onExecute] - Optional function name to call on execution
   *
   * @example
   * ```javascript
   * flowGraph.addNodeTemplate('math-add', {
   *   inputs: [
   *     { id: 'a', type: 'number', label: 'A' },
   *     { id: 'b', type: 'number', label: 'B' }
   *   ],
   *   outputs: [
   *     { id: 'result', type: 'number', label: 'Result' }
   *   ],
   *   html: '<div>Add: <input data-key="a" type="number"> + <input data-key="b" type="number"></div>',
   *   category: 'math',
   *   onExecute: 'executeMathAdd',
   *   customClass: 'my-custom-node' // Optional: custom CSS class for styling
   * });
   * ```
   */
  addNodeTemplate(name, template) {
    this.templates.set(name, template);
  }

  /**
   * Create a new node instance and add it to the flow graph.
   *
   * @param {string} type - The node type (must have a registered template)
   * @param {Object} [config={}] - Configuration object for the node
   * @param {string} [config.id] - Custom ID for the node (auto-generated if not provided)
   * @param {number} [config.x=0] - X position of the node
   * @param {number} [config.y=0] - Y position of the node
   * @param {number} [config.width=160] - Width of the node
   * @param {number} [config.height=100] - Height of the node
   * @param {string} [config.label] - Display label for the node
   * @param {boolean} [config.selected=false] - Whether the node is initially selected
   * @param {Object} [config.data] - Initial data values for data-bound elements
   * @returns {Node} The created node instance
   * @throws {Error} If the node type is not recognized
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * const node = flowGraph.addNode('math-add', {
   *   x: 100,
   *   y: 100,
   *   data: { a: 5, b: 10 }
   * });
   * ```
   */
  addNode(type, config = {}) {
    if (this.readonly) {
      throw new Error("Cannot add nodes in readonly mode");
    }

    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Unknown node type: ${type}`);
    }

    const node = new Node(this, {
      ...config,
      type,
      template,
      initialData: config.data || {}, // Pass initial data
    });
    this.nodes.set(node.id, node);
    
    // Register in reverse lookup map for efficient element-to-node lookup
    if (node.element) {
      this.elementToNodeMap.set(node.element, node);
      
      // Start observing this node for resize changes
      if (this.resizeObserver) {
        this.resizeObserver.observe(node.element);
      }
    } else {
      console.warn('Node element not ready when adding node:', node.id);
    }

    // If in readonly mode, disable form controls for the new node
    if (this.readonly) {
      node.disableFormControls();
    }

    this.container.dispatchEvent(
      new CustomEvent("node:create", {
        detail: { node },
      })
    );

    return node;
  }

  /**
   * Remove a node from the flow graph.
   * Also removes all edges connected to the node.
   *
   * @param {string} nodeId - The ID of the node to remove
   * @returns {boolean} True if the node was found and removed, false otherwise
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.removeNode('node_123');
   * ```
   */
  removeNode(nodeId) {
    if (this.readonly) {
      throw new Error("Cannot remove nodes in readonly mode");
    }

    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Remove all connected edges
    const edgesToRemove = [];
    for (const edge of this.edges.values()) {
      if (edge.fromSocket.node === node || edge.toSocket.node === node) {
        edgesToRemove.push(edge.id);
      }
    }
    edgesToRemove.forEach((edgeId) => this.removeEdge(edgeId));

    // Remove from reverse lookup map and stop observing
    if (node.element) {
      this.elementToNodeMap.delete(node.element);
      
      // Stop observing this node
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(node.element);
      }
    }
    
    // Remove node
    node.destroy();
    this.nodes.delete(nodeId);

    this.container.dispatchEvent(
      new CustomEvent("node:remove", {
        detail: { nodeId },
      })
    );
  }

  /**
   * Create a new edge connecting two sockets.
   *
   * @param {Socket} fromSocket - The source socket
   * @param {Socket} toSocket - The target socket
   * @returns {Edge|null} The created edge instance, or null if connection is not allowed
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * const edge = flowGraph.createEdge(node1.getSocket('output'), node2.getSocket('input'));
   * if (edge) {
   *   console.log('Edge created successfully');
   * }
   * ```
   */
  createEdge(fromSocket, toSocket) {
    if (this.readonly) {
      throw new Error("Cannot create edges in readonly mode");
    }

    if (!this.canConnect(fromSocket, toSocket)) return null;

    const edge = new Edge(this, fromSocket, toSocket);
    this.edges.set(edge.id, edge);

    this.container.dispatchEvent(
      new CustomEvent("edge:create", {
        detail: { edge },
      })
    );

    return edge;
  }

  /**
   * Get an edge by its ID.
   *
   * @param {string} edgeId - The ID of the edge to retrieve
   * @returns {Edge|undefined} The edge instance, or undefined if not found
   */
  getEdge(edgeId) {
    return this.edges.get(edgeId);
  }

  /**
   * Remove an edge from the flow graph.
   *
   * @param {string} edgeId - The ID of the edge to remove
   * @returns {boolean} True if the edge was found and removed, false otherwise
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.removeEdge('edge_123');
   * ```
   */
  removeEdge(edgeId) {
    if (this.readonly) {
      throw new Error("Cannot remove edges in readonly mode");
    }

    const edge = this.edges.get(edgeId);
    if (!edge) return;

    edge.destroy();
    this.edges.delete(edgeId);

    this.container.dispatchEvent(
      new CustomEvent("edge:remove", {
        detail: { edgeId },
      })
    );
  }

  /**
   * Update the visual path of all edges connected to a specific node.
   * Called when a node is moved or resized.
   *
   * @param {Node} node - The node whose connected edges should be updated
   * @private
   */
  updateEdgesForNode(node) {
    for (const edge of this.edges.values()) {
      if (edge.fromSocket.node === node || edge.toSocket.node === node) {
        edge.updatePath();
      }
    }
  }

  /**
   * Update the visual path of all edges in the graph.
   * Useful for refreshing edge positions after initial load.
   *
   * @public
   */
  updateAllEdges() {
    for (const edge of this.edges.values()) {
      edge.updatePath();
    }
  }

  /**
   * Clear all nodes and edges from the flow graph.
   * This removes all visual elements and resets the graph to an empty state.
   *
   * @throws {Error} If the flow graph is in readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.clear(); // Remove all nodes and edges
   * ```
   */
  clear() {
    if (this.readonly) {
      throw new Error("Cannot clear graph in readonly mode");
    }

    // Remove all edges
    for (const edgeId of this.edges.keys()) {
      this.removeEdge(edgeId);
    }

    // Remove all nodes
    for (const nodeId of this.nodes.keys()) {
      this.removeNode(nodeId);
    }
    
    // Clear reverse lookup map
    this.elementToNodeMap.clear();
  }

  /**
   * Serialize the current state of the flow graph to a JSON object.
   * This includes all nodes, edges, viewport state, and readonly mode for saving/loading.
   *
   * @returns {Object} Serialized flow graph data
   * @returns {Array} returns.nodes - Array of serialized node data
   * @returns {Array} returns.edges - Array of serialized edge data
   * @returns {Object} returns.viewport - Serialized viewport state
   * @returns {boolean} returns.readonly - Current readonly state
   *
   * @example
   * ```javascript
   * const data = flowGraph.serialize();
   * localStorage.setItem('myFlowGraph', JSON.stringify(data));
   * ```
   */
  serialize() {
    const nodes = Array.from(this.nodes.values()).map((node) =>
      node.serialize()
    );
    const edges = Array.from(this.edges.values()).map((edge) =>
      edge.serialize()
    );

    return {
      nodes,
      edges,
      viewport: this.viewport.serialize(),
      readonly: this.readonly,
    };
  }

  /**
   * Deserialize flow graph data and restore the graph state.
   * This recreates all nodes, edges, viewport, and readonly mode from saved data.
   *
   * @param {Object} data - Serialized flow graph data
   * @param {Array} data.nodes - Array of node data to restore
   * @param {Array} data.edges - Array of edge data to restore
   * @param {Object} [data.viewport] - Viewport state to restore
   * @param {boolean} [data.readonly] - Readonly state to restore
   *
   * @example
   * ```javascript
   * const data = JSON.parse(localStorage.getItem('myFlowGraph'));
   * flowGraph.deserialize(data);
   * ```
   */
  deserialize(data) {
    this.clear();

    // Restore nodes
    if (data.nodes) {
      data.nodes.forEach((nodeData) => {
        // Extract data for initial population
        const { data: nodeData_binding, ...nodeConfig } = nodeData;
        this.addNode(nodeData.type, {
          ...nodeConfig,
          data: nodeData_binding, // Pass data for DOM population
        });
      });
    }

    // Restore viewport
    if (data.viewport) {
      this.viewport.deserialize(data.viewport);
    }

    setTimeout(() => {
      // Restore edges
      if (data.edges) {
        data.edges.forEach((edgeData) => {
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
    }, 0);

    // Restore readonly state
    if (data.readonly !== undefined) {
      this.setReadonly(data.readonly);
    }
    
    // Dispatch deserialize event
    this.container.dispatchEvent(
      new CustomEvent("graph:deserialize", {
        detail: { data },
      })
    );
  }

  /**
   * Move a node and fire event
   *
   * @throws {Error} If the flow graph is in readonly mode
   */
  moveNode(nodeId, x, y) {
    if (this.readonly) {
      throw new Error("Cannot move nodes in readonly mode");
    }

    const node = this.nodes.get(nodeId);
    if (!node) return;

    const oldPosition = { x: node.x, y: node.y };
    node.setPosition(x, y);

    this.container.dispatchEvent(
      new CustomEvent("node:move", {
        detail: { nodeId, node, oldPosition, newPosition: { x, y } },
      })
    );

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
    edge.element.classList.add("selected");

    this.container.dispatchEvent(
      new CustomEvent("edge:select", {
        detail: { edgeId, edge },
      })
    );
  }

  /**
   * Deselect an edge
   */
  deselectEdge(edgeId) {
    const edge = this.edges.get(edgeId);
    if (!edge) return;

    edge.element.classList.remove("selected");

    this.container.dispatchEvent(
      new CustomEvent("edge:deselect", {
        detail: { edgeId, edge },
      })
    );
  }

  /**
   * Handle viewport changes
   */
  onViewportChange() {
    this.container.dispatchEvent(
      new CustomEvent("viewport:change", {
        detail: {
          x: this.viewport.x,
          y: this.viewport.y,
          scale: this.viewport.scale,
        },
      })
    );
  }

  /**
   * Handle viewport zoom
   */
  onViewportZoom(scale) {
    this.container.dispatchEvent(
      new CustomEvent("viewport:zoom", {
        detail: { scale, x: this.viewport.x, y: this.viewport.y },
      })
    );
  }

  /**
   * Handle viewport pan
   */
  onViewportPan(x, y) {
    this.container.dispatchEvent(
      new CustomEvent("viewport:pan", {
        detail: { x, y, scale: this.viewport.scale },
      })
    );
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
    return this.animations.animateOutputEdges(
      node,
      outputSocketNames,
      activeAnimations
    );
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

  // ===== READONLY MODE METHODS =====

  /**
   * Set the readonly mode of the flow graph.
   *
   * @param {boolean} readonly - Whether to enable readonly mode
   *
   * @example
   * ```javascript
   * flowGraph.setReadonly(true);  // Enable readonly mode
   * flowGraph.setReadonly(false); // Disable readonly mode
   * ```
   */
  setReadonly(readonly) {
    this.readonly = readonly;

    // Update visual indicators
    if (readonly) {
      this.surface.classList.add("readonly");
      // Disable form controls in all nodes
      this.nodes.forEach((node) => {
        node.disableFormControls();
      });
    } else {
      this.surface.classList.remove("readonly");
      // Enable form controls in all nodes
      this.nodes.forEach((node) => {
        node.enableFormControls();
      });
    }

    this.container.dispatchEvent(
      new CustomEvent("readonly:change", {
        detail: { readonly },
      })
    );
  }

  /**
   * Get the current readonly state of the flow graph.
   *
   * @returns {boolean} True if in readonly mode, false otherwise
   *
   * @example
   * ```javascript
   * const isReadonly = flowGraph.isReadonly();
   * console.log('Readonly mode:', isReadonly);
   * ```
   */
  isReadonly() {
    return this.readonly;
  }

  /**
   * Toggle readonly mode on/off.
   *
   * @returns {boolean} The new readonly state
   *
   * @example
   * ```javascript
   * const newState = flowGraph.toggleReadonly();
   * console.log('Readonly mode is now:', newState);
   * ```
   */
  toggleReadonly() {
    this.setReadonly(!this.readonly);
    return this.readonly;
  }

  destroy() {
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    this.clear();
    this.surface.remove();
  }
}

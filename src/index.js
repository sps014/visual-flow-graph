/**
 * @fileoverview FlowGraph Library - Main Entry Point
 * 
 * This is the main entry point for the FlowGraph visual scripting library.
 * It imports all components and core classes, making them available for use.
 * 
 * @version 1.0.0
 * @author FlowGraph Team
 * @license MIT
 */

// Import theme styles
import './styles/theme.css';

// Import all components to register them
import './components/flow-graph.js';
import './components/flow-node-def.js';
import './components/flow-node.js';
import './components/flow-socket.js';
import './components/flow-socket-anchor.js';
import './components/flow-edge.js';
import './components/flow-definitions.js';
import './components/flow-nodes.js';
import './components/flow-edges.js';
import './components/flow-background.js';
import './components/flow-context-menu.js';

/**
 * Web Components - Lit-based custom elements for the FlowGraph interface
 */

/** @type {typeof import('./components/flow-graph.js').FlowGraphElement} */
export { FlowGraphElement } from './components/flow-graph.js';

/** @type {typeof import('./components/flow-node-def.js').FlowNodeDefElement} */
export { FlowNodeDefElement } from './components/flow-node-def.js';

/** @type {typeof import('./components/flow-node.js').FlowNodeElement} */
export { FlowNodeElement } from './components/flow-node.js';

/** @type {typeof import('./components/flow-socket.js').FlowSocketElement} */
export { FlowSocketElement } from './components/flow-socket.js';

/** @type {typeof import('./components/flow-socket-anchor.js').FlowSocketAnchorElement} */
export { FlowSocketAnchorElement } from './components/flow-socket-anchor.js';

/** @type {typeof import('./components/flow-edge.js').FlowEdgeElement} */
export { FlowEdgeElement } from './components/flow-edge.js';

/** @type {typeof import('./components/flow-definitions.js').FlowDefinitionsElement} */
export { FlowDefinitionsElement } from './components/flow-definitions.js';

/** @type {typeof import('./components/flow-nodes.js').FlowNodesElement} */
export { FlowNodesElement } from './components/flow-nodes.js';

/** @type {typeof import('./components/flow-edges.js').FlowEdgesElement} */
export { FlowEdgesElement } from './components/flow-edges.js';

/** @type {typeof import('./components/flow-background.js').FlowBackgroundElement} */
export { FlowBackgroundElement } from './components/flow-background.js';

/** @type {typeof import('./components/flow-context-menu.js').FlowContextMenu} */
export { FlowContextMenu } from './components/flow-context-menu.js';

/**
 * Core Classes - Main logic and data structures for the FlowGraph system
 */

/** @type {typeof import('./core/FlowGraph.js').FlowGraph} */
export { FlowGraph } from './core/FlowGraph.js';

/** @type {typeof import('./core/Node.js').Node} */
export { Node } from './core/Node.js';

/** @type {typeof import('./core/Socket.js').Socket} */
export { Socket } from './core/Socket.js';

/** @type {typeof import('./core/Edge.js').Edge} */
export { Edge } from './core/Edge.js';

/** @type {typeof import('./core/Viewport.js').Viewport} */
export { Viewport } from './core/Viewport.js';

/** @type {typeof import('./core/SpatialGrid.js').SpatialGrid} */
export { SpatialGrid } from './core/SpatialGrid.js';

FlowGraph Library
A declarative, HTML-based visual scripting library that allows users to create node-based graphs using custom HTML elements.

Features
Declarative DSL: Use HTML elements to define graphs, nodes, and connections
Customizable: Support custom styling through CSS and HTML templates
Modular: Clean separation of concerns with pluggable components
Performance: Optimized for smooth interactions and large graphs
Accessible: Built on web standards with proper ARIA support
Theme Support: Built-in dark and light themes with CSS custom properties
Quick Start
Basic Usage
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="src/themes/dark.css">
  <script type="module" src="src/index.js"></script>
</head>
<body>
  <flow-graph theme="dark" snap-to-grid grid-size="20">
    <!-- Background -->
    <flow-background type="grid" color="#444" />
    
    <!-- Node Definitions -->
    <flow-definitions>
      <flow-node-def name="math.add" label="Add Node" width="180" height="120">
        <node-body>
          <h3 slot="title">➕ Add</h3>
          <flow-input socket="in:a" label="A">
            <input type="number" placeholder="0" />
          </flow-input>
          <flow-input socket="in:b" label="B">
            <input type="number" placeholder="0" />
          </flow-input>
          <flow-output socket="out:sum" label="Sum" color="orange"></flow-output>
        </node-body>
      </flow-node-def>
    </flow-definitions>
    
    <!-- Node Instances -->
    <flow-nodes>
      <flow-node type="math.add" id="n1" x="100" y="100"></flow-node>
      <flow-node type="math.add" id="n2" x="400" y="200"></flow-node>
    </flow-nodes>
    
    <!-- Edges -->
    <flow-edges>
      <flow-edge from="n1:sum" to="n2:a"></flow-edge>
    </flow-edges>
  </flow-graph>
</body>
</html>
Programmatic API
// Get FlowGraph instance
const flowGraph = document.querySelector('flow-graph').flowGraph;

// Add node programmatically
const node = flowGraph.addNode('math.add', { x: 100, y: 100 });

// Add edge programmatically
flowGraph.addEdge('n1:sum', 'n2:a');

// Event handling
flowGraph.on('node:create', (e) => {
  console.log('Node created:', e.detail.node);
});

flowGraph.on('edge:create', (e) => {
  console.log('Edge created:', e.detail.edge);
});
API Reference
FlowGraph Element
The main container element for the visual scripting system.

Attributes
theme: Visual theme ("dark" or "light")
snap-to-grid: Enable grid snapping for nodes
grid-size: Grid cell size in pixels
zoom-min/max: Zoom limits
default-zoom: Initial zoom level
Methods
addNode(type, config): Add a new node
removeNode(nodeId): Remove a node
addEdge(fromSocketId, toSocketId, config): Create an edge
removeEdge(edgeId): Remove an edge
clear(): Clear all nodes and edges
serialize(): Export graph data
deserialize(data): Import graph data
Node Definitions
Define reusable node templates using <flow-node-def>:

<flow-node-def name="custom.node" label="Custom Node" width="200" height="150">
  <node-body>
    <h3 slot="title">Custom Node</h3>
    <flow-input socket="in:data" label="Data" type="string"></flow-input>
    <flow-output socket="out:result" label="Result" color="green"></flow-output>
  </node-body>
</flow-node-def>
Socket Definitions
Define socket templates using <flow-socket-def>:

<flow-socket-def name="number" color="blue" shape="circle" size="14"></flow-socket-def>
<flow-socket-def name="boolean" color="purple" shape="square" size="12"></flow-socket-def>
Node Instances
Create node instances using <flow-node>:

<flow-node type="custom.node" id="node1" x="100" y="100" selected></flow-node>
Edge Definitions
Create connections using <flow-edge>:

<flow-edge from="node1:result" to="node2:data" color="green" width="3" animated="dashed"></flow-edge>
Events
The library emits various events for different interactions:

Node Events
node:create - Node created
node:delete - Node deleted
node:move - Node moved
node:select - Node selected
node:deselect - Node deselected
Edge Events
edge:create - Edge created
edge:delete - Edge deleted
edge:select - Edge selected
Viewport Events
viewport:change - Viewport changed
viewport:zoom - Viewport zoomed
viewport:pan - Viewport panned
Selection Events
selection:change - Selection changed
selection:clear - Selection cleared
Theming
The library supports both dark and light themes with CSS custom properties:

flow-graph {
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
Built-in Node Types
The library comes with several built-in node types:

number: Number input with output
sum: Addition operation
multiply: Multiplication operation
watch: Input monitoring
split: One input, multiple outputs
Performance
The library is optimized for performance with:

Virtual scrolling for large graphs
Efficient edge rendering
Event delegation
RAF-based animations
Memory management for removed elements
Browser Support
Modern browsers with Custom Elements v1
ES6+ features
CSS Grid and Flexbox
Pointer Events API
Development
File Structure
src/
├── core/           # Core functionality
├── elements/       # Custom HTML elements
├── models/         # Data models
├── themes/         # Theme styles
└── index.js        # Main entry point
Building
The library is built as ES modules and can be used directly in modern browsers or bundled with tools like Vite, Webpack, or Rollup.

License
MIT License - see LICENSE file for details.
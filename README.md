# FlowGraph

A modern, HTML-based visual scripting library that lets you create interactive node-based graphs using simple HTML elements. Perfect for data flow programming, workflow design, and visual logic building.

## ✨ Features

- **🎯 Declarative HTML** - Define graphs using intuitive HTML syntax
- **🔌 Smart Sockets** - Drag-to-connect with automatic validation and max connections
- **⚡ Async Execution** - Run entire graphs with value propagation and animations
- **🎨 Complete Customization** - Themes, colors, shapes, and animations
- **📱 Responsive Design** - Works on desktop and mobile
- **🚀 High Performance** - Optimized for smooth interactions
- **🔒 Readonly Mode** - Perfect for presentations and execution
- **🎮 Interactive** - Pan, zoom, multi-select, and context menus
- **💾 Save/Load** - Serialize and deserialize graphs
- **🎬 Animations** - Visual feedback with flowing, pulsing, and data-flow effects
- **📊 Data Binding** - Automatic form control data binding
- **🎨 Custom Nodes** - Create nodes with custom styling and shapes
- **🔗 Edge Selection** - Select and manage connections
- **⌨️ Keyboard Shortcuts** - Copy, paste, delete, and selection shortcuts

## 🚀 Quick Start

### Installation

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/flowgraph.css">
  <script type="module" src="dist/flowgraph.es.js"></script>
</head>
<body>
  <flow-graph theme="dark">
    <!-- Your graph here -->
  </flow-graph>
</body>
</html>
```

### Basic Example

```html
<flow-graph theme="dark" snap-to-grid grid-size="20">
  <!-- Define node templates -->
  <flow-definitions>
    <flow-node-def name="data.number" label="Number" width="160" height="100" 
                   category="Data" icon="🔢" onExecute="loadData">
      <node-body>
        <div class="title">🔢 Number</div>
        <div class="body">
          <input type="number" class="input-box" value="0" data-key="num:value">
          <flow-socket type="output" name="value" label="Value" data-type="number"></flow-socket>
        </div>
      </node-body>
    </flow-node-def>
    
    <flow-node-def name="math.add" label="Add" width="180" height="120" 
                   category="Math" icon="➕" onExecute="addNumbers">
      <node-body>
        <div class="title">➕ Add</div>
        <div class="body">
          <flow-socket type="input" name="a" label="A" data-type="number"></flow-socket>
          <flow-socket type="input" name="b" label="B" data-type="number"></flow-socket>
          <div style="height:8px"></div>
          <flow-socket type="output" name="sum" label="Sum" data-type="number"></flow-socket>
        </div>
      </node-body>
    </flow-node-def>
  </flow-definitions>
  
  <!-- Create node instances -->
  <flow-nodes>
    <flow-node type="data.number" id="n1" x="100" y="100"></flow-node>
    <flow-node type="data.number" id="n2" x="100" y="250"></flow-node>
    <flow-node type="math.add" id="n3" x="350" y="175"></flow-node>
  </flow-nodes>
  
  <!-- Define connections -->
  <flow-edges>
    <flow-edge from="n1:value" to="n3:a"></flow-edge>
    <flow-edge from="n2:value" to="n3:b"></flow-edge>
  </flow-edges>
</flow-graph>
```

### JavaScript Functions

```javascript
// Number input node
window.loadData = async function(context) {
  const inputElement = context.element.querySelector('input[type="number"]');
  const value = inputElement ? parseFloat(inputElement.value) || 0 : 0;
  await new Promise(resolve => setTimeout(resolve, 100));
  context.setOutput(0, value);
};

// Math operation node
window.addNumbers = async function(context) {
  const a = context.getInput(0) || 0;
  const b = context.getInput(1) || 0;
  await new Promise(resolve => setTimeout(resolve, 50));
  context.setOutput(0, a + b);
};
```

## 🎨 Customization

### Themes

```html
<!-- Dark theme (default) -->
<flow-graph theme="dark">

<!-- Light theme -->
<flow-graph theme="light">

<!-- Custom theme -->
<flow-graph style="--fg-bg: #1a1a1a; --fg-text: #ffffff;">
```

### Node Styling

```html
<!-- Custom node appearance -->
<flow-node-def name="custom.processor" label="Processor" 
               custom-class="node-solid" width="200" height="140">
  <node-body>
    <div class="title">⚙️ Processor</div>
    <div class="body">
      <flow-socket type="input" name="input" label="Input"></flow-socket>
      <input type="text" class="input-box" value="Custom Node">
      <flow-socket type="output" name="output" label="Output"></flow-socket>
    </div>
  </node-body>
</flow-node-def>
```

### Socket Shapes

```html
<!-- Default circular socket -->
<flow-socket type="input" name="data" label="Data"></flow-socket>

<!-- Custom square socket -->
<flow-socket type="output" name="result" label="Result">
  <flow-socket-anchor>
    <span style="border-color: #10b981; background: #10b981; 
          width: 18px; height: 18px; border-radius: 4px; display: block; border: 2px solid;"></span>
  </flow-socket-anchor>
  <span class="socket-label" style="color: #10b981; font-weight: bold;">Square Socket</span>
</flow-socket>

<!-- Diamond socket -->
<flow-socket type="input" name="diamond" label="Diamond">
  <flow-socket-anchor>
    <span style="border-color: #8b5cf6; background: linear-gradient(45deg, #8b5cf6, #7c3aed); 
          width: 16px; height: 16px; display: block; border: 2px solid; 
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); margin: 0 auto;"></span>
  </flow-socket-anchor>
  <span class="socket-label" style="color: #8b5cf6; font-weight: bold;">Diamond Socket</span>
</flow-socket>
```

### Color Patches

```html
<!-- Blue gradient for data nodes -->
<flow-node-def name="data.string" 
               color-bg="linear-gradient(90deg, rgba(59,130,246,0.15), transparent)" 
               color-text="#3b82f6">

<!-- Orange gradient for math nodes -->
<flow-node-def name="math.add" 
               color-bg="linear-gradient(90deg, rgba(245,158,11,0.15), transparent)" 
               color-text="#f59e0b">

<!-- Red gradient for logic nodes -->
<flow-node-def name="logic.if" 
               color-bg="linear-gradient(90deg, rgba(239,68,68,0.15), transparent)" 
               color-text="#ef4444">
```

### CSS Customization

```css
/* Custom theme variables */
flow-graph {
  --fg-bg: #111827;
  --fg-panel: #0b1220;
  --fg-node: #0f1724;
  --fg-text: #ffffff;
  --fg-accent: #7c3aed;
  --fg-success: #10b981;
  --fg-warning: #f59e0b;
  --fg-error: #ef4444;
}

/* Custom node styles */
.node-solid {
  border-radius: 6px !important;
  background: #ffffff !important;
  border: 3px solid #1f2937;
  color: #1f2937 !important;
}

/* Custom socket styles */
flow-graph {
  --fg-socket-size: 20px;
  --fg-socket-border-width: 3px;
  --fg-socket-border-radius: 0%; /* Square sockets */
}
```

## 🔌 Socket System

### Basic Sockets

```html
<!-- Simple input/output sockets -->
<flow-socket type="input" name="data" label="Data" data-type="any"></flow-socket>
<flow-socket type="output" name="result" label="Result" data-type="number"></flow-socket>

<!-- Custom styled sockets -->
<flow-socket type="output" name="custom" label="Custom" color="#10b981" size="20px"></flow-socket>
```

### Socket Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `type` | String | "input" or "output" |
| `name` | String | Socket identifier |
| `label` | String | Display label |
| `color` | String | Custom color |
| `size` | String | Socket size |
| `data-type` | String | Data type validation |
| `max-connection` | Number | Maximum number of connections allowed |

### Max Connections

```html
<!-- Limit input socket to 1 connection -->
<flow-socket type="input" name="data" label="Data" max-connection="1"></flow-socket>

<!-- Allow output socket up to 5 connections -->
<flow-socket type="output" name="result" label="Result" max-connection="5"></flow-socket>
```

## ⚡ Execution System

### Async Functions

```javascript
// Access node data and set outputs
window.processData = async function(context) {
  // Get input values
  const input = context.getInput(0);
  
  // Get form data
  const size = context.getData('size') || 50;
  const color = context.getData('color') || '#10b981';
  
  // Process data
  const result = { input, size, color, processed: true };
  
  // Set output
  context.setOutput(0, result);
};
```

### Data Binding

```html
<!-- Form controls with data binding -->
<input type="number" data-key="size" value="50">
<input type="color" data-key="color" value="#10b981">
<select data-key="mode">
  <option value="normal">Normal</option>
  <option value="advanced">Advanced</option>
</select>
```

### Execution Triggers

- **Double-click** any node to execute it
- **Ctrl/Cmd+Enter** to execute selected nodes
- **Shift+Enter** to execute entire graph
- **Execute Graph button** in the top-left corner

## 🎬 Animation System

### Animation Styles

```javascript
// Configure animations
flowGraph.setAnimationConfig({
  enabled: true,
  style: 'flowing',    // 'flowing', 'pulsing', 'data-flow'
  speed: 'normal'      // 'slow', 'normal', 'fast'
});

// Set trail duration (how long animations stay visible)
flowGraph.setTrailDuration(5000); // 5 seconds
```

### Animation Types

- **Flowing** - Dashed line animation that flows along edges
- **Pulsing** - Pulsing effect that changes stroke width and opacity  
- **Data Flow** - Moving dots animation that travels along edges

### Animation Controls

```javascript
// Clear execution trail
flowGraph.clearExecutionTrail();

// Reset all edge colors
flowGraph.resetAllEdgeColors();

// Disable animations
flowGraph.setAnimationConfig({ enabled: false });
``## 🧩 Node Templates

FlowGraph supports programmatic node template creation for dynamic node types.

### Creating Node Templates

```javascript
// Basic node template
flowGraph.addNodeTemplate('data.processor', {
  inputs: [
    { id: 'input', type: 'any', label: 'Input' }
  ],
  outputs: [
    { id: 'output', type: 'any', label: 'Output' }
  ],
  html: `
    <div class="title">📊 Data Processor</div>
    <div class="body">
      <input type="text" class="input-box" data-key="text:value" placeholder="Enter text">
      <flow-socket type="input" name="input" label="Input"></flow-socket>
      <flow-socket type="output" name="output" label="Output"></flow-socket>
    </div>
  `,
  onExecute: 'processData'
});

// Advanced node template with custom styling
flowGraph.addNodeTemplate('custom.renderer', {
  inputs: [
    { id: 'scene', type: 'object', label: 'Scene Data' },
    { id: 'camera', type: 'object', label: 'Camera' }
  ],
  outputs: [
    { id: 'image', type: 'texture', label: 'Rendered Image' },
    { id: 'stats', type: 'object', label: 'Render Stats' }
  ],
  html: `
    <div class="title">🎨 Custom Renderer</div>
    <div class="body">
      <canvas data-draggable="false" style="width: 100%; height: 80px; background: #000;"></canvas>
      <input type="range" data-draggable="false" data-key="quality" min="1" max="10" value="5">
      <flow-socket type="input" name="scene" label="Scene"></flow-socket>
      <flow-socket type="input" name="camera" label="Camera"></flow-socket>
      <flow-socket type="output" name="image" label="Image"></flow-socket>
      <flow-socket type="output" name="stats" label="Stats"></flow-socket>
    </div>
  `,
  onExecute: 'renderCustom'
});
```

### Template Properties

| Property | Type | Description |
|----------|------|-------------|
| `inputs` | Array | Input socket definitions |
| `outputs` | Array | Output socket definitions |
| `html` | String | HTML template for node body |
| `onExecute` | String | Name of async function to execute |

### Socket Definition

```javascript
{
  id: 'socketName',        // Socket identifier
  type: 'any',            // Data type validation
  label: 'Display Label'  // User-visible label
}
```

### Using Templates

```javascript
// Create node from template
const node = flowGraph.addNode('data.processor', { x: 100, y: 100 });

// Template nodes work exactly like HTML-defined nodes
// They support all the same features: data binding, execution, styling, etc.
```

## 💾 Save & Load

### Serialize Graph

```javascript
// Save graph to JSON
const graphData = flowGraph.serialize();
const jsonString = JSON.stringify(graphData, null, 2);

// Save to file
const blob = new Blob([jsonString], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'my-graph.json';
link.click();
```

### Load Graph

```javascript
// Load from JSON
const graphData = JSON.parse(jsonString);
flowGraph.deserialize(graphData);
```

### Auto-save Example

```javascript
// Auto-save every 30 seconds
setInterval(() => {
  const data = flowGraph.serialize();
  localStorage.setItem('flowgraph-autosave', JSON.stringify(data));
}, 30000);

// Load auto-save on page load
window.addEventListener('load', () => {
  const saved = localStorage.getItem('flowgraph-autosave');
  if (saved) {
    flowGraph.deserialize(JSON.parse(saved));
  }
});
```

## 🎮 Interactions

### Viewport Controls
- **Pan**: Click and drag on empty space
- **Zoom**: Mouse wheel or pinch gesture
- **Reset**: Programmatically via `resetViewport()`

### Node Manipulation
- **Move**: Click and drag nodes
- **Multi-select**: Ctrl/Cmd+click for multiple selection
- **Multi-drag**: Drag any selected node to move all together
- **Select**: Click on nodes for visual feedback

### Socket Connections
- **Connect**: Click and drag from output socket to input socket
- **Delete**: Right-click on socket to delete connections
- **Visual Feedback**: Hover effects and connection preview

### Context Menus
- **Add Nodes**: Right-click on empty space
- **Search**: Type in the context menu to filter nodes
- **Delete Nodes**: Right-click on any node to delete it

### Keyboard Shortcuts
- **`Ctrl+A` / `Cmd+A`**: Select all nodes
- **`Ctrl+C` / `Cmd+C`**: Copy selected nodes
- **`Ctrl+V` / `Cmd+V`**: Paste nodes
- **`Delete`**: Delete selected nodes
- **`Escape`**: Clear selection

## 🔒 Readonly Mode

```html
<!-- Enable readonly mode -->
<flow-graph readonly>
  <!-- Your graph content -->
</flow-graph>
```

```javascript
// Programmatic control
const flowGraph = document.querySelector('flow-graph');

// Enable readonly mode
flowGraph.setReadonly(true);

// Toggle readonly mode
const isReadonly = flowGraph.toggleReadonly();
```

**What's disabled in readonly mode:**
- ❌ Node creation/removal
- ❌ Node movement
- ❌ Edge creation/removal
- ❌ Form controls
- ❌ Context menus

**What still works:**
- ✅ Node execution
- ✅ Viewport navigation
- ✅ Node selection
- ✅ Value viewing

## 📚 API Reference

### FlowGraph Element

```javascript
const flowGraph = document.querySelector('flow-graph');

// Node management
const node = flowGraph.addNode('data.number', { x: 100, y: 100 });
flowGraph.removeNode('nodeId');
flowGraph.moveNode('nodeId', 100, 200);

// Edge management
flowGraph.addEdge('n1:value', 'n2:input');
flowGraph.removeEdge('edgeId');

// Selection control
flowGraph.selectNode('nodeId');
flowGraph.selectNode('nodeId', true); // Add to selection
flowGraph.deselectNode('nodeId');
flowGraph.clearSelection();
const selection = flowGraph.getSelection();

// Edge selection
flowGraph.selectEdge('edgeId');
flowGraph.deselectEdge('edgeId');
flowGraph.deselectAllEdges();

// Serialize/deserialize
const data = flowGraph.serialize();
flowGraph.deserialize(data);

// Readonly mode
flowGraph.setReadonly(true);
const isReadonly = flowGraph.isReadonly();
flowGraph.toggleReadonly();

// Animation control
flowGraph.setAnimationConfig({
  enabled: true,
  style: 'flowing',
  speed: 'normal'
});
flowGraph.setTrailDuration(5000);
flowGraph.clearExecutionTrail();
flowGraph.resetAllEdgeColors();

// Execution
await flowGraph.execute(); // Execute entire graph
await flowGraph.executeSelectedNodes(); // Execute only selected nodes

// Node templates
flowGraph.addNodeTemplate('custom.processor', {
  inputs: [{ id: 'input', type: 'any', label: 'Input' }],
  outputs: [{ id: 'output', type: 'any', label: 'Output' }],
  html: '<div class="title">⚙️ Processor</div><div class="body">...</div>',
  onExecute: 'processData'
});
```

### Complete API Methods

#### Node Management
```javascript
// Add node template
flowGraph.addNodeTemplate(name, template);

// Add node instance
const node = flowGraph.addNode(type, config);

// Remove node
flowGraph.removeNode(nodeId);

// Move node
flowGraph.moveNode(nodeId, x, y);
```

#### Edge Management
```javascript
// Create edge
flowGraph.addEdge(fromSocket, toSocket);

// Remove edge
flowGraph.removeEdge(edgeId);
```

#### Selection Control
```javascript
// Node selection
flowGraph.selectNode(nodeId);
flowGraph.selectNode(nodeId, true); // Add to selection
flowGraph.deselectNode(nodeId);
flowGraph.clearSelection();
const selection = flowGraph.getSelection();

// Edge selection
flowGraph.selectEdge(edgeId);
flowGraph.deselectEdge(edgeId);
flowGraph.deselectAllEdges();
```

#### Serialization
```javascript
// Save graph
const data = flowGraph.serialize();

// Load graph
flowGraph.deserialize(data);
```

#### Readonly Mode
```javascript
// Control readonly mode
flowGraph.setReadonly(true);
const isReadonly = flowGraph.isReadonly();
flowGraph.toggleReadonly();
```

#### Animation Control
```javascript
// Configure animations
flowGraph.setAnimationConfig({
  enabled: true,
  style: 'flowing',    // 'flowing', 'pulsing', 'data-flow'
  speed: 'normal'      // 'slow', 'normal', 'fast'
});

// Trail management
flowGraph.setTrailDuration(5000); // 5 seconds
flowGraph.clearExecutionTrail();
flowGraph.resetAllEdgeColors();
```

#### Execution
```javascript
// Execute entire graph
await flowGraph.execute();

// Execute only selected nodes
await flowGraph.executeSelectedNodes();
```

### Events

FlowGraph provides comprehensive events for monitoring all interactions:

#### Node Events
```javascript
// Node lifecycle
flowGraph.addEventListener('node:create', (e) => {
  console.log('Node created:', e.detail.node);
});

flowGraph.addEventListener('node:remove', (e) => {
  console.log('Node removed:', e.detail.nodeId);
});

// Node selection
flowGraph.addEventListener('node:select', (e) => {
  console.log('Node selected:', e.detail.nodeId, 'Selection:', e.detail.selection);
});

flowGraph.addEventListener('node:deselect', (e) => {
  console.log('Node deselected:', e.detail.nodeId);
});

flowGraph.addEventListener('selection:clear', (e) => {
  console.log('Selection cleared, previous:', e.detail.previousSelection);
});

// Node movement
flowGraph.addEventListener('node:move', (e) => {
  console.log('Node moved:', e.detail.nodeId, 
    'from', e.detail.oldPosition, 'to', e.detail.newPosition);
});
```

#### Edge Events
```javascript
// Edge lifecycle
flowGraph.addEventListener('edge:create', (e) => {
  console.log('Edge created:', e.detail.edge);
});

flowGraph.addEventListener('edge:remove', (e) => {
  console.log('Edge removed:', e.detail.edgeId);
});

// Edge selection
flowGraph.addEventListener('edge:select', (e) => {
  console.log('Edge selected:', e.detail.edgeId);
});

flowGraph.addEventListener('edge:deselect', (e) => {
  console.log('Edge deselected:', e.detail.edgeId);
});
```

#### Viewport Events
```javascript
// Viewport changes
flowGraph.addEventListener('viewport:change', (e) => {
  console.log('Viewport changed:', e.detail); // { x, y, scale }
});

flowGraph.addEventListener('viewport:zoom', (e) => {
  console.log('Zoomed to:', e.detail.scale);
});

flowGraph.addEventListener('viewport:pan', (e) => {
  console.log('Panned to:', e.detail.x, e.detail.y);
});
```

#### Execution Events
```javascript
// Node execution
flowGraph.addEventListener('node:execute', (e) => {
  console.log('Node executed:', e.detail.nodeId);
});

flowGraph.addEventListener('node:execute:error', (e) => {
  console.error('Node execution error:', e.detail.nodeId, 'Error:', e.detail.error);
});

// Graph execution
flowGraph.addEventListener('graph:execute:start', (e) => {
  console.log('Graph execution started');
});

flowGraph.addEventListener('graph:execute:complete', (e) => {
  if (e.detail.error) {
    console.error('Graph execution failed:', e.detail.error);
  } else {
    console.log('Graph execution completed successfully');
  }
});
```

#### Keyboard Shortcut Events
```javascript
// Selection changes
flowGraph.addEventListener('selection:change', (e) => {
  console.log('Selection changed:', e.detail.selectedNodes.length, 'nodes selected');
});

// Copy/paste operations
flowGraph.addEventListener('nodes:copy', (e) => {
  console.log('Nodes copied:', e.detail.copiedNodes.length, 'nodes');
});

flowGraph.addEventListener('nodes:paste', (e) => {
  console.log('Nodes pasted:', e.detail.pastedNodes.length, 'nodes');
});

flowGraph.addEventListener('nodes:delete', (e) => {
  console.log('Nodes deleted:', e.detail.deletedNodes.length, 'nodes');
});
```

## 🎯 Use Cases

- **Data Flow Programming** - Visual data processing pipelines
- **Workflow Design** - Business process automation
- **Logic Building** - Visual programming interfaces
- **Node-based Editors** - Shader editors, audio processors
- **Educational Tools** - Interactive learning experiences
- **Prototyping** - Rapid visual prototyping

## 🌐 Browser Support

- **Modern Browsers**: Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+
- **Required Features**: Custom Elements, ES6+, CSS Grid, SVG support

## 📦 Installation

### Bundled Distribution (Recommended)

```html
<link rel="stylesheet" href="dist/flowgraph.css">
<script type="module" src="dist/flowgraph.es.js"></script>
```

**Files included:**
- `dist/flowgraph.es.js` - Complete ES6 module with all dependencies
- `dist/flowgraph.css` - All theme styles and component CSS

**No additional dependencies required** - everything is bundled and ready to use!

## 🔧 Development

```bash
npm install
npm run dev    # Development server
npm run build  # Production build
```

## 📄 License

MIT License - see LICENSE file for details.

---

**FlowGraph** - Build interactive node-based graphs with HTML. No complex setup, no framework dependencies, just pure web standards.

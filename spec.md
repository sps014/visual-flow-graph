# FlowGraph Library Specification

A modern, declarative, HTML-based visual scripting library built with Lit web components that allows users to create interactive node-based graphs using custom HTML elements.

## 🚀 Features

- **Declarative DSL**: Define graphs, nodes, and connections using intuitive HTML syntax
- **Lit-based Architecture**: Built on modern web standards with Lit web components
- **Customizable UI**: Support custom styling through CSS and HTML templates
- **Interactive**: Drag-to-connect sockets, pan/zoom viewport, node manipulation
- **Performance Optimized**: Smooth interactions with RAF-based animations
- **Theme Support**: Built-in dark and light themes with CSS custom properties
- **Event System**: Comprehensive event handling for graph interactions
- **Modular Design**: Clean separation of concerns with pluggable components

## 📦 Installation

### CDN Usage (Recommended for Quick Start)
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="src/styles/theme.css">
  
  <!-- Import map for Lit dependencies -->
  <script type="importmap">
    {
      "imports": {
        "lit": "https://cdn.jsdelivr.net/npm/lit@3.1.0/index.js",
        "lit/": "https://cdn.jsdelivr.net/npm/lit@3.1.0/",
        "@lit/reactive-element": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.0.4/reactive-element.js",
        "@lit/reactive-element/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.0.4/",
        "lit-html": "https://cdn.jsdelivr.net/npm/lit-html@3.1.0/lit-html.js",
        "lit-html/": "https://cdn.jsdelivr.net/npm/lit-html@3.1.0/"
      }
    }
  </script>
  
  <script type="module" src="src/index.js"></script>
</head>
<body>
  <!-- Your FlowGraph content here -->
</body>
</html>
```

### NPM Installation
```bash
npm install flowgraph lit
```

## 🎯 Quick Start

### Basic Example
```html
<flow-graph theme="dark" snap-to-grid grid-size="20">
  <!-- Define reusable node templates -->
  <flow-definitions>
    <flow-node-def name="data.number" label="Number" width="160" height="100">
      <node-body>
        <div class="title">🔢 Number</div>
        <div class="body">
          <input type="number" class="input-box" value="0" placeholder="Enter value">
          <div class="line" style="text-align:right">
            <span class="socket out" data-sock="value"></span> Value
          </div>
        </div>
      </node-body>
      <flow-output socket="value" label="Value" type="number"></flow-output>
    </flow-node-def>
    
    <flow-node-def name="math.add" label="Add" width="180" height="120">
      <node-body>
        <div class="title">➕ Add</div>
        <div class="body">
          <div class="line">
            <span class="socket in" data-sock="a"></span> A
          </div>
          <div class="line">
            <span class="socket in" data-sock="b"></span> B
          </div>
          <div style="height:8px"></div>
          <div class="line" style="text-align:right">
            <span class="socket out" data-sock="sum"></span> Sum
          </div>
        </div>
      </node-body>
      <flow-input socket="a" label="A" type="number"></flow-input>
      <flow-input socket="b" label="B" type="number"></flow-input>
      <flow-output socket="sum" label="Sum" type="number"></flow-output>
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

## 📚 API Reference

### FlowGraph Element (`<flow-graph>`)

The main container element for the visual scripting system.

#### Attributes
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | String | `"dark"` | Visual theme (`"dark"` or `"light"`) |
| `snap-to-grid` | Boolean | `false` | Enable grid snapping for nodes |
| `grid-size` | Number | `20` | Grid cell size in pixels |
| `zoom-min` | Number | `0.1` | Minimum zoom level |
| `zoom-max` | Number | `3` | Maximum zoom level |
| `default-zoom` | Number | `1` | Initial zoom level |

#### Properties
| Property | Type | Description |
|----------|------|-------------|
| `flowGraph` | FlowGraph | Access to the underlying FlowGraph instance |

#### Methods
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `addNode(type, config)` | `type: string, config: object` | `Node` | Add a new node programmatically |
| `removeNode(nodeId)` | `nodeId: string` | `void` | Remove a node by ID |
| `addEdge(from, to)` | `from: string, to: string` | `Edge` | Create an edge between sockets |
| `removeEdge(edgeId)` | `edgeId: string` | `void` | Remove an edge by ID |
| `clear()` | - | `void` | Clear all nodes and edges |
| `serialize()` | - | `object` | Export graph data |
| `deserialize(data)` | `data: object` | `void` | Import graph data |

#### Events
| Event | Detail | Description |
|-------|--------|-------------|
| `node:create` | `{ node }` | Fired when a node is created |
| `node:remove` | `{ nodeId }` | Fired when a node is removed |
| `edge:create` | `{ edge }` | Fired when an edge is created |
| `edge:remove` | `{ edgeId }` | Fired when an edge is removed |

### Node Definition (`<flow-node-def>`)

Define reusable node templates.

#### Attributes
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | ✅ | Unique identifier for the node type |
| `label` | String | ❌ | Display label (defaults to name) |
| `width` | Number | ❌ | Node width in pixels (default: 160) |
| `height` | Number | ❌ | Node height in pixels (default: 100) |

#### Child Elements
- `<node-body>`: Contains the HTML template for the node's visual representation
- `<flow-input>`: Defines input sockets
- `<flow-output>`: Defines output sockets

### Socket Definition (`<flow-input>`, `<flow-output>`)

Define input and output sockets for nodes.

#### Attributes
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `socket` | String | ✅ | Socket identifier |
| `label` | String | ❌ | Display label |
| `type` | String | ❌ | Data type for validation (default: "any") |

### Node Instance (`<flow-node>`)

Create instances of defined node types.

#### Attributes
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | String | ✅ | Node type (must match a `flow-node-def` name) |
| `id` | String | ✅ | Unique node identifier |
| `x` | Number | ❌ | X position (default: 0) |
| `y` | Number | ❌ | Y position (default: 0) |
| `selected` | Boolean | ❌ | Initial selection state |

### Edge Definition (`<flow-edge>`)

Create connections between node sockets.

#### Attributes
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | String | ✅ | Source socket in format `"nodeId:socketId"` |
| `to` | String | ✅ | Target socket in format `"nodeId:socketId"` |

## 🎨 Theming and Styling

### CSS Custom Properties

The library uses CSS custom properties for theming:

```css
flow-graph[theme="dark"] {
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
```

### Interactive Elements in Nodes

FlowGraph uses a clean, attribute-based approach to handle interactive elements within nodes:

#### Data Attributes

Use `data-draggable` attributes to control dragging behavior:

```html
<!-- Prevent node dragging on this element -->
<canvas data-draggable="false"></canvas>
<input type="range" data-draggable="false">
<button data-draggable="false">Click me</button>

<!-- Force dragging even with form elements inside -->
<div data-draggable="true">
  <input type="text"> <!-- This won't block dragging -->
</div>
```

#### Default Behavior

- **Form elements** (`input`, `textarea`, `select`, `button`, `a[href]`) = interactive (no dragging)
- **Contenteditable elements** = interactive (no dragging)
- **Socket elements** = interactive (no dragging)
- **Everything else** = draggable by default

#### Example: 3D Renderer Node

```html
<flow-node-def name="render.3d" label="3D Renderer" width="320" height="280">
  <node-body>
    <div class="title">🎮 3D Renderer</div>
    <div class="body">
      <!-- Canvas for 3D rendering -->
      <canvas data-draggable="false" style="cursor: grab;"></canvas>
      
      <!-- Interactive controls -->
      <input type="range" data-draggable="false">
      <select data-draggable="false">
        <option>Perspective</option>
        <option>Orthographic</option>
      </select>
      
      <!-- Buttons -->
      <button data-draggable="false">Render</button>
      <button data-draggable="false">Reset</button>
    </div>
  </node-body>
</flow-node-def>
```

### Node Styling

Nodes can be styled using CSS classes:

```css
.node {
  /* Base node styles */
}

.node.type-math .title {
  background: linear-gradient(90deg, rgba(245,158,11,0.15), transparent);
  color: var(--fg-warning);
}

.input-box {
  /* Input field styles */
  pointer-events: auto;
  cursor: text;
}
```

## 🎮 User Interactions

### Viewport Controls
- **Pan**: Click and drag on empty space
- **Zoom**: Mouse wheel or pinch gesture
- **Reset**: Programmatically via `resetViewport()`

### Node Manipulation
- **Move**: Click and drag nodes
- **Select**: Click on nodes (visual feedback)
- **Input**: Click in input fields to type values

### Socket Connections
- **Connect**: Click and drag from output socket to input socket
- **Visual Feedback**: Hover effects and temporary connection preview
- **Validation**: Automatic connection validation (input/output, type checking)

## 🏗️ Architecture

### File Structure
```
src/
├── components/          # Lit web components
│   ├── flow-graph.js   # Main FlowGraph element
│   ├── flow-node-def.js
│   ├── flow-node.js
│   ├── flow-input.js
│   ├── flow-output.js
│   ├── flow-edge.js
│   └── ...
├── core/               # Core functionality
│   ├── FlowGraph.js    # Main orchestrator
│   ├── Node.js         # Node management
│   ├── Socket.js       # Socket connections
│   ├── Edge.js         # Edge rendering
│   └── Viewport.js     # Pan/zoom controls
├── styles/
│   └── theme.css       # Theme styles
└── index.js            # Main entry point
```

### Core Classes

#### FlowGraph
Main orchestrator class that manages nodes, edges, and viewport.

#### Node
Represents a node instance with sockets, position, and visual representation.

#### Socket
Represents input/output connection points with validation logic.

#### Edge
Represents connections between sockets with SVG path rendering.

#### Viewport
Manages pan, zoom, and coordinate transformations.

## 🚀 Performance Features

- **RAF-based Animations**: Smooth 60fps interactions
- **Event Delegation**: Efficient event handling
- **Viewport Culling**: Only render visible elements
- **Connection Optimization**: Fast socket position calculations
- **Memory Management**: Proper cleanup of removed elements

## 🌐 Browser Support

- **Modern Browsers**: Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+
- **Required Features**:
  - Custom Elements v1
  - ES6+ (modules, classes, arrow functions)
  - CSS Grid and Flexbox
  - Pointer Events API
  - SVG support

## 📝 Examples

### Programmatic API Usage

```javascript
// Wait for component to be ready
await customElements.whenDefined('flow-graph');
const flowGraph = document.querySelector('flow-graph');

// Event handling
flowGraph.addEventListener('node:create', (e) => {
  console.log('Node created:', e.detail.node);
});

flowGraph.addEventListener('edge:create', (e) => {
  console.log('Edge created:', e.detail.edge);
});

// Add nodes programmatically
const node1 = flowGraph.addNode('data.number', { x: 100, y: 100 });
const node2 = flowGraph.addNode('math.add', { x: 300, y: 100 });

// Create connections
flowGraph.addEdge('n1:value', 'n2:a');

// Serialize/deserialize
const data = flowGraph.serialize();
localStorage.setItem('my-graph', JSON.stringify(data));

const savedData = JSON.parse(localStorage.getItem('my-graph'));
flowGraph.deserialize(savedData);
```

### Custom Node Types

```html
<flow-node-def name="custom.processor" label="Data Processor" width="200" height="150">
  <node-body>
    <div class="title">⚙️ Processor</div>
    <div class="body">
      <div class="line">
        <span class="socket in" data-sock="input"></span> Input
      </div>
      <select class="input-box">
        <option>Transform A</option>
        <option>Transform B</option>
      </select>
      <div class="line" style="text-align:right">
        <span class="socket out" data-sock="output"></span> Output
      </div>
    </div>
  </node-body>
  <flow-input socket="input" label="Input" type="any"></flow-input>
  <flow-output socket="output" label="Output" type="any"></flow-output>
</flow-node-def>
```

## 🔧 Development

### Building
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
```

### Testing
```bash
npm test       # Run tests
npm run test:watch  # Watch mode
```

## 📄 License

MIT License - see LICENSE file for details.

---

## 🆕 Recent Updates

- ✅ **Clean Interactive Element System** - Replaced hardcoded lists with `data-draggable` attributes
- ✅ **Fixed input box typing functionality** - All form elements work properly
- ✅ **Improved panning** - Matches original POC behavior perfectly
- ✅ **Added proper Lit dependency management** - Via import maps for CDN usage
- ✅ **Enhanced node dragging** - Smart detection without hardcoding
- ✅ **Optimized viewport transforms** - Smooth interactions and edge updates
- ✅ **Updated edge styling** - Green color (#10b981) with reduced stroke width (2.5px)
- ✅ **Advanced 3D renderer example** - Shows arbitrary HTML content with full interactivity
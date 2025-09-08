# FlowGraph Library

A modern, declarative, HTML-based visual scripting library built with Lit web components that allows users to create interactive node-based graphs using custom HTML elements.

## 🚀 Features

- **Declarative DSL**: Define graphs, nodes, and connections using intuitive HTML syntax
- **Lit-based Architecture**: Built on modern web standards with Lit web components
- **Customizable UI**: Support custom styling through CSS and HTML templates
- **Interactive**: Drag-to-connect sockets, pan/zoom viewport, node manipulation
- **Performance Optimized**: Smooth interactions with RAF-based animations
- **Theme Support**: Built-in dark and light themes with comprehensive CSS customization
- **Event System**: Comprehensive event handling for graph interactions
- **Modular Design**: Clean separation of concerns with pluggable components
- **Context Menus**: Right-click menus for adding/deleting nodes and managing connections
- **Search Functionality**: Real-time search in node creation context menu
- **Multi-selection**: Select and drag multiple nodes simultaneously
- **Color Patches**: Flexible node title styling defined in node definitions
- **Async Execution**: Execute nodes and entire graphs with async functions and value propagation

## 🆕 Recent Updates

### v1.4.0 - Async Node Execution System
- **Async Execution**: Full support for async `onExecute` methods in node definitions
- **Graph Execution**: Execute entire graphs in dependency order using topological sorting
- **Value Propagation**: Automatic value flow between connected nodes through socket system
- **Index-Based Access**: Simple socket value access using array indices instead of names
- **Execution Events**: Comprehensive event system for monitoring graph execution
- **Multiple Triggers**: Double-click nodes, keyboard shortcuts, or execute button
- **Clean API**: Direct element access and helper methods for socket value management
- **Edge Animations**: Visual feedback during execution with customizable animation styles
- **Conditional Branching**: Smart execution system that only runs active branches in conditional logic
- **CSS Customization**: Complete animation theming system with orange default theme

### v1.3.0 - CSS Cleanup & Optimization
- **Consolidated CSS Variables**: All CSS custom properties now centralized in `theme.css`
- **Removed Duplicates**: Eliminated duplicate CSS across components
- **Improved Architecture**: Clear separation between global styles and component-specific styles
- **Better Maintainability**: Single source of truth for all theming variables
- **Optimized Bundle**: Reduced CSS duplication for smaller bundle size

### v1.2.0 - Color Patch System
- **Flexible Color Patches**: Define node title colors directly in `flow-node-def` using `color-bg` and `color-text` attributes
- **No Hardcoded CSS**: Each node type can have unique styling without global CSS changes
- **CSS Custom Properties**: Uses `--node-color-bg` and `--node-color-text` for dynamic styling
- **Enhanced Context Menus**: Improved viewport and socket context menus with search functionality
- **Better UX**: Friendly names in socket delete menus, improved node placement

### v1.1.0 - Context Menus & Multi-Selection
- **Viewport Context Menu**: Right-click to add nodes with categorized, searchable menu
- **Socket Context Menu**: Right-click sockets to delete connected edges
- **Multi-Node Dragging**: Select and move multiple nodes simultaneously
- **Enhanced Event System**: Comprehensive events for all graph interactions

## 📦 Installation

### Bundled Distribution (Recommended)

FlowGraph is distributed as a single bundled ES6 module with all dependencies included. Simply include the bundled files in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/flowgraph.css">
  <script type="module" src="dist/flowgraph.es.js"></script>
</head>
<body>
  <!-- Your FlowGraph content here -->
</body>
</html>
```

**Files included:**
- `dist/flowgraph.es.js` - Complete ES6 module with Lit bundled
- `dist/flowgraph.css` - All theme styles and component CSS

**No additional dependencies required** - everything is bundled and ready to use!

## 🎯 Quick Start

### Basic Example
```html
<flow-graph theme="dark" snap-to-grid grid-size="20">
  <!-- Define reusable node templates -->
  <flow-definitions>
    <flow-node-def name="data.number" label="Number" width="160" height="100" 
                   category="Data" description="Numeric input" icon="🔢"
                   color-bg="linear-gradient(90deg, rgba(59,130,246,0.15), transparent)" 
                   color-text="#3b82f6" onExecute="loadData">
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
    
    <flow-node-def name="math.add" label="Add" width="180" height="120" 
                   category="Math" description="Add two numbers" icon="➕"
                   color-bg="linear-gradient(90deg, rgba(245,158,11,0.15), transparent)" 
                   color-text="#f59e0b" onExecute="addNumbers">
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

## ⚡ Async Node Execution

FlowGraph supports async execution of nodes and entire graphs with automatic value propagation between connected nodes.

### Basic Execution Setup

Add `onExecute` attribute to your node definitions and define corresponding async functions:

```html
<flow-node-def name="data.number" label="Number" onExecute="loadData">
  <!-- node body -->
</flow-node-def>

<flow-node-def name="math.add" label="Add" onExecute="addNumbers">
  <!-- node body -->
</flow-node-def>
```

### Async Function Implementation

Define your async functions globally:

```javascript
// Number input node
window.loadData = async function(context) {
  // Access DOM element directly
  const inputElement = context.element.querySelector('input[type="number"]');
  const value = inputElement ? parseFloat(inputElement.value) || 0 : 0;
  
  // Simulate async work
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Set output value (index 0 for first output socket)
  context.setOutput(0, value);
};

// Math operation node
window.addNumbers = async function(context) {
  // Get input values by index
  const a = context.getInput(0) || 0;  // first input socket
  const b = context.getInput(1) || 0;  // second input socket
  
  // Simulate async calculation
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const sum = a + b;
  
  // Set output value
  context.setOutput(0, sum);
};
```

### Execution Context

Each async function receives a `context` object with:

- `context.nodeId` - Unique node identifier
- `context.nodeType` - Node type name
- `context.element` - DOM element of the node
- `context.inputs` - Map of input sockets
- `context.outputs` - Map of output sockets
- `context.getInput(index)` - Get input socket value by index
- `context.setOutput(index, value)` - Set output socket value by index

### Execution Triggers

- **Double-click** any node to execute it individually
- **Ctrl/Cmd+Enter** to execute selected nodes
- **Shift+Enter** to execute entire graph
- **Execute Graph button** in the top-left corner

### Graph Execution

The graph execution system automatically:

1. **Dependency Analysis**: Uses topological sorting to determine execution order
2. **Sequential Execution**: Executes nodes in dependency order (inputs before outputs)
3. **Value Propagation**: Automatically propagates values between connected sockets
4. **Error Handling**: Stops execution immediately if any individual node fails

### Socket Index Order

Inputs and outputs are ordered by their definition order in the `flow-node-def`:

```html
<flow-node-def name="math.add">
  <flow-input socket="a" label="A" type="number"></flow-input>  <!-- index 0 -->
  <flow-input socket="b" label="B" type="number"></flow-input>  <!-- index 1 -->
  <flow-output socket="sum" label="Sum" type="number"></flow-output>  <!-- index 0 -->
</flow-node-def>
```

### Execution Events

Listen to execution events for monitoring:

```javascript
flowGraph.addEventListener('node:execute', (e) => {
  console.log('Node executed:', e.detail.nodeId, 'Result:', e.detail.result);
});

flowGraph.addEventListener('node:execute:error', (e) => {
  console.error('Node execution failed:', e.detail.nodeId, 'Error:', e.detail.error);
});

flowGraph.addEventListener('graph:execute:start', (e) => {
  console.log('Graph execution started');
});

flowGraph.addEventListener('graph:execute:complete', (e) => {
  if (e.detail.error) {
    console.error('Graph execution failed:', e.detail.error);
    console.log(`Executed ${e.detail.executedNodes}/${e.detail.totalNodes} nodes before failure`);
  } else {
    console.log(`Graph execution completed successfully - ${e.detail.executedNodes} nodes executed`);
  }
});
```

## ✨ Edge Animations

FlowGraph provides visual feedback during graph execution through animated edges that show data flow between nodes.

### Animation Styles

Three different animation styles are available:

- **Flowing**: Dashed line animation that flows along the edge path
- **Pulsing**: Pulsing effect that changes stroke width and opacity
- **Data Flow**: Moving dots animation that travels along the edge

### Animation Configuration

Configure animations programmatically:

```javascript
// Set animation configuration
flowGraph.setAnimationConfig({
  enabled: true,           // Enable/disable animations
  style: 'flowing',       // 'flowing', 'pulsing', 'data-flow'
  speed: 'normal',        // 'slow', 'normal', 'fast'
  duration: 1000          // Base duration in milliseconds
});

// Disable animations
flowGraph.setAnimationConfig({ enabled: false });
```

### Animation Behavior

- **Automatic Triggering**: Animations start automatically when nodes execute
- **Dependency-Based**: Only edges connected to executing nodes are animated
- **Node Highlighting**: Executing nodes are highlighted with coordinated colors
- **Error Handling**: All animations stop immediately if execution fails
- **Performance**: Animations are lightweight and don't impact execution speed

### Node Highlighting

During execution, nodes are highlighted with colors that match their animation style:

- **Flowing**: Red highlighting (#ff6b6b) with glowing border
- **Pulsing**: Orange highlighting (#f59e0b) with pulsing effect
- **Data Flow**: Purple highlighting (#7c3aed) with gradient background

The highlighting includes:
- Glowing box shadow around the node
- Colored border matching the animation style
- Subtle background gradient
- Bold title text in the highlight color

### Custom Animation Classes

You can also create custom animations by adding CSS classes:

```css
.edge.my-custom-animation {
  stroke: #ff6b6b !important;
  stroke-width: 3px !important;
  animation: myCustomAnimation 2s ease-in-out infinite;
}

@keyframes myCustomAnimation {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```

Then apply it to edges:

```javascript
// Apply custom animation to specific edge
const edge = flowGraph.getEdge('edge_id');
edge.setAnimation('my-custom-animation');
```

## 🎨 Color Customization & Theming

### CSS Custom Properties

FlowGraph uses CSS custom properties for comprehensive theming. You can customize any aspect of the visual appearance:

```css
flow-graph[theme="dark"] {
  /* Background colors */
  --fg-bg: #111827;                    /* Main background */
  --fg-panel: #0b1220;                 /* Panel backgrounds */
  --fg-node: #0f1724;                  /* Node backgrounds */
  
  /* Text colors */
  --fg-text: #ffffff;                  /* Primary text */
  --fg-muted: #94a3b8;                 /* Secondary text */
  --fg-accent: #7c3aed;                /* Accent color */
  
  /* Edge colors */
  --fg-edge: rgba(124,58,237,0.95);    /* Connection lines */
  
  /* Status colors */
  --fg-success: #10b981;               /* Success states */
  --fg-warning: #f59e0b;               /* Warning states */
  --fg-error: #ef4444;                 /* Error states */
}

/* Light theme example */
flow-graph[theme="light"] {
  --fg-bg: #f8fafc;
  --fg-panel: #ffffff;
  --fg-node: #ffffff;
  --fg-text: #1f2937;
  --fg-muted: #64748b;
  --fg-accent: #7c3aed;
  --fg-edge: rgba(124,58,237,0.95);
  --fg-success: #10b981;
  --fg-warning: #f59e0b;
  --fg-error: #ef4444;
}
```

### ✨ Animation Customization

FlowGraph provides comprehensive customization for all animation styles, colors, and effects through CSS custom properties. The default theme uses a warm orange color scheme for all animations.

#### Animation Colors
```css
flow-graph {
  /* Animation colors - all default to orange theme */
  --fg-animation-flowing-color: #f59e0b;     /* Flowing animation color */
  --fg-animation-pulsing-color: #f59e0b;     /* Pulsing animation color */
  --fg-animation-data-flow-color: #f59e0b;   /* Data-flow animation color */
}
```

#### Animation Speeds
```css
flow-graph {
  /* Animation durations */
  --fg-animation-speed-slow: 2.5s;           /* Slow animation duration */
  --fg-animation-speed-normal: 1.5s;         /* Normal animation duration */
  --fg-animation-speed-fast: 0.8s;           /* Fast animation duration */
}
```

#### Execution Highlighting
```css
flow-graph {
  /* Node highlighting during execution */
  --fg-executing-border: #f59e0b;            /* Node border when executing */
  --fg-executing-shadow: rgba(245, 158, 11, 0.8); /* Node shadow when executing */
  --fg-executing-bg: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); /* Node background */
  --fg-executing-text: #f59e0b;              /* Node title color when executing */
}
```

#### Trail Highlighting
```css
flow-graph {
  /* Execution trail appearance */
  --fg-trail-opacity: 0.8;                   /* Opacity of execution trail */
  --fg-trail-stroke-width: 3px;              /* Stroke width of execution trail */
}
```

#### Animation Effects
```css
flow-graph {
  /* Animation visual effects */
  --fg-animation-stroke-width: 4px;          /* Stroke width during animation */
  --fg-animation-stroke-width-hover: 6px;    /* Stroke width on hover */
  --fg-animation-glow-intensity: 8px;        /* Glow effect intensity */
  --fg-animation-trail-glow-intensity: 6px;  /* Glow effect for trail */
}
```

#### Example: Custom Color Scheme
```css
/* Custom blue theme for animations */
flow-graph {
  --fg-animation-flowing-color: #3b82f6;     /* Blue flowing */
  --fg-animation-pulsing-color: #8b5cf6;     /* Purple pulsing */
  --fg-animation-data-flow-color: #06b6d4;   /* Cyan data-flow */
  --fg-animation-speed-normal: 1s;           /* Faster animations */
  --fg-trail-opacity: 0.9;                   /* More visible trail */
}
```

### Node Color Patches

FlowGraph supports flexible color patches defined directly in node definitions using `color-bg` and `color-text` attributes. This approach eliminates the need for hardcoded CSS and allows each node type to have its own unique styling.

#### Basic Usage
```html
<flow-node-def name="data.number" label="Number" 
               color-bg="linear-gradient(90deg, rgba(59,130,246,0.15), transparent)" 
               color-text="#3b82f6">
  <node-body>
    <div class="title">🔢 Number</div>
    <!-- node content -->
  </node-body>
</flow-node-def>
```

#### Color Patch Examples
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

<!-- Purple gradient for render nodes -->
<flow-node-def name="render.canvas" 
               color-bg="linear-gradient(90deg, rgba(139,92,246,0.15), transparent)" 
               color-text="#8b5cf6">
```

#### How It Works
- **CSS Custom Properties**: Color patches use CSS custom properties (`--node-color-bg`, `--node-color-text`)
- **Data Attributes**: Nodes automatically get a `data-color-patch` attribute when color patches are defined
- **Flexible Styling**: Each node can have completely custom colors without affecting others
- **No Hardcoded CSS**: Colors are defined per node type, not in global stylesheets

### Advanced Color Customization

#### Manual Node Styling (Alternative to Color Patches)
```css
/* Custom node types with specific colors */
.node.type-data .title {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.15), transparent);
  color: var(--fg-success);
}

.node.type-math .title {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.15), transparent);
  color: var(--fg-warning);
}

.node.type-logic .title {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.15), transparent);
  color: var(--fg-error);
}

/* Socket colors */
.socket.in {
  background: var(--fg-accent);
  border: 2px solid var(--fg-accent);
}

.socket.out {
  background: var(--fg-success);
  border: 2px solid var(--fg-success);
}

.socket:hover {
  transform: scale(1.2);
  box-shadow: 0 0 8px currentColor;
}
```

#### Edge Styling
```css
/* Custom edge styles */
.connection {
  stroke: var(--fg-edge);
  stroke-width: 2.5;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.connection:hover {
  stroke: var(--fg-accent);
  stroke-width: 3;
}

.connection.selected {
  stroke: var(--fg-accent);
  stroke-width: 3;
  filter: drop-shadow(0 0 4px currentColor);
}
```

#### Context Menu Styling

FlowGraph provides two types of context menus with consistent styling:

**Viewport Context Menu** (Right-click empty space):
- Defined in `flow-context-menu` component using Shadow DOM
- Uses theme variables for consistent styling
- Includes search functionality and categorized node creation

**Node Context Menu** (Right-click on nodes):
- Dynamically created for node operations
- Uses theme variables: `--fg-panel`, `--fg-muted`, `--fg-text`, `--fg-accent`
- Includes delete functionality with confirmation

```css
/* Context menu styling uses theme variables */
.node-context-menu {
  background: var(--fg-panel);
  border: 1px solid var(--fg-muted);
  color: var(--fg-text);
}

.context-menu-item:hover {
  background: var(--fg-accent);
  color: white;
}
```

**Available Context Menu Actions:**
- **Viewport**: Add new nodes from categorized menu
- **Nodes**: Delete selected node
- **Sockets**: Delete connected edges (existing functionality)

### Interactive Elements Styling

#### Form Controls
```css
.input-box {
  background: var(--fg-node);
  border: 1px solid var(--fg-muted);
  color: var(--fg-text);
  border-radius: 4px;
  padding: 4px 8px;
  pointer-events: auto;
  cursor: text;
}

.input-box:focus {
  border-color: var(--fg-accent);
  outline: none;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

/* Interactive elements that don't block dragging */
.interactive {
  pointer-events: auto !important;
  cursor: auto;
}

canvas.interactive {
  cursor: grab;
}

button.interactive {
  cursor: pointer;
}
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

### Node Definition (`<flow-node-def>`)

Define reusable node templates with enhanced metadata.

#### Attributes
| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String | ✅ | Unique identifier for the node type |
| `label` | String | ❌ | Display label (defaults to name) |
| `width` | Number | ❌ | Node width in pixels (default: 160) |
| `height` | Number | ❌ | Node height in pixels (default: 100) |
| `category` | String | ❌ | Category for context menu grouping (default: "General") |
| `description` | String | ❌ | Description shown in context menu |
| `icon` | String | ❌ | Icon/emoji for context menu display |
| `color-bg` | String | ❌ | Background gradient for node title (CSS gradient) |
| `color-text` | String | ❌ | Text color for node title (CSS color) |
| `onExecute` | String | ❌ | Name of async function to execute when node runs |

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

## 🎮 User Interactions

### Viewport Controls
- **Pan**: Click and drag on empty space
- **Zoom**: Mouse wheel or pinch gesture
- **Reset**: Programmatically via `resetViewport()`

### Node Manipulation
- **Move**: Click and drag nodes
- **Multi-select**: Ctrl/Cmd+click for multiple selection
- **Multi-drag**: Drag any selected node to move all together
- **Select**: Click on nodes (visual feedback)
- **Input**: Click in input fields to type values

### Socket Connections
- **Connect**: Click and drag from output socket to input socket
- **Delete**: Right-click on socket to delete connections
- **Visual Feedback**: Hover effects and temporary connection preview
- **Validation**: Automatic connection validation (input/output, type checking)

### Context Menus
- **Add Nodes**: Right-click on empty space to show node creation menu
- **Search**: Type in the context menu to filter available nodes
- **Delete Nodes**: Right-click on any node to delete it
- **Delete Connections**: Right-click on sockets to manage connections

### Keyboard Shortcuts
- **`Ctrl+A` / `Cmd+A`**: Select all nodes
- **`Ctrl+C` / `Cmd+C`**: Copy selected nodes
- **`Ctrl+V` / `Cmd+V`**: Paste nodes
- **`Delete`**: Delete selected nodes
- **`Escape`**: Clear selection

#### Keyboard Shortcut Events
```javascript
// Listen to keyboard shortcut events
flowGraph.addEventListener('selection:change', (e) => {
  console.log('Selection changed:', e.detail.selectedNodes.length, 'nodes selected');
});

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

## 🎯 Event System

FlowGraph provides a comprehensive event system for monitoring and responding to user interactions and programmatic changes.

### Node Events

```javascript
const flowGraph = document.querySelector('flow-graph').flowGraph;

// Selection events
flowGraph.addEventListener('node:select', (e) => {
  console.log('Node selected:', e.detail.nodeId);
  console.log('Current selection:', e.detail.selection);
});

flowGraph.addEventListener('node:deselect', (e) => {
  console.log('Node deselected:', e.detail.nodeId);
});

flowGraph.addEventListener('selection:clear', (e) => {
  console.log('Selection cleared, previous:', e.detail.previousSelection);
});

// Movement events
flowGraph.addEventListener('node:move', (e) => {
  console.log('Node moved:', e.detail.nodeId);
  console.log('From:', e.detail.oldPosition);
  console.log('To:', e.detail.newPosition);
});

// Creation/destruction events
flowGraph.addEventListener('node:create', (e) => {
  console.log('Node created:', e.detail.node);
});

flowGraph.addEventListener('node:remove', (e) => {
  console.log('Node removed:', e.detail.nodeId);
});
```

### Edge Events

```javascript
// Edge selection
flowGraph.addEventListener('edge:select', (e) => {
  console.log('Edge selected:', e.detail.edgeId);
});

flowGraph.addEventListener('edge:deselect', (e) => {
  console.log('Edge deselected:', e.detail.edgeId);
});

// Edge creation/destruction
flowGraph.addEventListener('edge:create', (e) => {
  console.log('Edge created:', e.detail.edge);
});

flowGraph.addEventListener('edge:remove', (e) => {
  console.log('Edge removed:', e.detail.edgeId);
});
```

### Viewport Events

```javascript
// Viewport changes
flowGraph.addEventListener('viewport:change', (e) => {
  console.log('Viewport changed:', e.detail);
  // { x, y, scale }
});

flowGraph.addEventListener('viewport:zoom', (e) => {
  console.log('Zoomed to:', e.detail.scale);
});

flowGraph.addEventListener('viewport:pan', (e) => {
  console.log('Panned to:', e.detail.x, e.detail.y);
});
```

### Programmatic Control

```javascript
// Selection control
flowGraph.selectNode('node1');                    // Select single node
flowGraph.selectNode('node2', true);             // Add to selection
flowGraph.deselectNode('node1');                 // Deselect specific node
flowGraph.clearSelection();                      // Clear all selections
const selection = flowGraph.getSelection();      // Get current selection

// Movement control
flowGraph.moveNode('node1', 100, 200);          // Move node programmatically

// Edge control
flowGraph.selectEdge('edge1');                   // Select edge
flowGraph.deselectEdge('edge1');                 // Deselect edge
```

## 🏗️ Architecture

### File Structure
```
src/
├── components/          # Lit web components
│   ├── flow-graph.js   # Main FlowGraph element
│   ├── flow-context-menu.js # Context menu component
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
<flow-node-def name="custom.processor" label="Data Processor" width="200" height="150"
               category="Processing" description="Process data streams" icon="⚙️">
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

### Advanced 3D Renderer Node

```html
<flow-node-def name="render.3d" label="3D Renderer" width="320" height="280"
               category="Render" description="3D scene rendering" icon="🎮">
  <node-body>
    <div class="title">🎮 3D Renderer</div>
    <div class="body">
      <!-- Canvas for 3D rendering -->
      <canvas data-draggable="false" style="cursor: grab; width: 100%; height: 120px; background: #000;"></canvas>
      
      <!-- Interactive controls -->
      <input type="range" data-draggable="false" min="0" max="100" value="50">
      <input type="color" data-draggable="false" value="#7c3aed">
      <select data-draggable="false">
        <option>Perspective</option>
        <option>Orthographic</option>
      </select>
      
      <!-- Textarea for shader code -->
      <textarea data-draggable="false" placeholder="Shader code..."></textarea>
      
      <!-- Buttons -->
      <button data-draggable="false">Render</button>
      <button data-draggable="false">Reset</button>
    </div>
  </node-body>
  <flow-input socket="scene" label="Scene" type="object"></flow-input>
  <flow-output socket="image" label="Image" type="image"></flow-output>
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

- ✅ **Comprehensive Event System** - Added node selection, movement, viewport, and edge events
- ✅ **Visual Selection Feedback** - Selected nodes and edges have distinct styling
- ✅ **Multi-selection Support** - Ctrl/Cmd+click for multiple node selection
- ✅ **Programmatic Control** - Full API for selection, movement, and viewport control
- ✅ **Context Menus** - Right-click menus for adding nodes and managing connections
- ✅ **Search Functionality** - Real-time search in node creation context menu
- ✅ **Clean Interactive Element System** - Replaced hardcoded lists with `data-draggable` attributes
- ✅ **Fixed input box typing functionality** - All form elements work properly
- ✅ **Improved panning** - Matches original POC behavior perfectly
- ✅ **Added proper Lit dependency management** - Via import maps for CDN usage
- ✅ **Enhanced node dragging** - Smart detection without hardcoding
- ✅ **Optimized viewport transforms** - Smooth interactions and edge updates
- ✅ **Updated edge styling** - Green color (#10b981) with reduced stroke width (2.5px)
- ✅ **Advanced 3D renderer example** - Shows arbitrary HTML content with full interactivity
- ✅ **Comprehensive Color Customization** - Full theming system with CSS custom properties
- ✅ **Enhanced Node Metadata** - Categories, descriptions, and icons for context menus
- ✅ **Fixed Coordinate System** - Proper handling of pan/zoom in context menu positioning
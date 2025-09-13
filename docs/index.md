# FlowGraph

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } **Quick Start**

    ---

    Get up and running with FlowGraph in minutes. Perfect for beginners.

    [:octicons-arrow-right-24: Quick Start](installation.md)

-   :material-puzzle:{ .lg .middle } **Components**

    ---

    Learn about all FlowGraph components and their attributes.

    [:octicons-arrow-right-24: Components](flow-graph.md)

-   :material-code-tags:{ .lg .middle } **API Reference**

    ---

    Complete API documentation for all methods and events.

    [:octicons-arrow-right-24: API Reference](api/flowgraph.md)

-   :material-palette:{ .lg .middle } **Customization**

    ---

    Customize themes, styles, and create your own nodes.

    [:octicons-arrow-right-24: Customization](theming.md)

</div>

---

## What is FlowGraph?

FlowGraph is a modern, HTML-based visual scripting library that lets you create interactive node-based graphs using simple HTML elements. Perfect for data flow programming, workflow design, and visual logic building.

<img width="1184" height="562" alt="Image" src="https://github.com/user-attachments/assets/f9e9b938-6f30-4ecb-b7b8-e1b4034e8857" />

### Key Features

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


**⚡ Async Execution** 

![Image](https://github.com/user-attachments/assets/09dcbc1e-54fa-4e4b-9ef1-03cac3c1d0a8)


## Quick Example

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

## Use Cases

FlowGraph is perfect for:

- **Data Flow Programming** - Visual data processing pipelines
- **Workflow Design** - Business process automation
- **Logic Building** - Visual programming interfaces
- **Node-based Editors** - Shader editors, audio processors
- **Educational Tools** - Interactive learning experiences
- **Prototyping** - Rapid visual prototyping

## Browser Support

- **Modern Browsers**: Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+
- **Required Features**: Custom Elements, ES6+, CSS Grid, SVG support

## Installation

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

**No additional dependencies required** - everything is bundled and ready to use!

## 🎮 Try the Live Demo

**Experience FlowGraph in action!** [Launch Interactive Demo →](demo.html)

---

## Getting Started

Ready to start building with FlowGraph? Check out our comprehensive guides:

1. **[Installation](installation.md)** - Get up and running in minutes
2. **[Basic Examples](basic-examples.md)** - Learn the fundamentals
3. **[Components](flow-graph.md)** - Learn about all available components
4. **[API Reference](api/flowgraph.md)** - Complete API documentation
5. **[Customization](theming.md)** - Customize themes and create custom nodes

## License

MIT License - see [LICENSE](https://github.com/sps014/visual-flow-graph/blob/main/LICENSE) file for details.

---

**FlowGraph** - Build interactive node-based graphs with HTML. No complex setup, no framework dependencies, just pure web standards.

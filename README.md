# Visual Flow Graph

A modern, HTML-based visual scripting library for creating interactive node-based graphs directly in the browser.

<img width="1184" height="562" alt="Image" src="https://github.com/user-attachments/assets/f9e9b938-6f30-4ecb-b7b8-e1b4034e8857" />


## Features

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

  
## ⚡ Async Execution
![Image](https://github.com/user-attachments/assets/09dcbc1e-54fa-4e4b-9ef1-03cac3c1d0a8)

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FlowGraph Quickstart</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    html, body {
      height: 100%; 
      margin: 0; 
      font-family: 'Inter', 'Roboto', system-ui, sans-serif; 
      color: #fff;
      overflow: hidden;
    }
    
    #app {
      position: relative; 
      height: 100vh; 
      width: 100vw; 
      overflow: hidden; 
      display: flex;
    }
  </style>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sps014/visual-flow-graph@main/published/flowgraph.css">
  <script type="module" src="https://cdn.jsdelivr.net/gh/sps014/visual-flow-graph@main/published/flowgraph.es.js"></script>
</head>
<body>
  <div id="app">
    <flow-graph theme="dark">
      <flow-definitions>
        <flow-node-def name="data.number" label="Number" width="160" height="100" onExecute="loadData">
          <node-body>
            <div class="title">🔢 Number</div>
            <div class="body">
              <input type="number" class="input-box" data-key="num:value" value="0" placeholder="Enter value">
              <flow-socket type="output" name="value" label="Value" data-type="number"></flow-socket>
            </div>
          </node-body>
        </flow-node-def>
      </flow-definitions>
      
      <flow-nodes>
        <flow-node type="data.number" id="n1" x="100" y="100"></flow-node>
      </flow-nodes>
    </flow-graph>
  </div>
  
  <script type="module">
    // Wait for custom elements to be defined
    await customElements.whenDefined('flow-graph');
    
    // Add execution handler for the number node
    window.loadData = async function(context) {
      console.log('🔢 Loading data for Number node:', context);
      
      // Use the new data binding system
      const value = parseInt(context.getData('num')) || 0;
      
      console.log('Number value:', value);
      
      // Set output value (index 0 for first output socket)
      context.setOutput(0, value);
    };
  </script>
</body>
</html>
```

## Documentation

📚 **[View Complete Documentation](https://sps014.github.io/visual-flow-graph/)**
🖍️ **[Live Demo](https://sps014.github.io/visual-flow-graph/demo.html)**

## Installation

### CDN (Recommended)
```html
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sps014/visual-flow-graph@main/published/flowgraph.css">
  <script type="module" src="https://cdn.jsdelivr.net/gh/sps014/visual-flow-graph@main/published/flowgraph.es.js"></script>
```

### Local Installation
1. Download from [Releases](https://github.com/sps014/visual-flow-graph/releases)
2. Include the files in your project:
```html
<link rel="stylesheet" href="dist/flowgraph.css">
<script type="module" src="dist/flowgraph.es.js"></script>
```

## Browser Support

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- 📖 [Documentation](https://sps014.github.io/visual-flow-graph/)
- 🐛 [Report Issues](https://github.com/sps014/visual-flow-graph/issues)
- 💬 [Discussions](https://github.com/sps014/visual-flow-graph/discussions)

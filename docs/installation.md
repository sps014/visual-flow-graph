# Installation

FlowGraph can be easily installed using CDN links. No build tools or frameworks required - just vanilla HTML, CSS, and JavaScript.

## CDN Installation (Recommended)

The easiest way to get started is using the bundled distribution from a CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My FlowGraph App</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgraph@latest/dist/flowgraph.css">
  <script type="module" src="https://cdn.jsdelivr.net/npm/flowgraph@latest/dist/flowgraph.es.js"></script>
</head>
<body>
  <flow-graph theme="dark">
    <!-- Your graph will go here -->
  </flow-graph>
</body>
</html>
```

### Specific Version

To use a specific version, replace `@latest` with the version number:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgraph@1.0.0/dist/flowgraph.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/flowgraph@1.0.0/dist/flowgraph.es.js"></script>
```

## Local Installation

### Download Release

1. Go to the [Releases page](https://github.com/sps014/visual-flow-graph/releases)
2. Download the latest release (e.g., `flowgraph-1.0.0.zip`)
3. Extract the files to your project directory
4. Include the CSS and JavaScript files:

```html
<link rel="stylesheet" href="dist/flowgraph.css">
<script type="module" src="dist/flowgraph.es.js"></script>
```

## Vanilla JavaScript Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/flowgraph.css">
  <script type="module" src="dist/flowgraph.es.js"></script>
</head>
<body>
  <flow-graph theme="dark">
    <!-- Your graph content -->
  </flow-graph>
  
  <script>
    // Wait for custom elements to be defined
    customElements.whenDefined('flow-graph').then(() => {
      const flowGraph = document.querySelector('flow-graph');
      // Your initialization code here
    });
  </script>
</body>
</html>
```

## Browser Support

FlowGraph requires modern browsers with support for:

- **Custom Elements** (Web Components)
- **ES6+** (Arrow functions, classes, modules)
- **CSS Grid** and **Flexbox**
- **SVG** support
- **CSS Custom Properties** (CSS Variables)

**Supported Browsers:**
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Requirements

FlowGraph has **no external dependencies** when using the bundled distribution. The `dist/flowgraph.es.js` file includes everything needed to run FlowGraph.

## File Structure

After installation, you'll have these files:

```
dist/
├── flowgraph.css          # Complete CSS with all themes
├── flowgraph.es.js        # ES6 module bundle
├── flowgraph.es.js.map    # Source map for debugging
└── flowgraph.umd.js       # UMD bundle (if available)
```
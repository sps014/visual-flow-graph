# Custom Nodes

Create custom nodes with unique styling and behavior.

## Basic Custom Node

```html
<flow-node-def name="custom.example" label="Custom Node" width="200" height="120" 
               category="Custom" icon="⭐" onExecute="customFunction">
  <node-body>
    <div class="title">⭐ Custom Node</div>
    <div class="body">
      <input type="text" data-key="text:value" placeholder="Enter text">
      <flow-socket type="input" name="input" label="Input"></flow-socket>
      <flow-socket type="output" name="output" label="Output"></flow-socket>
    </div>
  </node-body>
</flow-node-def>
```

## Custom Styling

```css
flow-node[type="custom.example"] {
  --node-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --node-border: #5a67d8;
  --node-text: #ffffff;
}

flow-node[type="custom.example"] .node-body {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

## Custom Shapes

```html
<flow-node-def name="custom.diamond" label="Diamond" width="100" height="100">
  <node-body>
    <div class="title">💎 Diamond</div>
    <div class="body">
      <flow-socket type="input" name="in" label="In"></flow-socket>
      <flow-socket type="output" name="out" label="Out"></flow-socket>
    </div>
  </node-body>
</flow-node-def>
```

```css
flow-node[type="custom.diamond"] .node-body {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  background: #ff6b6b;
}
```

## Execution Function

```javascript
function customFunction(context) {
  const input = context.getInput('input');
  const text = context.getData('text');
  
  const result = {
    input: input,
    text: text,
    timestamp: Date.now()
  };
  
  context.setOutput('output', result);
}
```

## Advanced Custom Node

```html
<flow-node-def name="custom.advanced" label="Advanced" width="250" height="180" 
               custom-class="advanced-node" onExecute="advancedFunction">
  <node-body>
    <div class="title">🚀 Advanced Node</div>
    <div class="body">
      <div class="controls">
        <label>Mode:</label>
        <select data-key="mode:selection">
          <option value="process">Process</option>
          <option value="transform">Transform</option>
        </select>
      </div>
      <div class="controls">
        <label>Count:</label>
        <input type="number" data-key="count:number" value="1" min="1" max="100">
      </div>
      <flow-socket type="input" name="data" label="Data"></flow-socket>
      <flow-socket type="output" name="result" label="Result"></flow-socket>
    </div>
  </node-body>
</flow-node-def>
```

```css
.advanced-node .node-body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #5a67d8;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.advanced-node .controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.advanced-node .controls label {
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

.advanced-node .controls input,
.advanced-node .controls select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
}
```
# Basic Examples

## Simple Calculator

```html
<flow-graph theme="dark" snap-to-grid grid-size="20">
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
    
    <flow-node-def name="data.watch" label="Watch" width="160" height="100" 
                   category="Data" icon="👁️" onExecute="watchValue">
      <node-body>
        <div class="title">👁️ Watch</div>
        <div class="body">
          <flow-socket type="input" name="value" label="Value" data-type="any"></flow-socket>
        </div>
      </node-body>
    </flow-node-def>
  </flow-definitions>
  
  <flow-nodes>
    <flow-node type="data.number" id="n1" x="100" y="100"></flow-node>
    <flow-node type="data.number" id="n2" x="100" y="250"></flow-node>
    <flow-node type="math.add" id="n3" x="350" y="175"></flow-node>
    <flow-node type="data.watch" id="n4" x="600" y="175"></flow-node>
  </flow-nodes>
  
  <flow-edges>
    <flow-edge from="n1:value" to="n3:a"></flow-edge>
    <flow-edge from="n2:value" to="n3:b"></flow-edge>
    <flow-edge from="n3:sum" to="n4:value"></flow-edge>
  </flow-edges>
</flow-graph>
```

## JavaScript Functions

```javascript
// Number input handler
function loadData(context) {
  const num = context.getData('num');
  context.setOutput('value', num.value);
}

// Addition handler
function addNumbers(context) {
  const a = context.getInput('a');
  const b = context.getInput('b');
  const sum = a + b;
  context.setOutput('sum', sum);
}

// Watch handler
function watchValue(context) {
  const value = context.getInput('value');
  console.log('Watched value:', value);
}
```

## Data Processing Pipeline

```html
<flow-graph theme="dark">
  <flow-definitions>
    <flow-node-def name="util.split" label="Split" width="160" height="100" 
                   category="Utility" icon="✂️" onExecute="splitValue">
      <node-body>
        <div class="title">✂️ Split</div>
        <div class="body">
          <flow-socket type="input" name="value" label="Value" data-type="any"></flow-socket>
          <div style="height:8px"></div>
          <flow-socket type="output" name="a" label="A" data-type="any"></flow-socket>
          <flow-socket type="output" name="b" label="B" data-type="any"></flow-socket>
        </div>
      </node-body>
    </flow-node-def>
    
    <flow-node-def name="render.3d" label="3D Render" width="180" height="120" 
                   category="Render" icon="🎮" onExecute="render3D">
      <node-body>
        <div class="title">🎮 3D Render</div>
        <div class="body">
          <flow-socket type="input" name="data" label="Data" data-type="any"></flow-socket>
          <div style="height:8px"></div>
          <flow-socket type="output" name="result" label="Result" data-type="any"></flow-socket>
        </div>
      </node-body>
    </flow-node-def>
  </flow-definitions>
  
  <flow-nodes>
    <flow-node type="util.split" id="split1" x="100" y="100"></flow-node>
    <flow-node type="render.3d" id="render1" x="300" y="50"></flow-node>
    <flow-node type="render.3d" id="render2" x="300" y="150"></flow-node>
  </flow-nodes>
  
  <flow-edges>
    <flow-edge from="split1:a" to="render1:data"></flow-edge>
    <flow-edge from="split1:b" to="render2:data"></flow-edge>
  </flow-edges>
</flow-graph>
```

## Custom Node with Styling

```html
<flow-node-def name="custom.minimal" label="Minimal" width="120" height="80" 
               category="Custom" icon="⚡" onExecute="minimalExample">
  <node-body>
    <div class="title">⚡ Minimal</div>
    <div class="body">
      <flow-socket type="input" name="in" label="In" data-type="any"></flow-socket>
      <flow-socket type="output" name="out" label="Out" data-type="any"></flow-socket>
    </div>
  </node-body>
</flow-node-def>
```

```css
/* Custom styling for minimal node */
flow-node[type="custom.minimal"] {
  --node-bg: #2a2a2a;
  --node-border: #444;
  --node-text: #fff;
}

flow-node[type="custom.minimal"] .node-body {
  padding: 8px;
  font-size: 12px;
}
```
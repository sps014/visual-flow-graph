# flow-node-def

Define node templates for creating node instances in the flow graph.

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | String | - | **Required.** Node type identifier |
| `label` | String | `name` | Display label |
| `width` | Number | `160` | Default node width |
| `height` | Number | `100` | Default node height |
| `category` | String | `"General"` | Category for context menus |
| `description` | String | `""` | Tooltip description |
| `icon` | String | `""` | Node icon |
| `onExecute` | String | - | Execution function name |
| `custom-class` | String | - | Custom CSS class |
| `color-bg` | String | - | Background color |
| `color-text` | String | - | Text color |

## Usage

```html
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
```

## Node Body Structure

The `<node-body>` element contains the visual content of the node:

- **Title**: Node title with icon
- **Body**: Main content area with inputs, outputs, and controls
- **Sockets**: Input/output connection points
- **Form Controls**: Input fields with `data-key` for data binding
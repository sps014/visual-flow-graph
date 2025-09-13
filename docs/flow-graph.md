# flow-graph

The main FlowGraph web component that provides the visual scripting interface.

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | String | `"dark"` | Visual theme (`"dark"` or `"light"`) |
| `snap-to-grid` | Boolean | `false` | Snap nodes to grid |
| `grid-size` | Number | `20` | Grid size for snapping |
| `zoom-min` | Number | `0.1` | Minimum zoom level |
| `zoom-max` | Number | `3` | Maximum zoom level |
| `default-zoom` | Number | `1` | Default zoom level |
| `readonly` | Boolean | `false` | Readonly mode |

## Usage

```html
<flow-graph theme="dark" snap-to-grid grid-size="20">
  <flow-definitions>
    <!-- Node definitions -->
  </flow-definitions>
  
  <flow-nodes>
    <!-- Node instances -->
  </flow-nodes>
  
  <flow-edges>
    <!-- Edge connections -->
  </flow-edges>
</flow-graph>
```

## Methods

| Method | Description |
|--------|-------------|
| `setReadonly(readonly)` | Enable/disable readonly mode |
| `toggleReadonly()` | Toggle readonly mode |

## Events

The flow-graph component emits all standard FlowGraph events. See [Events API](api/events.md) for complete list.
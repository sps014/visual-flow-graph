# flow-edge

Define connections between node sockets.

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `from` | String | - | **Required.** Source socket (`nodeId:socketName`) |
| `to` | String | - | **Required.** Target socket (`nodeId:socketName`) |
| `color` | String | - | Edge color |
| `width` | Number | `2` | Edge width |
| `style` | String | `"solid"` | Edge style (`"solid"`, `"dashed"`, `"dotted"`) |
| `custom-class` | String | - | Custom CSS class |

## Usage

```html
<flow-edges>
  <flow-edge from="node1:output" to="node2:input"></flow-edge>
  <flow-edge from="node2:result" to="node3:value" color="#ff6b6b" width="3"></flow-edge>
</flow-edges>
```

## Socket References

Socket references use the format `nodeId:socketName`:
- `nodeId`: The ID of the node containing the socket
- `socketName`: The name of the socket as defined in the node definition
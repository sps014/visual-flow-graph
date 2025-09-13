# FlowGraph API Reference

## FlowGraph Class

### Constructor
```javascript
new FlowGraph(container)
```

### Properties
| Property | Type | Description |
|----------|------|-------------|
| `container` | HTMLElement | Container element |
| `nodes` | Map<string, Node> | Node instances |
| `edges` | Map<string, Edge> | Edge instances |
| `readonly` | Boolean | Readonly mode |

## Node Management

### addNodeTemplate(name, template)
Add a node template.

### createNode(type, id, x, y)
Create a node instance.

### removeNode(id)
Remove a node.

### getNode(id)
Get a node by ID.

## Edge Management

### createEdge(from, to)
Create an edge between sockets.

### removeEdge(id)
Remove an edge.

### getEdge(id)
Get an edge by ID.

## Selection

### selectNode(id)
Select a node.

### selectEdge(id)
Select an edge.

### clearSelection()
Clear all selections.

### getSelectedNodes()
Get selected nodes.

### getSelectedEdges()
Get selected edges.

## Serialization

### serialize()
Serialize the graph to JSON.

### deserialize(data)
Deserialize JSON data to graph.

## Execution

### execute()
Execute the entire graph.

### executeNode(nodeId)
Execute a specific node.

## Readonly Mode

### setReadonly(readonly)
Enable/disable readonly mode.

### toggleReadonly()
Toggle readonly mode.

## Animation

### setAnimationConfig(config)
Configure animations.

### startAnimation(type, data)
Start an animation.

### stopAnimation(type)
Stop an animation.

## Events

FlowGraph extends EventTarget and emits events for all interactions. See [Events API](events.md) for complete list.
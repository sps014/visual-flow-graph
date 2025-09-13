# Events API

FlowGraph emits events for all user interactions and state changes.

## Node Events

| Event | Description | Data |
|-------|-------------|------|
| `node:create` | Node created | `{ nodeId, type, x, y }` |
| `node:select` | Node selected | `{ nodeId, node }` |
| `node:deselect` | Node deselected | `{ nodeId, node }` |
| `node:move` | Node moved | `{ nodeId, x, y }` |
| `node:delete` | Node deleted | `{ nodeId, node }` |

## Edge Events

| Event | Description | Data |
|-------|-------------|------|
| `edge:create` | Edge created | `{ edgeId, from, to }` |
| `edge:select` | Edge selected | `{ edgeId, edge }` |
| `edge:deselect` | Edge deselected | `{ edgeId, edge }` |
| `edge:delete` | Edge deleted | `{ edgeId, edge }` |
| `edge:connection:failed` | Connection attempt failed | `{ fromSocket, toSocket, reason }` |

## Viewport Events

| Event | Description | Data |
|-------|-------------|------|
| `viewport:pan` | Viewport panned | `{ x, y }` |
| `viewport:zoom` | Viewport zoomed | `{ zoom }` |
| `viewport:resize` | Viewport resized | `{ width, height }` |

## Execution Events

| Event | Description | Data |
|-------|-------------|------|
| `execution:start` | Execution started | `{}` |
| `execution:node-start` | Node execution started | `{ nodeId }` |
| `execution:node-complete` | Node execution completed | `{ nodeId, result }` |
| `execution:complete` | Execution completed | `{ results }` |
| `execution:error` | Execution error | `{ nodeId, error }` |

## Keyboard Events

| Event | Description | Data |
|-------|-------------|------|
| `keyboard:copy` | Copy shortcut pressed | `{}` |
| `keyboard:paste` | Paste shortcut pressed | `{}` |
| `keyboard:delete` | Delete shortcut pressed | `{}` |
| `keyboard:select-all` | Select all shortcut pressed | `{}` |

## Usage

```javascript
const flowGraph = document.querySelector('flow-graph');

flowGraph.addEventListener('node:create', (event) => {
  console.log('Node created:', event.detail);
});

flowGraph.addEventListener('execution:complete', (event) => {
  console.log('Execution completed:', event.detail.results);
});
```
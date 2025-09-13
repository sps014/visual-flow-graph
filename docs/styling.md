# Node Styling

Customize the appearance of nodes and their components.

## Node Body Structure

```html
<node-body>
  <div class="title">Node Title</div>
  <div class="body">
    <!-- Node content -->
  </div>
</node-body>
```

## CSS Classes

### Node Classes
| Class | Description |
|-------|-------------|
| `.node` | Base node container |
| `.node-body` | Node content area |
| `.title` | Node title section |
| `.body` | Node main content |

### Socket Classes
| Class | Description |
|-------|-------------|
| `.socket` | Base socket |
| `.socket-input` | Input socket |
| `.socket-output` | Output socket |
| `.socket-anchor` | Socket connection point |

## Custom Styling Examples

### Rounded Node
```css
flow-node[type="custom"] .node-body {
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Custom Socket Shapes
```css
flow-socket[shape="square"] .socket-anchor {
  border-radius: 4px;
}

flow-socket[shape="diamond"] .socket-anchor {
  transform: rotate(45deg);
  border-radius: 2px;
}
```

### Form Control Styling
```css
.node-body input[type="number"] {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
}
```

## Responsive Design

```css
@media (max-width: 768px) {
  .node-body {
    font-size: 12px;
    padding: 8px;
  }
  
  .socket {
    width: 16px;
    height: 16px;
  }
}
```
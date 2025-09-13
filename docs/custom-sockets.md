# Custom Sockets

Create custom socket shapes and styles for unique visual effects.

## Socket Shapes

### Circle (Default)
```html
<flow-socket type="input" name="input" shape="circle"></flow-socket>
```

### Square
```html
<flow-socket type="output" name="output" shape="square"></flow-socket>
```

### Diamond
```html
<flow-socket type="input" name="input" shape="diamond"></flow-socket>
```

### Triangle
```html
<flow-socket type="output" name="output" shape="triangle"></flow-socket>
```

## Custom Socket Styling

### Color and Size
```html
<flow-socket type="input" name="input" color="#ff6b6b" size="large"></flow-socket>
<flow-socket type="output" name="output" color="#4ecdc4" size="small"></flow-socket>
```

### Custom CSS Classes
```html
<flow-socket type="input" name="input" custom-class="my-socket"></flow-socket>
```

```css
.my-socket .socket-anchor {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

## Socket Sizes

| Size | Description |
|------|-------------|
| `small` | 8px diameter |
| `medium` | 12px diameter (default) |
| `large` | 16px diameter |

## Data Type Validation

```html
<flow-socket type="input" name="number" data-type="number"></flow-socket>
<flow-socket type="input" name="text" data-type="string"></flow-socket>
<flow-socket type="input" name="object" data-type="object"></flow-socket>
```

## Connection Limits

```html
<flow-socket type="input" name="single" max-connections="1"></flow-socket>
<flow-socket type="output" name="multiple" max-connections="5"></flow-socket>
```

## Custom Socket Shapes

### Heart Shape
```css
flow-socket[shape="heart"] .socket-anchor {
  width: 16px;
  height: 14px;
  background: #ff6b6b;
  transform: rotate(-45deg);
  border-radius: 8px 8px 0 0;
}

flow-socket[shape="heart"] .socket-anchor::before,
flow-socket[shape="heart"] .socket-anchor::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 12px;
  background: #ff6b6b;
  border-radius: 8px 8px 0 0;
  transform: rotate(45deg);
  transform-origin: 0 100%;
}

flow-socket[shape="heart"] .socket-anchor::before {
  left: 8px;
}

flow-socket[shape="heart"] .socket-anchor::after {
  left: 0;
  transform: rotate(-45deg);
  transform-origin: 100% 100%;
}
```

### Star Shape
```css
flow-socket[shape="star"] .socket-anchor {
  width: 16px;
  height: 16px;
  background: #ffd700;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
```
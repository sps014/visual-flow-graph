# Theming

FlowGraph supports comprehensive theming through CSS variables and custom styles.

## Built-in Themes

### Dark Theme (Default)
```html
<flow-graph theme="dark">
```

### Light Theme
```html
<flow-graph theme="light">
```

## CSS Variables

### Colors
```css
:root {
  --fg-bg: #1a1a1a;
  --fg-text: #ffffff;
  --fg-border: #333333;
  --fg-node-bg: #2a2a2a;
  --fg-socket-bg: #444444;
  --fg-selection: #007acc;
}
```

### Sizing
```css
:root {
  --fg-node-border-radius: 8px;
  --fg-socket-size: 12px;
  --fg-edge-width: 2px;
  --fg-grid-size: 20px;
}
```

### Animations
```css
:root {
  --fg-animation-speed: 1s;
  --fg-transition-speed: 0.2s;
}
```

## Custom Themes

Create custom themes by overriding CSS variables:

```css
flow-graph[theme="custom"] {
  --fg-bg: #f0f0f0;
  --fg-text: #333333;
  --fg-node-bg: #ffffff;
  --fg-socket-bg: #e0e0e0;
  --fg-selection: #ff6b6b;
}
```

## Node Styling

### Custom Node Colors
```html
<flow-node-def name="custom" color-bg="#ff6b6b" color-text="#ffffff">
```

### Custom CSS Classes
```html
<flow-node-def name="custom" custom-class="my-custom-node">
```

```css
.my-custom-node {
  border: 2px solid #ff6b6b;
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}
```
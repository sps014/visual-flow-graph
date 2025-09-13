# Animation API

FlowGraph provides visual feedback through animations during execution and interactions.

## Animation Types

### Flowing Animation
Shows data flow along edges.

```javascript
flowGraph.startAnimation('flowing', {
  from: 'node1:output',
  to: 'node2:input',
  duration: 1000
});
```

### Pulsing Animation
Highlights nodes during execution.

```javascript
flowGraph.startAnimation('pulsing', {
  nodeId: 'node1',
  duration: 500
});
```

### Data Flow Animation
Shows data values flowing through the graph.

```javascript
flowGraph.startAnimation('data-flow', {
  value: 'Hello World',
  from: 'node1:output',
  to: 'node2:input'
});
```

## Animation Configuration

### setAnimationConfig(config)
Configure global animation settings.

```javascript
flowGraph.setAnimationConfig({
  flowing: {
    color: '#00ff00',
    speed: 1.5,
    trailLength: 0.3
  },
  pulsing: {
    color: '#ff6b6b',
    intensity: 0.8
  }
});
```

### Animation Controls

```javascript
// Start animation
flowGraph.startAnimation(type, data);

// Stop animation
flowGraph.stopAnimation(type);

// Stop all animations
flowGraph.stopAllAnimations();
```

## CSS Animation Classes

| Class | Description |
|-------|-------------|
| `.flowing` | Edge flowing animation |
| `.pulsing` | Node pulsing animation |
| `.data-flow` | Data value animation |
| `.executing` | Node execution state |
| `.selected` | Selected element highlight |
/**
 * Manages the viewport transformations for the flow graph.
 * 
 * The Viewport handles panning, zooming, and coordinate transformations
 * for the flow graph interface. It provides smooth user interactions
 * and maintains the visual state of the graph.
 * 
 * @class Viewport
 * 
 * @example
 * ```javascript
 * const viewport = new Viewport(surface, contentContainer, flowGraph);
 * 
 * // Pan to a specific position
 * viewport.panTo(100, 200);
 * 
 * // Zoom to a specific scale
 * viewport.zoomTo(2.0);
 * ```
 */
export class Viewport {
  /**
   * Creates a new Viewport instance.
   * 
   * @param {HTMLElement} surface - The surface element for event handling
   * @param {HTMLElement} contentContainer - The container element to transform
   * @param {FlowGraph} [flowGraph=null] - The parent FlowGraph instance
   */
  constructor(surface, contentContainer, flowGraph = null) {
    /** @type {HTMLElement} The surface element for event handling */
    this.surface = surface;
    
    /** @type {HTMLElement} The container element to transform */
    this.contentContainer = contentContainer;
    
    /** @type {FlowGraph|null} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    /** @type {number} Current X position of the viewport */
    this.x = 0;
    
    /** @type {number} Current Y position of the viewport */
    this.y = 0;
    
    /** @type {number} Current zoom scale of the viewport */
    this.scale = 1;
    
    /** @type {number} Minimum allowed zoom scale */
    this.minScale = 0.1;
    
    /** @type {number} Maximum allowed zoom scale */
    this.maxScale = 3;
    
    // Pan state - matching original lib.js
    /** @type {Object} Internal state for panning operations */
    this.panState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      startViewportX: 0,
      startViewportY: 0
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Pan controls - similar to original lib.js implementation
    this.surface.addEventListener('pointerdown', (e) => {
      // Only start panning if not clicking on a node or socket
      const isNode = e.target.closest('.node');
      const isSocket = e.target.classList.contains('socket');
      
      // Don't start panning on right-click (button 2)
      if (e.button === 2) {
        return;
      }
      
      if (!isNode && !isSocket) {
        this.startPan(e);
      }
    });
    
    // Zoom with wheel
    this.surface.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  
  /**
   * Start panning operation - based on original lib.js implementation
   */
  startPan(e) {
    this.panState.isPanning = true;
    this.panState.startX = e.clientX;
    this.panState.startY = e.clientY;
    this.panState.startViewportX = this.x;
    this.panState.startViewportY = this.y;
    
    this.surface.setPointerCapture(e.pointerId);
    this.surface.style.cursor = 'grabbing';
    
    const onPointerMove = (e) => {
      if (this.panState.isPanning) {
        const deltaX = e.clientX - this.panState.startX;
        const deltaY = e.clientY - this.panState.startY;
        const newX = this.panState.startViewportX + deltaX;
        const newY = this.panState.startViewportY + deltaY;
        
        // Use panBy to fire events
        this.panBy(newX - this.x, newY - this.y);
      }
    };
    
    const onPointerUp = (e) => {
      this.panState.isPanning = false;
      this.surface.style.cursor = '';
      this.surface.releasePointerCapture(e.pointerId);
      this.surface.removeEventListener('pointermove', onPointerMove);
      this.surface.removeEventListener('pointerup', onPointerUp);
      
      // Fire pan event at the end of panning
      if (this.flowGraph) {
        // Dispatch on the container element, not the FlowGraph instance
        this.flowGraph.container.dispatchEvent(new CustomEvent('viewport:pan', {
          detail: { x: this.x, y: this.y, scale: this.scale }
        }));
      }
    };
    
    this.surface.addEventListener('pointermove', onPointerMove);
    this.surface.addEventListener('pointerup', onPointerUp);
  }
  
  handleWheel(e) {
    e.preventDefault();
    
    const rect = this.surface.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoomAt(centerX, centerY, scaleFactor);
  }
  
  handleKeyDown(e) {
    if (e.code === 'Space') {
      this.spacePressed = true;
      e.preventDefault();
    }
    
    // Only handle if we have a flowGraph
    if (!this.flowGraph) return;
    
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'a':
          e.preventDefault();
          this.flowGraph.selectAllNodes();
          break;
        case 'c':
          e.preventDefault();
          this.flowGraph.copySelectedNodes();
          break;
        case 'v':
          e.preventDefault();
          this.flowGraph.pasteNodes();
          break;
      }
    }
    
    switch (e.key) {
      case 'Delete':
        e.preventDefault();
        this.flowGraph.deleteSelectedNodes();
        break;
      case 'Escape':
        e.preventDefault();
        this.flowGraph.clearSelection();
        break;
    }
  }
  
  handleKeyUp(e) {
    if (e.code === 'Space') {
      this.spacePressed = false;
    }
  }
  
  panBy(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;
    this.updateTransform();
  }
  
  zoomAt(centerX, centerY, scaleFactor) {
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * scaleFactor));
    
    if (newScale !== this.scale) {
      // Adjust position to zoom towards the center point
      const scaleRatio = newScale / this.scale;
      this.x = centerX - (centerX - this.x) * scaleRatio;
      this.y = centerY - (centerY - this.y) * scaleRatio;
      this.scale = newScale;
      
      this.updateTransform();
      
      // Fire zoom event
      if (this.flowGraph) {
        // Dispatch on the container element, not the FlowGraph instance
        this.flowGraph.container.dispatchEvent(new CustomEvent('viewport:zoom', {
          detail: { scale: this.scale, x: this.x, y: this.y }
        }));
      }
    }
  }
  
  updateTransform() {
    // Apply transform to content container, not surface (like original lib.js)
    const transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    this.contentContainer.style.transform = transform;
    
    // Update grid background position on the flow-graph element using CSS variables
    const flowGraphElement = this.flowGraph.container;
    const computedStyle = getComputedStyle(flowGraphElement);
    const gridSize = parseInt(computedStyle.getPropertyValue('--fg-grid-main-size')) || 50;
    const minorGridSize = parseInt(computedStyle.getPropertyValue('--fg-grid-minor-size')) || 10;
    
    flowGraphElement.style.backgroundPosition = 
      `${this.x % gridSize}px ${this.y % gridSize}px, ` +
      `${this.x % gridSize}px ${this.y % gridSize}px, ` +
      `${this.x % minorGridSize}px ${this.y % minorGridSize}px, ` +
      `${this.x % minorGridSize}px ${this.y % minorGridSize}px`;
    
    // Fire viewport change event
    if (this.flowGraph) {
      // Dispatch on the container element, not the FlowGraph instance
      this.flowGraph.container.dispatchEvent(new CustomEvent('viewport:change', {
        detail: { 
          x: this.x, 
          y: this.y, 
          scale: this.scale 
        }
      }));
    }
  }
  
  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.x) / this.scale,
      y: (screenY - this.y) / this.scale
    };
  }
  
  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.scale + this.x,
      y: worldY * this.scale + this.y
    };
  }
  
  fitToContent() {
    // Implementation for fitting viewport to show all nodes
    // This would calculate bounds of all nodes and adjust viewport
  }
  
  resetZoom() {
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.updateTransform();
  }
  
  serialize() {
    return {
      x: this.x,
      y: this.y,
      scale: this.scale
    };
  }
  
  deserialize(data) {
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.scale = data.scale || 1;
    this.updateTransform();
  }
}

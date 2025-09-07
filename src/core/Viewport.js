export class Viewport {
  constructor(surface, contentContainer, flowGraph = null) {
    this.surface = surface;
    this.contentContainer = contentContainer;
    this.flowGraph = flowGraph;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.minScale = 0.1;
    this.maxScale = 3;
    
    // Pan state - matching original lib.js
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
        this.x = this.panState.startViewportX + deltaX;
        this.y = this.panState.startViewportY + deltaY;
        this.updateTransform();
      }
    };
    
    const onPointerUp = (e) => {
      this.panState.isPanning = false;
      this.surface.style.cursor = '';
      this.surface.releasePointerCapture(e.pointerId);
      this.surface.removeEventListener('pointermove', onPointerMove);
      this.surface.removeEventListener('pointerup', onPointerUp);
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
    }
  }
  
  updateTransform() {
    // Apply transform to content container, not surface (like original lib.js)
    const transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    this.contentContainer.style.transform = transform;
    
    // Update grid background position on the surface
    const gridSize = 50;
    const minorGridSize = 10;
    this.surface.style.backgroundPosition = 
      `${this.x % gridSize}px ${this.y % gridSize}px, ` +
      `${this.x % gridSize}px ${this.y % gridSize}px, ` +
      `${this.x % minorGridSize}px ${this.y % minorGridSize}px, ` +
      `${this.x % minorGridSize}px ${this.y % minorGridSize}px`;
    
    // Fire viewport change event
    if (this.flowGraph) {
      this.flowGraph.dispatchEvent(new CustomEvent('viewport:change', {
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

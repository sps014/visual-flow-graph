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
    
    // Cache grid sizes to avoid getComputedStyle on every pan
    /** @type {Object} Cached grid sizes */
    this.gridCache = {
      gridSize: 50,
      minorGridSize: 10,
      initialized: false
    };
    
    // Pan state - matching original lib.js
    /** @type {Object} Internal state for panning operations */
    this.panState = {
      isPanning: false,
      startX: 0,
      startY: 0,
      startViewportX: 0,
      startViewportY: 0
    };
    
    // Touch gesture state for mobile support
    /** @type {Object} Internal state for touch gestures */
    this.touchState = {
      isPinching: false,
      initialDistance: 0,
      initialScale: 1,
      initialCenterX: 0,
      initialCenterY: 0,
      initialViewportX: 0,
      initialViewportY: 0,
      lastTouches: [],
      lastTapTime: 0,
      lastTapX: 0,
      lastTapY: 0
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Pan controls - similar to original lib.js implementation
    this.surface.addEventListener('mousedown', (e) => {
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
    
    // Add touch event listeners for better mobile support
    this.surface.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.surface.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.surface.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
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
    
    this.surface.style.cursor = 'grabbing';
    
    const onMouseMove = (e) => {
      if (this.panState.isPanning) {
        const deltaX = e.clientX - this.panState.startX;
        const deltaY = e.clientY - this.panState.startY;
        const newX = this.panState.startViewportX + deltaX;
        const newY = this.panState.startViewportY + deltaY;
        
        // Use panBy to fire events
        this.panBy(newX - this.x, newY - this.y);
      }
    };
    
    const onMouseUp = (e) => {
      this.panState.isPanning = false;
      this.surface.style.cursor = '';
      this.surface.removeEventListener('mousemove', onMouseMove);
      this.surface.removeEventListener('mouseup', onMouseUp);
      
      // Fire pan event at the end of panning
      if (this.flowGraph) {
        // Dispatch on the container element, not the FlowGraph instance
        this.flowGraph.container.dispatchEvent(new CustomEvent('viewport:pan', {
          detail: { x: this.x, y: this.y, scale: this.scale }
        }));
      }
    };
    
    this.surface.addEventListener('mousemove', onMouseMove);
    this.surface.addEventListener('mouseup', onMouseUp);
  }
  
  handleWheel(e) {
    e.preventDefault();
    
    const rect = this.surface.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    this.zoomAt(centerX, centerY, scaleFactor);
  }
  
  /**
   * Handle touch start for panning and gestures
   */
  handleTouchStart(e) {
    this.touchState.lastTouches = Array.from(e.touches);
    
    if (e.touches.length === 1) {
      // Single touch - check for double tap or start panning
      const touch = e.touches[0];
      const isNode = touch.target.closest('.node');
      const isSocket = touch.target.classList.contains('socket');
      
      if (!isNode && !isSocket) {
        // Check for double tap
        const currentTime = Date.now();
        const timeDiff = currentTime - this.touchState.lastTapTime;
        const distance = Math.sqrt(
          Math.pow(touch.clientX - this.touchState.lastTapX, 2) + 
          Math.pow(touch.clientY - this.touchState.lastTapY, 2)
        );
        
        if (timeDiff < 300 && distance < 50) {
          // Double tap detected - zoom in/out
          this.handleDoubleTap(touch);
        } else {
          // Single tap - start panning
          this.startPan(touch);
        }
        
        // Update tap tracking
        this.touchState.lastTapTime = currentTime;
        this.touchState.lastTapX = touch.clientX;
        this.touchState.lastTapY = touch.clientY;
      }
    } else if (e.touches.length === 2) {
      // Two touches - start pinch zoom
      this.startPinchZoom(e);
    }
  }
  
  /**
   * Handle touch move for panning and gestures
   */
  handleTouchMove(e) {
    this.touchState.lastTouches = Array.from(e.touches);
    
    if (e.touches.length === 1 && this.panState.isPanning) {
      // Single touch panning
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.panState.startX;
      const deltaY = touch.clientY - this.panState.startY;
      const newX = this.panState.startViewportX + deltaX;
      const newY = this.panState.startViewportY + deltaY;
      
      this.panBy(newX - this.x, newY - this.y);
      e.preventDefault();
    } else if (e.touches.length === 2 && this.touchState.isPinching) {
      // Two finger pinch zoom
      this.updatePinchZoom(e);
      e.preventDefault();
    }
  }
  
  /**
   * Handle touch end for panning and gestures
   */
  handleTouchEnd(e) {
    if (e.touches.length === 0) {
      // All touches ended
      if (this.panState.isPanning) {
        this.panState.isPanning = false;
        this.surface.style.cursor = '';
        
        // Fire pan event at the end of panning
        if (this.flowGraph) {
          this.flowGraph.container.dispatchEvent(new CustomEvent('viewport:pan', {
            detail: { x: this.x, y: this.y, scale: this.scale }
          }));
        }
      }
      
      if (this.touchState.isPinching) {
        this.touchState.isPinching = false;
        
        // Fire zoom event at the end of pinch zoom
        if (this.flowGraph) {
          this.flowGraph.container.dispatchEvent(new CustomEvent('viewport:zoom', {
            detail: { x: this.x, y: this.y, scale: this.scale }
          }));
        }
      }
    } else if (e.touches.length === 1 && this.touchState.isPinching) {
      // Pinch zoom ended, switch to single touch panning
      this.touchState.isPinching = false;
      const touch = e.touches[0];
      const isNode = touch.target.closest('.node');
      const isSocket = touch.target.classList.contains('socket');
      
      if (!isNode && !isSocket) {
        this.startPan(touch);
      }
    }
  }
  
  /**
   * Handle double tap gesture
   */
  handleDoubleTap(touch) {
    const rect = this.surface.getBoundingClientRect();
    const centerX = touch.clientX - rect.left;
    const centerY = touch.clientY - rect.top;
    
    // Toggle between zoomed in and zoomed out
    if (this.scale > 1.5) {
      // Zoom out to fit
      this.zoomTo(1, centerX, centerY);
    } else {
      // Zoom in
      this.zoomTo(2, centerX, centerY);
    }
  }
  
  /**
   * Start pinch zoom gesture
   */
  startPinchZoom(e) {
    if (e.touches.length !== 2) return;
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    // Calculate initial distance between touches
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    // Calculate center point
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    // Store initial state
    this.touchState.isPinching = true;
    this.touchState.initialDistance = distance;
    this.touchState.initialScale = this.scale;
    this.touchState.initialCenterX = centerX;
    this.touchState.initialCenterY = centerY;
    this.touchState.initialViewportX = this.x;
    this.touchState.initialViewportY = this.y;
    
    // Stop any ongoing panning
    this.panState.isPanning = false;
  }
  
  /**
   * Update pinch zoom gesture
   */
  updatePinchZoom(e) {
    if (e.touches.length !== 2 || !this.touchState.isPinching) return;
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    // Calculate current distance between touches
    const currentDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    // Calculate scale factor
    const scaleFactor = currentDistance / this.touchState.initialDistance;
    const newScale = this.touchState.initialScale * scaleFactor;
    
    // Clamp scale to limits
    const clampedScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
    
    // Calculate center point
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    // Convert screen coordinates to world coordinates
    const rect = this.surface.getBoundingClientRect();
    const worldX = (centerX - rect.left - this.touchState.initialViewportX) / this.touchState.initialScale;
    const worldY = (centerY - rect.top - this.touchState.initialViewportY) / this.touchState.initialScale;
    
    // Calculate new viewport position to keep the pinch center point stable
    const newX = centerX - rect.left - worldX * clampedScale;
    const newY = centerY - rect.top - worldY * clampedScale;
    
    // Apply the zoom
    this.zoomTo(clampedScale, centerX - rect.left, centerY - rect.top);
  }
  
  /**
   * Calculate distance between two touch points
   */
  getTouchDistance(touch1, touch2) {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }
  
  /**
   * Calculate center point between two touches
   */
  getTouchCenter(touch1, touch2) {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
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
        // Also cancel any active connection
        if (this.flowGraph.connections) {
          this.flowGraph.connections.cancelConnection();
        }
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
  
  /**
   * Zoom to a specific scale at a given center point
   * @param {number} targetScale - The target zoom scale
   * @param {number} centerX - X coordinate of the zoom center
   * @param {number} centerY - Y coordinate of the zoom center
   */
  zoomTo(targetScale, centerX, centerY) {
    const clampedScale = Math.max(this.minScale, Math.min(this.maxScale, targetScale));
    const scaleFactor = clampedScale / this.scale;
    this.zoomAt(centerX, centerY, scaleFactor);
  }
  
  updateTransform() {
    // Apply transform to content container, not surface (like original lib.js)
    const transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    this.contentContainer.style.transform = transform;
    
    // Initialize grid cache on first use or periodically validate (every ~100 transforms)
    if (this.flowGraph) {
      const flowGraphElement = this.flowGraph.container;
      
      // Auto-detect grid size changes by periodically re-checking (low overhead)
      if (!this.gridCache.initialized || 
          (this.gridCache.checkCounter === undefined || ++this.gridCache.checkCounter > 100)) {
        
        const computedStyle = getComputedStyle(flowGraphElement);
        const newGridSize = parseInt(computedStyle.getPropertyValue('--fg-grid-main-size')) || 50;
        const newMinorGridSize = parseInt(computedStyle.getPropertyValue('--fg-grid-minor-size')) || 10;
        
        // Only update if values changed (or first init)
        if (!this.gridCache.initialized || 
            this.gridCache.gridSize !== newGridSize || 
            this.gridCache.minorGridSize !== newMinorGridSize) {
          this.gridCache.gridSize = newGridSize;
          this.gridCache.minorGridSize = newMinorGridSize;
          this.gridCache.initialized = true;
        }
        
        this.gridCache.checkCounter = 0;
      }
      
      // Use cached values for fast background position updates
      const gridSize = this.gridCache.gridSize;
      const minorGridSize = this.gridCache.minorGridSize;
      
      flowGraphElement.style.backgroundPosition = 
        `${this.x % gridSize}px ${this.y % gridSize}px, ` +
        `${this.x % gridSize}px ${this.y % gridSize}px, ` +
        `${this.x % minorGridSize}px ${this.y % minorGridSize}px, ` +
        `${this.x % minorGridSize}px ${this.y % minorGridSize}px`;
      
      // Fire viewport change event
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
  
  /**
   * Clear the grid size cache and force immediate re-read.
   * Normally not needed as grid sizes are auto-detected, but can be used
   * to force immediate update instead of waiting for the next periodic check.
   * 
   * @example
   * ```javascript
   * // Change grid size
   * flowGraph.container.style.setProperty('--fg-grid-main-size', '100px');
   * 
   * // Optional: Force immediate update (auto-detects within ~100 transforms anyway)
   * flowGraph.viewport.clearGridCache();
   * ```
   */
  clearGridCache() {
    this.gridCache.checkCounter = 101; // Force check on next updateTransform
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

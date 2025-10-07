/**
 * SpatialGrid - Ultra-fast spatial indexing for socket lookups
 * 
 * This class implements a 2D spatial hash grid that provides O(1) socket lookups
 * by position. Much faster than document.elementFromPoint() for real-time interaction.
 * 
 * @class SpatialGrid
 * 
 * @example
 * ```javascript
 * const grid = new SpatialGrid(50); // 50px cell size
 * 
 * // Insert sockets
 * grid.insert(socket, x, y);
 * 
 * // Ultra-fast lookup O(1)
 * const socket = grid.findAt(mouseX, mouseY, tolerance);
 * 
 * // Update socket position
 * grid.update(socket, newX, newY);
 * 
 * // Remove socket
 * grid.remove(socket);
 * ```
 */
export class SpatialGrid {
  /**
   * Creates a new SpatialGrid instance.
   * 
   * @param {number} [cellSize=50] - Size of each grid cell in pixels
   */
  constructor(cellSize = 50) {
    /** @type {number} Size of each grid cell */
    this.cellSize = cellSize;
    
    /** @type {Map<string, Set<Object>>} Grid cells containing socket references */
    this.grid = new Map();
    
    /** @type {Map<Object, Object>} Socket positions for quick updates */
    this.socketPositions = new Map();
    
    /** @type {number} Total number of sockets in the grid */
    this.socketCount = 0;
  }

  /**
   * Get grid cell key for a position.
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {string} Grid cell key
   * @private
   */
  getCellKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  /**
   * Get all cell keys that overlap with a circle (for tolerance radius).
   * 
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {number} radius - Search radius
   * @returns {string[]} Array of cell keys to check
   * @private
   */
  getCellKeysInRadius(x, y, radius) {
    const minCellX = Math.floor((x - radius) / this.cellSize);
    const maxCellX = Math.floor((x + radius) / this.cellSize);
    const minCellY = Math.floor((y - radius) / this.cellSize);
    const maxCellY = Math.floor((y + radius) / this.cellSize);
    
    const keys = [];
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        keys.push(`${cellX},${cellY}`);
      }
    }
    
    return keys;
  }

  /**
   * Insert a socket into the grid.
   * 
   * @param {Object} socket - Socket object with position data
   * @param {number} x - X coordinate in world space
   * @param {number} y - Y coordinate in world space
   * @public
   */
  insert(socket, x, y) {
    // Remove from old position if exists
    if (this.socketPositions.has(socket)) {
      this.remove(socket);
    }
    
    const cellKey = this.getCellKey(x, y);
    
    // Get or create cell
    if (!this.grid.has(cellKey)) {
      this.grid.set(cellKey, new Set());
    }
    
    // Add socket to cell
    this.grid.get(cellKey).add(socket);
    
    // Store position for quick updates
    this.socketPositions.set(socket, { x, y, cellKey });
    
    this.socketCount++;
  }

  /**
   * Update socket position in the grid.
   * More efficient than remove + insert if socket stays in same cell.
   * 
   * @param {Object} socket - Socket object
   * @param {number} newX - New X coordinate
   * @param {number} newY - New Y coordinate
   * @public
   */
  update(socket, newX, newY) {
    const oldData = this.socketPositions.get(socket);
    
    if (!oldData) {
      // Socket not in grid, insert it
      this.insert(socket, newX, newY);
      return;
    }
    
    const newCellKey = this.getCellKey(newX, newY);
    
    // If same cell, just update position (fast path)
    if (oldData.cellKey === newCellKey) {
      oldData.x = newX;
      oldData.y = newY;
      return;
    }
    
    // Different cell, need to move
    // Remove from old cell
    const oldCell = this.grid.get(oldData.cellKey);
    if (oldCell) {
      oldCell.delete(socket);
      if (oldCell.size === 0) {
        this.grid.delete(oldData.cellKey);
      }
    }
    
    // Add to new cell
    if (!this.grid.has(newCellKey)) {
      this.grid.set(newCellKey, new Set());
    }
    this.grid.get(newCellKey).add(socket);
    
    // Update stored position
    oldData.x = newX;
    oldData.y = newY;
    oldData.cellKey = newCellKey;
  }

  /**
   * Remove socket from the grid.
   * 
   * @param {Object} socket - Socket object to remove
   * @returns {boolean} True if socket was found and removed
   * @public
   */
  remove(socket) {
    const data = this.socketPositions.get(socket);
    
    if (!data) {
      return false;
    }
    
    // Remove from cell
    const cell = this.grid.get(data.cellKey);
    if (cell) {
      cell.delete(socket);
      if (cell.size === 0) {
        this.grid.delete(data.cellKey);
      }
    }
    
    // Remove position data
    this.socketPositions.delete(socket);
    
    this.socketCount--;
    return true;
  }

  /**
   * Find the closest socket at a position within tolerance.
   * ULTRA-FAST: O(1) lookup using spatial hash.
   * 
   * @param {number} x - X coordinate in world space
   * @param {number} y - Y coordinate in world space
   * @param {number} [tolerance=20] - Maximum distance for detection
   * @returns {Object|null} Closest socket within tolerance, or null
   * @public
   */
  findAt(x, y, tolerance = 20) {
    // Get cells that overlap with search radius
    const cellKeys = this.getCellKeysInRadius(x, y, tolerance);
    
    let closestSocket = null;
    let closestDistance = tolerance;
    
    // Check sockets in nearby cells
    for (const cellKey of cellKeys) {
      const cell = this.grid.get(cellKey);
      if (!cell) continue;
      
      for (const socket of cell) {
        const data = this.socketPositions.get(socket);
        if (!data) continue;
        
        // Calculate distance
        const dx = data.x - x;
        const dy = data.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSocket = socket;
        }
      }
    }
    
    return closestSocket;
  }

  /**
   * Find all sockets within a rectangular area.
   * 
   * @param {number} minX - Minimum X coordinate
   * @param {number} minY - Minimum Y coordinate
   * @param {number} maxX - Maximum X coordinate
   * @param {number} maxY - Maximum Y coordinate
   * @returns {Object[]} Array of sockets in the area
   * @public
   */
  findInRect(minX, minY, maxX, maxY) {
    const minCellX = Math.floor(minX / this.cellSize);
    const maxCellX = Math.floor(maxX / this.cellSize);
    const minCellY = Math.floor(minY / this.cellSize);
    const maxCellY = Math.floor(maxY / this.cellSize);
    
    const results = new Set();
    
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const cellKey = `${cellX},${cellY}`;
        const cell = this.grid.get(cellKey);
        
        if (cell) {
          for (const socket of cell) {
            const data = this.socketPositions.get(socket);
            if (data && data.x >= minX && data.x <= maxX && 
                data.y >= minY && data.y <= maxY) {
              results.add(socket);
            }
          }
        }
      }
    }
    
    return Array.from(results);
  }

  /**
   * Clear all sockets from the grid.
   * 
   * @public
   */
  clear() {
    this.grid.clear();
    this.socketPositions.clear();
    this.socketCount = 0;
  }

  /**
   * Rebuild the entire grid from scratch.
   * Call this after major viewport changes or bulk node operations.
   * 
   * @param {Object[]} sockets - Array of socket objects with positions
   * @param {Function} getPositionFn - Function to get position: (socket) => {x, y}
   * @public
   */
  rebuild(sockets, getPositionFn) {
    this.clear();
    
    for (const socket of sockets) {
      const pos = getPositionFn(socket);
      if (pos) {
        this.insert(socket, pos.x, pos.y);
      }
    }
  }

  /**
   * Get statistics about the grid (for debugging/optimization).
   * 
   * @returns {Object} Statistics object
   * @public
   */
  getStats() {
    const cellsUsed = this.grid.size;
    let minSocketsPerCell = Infinity;
    let maxSocketsPerCell = 0;
    let totalSockets = 0;
    
    for (const cell of this.grid.values()) {
      const size = cell.size;
      totalSockets += size;
      minSocketsPerCell = Math.min(minSocketsPerCell, size);
      maxSocketsPerCell = Math.max(maxSocketsPerCell, size);
    }
    
    const avgSocketsPerCell = cellsUsed > 0 ? totalSockets / cellsUsed : 0;
    
    return {
      cellSize: this.cellSize,
      cellsUsed,
      totalSockets: this.socketCount,
      socketsIndexed: totalSockets,
      avgSocketsPerCell: avgSocketsPerCell.toFixed(2),
      minSocketsPerCell: minSocketsPerCell === Infinity ? 0 : minSocketsPerCell,
      maxSocketsPerCell,
      memoryEstimate: `~${((cellsUsed * 50 + totalSockets * 40) / 1024).toFixed(1)} KB`
    };
  }

  /**
   * Visualize grid for debugging (adds overlay to DOM).
   * 
   * @param {HTMLElement} container - Container element to add visualization to
   * @public
   */
  visualize(container) {
    // Remove existing visualization
    const existing = container.querySelector('.spatial-grid-debug');
    if (existing) existing.remove();
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('spatial-grid-debug');
    svg.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.3;
    `;
    
    // Draw grid cells that have sockets
    for (const [cellKey, cell] of this.grid) {
      const [cellX, cellY] = cellKey.split(',').map(Number);
      const x = cellX * this.cellSize;
      const y = cellY * this.cellSize;
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', this.cellSize);
      rect.setAttribute('height', this.cellSize);
      rect.setAttribute('fill', 'rgba(0, 255, 0, 0.1)');
      rect.setAttribute('stroke', 'rgba(0, 255, 0, 0.5)');
      rect.setAttribute('stroke-width', '1');
      
      svg.appendChild(rect);
      
      // Draw socket count in cell
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x + this.cellSize / 2);
      text.setAttribute('y', y + this.cellSize / 2);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', 'lime');
      text.setAttribute('font-size', '12');
      text.textContent = cell.size;
      
      svg.appendChild(text);
    }
    
    container.appendChild(svg);
  }
}

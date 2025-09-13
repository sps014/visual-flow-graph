/**
 * DOMBatcher - Batches DOM operations for better performance
 * 
 * This class implements DOM batching to reduce reflow/repaint cycles
 * by collecting DOM operations and executing them in batches.
 * 
 * @class DOMBatcher
 * 
 * @example
 * ```javascript
 * const batcher = new DOMBatcher();
 * 
 * // Schedule DOM operations
 * batcher.schedule('update', () => {
 *   element.style.left = '100px';
 *   element.style.top = '200px';
 * });
 * 
 * // Flush all pending operations
 * batcher.flush();
 * ```
 */
export class DOMBatcher {
  /**
   * Creates a new DOMBatcher instance.
   */
  constructor() {
    /** @type {Map<string, Array<Function>>} Map of operation types to function arrays */
    this.operations = new Map();
    
    /** @type {Set<HTMLElement>} Set of elements scheduled for deletion */
    this.pendingDeletions = new Set();
    
    /** @type {boolean} Whether a flush is already scheduled */
    this.flushScheduled = false;
    
    /** @type {number} RAF ID for scheduled flush */
    this.rafId = null;
  }

  /**
   * Schedule a DOM operation for batching.
   * 
   * @param {string} type - The type of operation (e.g., 'update', 'delete')
   * @param {Function} operation - The DOM operation to perform
   */
  schedule(type, operation) {
    if (!this.operations.has(type)) {
      this.operations.set(type, []);
    }
    
    this.operations.get(type).push(operation);
    
    // Schedule flush if not already scheduled
    if (!this.flushScheduled) {
      this.scheduleFlush();
    }
  }

  /**
   * Schedule a node for deletion.
   * 
   * @param {HTMLElement} element - The element to delete
   */
  scheduleNodeDelete(element) {
    if (element && element.parentNode) {
      this.pendingDeletions.add(element);
      
      // Schedule flush if not already scheduled
      if (!this.flushScheduled) {
        this.scheduleFlush();
      }
    }
  }

  /**
   * Schedule a flush operation using requestAnimationFrame.
   * 
   * @private
   */
  scheduleFlush() {
    if (this.flushScheduled) return;
    
    this.flushScheduled = true;
    this.rafId = requestAnimationFrame(() => {
      this.flush();
    });
  }

  /**
   * Execute all pending DOM operations in batches.
   * 
   * @public
   */
  flush() {
    this.flushScheduled = false;
    this.rafId = null;
    
    // Execute operations by type for better batching
    const operationTypes = ['update', 'delete', 'create', 'modify'];
    
    operationTypes.forEach(type => {
      const operations = this.operations.get(type);
      if (operations && operations.length > 0) {
        // Execute all operations of this type
        operations.forEach(operation => {
          try {
            operation();
          } catch (error) {
            console.warn('Error in DOM operation:', error);
          }
        });
        
        // Clear the operations array
        operations.length = 0;
      }
    });
    
    // Handle pending deletions
    if (this.pendingDeletions.size > 0) {
      this.pendingDeletions.forEach(element => {
        try {
          if (element && element.parentNode) {
            element.remove();
          }
        } catch (error) {
          console.warn('Error removing element:', error);
        }
      });
      
      this.pendingDeletions.clear();
    }
  }

  /**
   * Cancel any pending flush operations.
   * 
   * @public
   */
  cancel() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.flushScheduled = false;
  }

  /**
   * Clear all pending operations without executing them.
   * 
   * @public
   */
  clear() {
    this.cancel();
    
    // Clear all operations
    this.operations.forEach(operations => {
      operations.length = 0;
    });
    this.operations.clear();
    
    // Clear pending deletions
    this.pendingDeletions.clear();
  }

  /**
   * Get the number of pending operations.
   * 
   * @returns {number} Total number of pending operations
   * @public
   */
  getPendingCount() {
    let total = 0;
    this.operations.forEach(operations => {
      total += operations.length;
    });
    total += this.pendingDeletions.size;
    return total;
  }

  /**
   * Check if there are any pending operations.
   * 
   * @returns {boolean} True if there are pending operations
   * @public
   */
  hasPending() {
    return this.getPendingCount() > 0;
  }

  /**
   * Destroy the DOMBatcher and clean up resources.
   * 
   * @public
   */
  destroy() {
    this.cancel();
    this.clear();
  }
}

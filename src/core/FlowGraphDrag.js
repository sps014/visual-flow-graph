/**
 * Handles drag operations and multi-drag system for FlowGraph.
 * 
 * This class manages dragging operations for nodes, including single node
 * dragging and multi-selection dragging. It provides smooth drag interactions
 * and maintains proper positioning during drag operations.
 * 
 * @class FlowGraphDrag
 * 
 * @example
 * ```javascript
 * const drag = new FlowGraphDrag(flowGraph);
 * 
 * // Start multi-drag operation
 * drag.startMultiDrag(event, draggedNode);
 * 
 * // Update drag position
 * drag.updateMultiDrag(event);
 * 
 * // End drag operation
 * drag.endMultiDrag();
 * ```
 */
export class FlowGraphDrag {
  /**
   * Creates a new FlowGraphDrag instance.
   * 
   * @param {FlowGraph} flowGraph - The parent FlowGraph instance
   */
  constructor(flowGraph) {
    /** @type {FlowGraph} The parent FlowGraph instance */
    this.flowGraph = flowGraph;
    
    /** @type {Object|null} Current multi-drag state */
    this.multiDragState = null;
  }

  /**
   * Start a multi-drag operation for selected nodes.
   * 
   * @param {PointerEvent} e - The pointer event that initiated the drag
   * @param {Node} draggedNode - The node that was initially dragged
   * 
   * @example
   * ```javascript
   * drag.startMultiDrag(event, node);
   * ```
   */
  startMultiDrag(e, draggedNode) {
    // Check if in readonly mode
    if (this.flowGraph.readonly) {
      return;
    }
    
    this.multiDragState = {
      active: true,
      draggedNode: draggedNode,
      startX: e.clientX,
      startY: e.clientY,
      initialPositions: new Map(),
      updateRafId: null,
      latestEvent: null
    };
    
    // Store initial positions of all selected nodes and add dragging class
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        this.multiDragState.initialPositions.set(nodeId, {
          x: node.x,
          y: node.y
        });
        // Add dragging class to all selected nodes
        node.element.classList.add('dragging');
      }
    }
  }

  /**
   * Update multi-drag operation
   * OPTIMIZED: Aggressive throttling and batching for smooth high-refresh-rate performance
   */
  updateMultiDrag(e) {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    // Cancel any pending update
    if (this.multiDragState.updateRafId) {
      cancelAnimationFrame(this.multiDragState.updateRafId);
    }
    
    // Store the latest event for processing
    this.multiDragState.latestEvent = e;
    
    // Schedule update using RAF for smooth 60fps+ performance
    this.multiDragState.updateRafId = requestAnimationFrame(() => {
      this.performMultiDragUpdate(this.multiDragState.latestEvent);
      this.multiDragState.updateRafId = null;
    });
  }
  
  /**
   * Perform the actual multi-drag update
   * OPTIMIZED: Batched DOM updates with transform instead of left/top
   * @private
   */
  performMultiDragUpdate(e) {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    const deltaX = e.clientX - this.multiDragState.startX;
    const deltaY = e.clientY - this.multiDragState.startY;
    
    // Convert screen delta to world delta
    const worldDeltaX = deltaX / this.flowGraph.viewport.scale;
    const worldDeltaY = deltaY / this.flowGraph.viewport.scale;
    
    // Collect nodes that need updating
    const nodesToUpdate = new Set();
    
    // Batch all DOM updates together to minimize reflows
    const updates = [];
    
    // Update all selected nodes - use transform for better performance
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
        const newX = initialPos.x + worldDeltaX;
        const newY = initialPos.y + worldDeltaY;
        
        // Update position without firing events (we'll fire one batch event)
        node.x = newX;
        node.y = newY;
        
        // Use transform instead of left/top for better performance (GPU accelerated)
        updates.push(() => {
          node.element.style.transform = `translate(${newX}px, ${newY}px)`;
          // Keep left/top at 0 when using transform
          if (!node.element.dataset.usingTransform) {
            node.element.style.left = '0';
            node.element.style.top = '0';
            node.element.dataset.usingTransform = 'true';
          }
        });
        
        nodesToUpdate.add(node);
      }
    }
    
    // Execute all DOM updates in a single batch
    updates.forEach(update => update());
    
    // Update edges with throttling
    if (nodesToUpdate.size > 0) {
      this.flowGraph.throttledUpdates.edgeUpdate(nodesToUpdate);
    }
  }

  /**
   * End multi-drag operation
   */
  endMultiDrag() {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    // Cancel any pending RAF update
    if (this.multiDragState.updateRafId) {
      cancelAnimationFrame(this.multiDragState.updateRafId);
      this.multiDragState.updateRafId = null;
    }
    
    // Fire move events for all moved nodes and remove dragging class
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
        
        // Convert transform back to left/top for final position
        if (node.element.dataset.usingTransform) {
          node.element.style.left = node.x + 'px';
          node.element.style.top = node.y + 'px';
          node.element.style.transform = '';
          delete node.element.dataset.usingTransform;
        }
        
        this.flowGraph.container.dispatchEvent(new CustomEvent('node:move', {
          detail: { 
            nodeId: node.id, 
            node: node, 
            oldPosition: initialPos,
            newPosition: { x: node.x, y: node.y }
          }
        }));
        // Remove dragging class
        node.element.classList.remove('dragging');
      }
    }
    
    this.multiDragState = null;
  }
}

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
    
    /** @type {Set<Node>} Accumulated nodes for batched edge updates */
    this.pendingEdgeUpdates = new Set();
    
    /** @type {number|null} RAF ID for batched edge updates */
    this.edgeUpdateRafId = null;
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
      initialPositions: new Map()
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
   */
  updateMultiDrag(e) {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    const deltaX = e.clientX - this.multiDragState.startX;
    const deltaY = e.clientY - this.multiDragState.startY;
    
    // Convert screen delta to world delta
    const worldDeltaX = deltaX / this.flowGraph.viewport.scale;
    const worldDeltaY = deltaY / this.flowGraph.viewport.scale;
    
    // Update all selected nodes using transform for better performance
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
        const newX = initialPos.x + worldDeltaX;
        const newY = initialPos.y + worldDeltaY;
        
        // Update position without firing events (we'll fire one batch event)
        node.x = newX;
        node.y = newY;
        
        // Use transform instead of left/top to avoid layout recalculations
        node.element.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      }
    }
    
    // Collect nodes for batched edge updates
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        this.pendingEdgeUpdates.add(node);
      }
    }
    
    // Schedule batched edge update to reduce layout thrashing
    this.scheduleBatchedEdgeUpdate();
  }

  /**
   * Schedule batched edge update to reduce layout thrashing
   * @private
   */
  scheduleBatchedEdgeUpdate() {
    if (this.edgeUpdateRafId) {
      return; // Already scheduled
    }
    
    this.edgeUpdateRafId = requestAnimationFrame(() => {
      if (this.pendingEdgeUpdates.size > 0) {
        this.flowGraph.batchUpdateEdges(this.pendingEdgeUpdates);
        this.pendingEdgeUpdates.clear();
      }
      this.edgeUpdateRafId = null;
    });
  }

  /**
   * End multi-drag operation
   */
  endMultiDrag() {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
    // Process any remaining edge updates immediately
    if (this.pendingEdgeUpdates.size > 0) {
      this.flowGraph.batchUpdateEdges(this.pendingEdgeUpdates);
      this.pendingEdgeUpdates.clear();
    }
    
    // Cancel any pending edge updates
    if (this.edgeUpdateRafId) {
      cancelAnimationFrame(this.edgeUpdateRafId);
      this.edgeUpdateRafId = null;
    }
    
    // Fire move events for all moved nodes and remove dragging class
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
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


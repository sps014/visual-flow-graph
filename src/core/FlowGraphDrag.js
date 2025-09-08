/**
 * Handles drag operations and multi-drag system
 */
export class FlowGraphDrag {
  constructor(flowGraph) {
    this.flowGraph = flowGraph;
    this.multiDragState = null;
  }

  /**
   * Start multi-drag operation
   */
  startMultiDrag(e, draggedNode) {
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
    
    // Update all selected nodes
    for (const nodeId of this.flowGraph.selection.getSelection()) {
      const node = this.flowGraph.nodes.get(nodeId);
      if (node) {
        const initialPos = this.multiDragState.initialPositions.get(nodeId);
        const newX = initialPos.x + worldDeltaX;
        const newY = initialPos.y + worldDeltaY;
        
        // Update position without firing events (we'll fire one batch event)
        node.x = newX;
        node.y = newY;
        node.element.style.left = newX + 'px';
        node.element.style.top = newY + 'px';
      }
    }
    
    // Update edges for all moved nodes
    requestAnimationFrame(() => {
      for (const nodeId of this.flowGraph.selection.getSelection()) {
        const node = this.flowGraph.nodes.get(nodeId);
        if (node) {
          this.flowGraph.updateEdgesForNode(node);
        }
      }
    });
  }

  /**
   * End multi-drag operation
   */
  endMultiDrag() {
    if (!this.multiDragState || !this.multiDragState.active) return;
    
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

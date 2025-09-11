import { LitElement, html, css } from 'lit';

/**
 * FlowContextMenu web component.
 * 
 * This component provides a context menu for adding nodes to the flow graph.
 * It displays a searchable list of available node definitions and allows
 * users to add new nodes by clicking on them.
 * 
 * @class FlowContextMenu
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-context-menu 
 *   ?visible="true"
 *   x="100"
 *   y="200"
 *   .nodeDefinitions="${nodeDefs}"
 *   .onNodeAdd="${handleNodeAdd}">
 * </flow-context-menu>
 * ```
 */
export class FlowContextMenu extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {Boolean} Whether the context menu is visible */
    visible: { type: Boolean },
    
    /** @type {Number} X position of the context menu */
    x: { type: Number },
    
    /** @type {Number} Y position of the context menu */
    y: { type: Number },
    
    /** @type {Array} Array of available node definitions */
    nodeDefinitions: { type: Array },
    
    /** @type {Function} Callback function when a node is added */
    onNodeAdd: { type: Function },
    
    /** @type {String} Search term for filtering node definitions */
    searchTerm: { type: String },
    
    /** @type {Number} Minimum width of the context menu */
    minWidth: { type: Number },
    
    /** @type {Number} Maximum width of the context menu */
    maxWidth: { type: Number }
  };

  static styles = css`
    :host {
      position: fixed;
      z-index: 10000;
      display: none;
    }

    :host([visible]) {
      display: block;
    }

    .context-menu {
      background: var(--fg-panel, #0b1220);
      border: 1px solid var(--fg-muted, #94a3b8);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      min-width: var(--context-menu-min-width, 200px);
      max-width: var(--context-menu-max-width, 300px);
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 8px 0;
      font-family: inherit;
      user-select: none;
    }

    .context-menu-header {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: bold;
      color: var(--fg-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--fg-muted, #94a3b8);
      margin-bottom: 4px;
    }

    .search-container {
      padding: 8px 12px;
      border-bottom: 1px solid var(--fg-muted, #94a3b8);
    }

    .search-input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid var(--fg-muted, #94a3b8);
      border-radius: 4px;
      background: var(--fg-panel, #0b1220);
      color: var(--fg-text, #ffffff);
      font-size: 12px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--fg-accent, #7c3aed);
    }

    .search-input::placeholder {
      color: var(--fg-muted, #94a3b8);
    }

    .node-category {
      margin-bottom: 8px;
    }

    .category-header {
      padding: 6px 16px;
      font-size: 11px;
      font-weight: 600;
      color: var(--fg-accent, #7c3aed);
      background: rgba(124, 58, 237, 0.1);
      border-left: 3px solid var(--fg-accent, #7c3aed);
    }

    .node-item {
      padding: 10px 16px;
      cursor: pointer;
      color: var(--fg-text, #ffffff);
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .node-item:hover {
      background: var(--fg-accent, #7c3aed);
      color: white;
      border-left-color: white;
    }

    .node-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .node-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .node-name {
      font-weight: 500;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-description {
      font-size: 11px;
      color: var(--fg-muted, #94a3b8);
      opacity: 0.8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-item:hover .node-description {
      color: rgba(255, 255, 255, 0.8);
    }

    .node-type {
      font-size: 10px;
      padding: 2px 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      color: var(--fg-muted, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
    }

    .node-item:hover .node-type {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .no-nodes {
      padding: 20px 16px;
      text-align: center;
      color: var(--fg-muted, #94a3b8);
      font-size: 12px;
    }

    /* Scrollbar styling */
    .context-menu::-webkit-scrollbar {
      width: 6px;
    }

    .context-menu::-webkit-scrollbar-track {
      background: transparent;
    }

    .context-menu::-webkit-scrollbar-thumb {
      background: var(--fg-muted, #94a3b8);
      border-radius: 3px;
    }

    .context-menu::-webkit-scrollbar-thumb:hover {
      background: var(--fg-accent, #7c3aed);
    }
  `;

  constructor() {
    super();
    this.visible = false;
    this.x = 0;
    this.y = 0;
    this.nodeDefinitions = [];
    this.onNodeAdd = null;
    this.searchTerm = '';
    this.minWidth = 200;
    this.maxWidth = 300;
  }

  show(x, y, nodeDefinitions, onNodeAdd, minWidth = 200, maxWidth = 300) {
    this.x = x;
    this.y = y;
    this.nodeDefinitions = nodeDefinitions;
    this.onNodeAdd = onNodeAdd;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.visible = true;
    this.searchTerm = ''; // Clear search when showing menu
    
    // Set CSS custom properties for width
    this.style.setProperty('--context-menu-min-width', `${minWidth}px`);
    this.style.setProperty('--context-menu-max-width', `${maxWidth}px`);
    
    // Set the visible attribute on the host element
    this.setAttribute('visible', '');
    
    // Trigger re-render
    this.requestUpdate();
    
    // Position the menu
    this.updatePosition();
    
    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick.bind(this));
    }, 0);
  }

  hide() {
    this.visible = false;
    this.removeAttribute('visible');
    this.requestUpdate();
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  updatePosition() {
    const rect = this.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let x = this.x;
    let y = this.y;

    // Adjust if menu would go off screen
    if (x + rect.width > viewport.width) {
      x = viewport.width - rect.width - 10;
    }
    if (y + rect.height > viewport.height) {
      y = viewport.height - rect.height - 10;
    }

    this.style.left = `${Math.max(10, x)}px`;
    this.style.top = `${Math.max(10, y)}px`;
  }

  handleOutsideClick(event) {
    // Don't close if clicking on the search input or any element inside the context menu
    if (!this.contains(event.target) && !event.target.closest('flow-context-menu')) {
      this.hide();
    }
  }

  handleNodeClick(nodeDef) {
    if (this.onNodeAdd) {
      this.onNodeAdd(nodeDef);
    }
    this.hide();
  }

  groupNodesByCategory() {
    const groups = {};
    
    // Filter nodes based on search term
    const filteredNodes = this.nodeDefinitions.filter(nodeDef => {
      if (!this.searchTerm) return true;
      const searchLower = this.searchTerm.toLowerCase();
      return (
        nodeDef.label?.toLowerCase().includes(searchLower) ||
        nodeDef.name?.toLowerCase().includes(searchLower) ||
        nodeDef.description?.toLowerCase().includes(searchLower) ||
        nodeDef.category?.toLowerCase().includes(searchLower)
      );
    });
    
    filteredNodes.forEach(nodeDef => {
      const category = nodeDef.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(nodeDef);
    });

    return groups;
  }

  handleSearchInput(e) {
    this.searchTerm = e.target.value;
    this.requestUpdate();
  }

  handleSearchKeydown(e) {
    // Prevent event propagation to avoid closing the menu
    e.stopPropagation();
  }

  handleSearchClick(e) {
    // Prevent event propagation to avoid closing the menu
    e.stopPropagation();
  }

  getNodeIcon(nodeDef) {
    // Use the icon from the node definition, fallback to a default
    return nodeDef.icon || '⚙️';
  }

  render() {
    if (!this.visible || !this.nodeDefinitions.length) {
      return html``;
    }

    const groupedNodes = this.groupNodesByCategory();

    return html`
      <div class="context-menu">
        <div class="context-menu-header">
          Add Node
        </div>
        
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search nodes..."
            .value="${this.searchTerm || ''}"
            @input="${this.handleSearchInput}"
            @keydown="${this.handleSearchKeydown}"
            @click="${this.handleSearchClick}"
          />
        </div>
        
        ${Object.entries(groupedNodes).map(([category, nodes]) => html`
          <div class="node-category">
            <div class="category-header">
              ${category}
            </div>
            ${nodes.map(nodeDef => html`
              <div 
                class="node-item"
                @click=${() => this.handleNodeClick(nodeDef)}
                title="${nodeDef.description || ''}"
              >
                <div class="node-icon">
                  ${nodeDef.icon || this.getNodeIcon(nodeDef)}
                </div>
                <div class="node-info">
                  <div class="node-name">${nodeDef.label || nodeDef.name}</div>
                  ${nodeDef.description ? html`
                    <div class="node-description">${nodeDef.description}</div>
                  ` : ''}
                </div>
                <div class="node-type">${nodeDef.name}</div>
              </div>
            `)}
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('flow-context-menu', FlowContextMenu);

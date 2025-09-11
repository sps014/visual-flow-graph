import { LitElement, html, css } from 'lit';

/**
 * FlowSocket web component.
 * 
 * This component represents a self-contained, reusable socket that can be either
 * an input or output socket. It automatically generates the proper structure
 * with a socket anchor for edge connections and a label.
 * 
 * @class FlowSocketElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <!-- Simple usage -->
 * <flow-socket type="output" name="result" label="Result"></flow-socket>
 * 
 * <!-- Custom styled socket -->
 * <flow-socket type="output" name="custom" label="Custom Output" 
 *              color="#10b981" size="20px"></flow-socket>
 * ```
 */
export class FlowSocketElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} Socket type: 'input' or 'output' */
    type: { type: String },
    
    /** @type {String} Socket name/identifier */
    name: { type: String },
    
    /** @type {String} Display label for the socket */
    label: { type: String },
    
    /** @type {String} Custom color for the socket */
    color: { type: String },
    
    /** @type {String} Custom size for the socket */
    size: { type: String },
    
    /** @type {String} Custom CSS class for additional styling */
    customClass: { type: String, attribute: 'custom-class' },
    
    /** @type {String} Data type this socket accepts/provides */
    dataType: { type: String, attribute: 'data-type' }
  };
  
  /**
   * CSS styles for the component.
   * @static
   * @type {CSSResult}
   */
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--fg-text, #e2e8f0);
      position: relative;
    }
    
    :host([type="input"]) {
      flex-direction: row;
    }
    
    :host([type="output"]) {
      flex-direction: row-reverse;
    }
    
    flow-socket-anchor {
      flex-shrink: 0;
    }
    
    .socket-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    :host([type="input"]) .socket-label {
      text-align: left;
    }
    
    :host([type="output"]) .socket-label {
      text-align: right;
    }
    
  `;
  
  constructor() {
    super();
    this.type = 'output';
    this.name = '';
    this.label = '';
    this.color = '';
    this.size = '';
    this.customClass = '';
    this.dataType = 'any';
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.ensureSocketStructure();
  }
  
  /**
   * Ensure the socket has the proper structure with anchor and label elements.
   * Generates them if they don't exist.
   * 
   * @private
   */
  ensureSocketStructure() {
    // Wait for the component to be fully rendered
    requestAnimationFrame(() => {
      // Check if we have slot content
      const hasSlotContent = this.innerHTML.trim().length > 0;
      
      if (hasSlotContent) {
        // Don't generate default structure if we have slot content
        return;
      }
      
      // Check if anchor and label elements exist
      const existingAnchor = this.shadowRoot?.querySelector('flow-socket-anchor');
      const existingLabel = this.shadowRoot?.querySelector('.socket-label');
      
      if (!existingAnchor || !existingLabel) {
        // Generate the complete structure
        this.generateSocketStructure();
      }
    });
  }
  
  /**
   * Generate the complete socket structure with anchor and label.
   * 
   * @private
   */
  generateSocketStructure() {
    const socketClass = `socket ${this.type} ${this.customClass || ''}`.trim();
    const socketStyle = this.getSocketStyle();
    const labelStyle = this.getLabelStyle();
    
    // Create the complete structure
    const structure = `
      <flow-socket-anchor class="${this.customClass || ''}">
        <span 
          class="${socketClass}" 
          style="${socketStyle}">
        </span>
      </flow-socket-anchor>
      <span class="socket-label" style="${labelStyle}">${this.label}</span>
    `;
    
    // Set the innerHTML
    this.shadowRoot.innerHTML = structure;
  }
  
  /**
   * Renders the component template.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    // Check if we have custom content in the slot
    const hasSlotContent = this.innerHTML.trim().length > 0;
    
    if (hasSlotContent) {
      // Use the slot content if provided - don't generate default structure
      return html`<slot></slot>`;
    } else {
      // Generate default structure only when no slot content
      const socketClass = `socket ${this.type} ${this.customClass || ''}`.trim();
      const socketStyle = this.getSocketStyle();
      const labelStyle = this.getLabelStyle();
      
      return html`
        <flow-socket-anchor class="${this.customClass || ''}">
          <span 
            class="${socketClass}" 
            style="${socketStyle}">
          </span>
        </flow-socket-anchor>
        <span class="socket-label" style="${labelStyle}">${this.label}</span>
      `;
    }
  }
  
  /**
   * Generate CSS styles for the socket element.
   * 
   * @returns {string} CSS style string
   * @private
   */
  getSocketStyle() {
    const defaultColor = this.type === 'input' ? '#10b981' : '#10b981';
    const color = this.color || defaultColor;
    const size = this.size || '16px';
    
    return `
      border-color: ${color};
      background: linear-gradient(180deg, ${this.hexToRgba(color, 0.6)}, ${this.hexToRgba(color, 0.3)});
      width: ${size};
      height: ${size};
      border-radius: 50%;
    `;
  }
  
  /**
   * Generate CSS styles for the label element.
   * 
   * @returns {string} CSS style string
   * @private
   */
  getLabelStyle() {
    if (!this.color) return '';
    
    return `color: ${this.color}; font-weight: bold;`;
  }
  
  /**
   * Convert hex color to rgba with opacity.
   * 
   * @param {string} hex - Hex color string
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} RGBA color string
   * @private
   */
  hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  /**
   * Get the socket anchor element for edge connections.
   * 
   * @returns {HTMLElement|null} The socket anchor element
   */
  getSocketAnchor() {
    return this.shadowRoot?.querySelector('flow-socket-anchor');
  }
  
  /**
   * Get the socket span element.
   * 
   * @returns {HTMLElement|null} The socket span element
   */
  getSocketElement() {
    return this.shadowRoot?.querySelector('.socket');
  }
}

customElements.define('flow-socket', FlowSocketElement);

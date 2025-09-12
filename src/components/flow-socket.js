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
    
    // Convert color to rgba format for background gradient
    const rgbaColor1 = this.colorToRgba(color, 0.6);
    const rgbaColor2 = this.colorToRgba(color, 0.3);
    
    return `
      border-color: ${color};
      background: linear-gradient(180deg, ${rgbaColor1}, ${rgbaColor2});
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
   * Convert CSS color name to hex value.
   * 
   * @param {string} color - CSS color name
   * @returns {string|false} Hex color string or false if not found
   * @private
   */
  colourNameToHex(color) {
    const colours = {
      "aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
      "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
      "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
      "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
      "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
      "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
      "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
      "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
      "honeydew":"#f0fff0","hotpink":"#ff69b4",
      "indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
      "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
      "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
      "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
      "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
      "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
      "navajowhite":"#ffdead","navy":"#000080",
      "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
      "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
      "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
      "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
      "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
      "violet":"#ee82ee",
      "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
      "yellow":"#ffff00","yellowgreen":"#9acd32"
    };

    if (typeof colours[color.toLowerCase()] !== 'undefined') {
      return colours[color.toLowerCase()];
    }

    return false;
  }

  /**
   * Convert any CSS color to rgba with opacity.
   * Handles both hex colors and named CSS colors.
   * 
   * @param {string} color - CSS color string (hex, named, rgb, etc.)
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} RGBA color string
   * @private
   */
  colorToRgba(color, opacity) {
    // If it's already a hex color, use the existing method
    if (color.startsWith('#')) {
      return this.hexToRgba(color, opacity);
    }
    
    // Try to convert named color to hex first
    const hexColor = this.colourNameToHex(color);
    if (hexColor) {
      return this.hexToRgba(hexColor, opacity);
    }
    
    // Handle rgb/rgba colors
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Fallback to the original color with opacity
    return color;
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

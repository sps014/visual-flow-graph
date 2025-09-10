import { LitElement, html, css } from 'lit';

/**
 * FlowBackground web component.
 * 
 * This component provides background styling and visual elements for the flow graph.
 * It can display different types of backgrounds (grid, solid, pattern) and
 * acts as a container for background content.
 * 
 * @class FlowBackgroundElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-background 
 *   type="grid" 
 *   color="#1e293b">
 * </flow-background>
 * ```
 */
export class FlowBackgroundElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} Type of background: 'grid', 'solid', 'pattern' */
    type: { type: String },
    
    /** @type {String} Background color */
    color: { type: String }
  };
  
  /**
   * CSS styles for the component.
   * @static
   * @type {CSSResult}
   */
  static styles = css`
    :host {
      display: none !important;
    }
  `;
  
  /**
   * Renders the component template.
   * This component acts as a simple slot container.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('flow-background', FlowBackgroundElement);

import { LitElement, html, css } from 'lit';

/**
 * FlowOutput web component.
 * 
 * This component represents an output socket on a node.
 * It provides a declarative way to define output sockets in HTML
 * and acts as a container for output socket content.
 * 
 * @class FlowOutputElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-output 
 *   socket="result" 
 *   label="Result" 
 *   type="number"
 *   color="#10b981">
 *   <div class="output-value">42</div>
 * </flow-output>
 * ```
 */
export class FlowOutputElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} The socket identifier */
    socket: { type: String },
    
    /** @type {String} Display label for the output socket */
    label: { type: String },
    
    /** @type {String} Data type this output provides */
    type: { type: String },
    
    /** @type {String} Color for the output socket */
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

customElements.define('flow-output', FlowOutputElement);

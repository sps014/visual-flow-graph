import { LitElement, html, css } from 'lit';

/**
 * FlowInput web component.
 * 
 * This component represents an input socket on a node.
 * It provides a declarative way to define input sockets in HTML
 * and acts as a container for input socket content.
 * 
 * @class FlowInputElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-input 
 *   socket="input1" 
 *   label="Value" 
 *   type="number">
 *   <input data-key="input1" type="number">
 * </flow-input>
 * ```
 */
export class FlowInputElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} The socket identifier */
    socket: { type: String },
    
    /** @type {String} Display label for the input socket */
    label: { type: String },
    
    /** @type {String} Data type this input accepts */
    type: { type: String }
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

customElements.define('flow-input', FlowInputElement);

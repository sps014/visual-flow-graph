import { LitElement, html, css } from 'lit';

/**
 * FlowNodeDef web component.
 * 
 * This component defines a node template that can be used to create
 * instances of nodes in the flow graph. It provides a declarative way
 * to define node structure, inputs, outputs, and visual appearance.
 * 
 * @class FlowNodeDefElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-node-def 
 *   name="math-add" 
 *   label="Add Numbers"
 *   width="160"
 *   height="100">
 *   <flow-input socket="a" label="A" type="number"></flow-input>
 *   <flow-input socket="b" label="B" type="number"></flow-input>
 *   <flow-output socket="result" label="Result" type="number"></flow-output>
 * </flow-node-def>
 * ```
 */
export class FlowNodeDefElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} The name/type identifier for this node definition */
    name: { type: String },
    
    /** @type {String} Display label for the node */
    label: { type: String },
    
    /** @type {Number} Default width of nodes created from this definition */
    width: { type: Number },
    
    /** @type {Number} Default height of nodes created from this definition */
    height: { type: Number }
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

customElements.define('flow-node-def', FlowNodeDefElement);

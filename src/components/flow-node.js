import { LitElement, html, css } from 'lit';

/**
 * FlowNode web component.
 * 
 * This component represents a single node in the flow graph.
 * It provides a declarative way to define nodes in HTML and
 * acts as a container for node content.
 * 
 * @class FlowNodeElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-node 
 *   type="math-add" 
 *   id="node1" 
 *   x="100" 
 *   y="200"
 *   ?selected="true">
 *   <div>Add: <input data-key="a" type="number"></div>
 * </flow-node>
 * ```
 */
export class FlowNodeElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} The type identifier for this node */
    type: { type: String },
    
    /** @type {String} Unique identifier for this node */
    id: { type: String },
    
    /** @type {Number} X position of the node */
    x: { type: Number },
    
    /** @type {Number} Y position of the node */
    y: { type: Number },
    
    /** @type {Boolean} Whether the node is currently selected */
    selected: { type: Boolean }
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

customElements.define('flow-node', FlowNodeElement);

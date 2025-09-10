import { LitElement, html, css } from 'lit';

/**
 * FlowEdge web component.
 * 
 * This component represents a connection between two nodes.
 * It provides a declarative way to define edges in HTML
 * and acts as a container for edge content.
 * 
 * @class FlowEdgeElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-edge 
 *   from="node1:output1" 
 *   to="node2:input1" 
 *   color="#10b981"
 *   width="2"
 *   animated="flowing">
 * </flow-edge>
 * ```
 */
export class FlowEdgeElement extends LitElement {
  /**
   * Lit properties configuration for the component.
   * @static
   * @type {Object}
   */
  static properties = {
    /** @type {String} Source socket identifier (format: nodeId:socketId) */
    from: { type: String },
    
    /** @type {String} Target socket identifier (format: nodeId:socketId) */
    to: { type: String },
    
    /** @type {String} Color of the edge */
    color: { type: String },
    
    /** @type {Number} Width/thickness of the edge */
    width: { type: Number },
    
    /** @type {String} Animation type for the edge */
    animated: { type: String }
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

customElements.define('flow-edge', FlowEdgeElement);

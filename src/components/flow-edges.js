import { LitElement, html, css } from 'lit';

/**
 * FlowEdges web component.
 * 
 * This component acts as a container for edge elements in the flow graph.
 * It provides a declarative way to group and manage edges in HTML
 * and acts as a slot container for edge content.
 * 
 * @class FlowEdgesElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-edges>
 *   <flow-edge from="node1:output" to="node2:input"></flow-edge>
 *   <flow-edge from="node2:output" to="node3:input"></flow-edge>
 * </flow-edges>
 * ```
 */
export class FlowEdgesElement extends LitElement {
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

customElements.define('flow-edges', FlowEdgesElement);

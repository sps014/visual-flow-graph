import { LitElement, html, css } from 'lit';

/**
 * FlowNodes web component.
 * 
 * This component acts as a container for node elements in the flow graph.
 * It provides a declarative way to group and manage nodes in HTML
 * and acts as a slot container for node content.
 * 
 * @class FlowNodesElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-nodes>
 *   <flow-node type="math-add" id="node1" x="100" y="100"></flow-node>
 *   <flow-node type="math-subtract" id="node2" x="300" y="100"></flow-node>
 * </flow-nodes>
 * ```
 */
export class FlowNodesElement extends LitElement {
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

customElements.define('flow-nodes', FlowNodesElement);

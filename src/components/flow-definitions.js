import { LitElement, html, css } from 'lit';

/**
 * FlowDefinitions web component.
 * 
 * This component acts as a container for node definition elements in the flow graph.
 * It provides a declarative way to group and manage node definitions in HTML
 * and acts as a slot container for node definition content.
 * 
 * @class FlowDefinitionsElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-definitions>
 *   <flow-node-def name="math-add" label="Add Numbers">
 *     <flow-input socket="a" label="A" type="number"></flow-input>
 *     <flow-output socket="result" label="Result" type="number"></flow-output>
 *   </flow-node-def>
 * </flow-definitions>
 * ```
 */
export class FlowDefinitionsElement extends LitElement {
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

customElements.define('flow-definitions', FlowDefinitionsElement);

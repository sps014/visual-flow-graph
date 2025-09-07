import { LitElement, html, css } from 'lit';

export class FlowDefinitionsElement extends LitElement {
  static styles = css`
    :host {
      display: none !important;
    }
  `;
  
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('flow-definitions', FlowDefinitionsElement);

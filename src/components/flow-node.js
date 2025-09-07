import { LitElement, html, css } from 'lit';

export class FlowNodeElement extends LitElement {
  static properties = {
    type: { type: String },
    id: { type: String },
    x: { type: Number },
    y: { type: Number },
    selected: { type: Boolean }
  };
  
  static styles = css`
    :host {
      display: none !important;
    }
  `;
  
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('flow-node', FlowNodeElement);

import { LitElement, html, css } from 'lit';

export class FlowEdgeElement extends LitElement {
  static properties = {
    from: { type: String },
    to: { type: String },
    color: { type: String },
    width: { type: Number },
    animated: { type: String }
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

customElements.define('flow-edge', FlowEdgeElement);

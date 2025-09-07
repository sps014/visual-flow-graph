import { LitElement, html, css } from 'lit';

export class FlowOutputElement extends LitElement {
  static properties = {
    socket: { type: String },
    label: { type: String },
    type: { type: String },
    color: { type: String }
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

customElements.define('flow-output', FlowOutputElement);

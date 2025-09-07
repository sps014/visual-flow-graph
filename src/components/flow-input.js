import { LitElement, html, css } from 'lit';

export class FlowInputElement extends LitElement {
  static properties = {
    socket: { type: String },
    label: { type: String },
    type: { type: String }
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

customElements.define('flow-input', FlowInputElement);

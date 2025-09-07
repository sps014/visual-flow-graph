import { LitElement, html, css } from 'lit';

export class FlowNodeDefElement extends LitElement {
  static properties = {
    name: { type: String },
    label: { type: String },
    width: { type: Number },
    height: { type: Number }
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

customElements.define('flow-node-def', FlowNodeDefElement);

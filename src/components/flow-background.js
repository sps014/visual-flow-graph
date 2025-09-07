import { LitElement, html, css } from 'lit';

export class FlowBackgroundElement extends LitElement {
  static properties = {
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

customElements.define('flow-background', FlowBackgroundElement);

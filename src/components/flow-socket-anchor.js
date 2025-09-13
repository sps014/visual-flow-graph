import { LitElement, html, css } from 'lit';

/**
 * FlowSocketAnchor web component.
 * 
 * This component provides a slot container for socket elements where edge
 * connections begin and end. It acts as a connection point for the flow graph
 * system and provides the necessary structure for socket interaction.
 * 
 * @class FlowSocketAnchorElement
 * @extends LitElement
 * 
 * @example
 * ```html
 * <flow-socket-anchor>
 *   <span class="socket out"></span>
 * </flow-socket-anchor>
 * ```
 */
export class FlowSocketAnchorElement extends LitElement {
  /**
   * CSS styles for the component.
   * @static
   * @type {CSSResult}
   */
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      cursor: crosshair;
    }
    
    ::slotted(.socket) {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid;
      cursor: crosshair;
      transition: all 0.2s ease;
      position: relative;
      z-index: 10;
    }
    
    ::slotted(.socket:hover) {
      transform: scale(1.2);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
    }
    
    ::slotted(.socket.socket-active) {
      transform: scale(1.3);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
    }
    
    ::slotted(.socket.socket-hover) {
      transform: scale(1.1);
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
    }
    
    /* Input socket specific styles */
    ::slotted(.socket.in) {
      border-color: var(--fg-socket-input-border, rgba(59, 130, 246, 0.8));
      background: linear-gradient(180deg, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.3));
    }
    
    /* Output socket specific styles */
    ::slotted(.socket.out) {
      border-color: var(--fg-socket-output-border, rgba(147, 51, 234, 0.8));
      background: linear-gradient(180deg, rgba(147, 51, 234, 0.6), rgba(147, 51, 234, 0.3));
    }
  `;
  
  /**
   * Renders the component template.
   * This component acts as a slot container for socket elements.
   * 
   * @returns {TemplateResult} The rendered template
   * @override
   */
  render() {
    return html`<slot></slot>`;
  }
  
  /**
   * Get the socket element within this anchor.
   * 
   * @returns {HTMLElement|null} The socket element
   */
  getSocketElement() {
    return this.querySelector('.socket');
  }
  
  /**
   * Get the socket ID from the parent flow-socket name attribute.
   * 
   * @returns {string|null} The socket ID
   */
  getSocketId() {
    const flowSocket = this.closest('flow-socket');
    return flowSocket?.getAttribute('name') || null;
  }
  
  /**
   * Get the socket type (input/output) from the class list.
   * 
   * @returns {string|null} The socket type
   */
  getSocketType() {
    const socket = this.getSocketElement();
    if (!socket) return null;
    
    if (socket.classList.contains('in')) return 'input';
    if (socket.classList.contains('out')) return 'output';
    return null;
  }
}

customElements.define('flow-socket-anchor', FlowSocketAnchorElement);

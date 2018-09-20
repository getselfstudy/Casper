import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';

/**
 * `polymer-element`
 * Sample element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MyPolymerElement extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                display: block;
                }
            </style>
            <h2>Hello [[prop1]]!</h2>
            <slot></slot>
        `;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'polymer-element',
            },
        };
    }
}

window.customElements.define('polymer-element', MyPolymerElement);

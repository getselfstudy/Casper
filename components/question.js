import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `polymer-element`
 * Sample element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class Question extends PolymerElement {
    constructor() {
        super();
        this._listener = this._selfstudyAnswer.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('selfstudyanswer', this._listener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('selfstudyanswer', this._listener);
    }

    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
            </style>
            <div style="width:100%">
                <p>Answers [[answered]]</p>
                <div style="width:100%">
                    <slot></slot>
                </div>
            </label>
        `;
    }

    static get properties() {
        return {
            answered: {
                type: String,
                notify: true,
                readOnly: false,
                value: ""
            },
            answer: {
                type: Object,
                notify: true,
                readOnly: false,
                value: () => ({})
            }
        };
    }

    _selfstudyAnswer(e) {
        e.stopPropagation();
        const answered = Object.assign(this.answer || {}, e.value);
        Object.keys(answered).forEach(key => {
            if (!answered[key]) {
                delete answered[key];
            }
        });
        this.answered = Object.keys(answered).join(', ');
        this.answer = answered;
    }
}

window.customElements.define('selfstudy-question', Question);

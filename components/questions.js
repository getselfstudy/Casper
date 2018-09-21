import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';

function truthy(val) {
    if (/^\s*(true|1|on|yes|y)\s*$/i.test(val)) {
        return true;
    }
    if (/^\s*(false|0|off|no|n)\s*$/i.test(val)) {
        return false;
    }
    return null;
}

/**
 * `polymer-element`
 * Sample element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class QuestionSet extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
            </style>
            <slot></slot>
        `;
    }

    static get properties() {
        return {
            index: {
                type: Number,
                value: 0
            },
            answers: {
                type: Object,
                value: () => ({})
            }
        };
    }

    static get observers() {
        return [
            '_checkAnswers(answers)'
        ];
    }

    constructor() {
        super();
        this._listener = this._selfstudyAnswer.bind(this);

        this.questions = [].slice.call(this.querySelectorAll('selfstudy-question'));
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('selfstudyquestionanswer', this._listener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('selfstudyquestionanswer', this._listener);
    }

    _checkAnswers(answers) {
        let index = null;
        this.questions.forEach((question, pos) => {
            if (!answers[question.getAttribute('id')]) {
                if (index == null) {
                    question.show = true;
                    index = pos;
                } else {
                    question.show = null;
                }
            } else {
                question.show = true;
            }
        });
        this.set('index', index);
    }

    _selfstudyAnswer(e) {
        e.stopPropagation();
        const answers = Object.assign(this.answers || {});

        const { id, value } = e.detail || {};

        answers[id] = value;

        this.set('answers', answers);

        this._checkAnswers(this.answers);
    }
}

window.customElements.define('selfstudy-question-set', QuestionSet);

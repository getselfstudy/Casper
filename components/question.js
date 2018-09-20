import {html, PolymerElement} from '../node_modules/@polymer/polymer/polymer-element.js';

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
                .question-wrapper {
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 5px;
                }
                .question-wrapper {
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 5px;
                }
                .question-para {
                    position: relative;
                    width: 100%;
                    min-height: 42px;
                }
                .question-para {
                    padding-top: 7px;
                }
                .question-para i,
                .question-para b,
                .question-para em,
                .question-para sup,
                .question-para sub {
                    display: inline;
                }
                .question-number {
                    float: left;
                    width: 42px;
                    height: 42px;
                    line-height: 42px;
                    margin: 0 10px 10px 0;
                    border-radius: 50%;
                    background-color: #20a499;
                    color: white;
                    font-weight: 600;
                    text-align: center;
                    font-size: 18px;
                    display: inline-block;
                }
                .question-question {
                    width: calc(100% - 52px);
                    display: inline-block;
                    margin-bottom: 10px;
                    font-weight: normal;
                    font-size: 1.2rem;
                    min-height: 42px;
                }
                .test-btn-wrap {
                    width: 100%;
                    text-align: center;
                }
                .test-btn {
                    margin-top: 15px;
                    display: block;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .test-btn button {
                    background: #366fb5;
                    color: white;
                    width: 6.5em;
                    font-size: 100%;
                }
                .test-btn button:hover {
                    box-shadow: 0 3px 3px 1px rgba(0, 0, 0, 0.14),
                        0 3px 3px 1px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
                }
                .main-question {
                    margin-top: 20px;
                    margin-bottom: 20px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
            </style>
            <div class="main-question" hidden$="{{!show}}">
                <div class="question-wrapper">
                    <div hidden$="{{!index}}" class="question-number">[[index]]</div>
                    <div class="question-question question-para">
                        <slot name="stem"></slot>
                    </div>
                </div>
                <slot name="answers"></slot>
                <div hidden$="{{!showConfidence}}">
                    <div class="test-btn-wrap">
                        <div class="test-btn">
                            <button
                                class="btn"
                                disabled$="{{hasConfidence}}"
                                name="sure"
                                on-click="_handleConfidence">
                                I am Sure
                            </button>
                            <button
                                class="btn"
                                style="opacity: 0.8;"
                                disabled$="{{hasConfidence}}"
                                name="unsure"
                                on-click="_handleConfidence">
                                I Think So
                            </button>
                            <button
                                class="btn"
                                style="opacity: 0.6;"
                                disabled$="{{hasConfidence}}"
                                name="guess"
                                on-click="_handleConfidence">
                                Best Guess
                            </button>
                        </div>
                    </div>
                </div>
                <div hidden$="{{!hasConfidence}}" class="question-wrapper">
                    <slot name="explanation"></slot>
                </div>
            </div>
        `;
    }

    static get properties() {
        return {
            index: {
                type: String,
                value: ""
            },
            answered: {
                type: String,
                notify: true,
                readOnly: false,
                value: ""
            },
            confidence: {
                type: Boolean,
                notify: true,
                value: false
            },
            answer: {
                type: Object,
                notify: true,
                readOnly: false,
                value: () => ({})
            },
            showConfidence: {
                type: Boolean,
                value: false,
                notify: true,
            },
            hasConfidence: {
                type: Boolean,
                value: false,
                notify: true
            },
            show: {
                type: Boolean,
                value: true,
                nofify: true
            }
        };
    }

    static get observers() {
        return [
            '_checkConfidence(confidence, answer)'
        ];
    }

    _checkConfidence(confidence, answer) {
        answer = answer || {};
        if (confidence) {
            if (Object.keys(answer.choice || {}).length > 0) {
                if (answer.confidence) {
                    this.set('hasConfidence', true);
                    this.set('showConfidence', false);
                } else {
                    this.set('hasConfidence', false);
                    this.set('showConfidence', true);
                }
            } else {
                this.set('hasConfidence', false);
            }
        } else {
            if (Object.keys(answer.choice || {}).length > 0) {
                this.set('hasConfidence', true);
            } else {
                this.set('hasConfidence', false);
            }
        }
    }

    _handleConfidence(e) {
        const confidence = e.target.name;
        const answer = Object.assign({}, this.answer || {});
        answer.confidence = confidence;
        this.set('answer', answer);
        this._checkConfidence(this.confidence, this.answer);
    }

    _selfstudyAnswer(e) {
        e.stopPropagation();
        const answer = Object.assign(this.answer || {});
        delete answer.confidence;
        const choice = Object.assign(answer.choice || {}, e.value);
        Object.keys(choice).forEach(key => {
            if (!choice[key]) {
                delete choice[key];
            }
        });
        answer.choice = choice;
        this.set('answered', Object.keys(choice).join(', '));
        this.set('answer', answer);
        this._checkConfidence(this.confidence, this.answer);
    }
}

window.customElements.define('selfstudy-question', Question);

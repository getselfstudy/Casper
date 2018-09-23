import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

function truthy(val) {
    if (/^\s*(true|1|on|yes|y)\s*$/i.test(val)) {
        return true;
    }
    if (/^\s*(false|0|off|no|n)\s*$/i.test(val)) {
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
class Question extends PolymerElement {
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
                    display: inline-block;
                }
                .question-question {
                    width: calc(100% - 52px);
                    display: inline-block;
                    margin-bottom: 10px;
                    font-weight: normal;
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
                .answer-list {
                    display: flex;
                    width: 100%;
                    flex-direction: row;
                    flex-flow: wrap;
                }
            </style>
            <div class="main-question" hidden$="{{!show}}">
                <div>Answers [[answered]]</div>
                <div class="question-wrapper">
                    <div hidden$="{{!index}}" class="question-number">[[index]]</div>
                    <div class="question-question question-para">
                        <slot name="stem"></slot>
                    </div>
                </div>
                <div class="answer-list">
                    <slot id="answers-slot" name="answers"></slot>
                </div>
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
            answers: {
                type: Array,
                notify: true
            },
            id: {
                type: String,
                value: "default"
            },
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
                value: () => {
                    return {};
                }
            },
            preserve: {
                type: Boolean,
                notify: true,
                readOnly: false
            },
            showConfidence: {
                type: Boolean,
                value: false,
                notify: true
            },
            hasConfidence: {
                type: Boolean,
                value: false,
                notify: true
            },
            show: {
                type: Boolean,
                value: false,
                nofify: true
            },
            correct: {
                type: Boolean,
                value: false,
                notify: true
            }
        };
    }

    static get observers() {
        return ["_checkConfidence(confidence, answer)"];
    }

    constructor() {
        super();
        this._listener = this._selfstudyAnswer.bind(this);

        const answers = [].slice.call(
            this.querySelectorAll("selfstudy-answer")
        );
        const preserve = truthy(this.getAttribute("preserve"));
        this.expected = (this.getAttribute("expect") || "1")
            .split(",")
            .reduce((expect, val) => {
                const [index, order] = val.split(":");
                if (order) {
                    expect[index] = Number(order);
                } else {
                    expect[index] = true;
                }
                return expect;
            }, {});
        this.exclusive = {};
        answers.forEach((item, index) => {
            if (!item.getAttribute("id")) {
                item.setAttribute("id", `${index + 1}`);
            }
            if (item.getAttribute("type") === "radio") {
                this.exclusive[item.getAttribute("id")] = item;
            }
            if (preserve) {
                item.setAttribute("order", item.getAttribute("id"));
            } else {
                item.setAttribute("order", Math.random());
            }
            item.setAttribute("path", index + 1);
        });

        if (!preserve) {
            answers.sort(function(a, b) {
                return a.getAttribute("order") - b.getAttribute("order");
            });
        }
        this.set('answers', answers);
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("selfstudyanswer", this._listener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("selfstudyanswer", this._listener);
    }

    _checkConfidence(confidence, answer) {
        answer = answer || {};
        if (confidence) {
            if (Object.keys(answer.choice || {}).length > 0) {
                if (answer.confidence) {
                    this.set("hasConfidence", true);
                    this.set("showConfidence", false);
                } else {
                    this.set("hasConfidence", false);
                    this.set("showConfidence", true);
                }
            } else {
                this.set("hasConfidence", false);
                this.set("showConfidence", false);
            }
        } else {
            if (Object.keys(answer.choice || {}).length > 0) {
                this.set("hasConfidence", true);
            } else {
                this.set("hasConfidence", false);
            }
        }
        if (this.get("hasConfidence")) {
            const event = new CustomEvent("selfstudyquestionanswer", {
                bubbles: true,
                composed: true,
                detail: {
                    value: answer,
                    id: this.id
                }
            });
            this.dispatchEvent(event);
        }
    }

    _handleConfidence(e) {
        const confidence = e.target.name;
        const answer = Object.assign({}, this.answer || {});
        answer.confidence = confidence;
        this.set("answer", answer);
        this._checkConfidence(this.confidence, this.answer);
    }

    _selfstudyAnswer(e) {
        e.stopPropagation();
        const answer = Object.assign(this.answer || {});
        delete answer.confidence;
        const { id, value, path } = e.detail || {};
        let choice = Object.assign(answer.choice || {});
        if (typeof value === "boolean") {
            if (value) {
                choice[id] = Object.keys(choice).length + 1;
                if (this.exclusive[id]) {
                    Object.keys(this.exclusive).forEach(key => {
                        if (id !== key) {
                            const item = this.exclusive[key];
                            if (truthy(item.value)) {
                                delete choice[key];
                                item.value = "false";
                            }
                        }
                    });
                }
            } else if (choice[id]) {
                delete choice[id];
            }
            const temp = Object.keys(choice).map(key => {
                return {
                    key,
                    value: choice[key]
                };
            });
            temp.sort((a, b) => {
                return a.value - b.value;
            });
            choice = temp.reduce((choice, { key }, index) => {
                choice[key] = index + 1;
                return choice;
            }, {});
        }
        answer.choice = choice;
        const all = Object.assign({}, this.expected, choice);
        const correct = Object.keys(all).reduce((correct, key) => {
            if (!correct) {
                return correct;
            }
            const value = this.expected[key];
            if (typeof value === "boolean") {
                if (!choice[key]) {
                    return false;
                }
            } else {
                if (value !== choice[key]) {
                    return false;
                }
            }
            return true;
        }, true);
        answer.correct = correct;

        this.set("correct", correct);
        this.set(
            "answered",
            Object.keys(choice)
                .map(key => {
                    return `${key}:${choice[key]}`;
                })
                .join(", ") + (correct ? " correct!" : "")
        );
        this.set("answer", answer);
        this._checkConfidence(this.confidence, this.answer);
    }
}

window.customElements.define("selfstudy-question", Question);

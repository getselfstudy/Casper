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
class Answer extends PolymerElement {
    constructor() {
        super();
    }

    static get template() {
        return html`
            <style>
                :host {
                    display: flex;
                    width: 29%;
                    flex-basis: 300px;
                    flex-grow: 10;
                }
                .answer-caption {
                    display: inline-block;
                    vertical-align: middle;
                }
                @media (min-width: 600px) {
                    .answer-wrapper {
                        display: block;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .question-preview .answer-wrapper,
                    .q-footer {
                        padding: 0 3rem;
                    }
                    .test-btn-wrap .answer-wrapper {
                        padding: 0;
                    }
                    .answer-wrapper .question-answer {
                        display: block;
                        width: 100%;
                        min-height: 1px;
                        align-items: center;
                        position: relative;
                    }
                }
                @media (max-width: 575.98px) {
                    .answer-wrapper .question-answer {
                        width: 100%;
                    }
                    .question-preview {
                        margin-top: 0;
                    }
                    .question-preview .question-question p {
                        line-height: 1.2;
                    }
                    .test-btn-wrap {
                        width: 100%;
                        margin-left: 0;
                    }
                    .test-btn button {
                        width: 80%;
                        margin: 10px 10%;
                    }
                    .question-preview {
                        padding: 1rem 1rem;
                        border-radius: 0;
                        border-left: none;
                        border-right: none;
                    }
                    .text-answer input {
                        width: 100%;
                        margin-left: 0;
                    }
                }
                .answer-wrapper {
                    justify-content: space-between;
                    width: 100%;
                }
                .answer-wrapper .question-answer {
                    display: block;
                    align-items: center;
                    position: relative;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 0.25rem;
                    background-color: white;
                    padding: 0 5px;
                    margin-bottom: 5px;
                }
                .question-answer:focus,
                .question-answer:hover {
                    outline: none;
                    border-radius: 4px;
                    border: 1px solid #cce4e2;
                }
                .question-answer:before {
                    content: "";
                    display: block;
                    opacity: 0;
                    position: absolute;
                    transition-duration: 0.15s;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background: #20a499;
                    border-radius: 4px;
                    transform: scale(0);
                    transition-property: transform, opacity;
                }
                .question-answer:hover:before,
                .question-answer:focus:before {
                    transform: scale(1);
                    opacity: 0.12;
                }
                .question-wrapper {
                    width: 100%;
                    padding-top: 10px;
                    padding-bottom: 5px;
                }
                .correct-ans {
                    color: green;
                    text-align: center;
                    margin-top: 25px;
                }
                .wrong-ans {
                    color: red;
                    text-align: center;
                    margin-top: 25px;
                }
                .question-answer input[type="radio"],
                .question-answer input[type="checkbox"] {
                    margin: 20px 10px;
                    position: relative;
                    display: inline-block;
                    vertical-align: middle;
                }
                .question-answer input[type="radio"],
                .question-answer input[type="checkbox"] {
                    background: #f3f3f3;
                    width: 30px;
                    height: 30px;
                    border: 2px solid #366fb5;
                    transition: all 0.3s linear;
                    cursor: pointer;
                    -webkit-appearance: none;
                    appearance: none;
                }
                .question-answer input[type="radio"] {
                    border-radius: 50%;
                }
                .question-answer input[type="checkbox"] {
                    border-radius: 2px;
                }
                .question-answer input[type="radio"]:checked,
                .question-answer input[type="checkbox"]:checked {
                    background-color: #366fb5;
                }
                .question-answer input[type="radio"]:focus,
                .question-answer input[type="checkbox"]:focus {
                    outline: 0 none;
                    box-shadow: none;
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
            </style>
            <div class="answer-wrapper">
                <label
                    for="[[id]]"
                    tabIndex="-1"
                    style="cursor: pointer"
                    class$="[[config.rootClassName]]"
                >
                    <div class$="[[config.className]]">
                        <input
                            type="[[type]]"
                            name="[[id]]"
                            id="[[id]]"
                            checked="{{config.checked}}"
                            value="[[config.value]]"
                            on-change="handleChange"
                        />
                        <div class="answer-caption">
                            <div class="question-para">
                                <slot></slot>
                            </div>
                        </div>
                    </div>
                </label>
            </div>
        `;
    }

    static get observers() {
        return ["computeConfig(value, expect, showCorrect, review)"];
    }

    static get properties() {
        return {
            id: {
                type: String,
                value: "default"
            },
            config: {
                type: Object,
                value: () => {
                    return {};
                },
                notify: true,
                readOnly: false
            },
            value: {
                type: String,
                value: "false",
                notify: true,
                readOnly: false
            },
            expect: {
                type: String,
                value: "",
                readOnly: false
            },
            type: String,
            answered: {
                type: Boolean,
                value: false,
                notify: true,
                readOnly: false
            },
            showCorrect: {
                type: Boolean,
                value: false,
                notify: true,
                readOnly: false
            },
            review: {
                type: Boolean,
                value: false,
                notify: true,
                readOnly: false
            },
            order: {
                type: Number,
                value: () => {
                    return this.id;
                }
            }
        };
    }

    handleChange(e) {
        e.stopPropagation();
        const value = e.target[this.config.property];
        this.set("value", value);
        const event = new CustomEvent("selfstudyanswer", {
            bubbles: true,
            composed: true,
            detail: {
                value,
                path: this.config.path,
                id: this.id
            }
        });
        this.dispatchEvent(event);
    }

    computeConfig(value, expect, showCorrect, review, hide) {
        const oldConfig = this.config || {};
        const config = Object.assign({}, oldConfig);
        switch (this.type) {
            case "text":
                config.className = "text-answer";
                config.path = "value";
                config.value = value || "";
                config.property = "value";
                config.isCorrect = config.value === this.expect;
                break;
            case "checkbox":
                config.value = this.id + 1;
                config.path = `${this.id + 1}`;
                config.className = "checkbox";
                config.checked = truthy(value);
                config.property = "checked";
                config.isCorrect = config.checked === (expect === "true");
                if (config.checked && !config.isCorrect) {
                    config.wronglySelected = true;
                }
                break;
            case "radio":
                config.value = this.id + 1;
                config.path = `${this.id + 1}`;
                config.className = "radio";
                config.checked = truthy(value);
                config.property = "checked";
                config.isCorrect = config.checked === (expect === "true");
                if (config.checked && !config.isCorrect) {
                    config.wronglySelected = true;
                }
                break;
        }
        const className = ["question-answer"];
        if ((showCorrect || review) && config.isCorrect && config.checked) {
            className.push("correct-answer");
        }
        if ((showCorrect || review) && config.wronglySelected) {
            className.push("wrong-answer");
        }
        config.rootClassName = className.join(" ");
        if (
            config.rootClassName !== oldConfig.rootClassName ||
            config.className !== oldConfig.className
        ) {
            this.updateStyles();
        }
        this.config = config;
    }
}

window.customElements.define("selfstudy-answer", Answer);

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `polymer-element`
 * Sample element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class Answer extends PolymerElement {
    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                }
                .answer-caption {
                    display: inline-block;
                    vertical-align: middle;
                }
            </style>
            <div class="answer-wrapper">
                <div>Answer [[id]]</div>
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
                            <slot></slot>
                        </div>
                    </div>
                </label>
            </div>
        `;
    }

    static get observers() {
        return [
            'computeConfig(value, expect, showCorrect, review)',
        ]
    }

    static get properties() {
        return {
            id: {
                type: String,
                value: 'default'
            },
            config: {
                type: Object,
                value: () => ({}),
                notify: true,
                readOnly: false
            },
            value: {
                type: Object,
                value: () => ({}),
                notify: true,
                readOnly: false
            },
            expect: {
                type: String,
                value: '',
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
            }
        };
    }

    handleChange(e) {
        e.stopPropagation();
        const event = new CustomEvent('selfstudyanswer', {bubbles: true, composed: true});
        const checked = e.target[this.config.property];
        event.value = {
            [this.id]: checked
        };
        this.dispatchEvent(event);
    }

    computeConfig(value, expect, showCorrect, review) {
        value = value || {};
        const oldConfig = this.config || {};
        const config = Object.assign({}, oldConfig);
        switch (this.type) {
        case "text":
            config.className = "text-answer";
            config.path = "value";
            config.value = value[this.id] || "";
            config.property = "value";
            config.isCorrect = config.value === this.expect;
            break;
        case "checkbox":
            config.value = this.id + 1;
            config.path = `${this.id + 1}`;
            config.className = "checkbox";
            config.checked = value[this.id] || false;
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
            config.checked = value[this.id] || false;
            config.property = "checked";
            config.isCorrect = config.checked === (expect === "true");
            if (config.checked && !config.isCorrect) {
                config.wronglySelected = true;
            }
            break;
        }
        const className = ['question-answer'];
        if ((showCorrect || review) && config.isCorrect && config.checked) {
            className.push("correct-answer");
        }
        if ((showCorrect || review) && config.wronglySelected) {
            className.push("wrong-answer");
        }
        config.rootClassName = className.join(' ');
        if (config.rootClassName !== oldConfig.rootClassName || config.className !== oldConfig.className) {
            this.updateStyles();
        }
        this.config = config;
    }
}

window.customElements.define('selfstudy-answer', Answer);

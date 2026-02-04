/**
 * @typedef {import('./field.js').Field} Field
 */

/**
 * Text input field.
 */
class TextField extends Field {

    constructor(element) {
        super(element);

        /** @type {HTMLLabelElement | null} */
        this._label = document.querySelector(
            `label[data-field-label="${this.name}"]`
        );
    }

    /**
     * @returns {string}
     */
    get_value() {
        return this.el.value;
    }

    /**
     * @param {string} value
     */
    set_value(value) {
        this.el.value = value;
    }

    /**
     * @returns {string}
     */
    get_default_value() {
        return this.el.defaultValue ?? "";
    }

    /**
     * @returns {string[]}
     */
    get_options() {
        return ["*"];
    }

    /**
     * @param {(value: string) => void} handler
     */
    on_update(handler) {
        this.el.addEventListener("blur", () =>
            handler(this.get_value())
        );
    }

    reset() {
        this.el.style.display = "";
        this.el.disabled = false;
        this.el.title = "";
        if (this._label) this._label.style.display = "";
    }

    /**
     * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states
     */
    apply_options_states(states) {
        this.reset();

        if (!states || states.size === 0) {
            return;
        }

        // Pour TextField, on regarde une clé spéciale "*"
        const state = states.get("*");
        if (!state) {
            return;
        }

        if (state.hidden) {
            this.el.style.display = "none";
            if (this._label) this._label.style.display = "none";
        }

        if (state.disabled) {
            this.el.disabled = true;
            this.el.title = state.reason;
        }
    }
}

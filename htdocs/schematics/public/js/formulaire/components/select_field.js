/**
 * @type {import('./field.js')}
 */

/**
 * 
 */
class SelectField extends Field{
    constructor(element){
        super(element);

        /** @type {HTMLLabelElement | null} */
        this._label = document.querySelector(`label[data-field-label="${this.name}"]`);
    }
    /**
     * return the current value of the field.
     * @returns {string}
     */
    get_value() {
        return this.el.value;
    }

    /**
     * Set the value of the field with the value given.
     * @param {string} value 
     */
    set_value(value){
        this.el.value = value;
    }

    /**
     * return the default value of the field.
     * @returns {string|null}
     */
    get_default_value(){
        const default_option = Array.from(this.el.options).find(opt => opt.defaultSelected);
        if (!default_option){
            console.warn(`[SelectField.get_default_value()] : No default value found for the field : '${this.name}'`);
            return null;
        }
        return default_option.value;
    }

    /**
     * return all possible options of this field.
     * @return {string[]}
     */
    get_options() {
        return Array.from(this.el.options).map(opt => opt.value);
    }


    /**
     * add an update handler, the function handler will be called when the field will be updated
     * with the new value in parameters.
     * @param {(value: string) => void} handler 
     */
    on_update(handler){
        this.el.addEventListener("change", () => handler(this.get_value()));
    }

    /**
     * Reset the state of the field
     */
    reset() {
        this.el.style.display = "";
        this.el.disabled = false;
        if (this._label) this._label.style.display = "";

        Array.from(this.el.options).forEach(option =>{
            option.style.display = "";
            option.title = "";
            option.disabled = false;
        });
    }


    /**
     * Apply options states by disabling, hiding and add title to explain the reason. 
     * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states 
     */
    apply_options_states(states){
        this.reset();

        if (!states || states.size === 0){
            return;
        }
        let reason_set = new Set();
        let disabled_count = 0;
        let hidden_count = 0;

        for (const option of this.el.options){
            const state = states.get(option.value);
            if (!state){
                continue;
            }

            if (state.hidden){
                option.style.display = "none";
                hidden_count++;
            }

            if (state.disabled){
                option.disabled = true;
                option.title = state.reason;
                disabled_count++;
                reason_set.add(state.reason);
            }
        }

        if (hidden_count === this.el.options.length){
            this.el.style.display = "none";
            if (this._label) this._label.style.display = "none";
        }

        if (disabled_count >= this.el.options.length - 1){
            this.el.disabled = true;

            this.el.title = Array.from(reason_set).join("\n ou \n");
        }
    }
}

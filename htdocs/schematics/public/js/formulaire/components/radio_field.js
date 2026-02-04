/** @type {import('./field.js')}*/

/**
 * 
 */
class RadioField extends Field{
    constructor(element){
        super(element);
        /** @type {Map<HTMLLabelElement, HTMLInputElement>} */
        this._elements = new Map();

        document.querySelectorAll(`input[type="radio"][name="${this.el.name}"]`).forEach(el =>{
            const label = document.querySelector(`label[for="${el.id}"]`);
            this._elements.set(label, el);
        });        
    }
    /**
     * return the current value of the field.
     * @returns {string}
     */
    get_value() {
        for (const [_, el] of this._elements){
            if (el.checked) return el.value;
        }
        throw new Error(`[RadioField.get_value()] No value for the field : '${this.name}'`);
    }

    /**
     * Set the value of the field with the value given.
     * @param {string} value 
     */
    set_value(value){
        let found = false;

        for (const [, el] of this._elements){
            if (el.value === value){
                el.checked = true;
                found = true;
            } else {
                el.checked = false;
            }
        }

        if (!found){
            console.warn(`[RadioField.set_value()] Unknown value '${value}'`);
        }
    }

    /**
     * return the default value of the field.
     * @returns {string|null}
     */
    get_default_value(){
        for (const [, el] of this._elements){
            if (el.defaultChecked){
                return el.value;
            }
        }
        throw new Error(`[RadioField.get_default_value()] No default value for '${this.name}'`);
    }

    /**
     * return all possible options of this field.
     * @return {string[]}
     */
    get_options() {
        const results = [];

        for (const [, el] of this._elements){
            results.push(el.value);
        } 
        return results;
    }


    /**
     * add an update handler, the function handler will be called when the field will be updated
     * with the new value in parameters.
     * @param {(value: string) => void} handler 
     */
    on_update(handler){
        for (const [, el] of this._elements){
            el.addEventListener("change", () => {
                if (el.checked){
                    handler(el.value);
                }
            });
        }
    }

    /**
     * Reset the state of the field
     */
    reset() {
        for (const [label, el] of this._elements){
            el.disabled = false;
            el.classList.remove("disabled");

            label.classList.remove("disabled");

            el.style.display = "";
            label.style.display = "";

            el.title = "";
            label.title = "";
        }
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

        for (const [label, el] of this._elements){
            const state = states.get(el.value);
            if (!state){
                continue;
            }

            if (state.hidden){
                el.style.display = "none";
                label.style.display = "none";
                continue;
            }

            if (state.disabled){
                el.disabled = true;
                el.classList.add("disabled");
                label.classList.add("disabled");
            }

            if (state.reason){
                el.title = state.reason;
                label.title = state.reason;
            }
        }
    }
}
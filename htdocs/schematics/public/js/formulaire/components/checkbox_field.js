class CheckboxField extends Field{
    constructor(element){
        super(element);
        this._label = document.querySelector(`label[for="${this.el.id}"]`);
    }

    /**
     * return the current value of the field.
     * @returns {string}
     */
    get_value() {
        return (this.el.checked)? "on" : "off";
    }

    /**
     * Set the value of the field with the value given.
     * @param {string} value 
     */
    set_value(value){
        this.el.checked = (value === "on");
    }

    /**
     * return the default value of the field.
     * @returns {string}
     */
    get_default_value(){
        return (this.el.defaultChecked)? "on" : "off";
    }

    /**
     * return all possible options of this field.
     * @return {string[]}
     */
    get_options() {
        return ["on", "off"];
    }


    /**
     * add an update handler, the function handler will be called when the field will be updated
     * with the new value in parameters.
     * @param {(value: string) => void} handler 
     */
    on_update(handler){
        this.el.addEventListener("input", () => handler(this.get_value()));
    }

    /**
     * Reset the state of the field
     */
    reset() {
        this._label.classList.remove("disabled");
        this.el.classList.remove("disabled");

        this.el.disabled = false;

        this._label.title = "";
        this.el.title = "";
    }


    /**
     * Apply options states by disabling, hiding and add title to explain the reason. 
     * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states 
     */
    apply_options_states(states){
        this.reset();
        // console.log(states);
        if (!states || states.size === 0){
            return;
        }

        const state_on = states.get("on");
        const state_off = states.get("off");

        if ((state_on && state_on.disabled) || (state_off && state_off.disabled)){
            this.el.disabled = true;
            this.el.classList.add("disabled");
            this._label.classList.add("disabled");
            
            if (state_on && state_on.disabled){
                this.el.title = state_on.reason;
                this._label.title = state_on.reason;
            }else if (state_off && state_off.disabled){
                this.el.title = state_off.reason;
                this._label.title = state_off.reason;
            }
            
        }
    }

}
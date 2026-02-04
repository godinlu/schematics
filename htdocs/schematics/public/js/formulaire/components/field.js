/**
 * @type {import('../model/rules.js').Effect}
 * @type {import('./select_field.js')}
 * @type {import('./checkbox_field.js')}
 * @type {import('./radio_field.js')}
 * @typedef {import('./text_field.js')}
 */

/**
 * 
 */
class Field {
    /** @type {HTMLElement} */
    el

    /** @type {string} */
    name

    /**
     * 
     * @param {HTMLElement} element 
     * @returns {Field}
     */
    static from_element(element) {
        if (element.tagName === "SELECT") {
            return new SelectField(element);
        } else if (element.tagName === "INPUT") {
            if (element.type === "checkbox") {
                return new CheckboxField(element);
            }else if (element.type === "radio"){
                return new RadioField(element);
            }else if (element.type === "text"){
                return new TextField(element);
            }
        }
    }

    constructor(element) {
        this.el = element;
        this.name = element.dataset.field;
    }

    /**
     * return the current value of the field.
     * @returns {string}
     */
    get_value() {
        throw new Error("get_value() not implemented");
    }

    /**
     * Set the value of the field with the value given.
     * @param {string} value 
     */
    set_value(value){
        throw new Error("set_value() not implemented");
    }

    /**
     * return the default value of the field.
     * @returns {string|null}
     */
    get_default_value(){
        throw new Error("get_default_value() not implemented");
    }

    /**
     * return all possible options of this field.
     * @return {string[]}
     */
    get_options() {
        throw new Error("get_options() not implemented");
    }

    /**
     * add an update handler, the function handler will be called when the field will be updated
     * with the new value in parameters.
     * @param {(value: string) => void} handler 
     */
    on_update(handler){
        throw new Error("on_update() not implemented");
    }

    /**
     * Reset the state of the field
     */
    reset() {
        throw new Error("reset() not implemented");
    }

    /**
     * Apply options states by disabling, hiding and add title to explain the reason. 
     * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} states 
     */
    apply_options_states(states){
        throw new Error("apply_options_states() not implemented");
    }
}

/**
 * @type {import('./field.js').Field}
 * @type {import('./field.js').SelectField}
 * @type {import('../model/rules.js').Rules}
 */

/**
 * 
 */
class FieldManager{
    /**
     * 
     * @param {Record<string, string|null>} [context] 
     */
    constructor(context){

        /** @type {Map<string, string[]>} */
        this._all_options = new Map();

        /** @type {Map<string, Field>} */
        this._fields = new Map();

        /** @type {Record<string, string|null>} */
        this._ctx = (context) ?? {};

        /** @type {Map<string, Map<string, {disabled: boolean, hidden: boolean, reason: string}} */
        this._all_states = new Map();

        for (const element of document.querySelector("main").querySelectorAll("[data-field]")){
            const name = element.dataset.field;

            const field = Field.from_element(element);
            const options = field.get_options();

            this._fields.set(name, field);
            this._all_options.set(name, options);

            // populate the ctx for each empty field
            if (!(name in this._ctx)){
                this._ctx[name] = field.get_value();
            }
        } 
        // init
        this.resolve_context_and_states();
        this.render_to_DOM();
    } 

    attach_events(){
        for (const [field_name, field] of this._fields){
            field.on_update((value) =>{
                // 1. update the ctx with the updated field
                this._ctx[field_name] = value;

                // 2. resolve event rules
                this.resolve_event_rules(field_name);

                // 3. resolve context and states
                this.resolve_context_and_states();

                //4. render to DOM
                this.render_to_DOM();
            });
        }
    }

    /**
     * Iteratively resolves the full context (`this._ctx`) and UI states (`this._all_states`)
     * until a stable state is reached (i.e., no further changes are necessary).
     *
     * This is the main entry point to propagate all rules and compute the final form state.
     */
    resolve_context_and_states() {
        let changed;
        do{
            this.compute_all_field_states();
            changed = this.synchronize_context_with_states();
        } while(changed);
    }

    /**
     * This method will compute all states by applying rules on the current context and compile effects
     * with this._all_options
     */
    compute_all_field_states(){
        // resset _all_states
        this._all_states = new Map();

        // evalute rules to get effects for this context.
        const all_effects = evaluate_rules(this._ctx);

        for (const [field_name, options] of this._all_options){
            // states for the current field
            let field_states = new Map();

            // set default value states for the current field
            for (const opt of options){
                field_states.set(opt, {disabled: false, hidden: false, reason:""});
            }

            // filter only effect which concern the current field
            const effects = all_effects.filter(ef => ef.field === field_name);

            // apply effect ont the field_states
            this._apply_options_effects(field_states, effects);

            // add field_states to all states
            this._all_states.set(field_name, field_states);
        }

    }

    /**
     * Updates the internal context (`this._ctx`) based on the currently computed states (`this._all_states`).
     * Ensures all field values are valid according to the rules and returns whether the context has changed.
     *
     * @returns {boolean} True if the context was modified, false otherwise.
     */
    synchronize_context_with_states() {
        let changed = false;

        for (const [field_name, field_states] of this._all_states){

            // if the field_states has "*" it means the field don't have options
            // so it's a TextField
            if (field_states.has("*")) continue;

            const current_value = this._ctx[field_name];
            const default_value = this._fields.get(field_name).get_default_value();

            // find the first valid option in order of current_value, default_value and other options
            // if their are no valid options at all set null.
            const new_value = [current_value, default_value, ...field_states.keys()].find(val => {
                const state = field_states.get(val);
                return (state && !state.disabled && !state.hidden);
            }) ?? null;

            if (current_value !== new_value){
                this._ctx[field_name] = new_value;
                changed = true;
            }
        }

        return changed;
    }

    /**
     * Updates the DOM to reflect the current internal context (`this._ctx`) and field states (`this._all_states`).
     * Applies value, visibility, and disabled status to all fields and their associated labels.
     */
    render_to_DOM() {
        for (const [field_name, field_states] of this._all_states){
            const field = this._fields.get(field_name);

            
            field.set_value(this._ctx[field_name]);
            field.apply_options_states(field_states);
        }
    }   

    /**
    * Applies all 'force-default' event rules recursively for a changed field.
    * Updates this._ctx in-place and propagates changes to affected fields.
     * @param {string} changed_field 
     */
    resolve_event_rules(changed_field){
        const effects = evaluate_event_rules(changed_field, this._ctx);

        for (const ef of effects){
            if (ef.type === "force-default"){
                if (this._ctx[ef.field] !== ef.value){
                    this._ctx[ef.field] = ef.value;
                    this.resolve_event_rules(ef.field);
                }
            }
        }
    }

    /**
     * Applies one or more option effects to a field's option states.
     *
     * Iterates over each option in `fieldStates` and updates its `disabled`, `hidden`,
     * and `reason` properties according to the provided effects.
     *
     * @param {Map<string, {disabled: boolean, hidden: boolean, reason: string}>} fieldStates
     *        A map of option values to their current state objects for a single field.
     * @param {OptionsEffect[]} effects
     *        An array of effects to apply to the field's options. Each effect may
     *        disable or hide certain options based on regex matching and effect type.
     *
     * @private
     */
    _apply_options_effects(field_states, effects){
        for (const ef of effects) {
            for (const [optionValue, state] of field_states) {
                const is_match = ef.regex.test(optionValue);

                switch (ef.type) {
                    case "disabled-options":
                        if (is_match) {
                            state.disabled = true;
                            state.reason = ef.reason;
                        }
                        break;
                    case "disabled-other-options":
                        if (!is_match) {
                            state.disabled = true;
                            state.reason = ef.reason;
                        }
                        break;
                    case "hide-options":
                        if (is_match) {
                            state.hidden = true;
                            state.reason = ef.reason;
                        }
                        break;
                    case "hide-other-options":
                        if (!is_match) {
                            state.hidden = true;
                            state.reason = ef.reason;
                        }
                        break;
                    default:
                        console.warn(`[FieldManager._apply_effects] Unknown effect type: ${ef.type}`);
                }

                // Update the map with the modified state (optional, because objects are by reference)
                field_states.set(optionValue, state);
            }
        }
    }

}
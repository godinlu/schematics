/**
 * @typedef {import('./rules.config.js')}
 * @typedef {import('./options.config.js')}
 */


/**
 * RuleEngine is responsible for managing form field states and context
 * according to a set of predefined rules. It supports:
 *  - initializing default context values
 *  - applying event-driven updates recursively
 *  - resolving all derived states for options (disabled, hidden, reason)
 */
class RuleEngine{
    constructor(){
        /**
         * All field options definition.
         * @type {Options}
         */
        this._all_options = options;

        /**
         * Current context of all fields: { fieldKey: value }
         * @type {Object<string, string>}
         */
        this._context = {};

        /**
         * Current computed states for all options of all fields.
         * Map<fieldKey, Map<optionValue, {disabled: boolean, hidden: boolean, reason: string}>>
         * @type {Map<string, Map<string, {disabled: boolean, hidden: boolean, reason: string}>>}
         */
        this._all_states = new Map();
    }

    /**
     * Initialize the engine context with default values from _all_options
     * if missing.
     * @param {Object<string, string>} [context] - Optional initial context values
     */
    init(context){
        const ctx = context ? context : {};
        
        for (const [key, opt_def] of Object.entries(this._all_options)){
            if (!(key in ctx) || (ctx[key] == null) ){
                ctx[key] = opt_def.default;
            }
        }

        this._context = ctx;
    }

    /**
     * Update the context for a single field and recursively propagate
     * event rules until the context stabilizes.
     * @param {string} field_key - The field to update
     * @param {string} new_value - The new value to set
     */
    update_ctx(field_key, new_value){
        this._context[field_key] = new_value;

        const queue = [field_key];

        // 2️⃣ Process queue
        while (queue.length > 0) {
            const current = queue.shift();

            // 3️⃣ Evaluate rules for current field
            const effects = evaluate_event_rules(current, this._context);

            for (const effect of effects) {
                const { field, value } = effect;

                // Only enqueue if the value actually changes
                if (this._context[field] !== value) {
                    this._context[field] = value;
                    queue.push(field); // re-evaluate rules for this field
                }
            }
        }
    }


    /**
     * return the current context
     * @return {Object<string, string>} context
     */
    get_ctx(){
        return this._context;
    }


    /**
     * Resolve the engine context and option states until stabilized.
     * Checks all fields and options, applies rules, and adjusts context
     * values to valid selections.
     * @returns {{context: Object<string,string>, all_states: Map<string, Map<string, {disabled:boolean, hidden:boolean, reason:string}>>}}
     */
    resolve(){
        let stabilized = false;

        while(!stabilized){
            stabilized = true;

            // step 1 : evaluate rules on the context
            const effects = evaluate_rules(this._context);

            // step 2 : transform effects on _all_states
            this._apply_effects(effects);

            // step 3 : check if a selected value is now forbidden in _all_states and need to changed
            for (const [field_key, states] of this._all_states){
                // skip if the field is a text field cause no options
                const options = this._all_options[field_key].options;
                if (options.length === 1 && options[0] === "*") continue;

                const current_value = this._context[field_key];
                const default_value = options.default;

                if (current_value === undefined){
                    console.warn(`[RuleEngine.resolve()] something went wrong for ${field_key}`);
                    continue;
                };
                const new_value = [current_value, default_value, ...states.keys()].find(val => {
                    const state = states.get(val);
                    return (state && !state.disabled && !state.hidden);
                }) ?? null;

                if (current_value !== new_value){
                    this._context[field_key] = new_value;
                    stabilized = false;
                }
            }
        }
        return {context: this._context, all_states: this._all_states};
    }


    /**
     * Apply a set of effects to the _all_states map.
     * Updates option disabled/hidden states and their reasons.
     * @param {Effect[]} effects - List of effects to apply
     * @private
     */
    _apply_effects(effects){
        this._all_states.clear();

        for (const [field_key, opt_def] of Object.entries(this._all_options)){
            const field_states = new Map();

            for (const opt of opt_def.options) {
                field_states.set(opt, {disabled: false, hidden: false, reason: ""});
            }

            this._all_states.set(field_key, field_states);
        }


        for (const effect of effects){
            const field_states = this._all_states.get(effect.field);

            if (!field_states){
                console.warn("[RuleEngine._apply_effects] unrecognized field for the following effect", effect);
                continue;
            }

            for (const [opt, state] of field_states){
                const match = effect.regex.test(opt);
                if (match){
                    if (effect.type === "disabled-options"){
                        state.disabled = true;
                        state.reason = effect.reason;
                    }
                    else if (effect.type === "hide-options"){
                        state.hidden = true;
                        state.reason = effect.reason;
                    }
                }else{
                    if (effect.type === "disabled-other-options"){
                        state.disabled = true;
                        state.reason = effect.reason;
                    }else if (effect.type === "hide-other-options"){
                        state.hidden = true;
                        state.reason = effect.reason;
                    }
                }
            }
        }
    }

}


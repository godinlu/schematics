/**
 * @typedef {import('../options.config.js')}
 * @typedef {import('./rules.config.js')}
 */


/**
 * @typedef {Object} state
 * @property {boolean} disabled
 * @property {string} reason
 */

class RuleEngine{
    /**
     * 
     * @param {RulesConfig} rules_config 
     * @param {Options} all_options 
     */
    constructor(rules_config, all_options){
        this._all_options = all_options;

        this._resource_map = RuleEngine.generate_ressources_mapping(all_options);
        
        rules_config.compile_rules(all_options);
        this._rules = rules_config.rules;
        this._event_rules = rules_config.event_rules;
    }


    /**
     * Resolves the form context by applying all rules until stabilization.
     *
     * This method iteratively computes the states of all options (`all_states`) using
     * `construct_all_states`, then applies resource constraints and rule constraints.
     * For each field in the context, if the currently selected value becomes disabled
     * or hidden according to the rules, it is replaced by the default value or the next
     * available valid option. This process continues until the context is stable and
     * no further changes are required.
     *
     * **Important:** The `context` object passed as a parameter is modified in-place.
     * Any changes to the selected values will be reflected directly in this object.
     *
     * @param {Object<string, string>} context - The current form context. Each key represents
     *                                           a field, and the value is the selected option.
     *
     * @returns {Object<string, Object<string, state>>}
     */
    resolve(context){
        let stabilized = false;
        let all_states = null;

        while(!stabilized){
            stabilized = true;

            all_states = this.construct_all_states();
            this.apply_resources_constraints(context, all_states);
            this.apply_rules_constraints(context, all_states);


            // step 3 : check if a selected value is now forbidden in _all_states and need to changed
            for (const [field_key, states] of Object.entries(all_states)){
                // skip if the field is a text field cause no options
                const options = Object.keys(this._all_options[field_key].options);
                if (options.length === 1 && options[0] === "*") continue;

                const current_value = context[field_key];
                const default_value = this._all_options[field_key].default;

                if (current_value === undefined){
                    console.warn(`[RuleEngine.resolve()] something went wrong for ${field_key}`);
                    continue;
                };
                const new_value = [current_value, default_value, ...Object.keys(states)].find(val => {
                    const state = states[val];
                    return (state && !state.disabled && !state.hidden);
                }) ?? null;

                if (current_value !== new_value){
                    context[field_key] = new_value;
                    stabilized = false;
                }
            }
        }

        return all_states;
    }


    /**
     * Apply default selection recursively on context.
     * @param {Object<string, string>} context 
     * @param {string} updated_field 
     * @param {string} new_value 
     */
    apply_default_selection_on_context(context, updated_field, new_value){
        context[updated_field] = new_value;
        for (const event_rule of Object.values(this._event_rules)){
            if (event_rule.when(context, updated_field)){
                for (const [field, force_value] of Object.entries(event_rule.force)){
                    this.apply_default_selection_on_context(context, field, force_value);
                }
            }
        }
    }

    /**
     * @returns {Object<string, Object<string, state>>}
     */
    construct_all_states(){
        const all_states = {};
        for (const [field, field_data] of Object.entries(this._all_options)){
            all_states[field] = {};
            for (const opt of Object.keys(field_data.options)){
                all_states[field][opt] = {disabled:false, reason:""};
            }
        }
        return all_states;
    }

    /**
     * Apply resource constraints to the state object based on the current context.
     * Disables options already used by other fields and sets a reason.
     * @param {Object<string, string>} context 
     * @param {Object<string, Object<string, state>>} all_states 
     */
    apply_resources_constraints(context, all_states){
        for (const [ctx_field, ctx_value] of Object.entries(context)){
            const used_ressources = this._all_options?.[ctx_field]?.options?.[ctx_value] ?? [];
            for (const resource of used_ressources){
                for (const [target_field, options] of Object.entries(this._resource_map[resource])){
                    // don't affect the same field
                    if (target_field === ctx_field) continue;

                    for (const opt of options){
                        all_states[target_field][opt].disabled = true;

                        let reason = "";
                        if (resource.startsWith("S")){
                            reason = `La sortie ${resource} est déjà prise par le champ : ${ctx_field}`;
                        }else if (resource.startsWith("C")){
                            reason = `Le circulateur ${resource} est déjà pris par le champ : ${ctx_field}`;
                        }else if (resource.startsWith("T")){
                            reason = `La sonde ${resource} est déjà prise par le champ : ${ctx_field}`;
                        }
                        all_states[target_field][opt].reason = reason;
                    }
                    
                }
            }
        }
    }

    /**
     * Apply rules constraints to the state object based on the current context.
     * Disables options already used by other fields and sets a reason.
     * @param {Object<string, string>} context 
     * @param {Object<string, Object<string, state>>} all_states 
     */
    apply_rules_constraints(context, all_states){
        for (const rule of Object.values(this._rules)){
            if (!rule.when(context)){
                for (const [field, options] of Object.entries(rule.allow)){
                    for (const opt of options){
                        all_states[field][opt].disabled = true;
                        all_states[field][opt].reason = rule.reason;
                    }
                }
            }
        }
    }

    /**
     * Builds a mapping of resources to the options that use them.
     *
     * Structure:
     *   { resource: { field: Set<optionValues> } }
     * 
     * Useful for quickly checking which options to disable
     * when a resource is already in use.
     *
     * @param {Options} all_options 
     * 
     * @returns {Object<string, Object<string, Set<string>>>} Resource-to-options map
     */
    static generate_ressources_mapping(all_options){
        const resource_map = {};
        for (const [field, field_data] of Object.entries(all_options)) {
            for (const [opt, ressources] of Object.entries(field_data.options)) {
                for (const r of ressources) {
                    resource_map[r] ??= {};
                    resource_map[r][field] ??= new Set();
                    resource_map[r][field].add(opt);
                }
            }
        }
        return resource_map;

    }


    

}
/**
 * @typedef {import('../options.config.js')}
 * @typedef {import('./rules.config.js')}
 */

class RuleEngine{
    constructor(){
        /**
         * All field options definition.
         * @type {Options}
         */
        this._all_options = options;

        /** @type {Object<string, Object<string, Set<string> >>} */
        this._resource_map = this._generate_ressources_mapping();
        
        /** @type {Rule[]} */
        this._rules = RULES;

        /**
         * Current context of all fields: { fieldKey: value }
         * @type {Object<string, string>}
         */
        this._context = get_formulaire();

        /**
         * Current computed states for all options of all fields.
         * Map<fieldKey, Map<optionValue, {disabled: boolean, hidden: boolean, reason: string}>>
         * @type {Object<string, Object<string, {disabled: boolean, hidden: boolean, reason: string}>>}
         */
        this._all_states = {};
    }


    /**
     * Resolves the form context by applying all rules until stabilization.
     *
     * Iteratively computes `_all_states` using `_compute_all_states` and updates
     * the current context `_context` for each field. If a selected option becomes
     * disabled or hidden according to the rules, it is replaced by the default
     * or the next available valid option.
     *
     * The loop continues until no changes occur, ensuring that all cascading
     * dependencies between fields and signals are properly handled.
     *
     * @returns {{
     *   context: Object<string, string>,
     *   all_states: Object<string, Object<string, {disabled: boolean, hidden: boolean, reason: string}>> 
     * }}
     */
    resolve(){
        let stabilized = false;

        while(!stabilized){
            stabilized = true;

            this._reset_states();
            this._compute_ressource_states();
            this._compute_rules_states();

            //this._compute_all_states();

            // step 3 : check if a selected value is now forbidden in _all_states and need to changed
            for (const [field_key, states] of Object.entries(this._all_states)){
                // skip if the field is a text field cause no options
                const options = Object.keys(this._all_options[field_key].options);
                if (options.length === 1 && options[0] === "*") continue;

                const current_value = this._context[field_key];
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
                    this._context[field_key] = new_value;
                    stabilized = false;
                }
            }
        }

        return {context: this._context, all_states: this._all_states};
    }

    /**
     * Updates the value of a specific field in the current context and propagates dependent changes.
     *
     * Sets `_context[field_key]` to `new_value` and automatically updates related fields
     * according to predefined dependency rules:
     *  - If `typeInstallation` contains "2" and `ballonTampon` is "Aucun", sets `ballonTampon` to "Ballon tampon".
     *  - If `ballonTampon` is not "Aucun", sets `EchangeurDansBT` to "on".
     *
     * This ensures that changes to key fields propagate necessary updates to dependent fields,
     * maintaining a consistent and valid form context.
     *
     * @param {string} field_key - The key of the field to update.
     * @param {string} new_value - The new value to assign to the field.
     */
    update_ctx(field_key, new_value){
        this._context[field_key] = new_value;
        if (
            field_key === "typeInstallation" && 
            /2/.test(this._context.typeInstallation) &&
            this._context.ballonTampon === "Aucun"
        ){
            this.update_ctx("ballonTampon", "Ballon tampon");
        }

        if (field_key === "ballonTampon" && this._context.ballonTampon !== "Aucun"){
            this.update_ctx("EchangeurDansBT", "on");
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
     * Computes the current state of all options based on active signals.
     *
     * Initializes `_all_states` for every field and option, setting default
     * `disabled`, `hidden`, and `reason` values. Then iterates through the
     * current context to propagate signals emitted by selected options.
     * 
     * For each signal, marks the corresponding receiver options as disabled
     * according to the `_receiver_map`. A field cannot disable its own options
     * via its own signals.
     *
     * After execution, `_all_states` reflects the updated `disabled` and `hidden`
     * states of all options, ready for UI rendering or further rule evaluation.
     */
    _compute_all_states(){
        // reset _all_states
        this._all_states = {};
        for (const [field, field_data] of Object.entries(this._all_options)){
            this._all_states[field] = {};
            for (const opt of Object.keys(field_data.options)){
                this._all_states[field][opt] = {disabled:false, hidden:false, reason:""};
            }
        }

        for (const [field, value] of Object.entries(this._context)){
            const signales = this._sender_map?.[field]?.[value] ?? new Set();

            for (const s of signales){
                const receivers = this._receiver_map?.[s] ?? {};
                
                // get the reason in signal_mapping if existe or get
                // constructed reason for equipment such as SXX, TXX or CX
                const reason = signal_reasons?.[s]?.reason ?? this._construct_signal_reason(field, s);

                for (const [receiver_field, opt_set] of Object.entries(receivers)){

                    // a field can't send and receive it's own signal
                    if (field === receiver_field) continue;

                    for (const opt of opt_set){
                        const state = this._all_states[receiver_field][opt];
                        state.disabled = true;
                        state.hidden = hide_signales?.[s]?.[receiver_field] ?? false;
                        if (state.reason === ""){
                            state.reason = reason;
                        }else{
                            state.reason = `Conditions d'activation : \n - ${state.reason}\n - ${reason}`;
                        }
                    }
                }
            }
        }

    }

    /**
     */
    _reset_states(){
        // reset _all_states
        this._all_states = {};
        for (const [field, field_data] of Object.entries(this._all_options)){
            this._all_states[field] = {};
            for (const opt of Object.keys(field_data.options)){
                this._all_states[field][opt] = {disabled:false, hidden:false, reason:""};
            }
        }
    }


    _compute_ressource_states(){
        for (const [ctx_field, ctx_value] of Object.entries(this._context)){
            const used_ressources = this._all_options?.[ctx_field]?.options?.[ctx_value] ?? [];
            for (const resource of used_ressources){
                for (const [target_field, options] of Object.entries(this._resource_map[resource])){
                    // don't affect the same field
                    if (target_field === ctx_field) continue;

                    for (const opt of options){
                        this._all_states[target_field][opt].disabled = true;

                        let reason = "";
                        if (resource.startsWith("S")){
                            reason = `La sortie ${resource} est déjà prise par le champ : ${ctx_field}`;
                        }else if (resource.startsWith("C")){
                            reason = `Le circulateur ${resource} est déjà pris par le champ : ${ctx_field}`;
                        }else if (resource.startsWith("T")){
                            reason = `La sonde ${resource} est déjà prise par le champ : ${ctx_field}`;
                        }
                        this._all_states[target_field][opt].reason = reason;
                    }
                    
                }
            }
        }
    }

    _compute_rules_states(){
        for (const rule of this._rules){
            if (!rule.when(this._context)){
                for (const [field, options] of Object.entries(rule.allow)){
                    for (const opt of options){
                        this._all_states[field][opt].disabled = true;
                        this._all_states[field][opt].reason = rule.reason;
                    }
                }
            }
        }
    }



    /**
     * 
     * @param {string} sender_field 
     * @param {string} signal
     * @return {string} 
     */
    _construct_signal_reason(sender_field, signal){
        const sortie_match = signal.match(/^[<>]?(S\d+)$/);
        if (sortie_match) {
            return `La sortie ${sortie_match[1]} est déjà prise par le champ : ${sender_field}`;
        }
        const sonde_match = signal.match(/^[<>]?(T\d+)$/);
        if (sonde_match) {
            return `La sonde ${sonde_match[1]} est déjà prise par le champ : ${sender_field}`;
        }

        const circ_match = signal.match(/^[<>]?(C\d+)$/);
        if (circ_match){
            return `Le circulateur ${circ_match[1]} est déjà pris par le champ : ${sender_field}`;
        }
        console.log(`[RuleEngine._construct_signal_reason] No reason found for the signal : "${signal}" sended by "${sender_field}".`);
        return "";
    }


    /**
     * Generates mappings for rule signals based on all field options.
     *
     * Parses each option's rules to build:
     *  - sender_map: which signals are emitted by each field option.
     *  - receiver_map: which options are affected (receive) by each signal.
     *
     * Supports rules prefixed with:
     *  - ">"  : send signal
     *  - "<"  : receive signal
     * 
     * Can also send and receive if no prefix.
     *
     * @param {Options} all_options - The full options definition with rules.
     * @returns {{
     *   sender_map: Object<string, Object<string, Set<string>>>,
     *   receiver_map: Object<string, Object<string, Set<string>>>
     * }}
     *   sender_map[field][option] = Set of signals sent by that option
     *   receiver_map[signal][field] = Set of options affected by that signal
     */
    _generate_rules_mapping(all_options) {
        const sender_map = {};
        const receiver_map = {};

        for (const [field, field_data] of Object.entries(all_options)) {
            for (const [opt, rules] of Object.entries(field_data.options)) {
                for (const r of rules) {

                    const signal = r.replace(/^[<>!]+/, "");

                    // SEND
                    if (!r.startsWith("<")) {

                        sender_map[field] ??= {};
                        sender_map[field][opt] ??= new Set();

                        if (r.startsWith(">!")){
                            for (const [_opt, _rules] of Object.entries(field_data.options)){
                                if (_rules.includes(r)) continue;
                                sender_map[field][_opt] ??= new Set();
                                sender_map[field][_opt].add(signal);
                            }
                        }else{
                            sender_map[field][opt].add(signal);
                        }
                    }

                    // RECEIVE
                    if (!r.startsWith(">")) {

                        receiver_map[signal] ??= {};
                        receiver_map[signal][field] ??= new Set();

                        if (r.startsWith("<!")){
                            for (const [_opt, _rules] of Object.entries(field_data.options)){
                                if (_rules.includes(r)) continue;
                                receiver_map[signal][field].add(_opt);
                            }
                        }else{
                            receiver_map[signal][field].add(opt);
                        }          
                    }
                }
            }
        }

        return { sender_map, receiver_map };
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
     * @returns {Object<string, Object<string, Set<string>>>} Resource-to-options map
     */
    _generate_ressources_mapping(){
        const resource_map = {};
        for (const [field, field_data] of Object.entries(this._all_options)) {
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
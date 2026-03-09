
/**
 * @type {import('./rule_engine.js').RuleEngine}
 * @type {import('./field.js').SelectField}
 * @type {import('./field_manager.js').FieldManager}
 * @type {import('./rules.config.js').process_rules}
 * @typedef {import('./options.config.js')}
 */

/**
 * 
 */
class FormulaireApp{
    constructor(){
        this._context = sessionStore.formulaire;

        this._rule_engine = new RuleEngine(rule_config, options);

        this._fields = new Map();

        // init all fields
        for (const field of document.querySelector("main").querySelectorAll("[data-field]")){
            const field_key = field.dataset.field;
            this._fields.set(field_key, field);
        }

        // render once at the init
        this.render();

        // attach all event
        this._attach_events();  
    }

    render(){
        // here this._context will be updated inplace
        const all_states = this._rule_engine.resolve(this._context);

        console.log(get_description_from_ctx(this._context));

        // save the context in the session
        sessionStore.formulaire = this._context;

        for (const [field_key, states] of Object.entries(all_states)){
            set_field_states(this._fields.get(field_key), states);
        }

        for (const [field_key, value] of Object.entries(this._context)){
            set_field_value(this._fields.get(field_key), value);
        }


    }


    _on_field_update(field_key, new_value){
        // appply default selection and update inplace the context
        this._rule_engine.apply_default_selection_on_context(this._context, field_key, new_value);

        // render all field with new computed states
        this.render();
    }


    _attach_events(){
        for (const [field_key, field] of this._fields){
            field.addEventListener("change", () =>{
                this._on_field_update(field_key, get_field_value(field));
            });
        }
    }

}
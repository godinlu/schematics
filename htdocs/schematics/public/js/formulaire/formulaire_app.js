
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
        this._rule_engine = new RuleEngine();
        this._rule_engine.init();
        this._attach_events();  
        this._fields = new Map();

        // init all fields
        for (const field of document.querySelector("main").querySelectorAll("[data-field]")){
            const field_key = field.dataset.field;
            this._fields.set(field_key, field);
        }

        // render once at the init
        this.render();

    }

    render(){
        const {context, all_states} = this._rule_engine.resolve();

        for (const [field_key, states] of all_states){
            set_field_states(this._fields.get(field_key), states);
        }

        for (const [field_key, value] of Object.entries(context)){
            set_field_value(this._fields.get(field_key), value);
        }


    }


    _on_field_update(field_key, new_value){
        this._rule_engine.update_ctx(field_key, new_value);
        this.render();
    }


    _attach_events(){
        document.querySelector("main").addEventListener("change", (event) =>{
            const field_key = event.target.dataset.field;
            if (!field_key){
                console.warn(`[FormulaireApp._attach_events] unrecognized field : ${event.target}`);
            }
            this._on_field_update(field_key, event.target.value);
        });
    }

}
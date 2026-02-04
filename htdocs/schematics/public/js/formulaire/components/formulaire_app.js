
/**
 * @type {import('../model/rule_engine.js').RuleEngine}
 * @type {import('./field.js').SelectField}
 * @type {import('./field_manager.js').FieldManager}
 * @type {import('../model/rules.js').process_rules}
 */

/**
 * 
 */
class FormulaireApp{
    constructor(){
        // this.rule_engine.update("typeInstallation");

        this.field_manager = new FieldManager();
        this.field_manager.attach_events();

        //this.field_manager.attach_events(rules);
        //this.field_manager.init_rules(rules);

        // this.field_manager.on_field_update(() =>{
        //     const instructions = this.rule_engine.evaluate( this.field_manager.get_values() );
        //     this.field_manager.reset();
        //     this.field_manager.apply_instructions(instructions);
        // });

        
    }

}
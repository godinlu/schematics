
/**
 * @type {import('../model/rule_engine.js').RuleEngine}
 * @type {import('./field.js').SelectField}
 * @type {import('./field_manager.js').FieldManager}
 */

/**
 * 
 */
class FormulaireApp{
    constructor(){
        this.rule_engine = new RuleEngine();

        this.field_manager = new FieldManager();
        console.log(this.field_manager.get_values());

        this.#attach_events();

        // this.select = new SelectField(document.querySelector("select"));
        // console.log(this.select.get_options());
        // this.select.render([{value:"SC1Z", reason:"salut", hide: false}]);

        
    }

    #init_fields(){

    }


    #attach_events(){
        let main = document.querySelector("main");

        main.addEventListener("change", (event) =>{
            const select = event.target;
            if (!select) return;
            if (!select.dataset.field) return;

            console.log(select.dataset.field);

        });
    }
}
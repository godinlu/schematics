/**
 * @type {import('./field.js').SelectField}
 */

/**
 * 
 */
class FieldManager{
    constructor(){
        this.fields = new Map();

        document.querySelector("main").querySelectorAll("[data-field]").forEach(element =>{
            let field;
            if (element.tagName === "SELECT"){
                field = new SelectField(element);
            }
            this.fields.set(element.dataset.field, field);
        });
    }


    get_values() {
        const values = {};
        for (const [fieldName, field] of this.fields.entries()) {
            values[fieldName] = field.get_value();
        }
        return values;
    }
}
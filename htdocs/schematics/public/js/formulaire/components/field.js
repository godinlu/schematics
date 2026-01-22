/**
 * @type {import('../model/rules.js').Effect}
 */

class Field{
    constructor(element){
        this.el = element;
        this.name = element.dataset.field;
    }

    /**
     * @returns {string}
     */
    get_value(){
        throw new Error("get_value() not implemented");
    }

    get_options(){
        throw new Error("get_options() not implemented");
    }

    /**
     * 
     * @param {{
     *  value: string,
     *  reason: string,
     *  hide: boolean
     * }[]} forbid_rules 
     */
    render(forbid_rules){
        throw new Error("get_options() not implemented");
    }

    set_disabled(disabled = true){
        this.el.disabled = disabled;
    }

}


class SelectField extends Field{
    get_value(){
        return this.el.value;
    }

    get_options(){
        return Array.from(this.el.options).map(opt => opt.value);
    }

    /**
     * Apply forbid rules to a select field
     * @param {{
     *  value: string,
     *  reason: string,
     *  hide: boolean
     * }[]} forbid_rules 
     */
    render(forbid_rules) {
        const forbiddenValues = new Set();

        for (const rule of forbid_rules) {
            const option = Array.from(this.el.options).find(opt => opt.value === rule.value);
            if (!option) continue;

            forbiddenValues.add(option.value);

            if (rule.hide) {
                option.style.display = "none";      // cache complètement l'option
            } else {
                option.disabled = true;             // désactive l'option
            }

            if (rule.reason) {
                option.title = rule.reason;         // affiche la raison au hover
            }
        }

        // Si la valeur sélectionnée est interdite, changer la sélection
        if (forbiddenValues.has(this.el.value)) {
            // trouver la première option valide
            const firstValid = Array.from(this.el.options).find(opt => !forbiddenValues.has(opt.value) && opt.style.display !== "none");
            if (firstValid) {
                this.el.value = firstValid.value;
            } else {
                // aucun choix valide → vider la sélection
                this.el.value = "";
            }

            const event = new Event('change', { bubbles: true });
            this.el.dispatchEvent(event);
        }
    }

}
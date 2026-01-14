/**
 * @type {import('../store/devis_store').devisStore}
 * @type {import('./devis_category.js').DevisCategory}
 * @type {import('../model/default_articles_ref.js').get_default_articles_ref}
 */

class DevisBody{
    /** @type {Map<string, DevisCategory>} */
    devis_categories

    constructor(formulaire){
        this.devis_categories = new Map();
        this.formulaire = formulaire;

        // init empty categories
        devisStore.data_manager.get_childrens_categories('articles').forEach(categ =>{
            this.devis_categories.set(categ.id, new DevisCategory(categ));
        });

        devisStore.subscribe("reset", () => this.reset());
        
    }

    /**
     * reset the body by reseting all categories and by adding default articles from the formulaire
     */
    reset(){
        this.devis_categories.forEach(categ => categ.reset());

        // init the default articles in the body
        for (const {ref, base_category_id} of get_default_articles_ref(this.formulaire)){
            this.devis_categories.get(base_category_id).insert_row(ref);
        }
    }

    /**
     * 
     * @param {HTMLElement} tbody 
     */
    mount(tbody){
        tbody.innerHTML = "";
        this.devis_categories.forEach(devis_category => devis_category.mount(tbody));
    }


    /**
     * 
     * @param {{
     *  type: string,
     *  payload: Object,
     *  timestamp?: number
     * }} action  
     */
    submit_action(action){
        if (!("base_category_id" in action.payload)){
            throw new Error("key : 'base_category_id' not found in payload.");
        }

        this.devis_categories.get(action.payload.base_category_id).submit_action(action);
    }

    /**
     * return the total amount of the devis before taxes
     * @returns {number}
     */
    get total_amount(){
        let res = 0;
        this.devis_categories.forEach((cat) => {res += cat.total_amount});
        return res;
    }


    /**
     * returns devis categories
     * 
     * @param {boolean} [only_non_empty=true] - If true, returns only non-empty categories
     * @returns {DevisCategory[]}
     */
    get_devis_categories(only_non_empty = true){
        return [...this.devis_categories.values()].filter(categ => !only_non_empty || !categ.is_empty);
    }

    
}

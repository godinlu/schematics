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

        // init empty categories
        devisStore.data_manager.get_childrens_categories('articles').forEach(categ =>{
            this.devis_categories.set(categ.id, new DevisCategory(categ));
        });

        // init the default articles in the body
        for (const {ref, base_category_id} of get_default_articles_ref(formulaire)){
            this.devis_categories.get(base_category_id).insert_row(ref);
        }
        
    }

    /**
     * 
     * @param {HTMLElement} tbody 
     */
    mount(tbody){
        tbody.innerHTML = "";
        this.devis_categories.forEach(el => el.mount(tbody));
    }


    submit_action(action){
        if (!("base_category_id" in action)){
            throw new Error("The action need a base_category_id.");
        }
        this.devis_categories.get(action.base_category_id).submit_action(action);
    }

    /**
     * return the total price of the devis
     * @returns {number} - total price of the devis
     */
    get_price(){
        let res = 0;
        this.devis_categories.forEach((cat) => {res += cat.get_price()});
        return res;
    }


    /**
     * returns devis categories
     * 
     * @param {boolean} [only_non_empty=true] - If true, returns only non-empty categories
     * @returns {DevisCategory[]}
     */
    get_devis_categories(only_non_empty = true){
        return [...this.devis_categories.values()].filter(categ => !only_non_empty || !categ.is_empty());
    }

    
}

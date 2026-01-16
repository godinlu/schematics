/**
 * @type {import('../store/devis_store').devisStore}
 * @type {import('./devis_category.js').DevisCategory}
 * @type {import('../model/default_articles_ref.js').get_default_articles_ref}
 * @type {import('../utils.js').debounce}
 */

class DevisBody{
    /** @type {Map<string, DevisCategory>} */
    devis_categories

    constructor(formulaire){
        this.devis_categories = new Map();
        this.formulaire = formulaire;
        this.global_remise = 0;

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

        // reset the global remise
        this.global_remise = 0;

        // init the default articles in the body
        for (const {ref, base_category_id} of get_default_articles_ref(this.formulaire)){
            this.devis_categories.get(base_category_id).insert_row(ref);
        }
    }

    /**
     * 
     * @param {HTMLTableElement} table 
     */
    mount(table){
        let input = table.querySelector("thead input");
        input.value = this.global_remise;

        let tbody = table.querySelector("tbody");
        tbody.innerHTML = "";
        this.devis_categories.forEach(devis_category => devis_category.mount(tbody));

        // avoid stacking handler on re-render
        if (!this.add_handlers){
            this.add_handlers = true;
            this.#attach_events(input);
        }
        
    }


    /**
     * Submit the action given.
     * - The action given will always start by "body-..."
     * - The action "body-edit-global-remise" will set all devis_row remise to the new_value in payload
     * and force a render
     * - Other actions will be redistributed to the corresponding devis_category according to "base_category_id"
     *  in payload
     * 
     * @param {{
     *  type: string,
     *  payload: Object,
     *  timestamp?: number
     * }} action  
     */
    submit_action(action){
        // manage action "body-edit-global-remise" 
        if (action.type === "body-edit-global-remise"){
            this.global_remise = action.payload.new_value;
            for (const [category_id, devis_category] of this.devis_categories){
                if (category_id !== "service transport"){
                    devis_category.set_global_remise(action.payload.new_value);
                }
            }
            return;
        }

        // redirect the action to the corresponding category and checking the payload
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

    /**
     * Attach all events listeners :
     * - submit an "body-edit-global-remise" on input of the corresponding input
     * 
     * @param {HTMLInputElement} input 
     */
    #attach_events(input){
        const debouncedHandler = debounce(()=>{
            const new_value = parseInt(input.value);

            if (!isNaN(new_value) && new_value !== this.global_remise && new_value >= 0 && new_value <= 30){
                devisStore.submit_action({type:"body-edit-global-remise", payload:{new_value}});
                devisStore.dispatch("render");
            }
        }, 300);

        input.addEventListener("input", () => debouncedHandler());
    }

    
}

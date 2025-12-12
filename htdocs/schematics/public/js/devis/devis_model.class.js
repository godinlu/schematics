/**
 * @type {import('./data_manager.class').DataManager}
 */

class DevisModel{
    /**
     * 
     * @param {DataManager} data_manager 
     * @param {Object} formulaire 
     * @param {Object[]} [actions] 
     */
    constructor(data_manager, formulaire, actions = []){
        this.data_manager = data_manager;
        this.formulaire = formulaire;

        this.header_fields = new Map();
        this.article_rows = new Map();
        this.action_list = [];

        // insert all default ref from the installation
        get_default_articles_ref(formulaire).forEach(ref => this.insert_article(ref));

        // init the header fields
        this.#init_header_fields(); 

        // submit all action given (to simulate the save of previous action)
        actions.forEach(action => this.submit_action(action));

    }

    /**
     * 
     */
    submit_action(action){
        try {
            if (action.type === "body-add"){
                this.insert_article(action.ref);
            }else if (action.type === "body-edit"){
                const art = this.data_manager.get_article(action.new_ref);
                const base_categ = this.data_manager.get_base_categorie_id(art.categorie_id);

                let new_row = new ArticleRow({...art, base_categorie_id:base_categ.id});

                // preserve the old priority
                new_row.priority = this.article_rows.get(action.old_ref).priority;

                this.article_rows.delete(action.old_ref);
                this.article_rows.set(action.new_ref, new_row);
            }else if (action.type === "body-move"){
                this.#move_article(action.ref, action.direction);

            }else if (action.type === "body-remove"){
                this.article_rows.delete(action.ref);
            }else if (action.type === "body-update-qte"){
                if (action.old_value === "") action.old_value = this.article_rows.get(action.ref).quantity;
                this.article_rows.get(action.ref).quantity = parseInt(action.new_value);
            }else if (action.type === "body-update-remise"){
                if (action.old_value === "") action.old_value = this.article_rows.get(action.ref).remise;
                this.article_rows.get(action.ref).remise = parseInt(action.new_value);
            }else if (action.type === "body-add-text"){
                let new_row = new ArticleRow({
                    ref: action.ref,
                    label: "",
                    prix: 0,
                    categorie_id: action.base_categorie_id,
                    priority: this.get_rows_ordered_by_categ(action.base_categorie_id).at(-1)?.priority + 1,
                    base_categorie_id: action.base_categorie_id
                });
                this.article_rows.set(action.ref, new_row);
            }else if (action.type === "body-edit-text"){
                this.article_rows.get(action.ref).label = action.new_label;
            }else if (action.type === "header-edit-field"){
                if (action.old_value === "") action.old_value = this.header_fields.get(action.field)??"";
                if (action.old_value !== this.header_fields.get(action.field)){
                    throw new Error("Old value doesn't match with the reel value");
                }
                this.header_fields.set(action.field, action.new_value);
            }else{
                throw new TypeError("submit_action expects an Action instance");
            }
            this.action_list.push(action);
        } catch (error){
            console.warn(`Warning : Can't submiting action : ${error}`);
        }
    }

    /**
     * Inserts an article into the rows map.  
     * If the article already exists, its quantity is incremented.  
     * Otherwise, the article is retrieved from the data manager and a new DevisRow is created.
     *
     * @param {string} article_ref - The reference of the article to insert.
     */
    insert_article(article_ref){
        if (this.article_rows.has(article_ref)){
            this.article_rows.get(article_ref).quantity += 1;
        }else{
            try{
                const art = this.data_manager.get_article(article_ref);
                const base_categ = this.data_manager.get_base_categorie_id(art.categorie_id);
                let devis_row = new ArticleRow({...art, base_categorie_id:base_categ.id});
                this.article_rows.set(article_ref, devis_row);
            }catch (error){
                console.log(`Warning : Can't insert article : ${error}`);
            }
        }
    }

     /**
     * Returns a list of articles filtered by their base_categorie_id
     * and ordered by priority.
     *
     * @param {number} base_categorie_id
     * @returns {ArticleRow[]}
     */
    get_rows_ordered_by_categ(base_categorie_id) {
        // Convert Map → Array, filter, sort
        return [...this.article_rows.values()]
            .filter(a => a.base_categorie_id === base_categorie_id)
            .sort((a, b) => a.priority - b.priority);

    }

    /**
     * Move an article up or down within its base category by swapping priorities
     * with the neighboring article in the requested direction.
     *
     * @param {string} ref - Reference of the article to move.
     * @param {number} direction - Direction of the move: -1 (up) or +1 (down).
     * @throws {Error} If the article is not found or cannot be moved.
     */
    #move_article(ref, direction){
        // Retrieve the article to move
        let devis_row = this.article_rows.get(ref);
        if (!devis_row) throw new Error("row not found in devis");

        // Get all articles from the same base category, ordered by priority
        const rows = this.get_rows_ordered_by_categ(devis_row.base_categorie_id);

        // Find the current index of the article in the ordered list
        const index = rows.findIndex(a => a.ref === devis_row.ref);
        if (index === -1) throw new Error("Article not found in ordered list");

        // Compute the target index based on direction (−1 or +1)
        const targetIndex = index + direction;

        // Ensure the target index is within bounds
        if (targetIndex < 0 || targetIndex >= rows.length) {
            // Nothing to do — the article is already at the boundary
            return;
        }

        // Retrieve the neighboring article that will swap priority
        const swapped_row = this.article_rows.get(rows[targetIndex].ref);
        if (!swapped_row) {
            throw new Error("Swapped article not found in the current map");
        }

        // Swap priorities between the two articles
        const tmp_priority = devis_row.priority;
        devis_row.priority = swapped_row.priority;
        swapped_row.priority = tmp_priority;
    }


    /**
     * Init all header field values with information from the installation
     */
    #init_header_fields(){
        this.header_fields.set("header-date", new Date().toISOString().split("T")[0]);

        const full_name = [this.formulaire.nom_client?.toUpperCase(), this.formulaire.prenom_client].filter(Boolean).join(" ");
        const header_objet = [full_name, this.formulaire.typeInstallation].filter(Boolean).join(" - ");
        this.header_fields.set("header-objet", header_objet);

        this.header_fields.set("header-affaire", this.formulaire.installateur);
        this.header_fields.set("header-field1", this.formulaire.commercial);
        this.header_fields.set("header-mail", this.formulaire.adresse_mail);
        this.header_fields.set("header-installateur", this.formulaire["Prénom/nom"]);

    }
}


class ArticleRow{
       /**
     * Create a DevisRow
     * @param {Object} options - DevisRow properties
     * @param {string} options.ref
     * @param {string} options.label
     * @param {number} options.prix
     * @param {number} options.categorie_id
     * @param {number} options.priority
     * @param {number} options.base_categorie_id
     */
    constructor({ref, label, prix, categorie_id, priority, base_categorie_id}){
        this.ref = ref;
        this.label = label;
        this.prix = prix;
        this.categorie_id = categorie_id;
        this.priority = priority;
        this.base_categorie_id = base_categorie_id;
        this.quantity = 1;
        this.remise = 0;
    }
}
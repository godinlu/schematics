/**
 * @type {import('./data_manager.class').DataManager}
 * @type {import('./devis_row.class').DevisRow}
 * @type {import('./modal.class').Modal}
 */


/** 
 * @property {DataManager} data_manager
 * @property {Action[]} actions - Array to store actions
 * @property {Map<string, DevisRow>} rows - Map to store articles
 */
class Devis{
    /** @type {Map<string, DevisRow>} */
    rows

    #qte_timers

    /**
     * 
     * @param {DataManager} data_manager - data manager
     * @param {string[]} default_articles - Default article on the devis
     * @param {Action[]} [actions] - Optional array of actions
     */
    constructor(render_div, data_manager, default_articles_ref, actions = []){
        this.render_table = render_div;
        this.data_manager = data_manager;
        this.actions = []; 
        this.default_articles_ref = default_articles_ref;
        this.#qte_timers = new Map();

        this.rows = new Map(); 
        this.modal = new Modal();

        for (const ref of default_articles_ref){
            this.insert_article(ref);
        }

        for (const action of actions){
            this.submit_action(action);
        }
    }

    /**
     * 
     */
    submit_action(action){
        try {
            if (action.type === "add"){
                this.insert_article(action.ref);
            }else if (action.type === "edit"){
                const art = this.data_manager.get_article(action.new_ref);
                const base_categ = this.data_manager.get_base_categorie_id(art.categorie_id);

                let new_row = new DevisRow({...art, base_categorie_id:base_categ.id});

                // preserve the old priority
                new_row.priority = this.rows.get(action.old_ref).priority;

                this.rows.delete(action.old_ref);
                this.rows.set(action.new_ref, new_row);
            }else if (action.type === "move"){
                this.#move_article(action.ref, action.direction);

            }else if (action.type === "remove"){
                this.rows.delete(action.ref);
            
            }else if (action.type === "update_qte"){
                this.rows.get(action.ref).quantity = parseInt(action.new_qte);
            }else{
                throw new TypeError("submit_action expects an Action instance");
            }
            this.actions.push(action);
        } catch (error){
            console.log(`Warning : Can't submiting action : ${error}`);
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
        if (this.rows.has(article_ref)){
            this.rows.get(article_ref).quantity += 1;
        }else{
            const art = this.data_manager.get_article(article_ref);
            const base_categ = this.data_manager.get_base_categorie_id(art.categorie_id);
            let devis_row = new DevisRow({...art, base_categorie_id:base_categ.id});
            this.rows.set(article_ref, devis_row);
        }
    }

    /**
     * Returns a list of articles filtered by their base_categorie_id
     * and ordered by priority.
     *
     * @param {number} base_categorie_id
     * @returns {DevisRow[]}
     */
    get_rows_ordered_by_categ(base_categorie_id) {
        // Convert Map → Array, filter, sort
        return [...this.rows.values()]
            .filter(a => a.base_categorie_id === base_categorie_id)
            .sort((a, b) => a.priority - b.priority);

    }

    /**
     * Generate HTML element for this devis
     * @returns {HTMLElement} The devis div element
     */
    render() {
        this.render_table.innerHTML = "";

        let thead = document.createElement("thead");
        thead.innerHTML = "<tr><th>Ref</th><th>Désignation</th><th>Prix</th><th>Quantité</th><th>Edition</th></tr>";

        let tbody = document.createElement("tbody");

        for (const categ of this.data_manager.get_childrens_categories(0)){
            let categ_tr = document.createElement("tr");
            tbody.appendChild(categ_tr).innerHTML = `<th colspan="5">${categ.name}</th>`

            for (const devis_row of this.get_rows_ordered_by_categ(categ.id)){
                tbody.appendChild(devis_row.html_element(
                    this.edit_handler, this.up_handler, this.down_handler, this.remove_handler, this.update_qte_handler
                ));
            }

            let td = document.createElement("td");
            td.colSpan = "5";

            let add_button = document.createElement("button");
            add_button.innerHTML = '<i class="fa-solid fa-plus"></i>';
            add_button.addEventListener("click", () => this.add_handler(categ.id));

            tbody.appendChild(document.createElement("tr")).appendChild(td).appendChild(add_button);
        }

        this.render_table.appendChild(thead);
        this.render_table.appendChild(tbody);
    }

    add_handler = (categorie_id) => {
        this.#set_modal_content({type:"add", ref: ""}, categorie_id);
    }

    edit_handler = (ref) =>{
        const devis_row = this.rows.get(ref);
        this.#set_modal_content({type:"edit", old_ref: ref, new_ref:""}, devis_row.categorie_id);
    }
    up_handler = (ref) => {
        this.submit_action({type: "move",ref: ref,  direction: -1});
        this.render();
    }
    down_handler = (ref) => {
        this.submit_action({type: "move", ref: ref, direction: 1});
        this.render();
    }

    remove_handler = (ref) => {
        this.submit_action({type: "remove", ref: ref});
        this.render();
    }

    /**
     * Handles quantity updates with a debounce mechanism to avoid logging excessive actions
     * when a user rapidly modifies the quantity (typing, spinner, spam clicking, etc.).
     *
     * @param {string} ref - The article reference whose quantity is being updated.
     * @param {number} new_qte - The new quantity value entered by the user.
     */
    update_qte_handler = (ref, new_qte) => {
        const devis_row = this.rows.get(ref);

        // If a pending timer exists for this article, cancel it
        if (this.#qte_timers.has(ref)) {
            clearTimeout(this.#qte_timers.get(ref));
        }

        // Create a new debounce timer
        const timer = setTimeout(() => {
            this.submit_action({type: "update_qte",ref,old_qte: devis_row.quantity, new_qte });

            // Remove the timer once the action has been processed
            this.#qte_timers.delete(ref);

        }, 300); // Recommended debounce delay (300ms)

        // Store the timer for this specific article reference
        this.#qte_timers.set(ref, timer);
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
        let devis_row = this.rows.get(ref);
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
        const swapped_row = this.rows.get(rows[targetIndex].ref);
        if (!swapped_row) {
            throw new Error("Swapped article not found in the current map");
        }

        // Swap priorities between the two articles
        const tmp_priority = devis_row.priority;
        devis_row.priority = swapped_row.priority;
        swapped_row.priority = tmp_priority;
    }


    #set_modal_content(action, categorie_id){
        const sub_categs = this.data_manager.get_childrens_categories(categorie_id);

        // reset the modal content
        this.modal.content_div.innerHTML = "";

        // add the breadcrumb trail
        let breadcrumb = document.createElement("span");
        breadcrumb.className = "breadcrumb";
        breadcrumb.innerText = action.type + " : ";

        for (const c of this.data_manager.get_parents_categories(categorie_id)){
            let a = document.createElement("a");
            a.href = "#";
            a.addEventListener("click", () => this.#set_modal_content(action, c.id));
            a.innerText = c.short_name;
            breadcrumb.appendChild(a);
        }
        this.modal.content_div.appendChild(breadcrumb);

        if (sub_categs.length > 0){
            this.#set_modal_categories_view(action, sub_categs);
        }else{
            this.#set_modal_article_view(action, this.data_manager.get_articles_by_categorie_id(categorie_id));
        }

        this.modal.show();
    }

    /**
     * 
     * @param {object} action 
     * @param {categorie_dict[]} categories 
     */
    #set_modal_categories_view(action, categories){
        let div = document.createElement("div");
        div.classList.add("modal-categorie");

        // loop on categories to add corresponding button
        for (const cat of categories){
            let button = document.createElement("button");
            button.innerText = cat.name;

            button.addEventListener("click", () => this.#set_modal_content(action, cat.id));

            div.appendChild(button);
        }
        this.modal.content_div.appendChild(div);
    }

    /**
     * 
     * @param {Object} action 
     * @param {article_dict[]} articles 
     */
    #set_modal_article_view(action, articles){
        // create a container div to able scrolling on table
        let div = document.createElement("div");
        div.classList.add("table-scroll");

        let table = document.createElement("table");
        table.classList.add("articles-table");

        // create the thead 
        let thead = document.createElement("thead");
        thead.innerHTML= '<tr><th>Ref</th><th>Désignation</th><th>Prix</th></tr>';

        // create the tbody
        let tbody = document.createElement("tbody");
        for (const art of articles){
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${art.ref}</td><td>${art.label}</td><td>${art.prix} €</td>`;

            let action_copy = {...action}; // copy the object to avoid artifact
            if (action_copy.type === "edit") action_copy.new_ref = art.ref;
            if (action_copy.type === "add") action_copy.ref = art.ref;

            tr.addEventListener("click", () => {
                this.submit_action(action_copy);
                this.modal.hide();
                this.render();
            });

            tbody.appendChild(tr);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        this.modal.content_div.appendChild(div).appendChild(table);
    }



}



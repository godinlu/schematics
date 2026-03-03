/**
 * @type {import('../store/devis_store.js').devisStore}
 * @type {import('./devis_row.js').DevisRow}
 * @type {import('../model/data_manager.class.js').category_dict}
 */

/**
 * 
 */
class DevisCategory{
    /** @type {Map<string, DevisRow>} */
    rows
    /** @type {category_dict} */
    categ

    /**
     * 
     * @param {category_dict} categ 
     */
    constructor(categ){
        this.categ = categ;
        this.rows = new Map();
        this._global_remise = 0;

    }

    /**
     * reset the instance by emptying rows
     * this method will be called at each reset by the devis_body
     */
    reset(){
        this.rows = new Map();
        this._global_remise = 0;
    }

    /**
     * 
     * @param {HTMLElement} tbody 
     */
    mount(tbody){
        const header = document.createElement("tr");
        header.innerHTML = `
            <th></th>
            <th>${this.categ.name}</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        `;

        const footer = document.createElement("tr");
        footer.innerHTML = `
            <td></td>
            <td class="add-buttons">
                <button data-action="add-article"><i class="fa-solid fa-plus"></i></button>
                <button data-action="add-text">TEXT</button>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;

        this.attach_event_listeners(footer);

        tbody.appendChild(header);
        this.get_rows_ordered().forEach(el => el.mount(tbody));
        tbody.appendChild(footer);
    }

    /**
     * return the total amount of all rows of the category
     * @returns {number}
     */
    get total_amount(){
        let res = 0;
        this.rows.forEach((devis_row) => {res += devis_row.total_amount});
        return res;
    }

    /**
     * return true if the category is empty
     * @returns {boolean} - true if the category is empty
     */
    get is_empty(){
        return this.rows.size === 0;
    }

    /**
     * attach event listener for the add article button and the add text button
     * @param {HTMLTableRowElement} footer 
     */
    attach_event_listeners(footer){
        footer.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            if (btn.dataset.action === "add-article"){
                const pending_action = {type: "body-add", payload: {ref:"", base_category_id: ""}};
                devisStore.dispatch("show-modal", {category_id: this.categ.id, pending_action});
            }else if (btn.dataset.action === "add-text"){
                const action = {
                    type:"body-add-text", 
                    payload: {ref: "TEXT_"+Date.now(), base_category_id: this.categ.id}
                };
                devisStore.submit_action(action);
                devisStore.dispatch("render");
            }
        });
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
        const payload = action.payload;
        switch (action.type){
            case "body-add":
                this.insert_row(payload.ref, payload.category_id);
                break;
            case "body-remove":
                this.rows.delete(payload.ref);
                break;
            case "body-move":
                this.#move_row(payload.ref, parseInt(payload.direction));
                break;
            case "body-edit":
                this.#edit_row(payload.old_ref, payload.new_ref, payload.category_id);
                break;
            case "body-add-text":
                let new_row = new DevisRow({
                    ref: payload.ref,
                    label: "",
                    prix: 0,
                    category_id: payload.base_category_id,
                    priority: this.get_rows_ordered().at(-1)?.priority + 1,
                    base_category_id: payload.base_category_id
                });
                this.rows.set(payload.ref, new_row);
                break;
            case "body-edit-text":
                this.rows.get(payload.ref).label = payload.new_value;
                break;
            case "body-edit-qte":
                this.rows.get(payload.ref).quantity = parseInt(payload.new_value);
                break;
            case "body-edit-remise":
                this.rows.get(payload.ref).remise = parseInt(payload.new_value);
                break;
            default:
                throw new Error(`Unrecognized action.`);
        }
    }

    /**
     * return the list of DevisRow ordered by priority
     * @returns {DevisRow[]}
     */
    get_rows_ordered(){
        return [...this.rows.values()].sort((a, b) => a.priority - b.priority);
    }

    /**
     * Inserts an article into the rows map.  
     * If the article already exists, its quantity is incremented.  
     * Otherwise, the article is retrieved from the data manager and a new DevisRow is created.
     *
     * @param {string} ref - The reference of the article to insert.
     * @param {string} category_id - the category id of the article to insert.
     * @param {string} [reason] - Optional explanation of why this article was added.
     */
    insert_row(ref, category_id, reason){
        if (this.rows.has(ref)){
            this.rows.get(ref).quantity += 1;
        }else{
            try{
                const art = devisStore.data_manager.get_article(ref, category_id);
                let devis_row = new DevisRow({...art, reason});
                this.rows.set(ref, devis_row);
                this.rows.get(ref).remise = this._global_remise;
            }catch (error){
                console.log(`Warning : Can't insert article : ${error}`);
            }
        }
    }

    /**
     * convert the devisCategory into a JSON format to be saved with api
     * 
     * @returns {Object[]} - json_data.
     */
    to_json_data(){
        return this.get_rows_ordered().map(devis_row => devis_row.to_json_data());
    }

    /**
     * Set remise for all articles in rows to the new value given
     * @param {number} new_value 
     */
    set_global_remise(new_value){
        this._global_remise = new_value;
        this.rows.forEach(devis_row => devis_row.remise = new_value);
    }

    /**
     * switch the row identify with old_ref with a new row identify with new_ref.
     * The switch preserve the priority of the old row
     * @param {string} old_ref 
     * @param {string} new_ref 
     * @param {string} category_id
     */
    #edit_row(old_ref, new_ref, category_id){
        const old_row = this.rows.get(old_ref);
        this.rows.delete(old_ref);
        this.insert_row(new_ref, category_id);
        this.rows.get(new_ref).priority = old_row.priority;
        this.rows.get(new_ref).quantity = old_row.quantity;
    }


    /**
     * Move an article up or down within its base category by swapping priorities
     * with the neighboring article in the requested direction.
     *
     * @param {string} ref - Reference of the article to move.
     * @param {number} direction - Direction of the move: -1 (up) or +1 (down).
     * @throws {Error} If the article is not found or cannot be moved.
     */
    #move_row(ref, direction){
        // Retrieve the article to move
        let devis_row = this.rows.get(ref);
        if (!devis_row) throw new Error("row not found in devis");

        const ordered_rows = this.get_rows_ordered();

        // Find the current index of the article in the ordered list
        const index = ordered_rows.findIndex(a => a.ref === devis_row.ref);
        if (index === -1) throw new Error("Article not found in ordered list");

        // Compute the target index based on direction (−1 or +1)
        const targetIndex = index + direction;

        // Ensure the target index is within bounds
        if (targetIndex < 0 || targetIndex >= ordered_rows.length) {
            // Nothing to do — the article is already at the boundary
            return;
        }
        // Retrieve the neighboring article that will swap priority
        const swapped_row = this.rows.get(ordered_rows[targetIndex].ref);
        if (!swapped_row) {
            throw new Error("Swapped article not found in the current map");
        }

        // Swap priorities between the two articles
        const tmp_priority = devis_row.priority;
        devis_row.priority = swapped_row.priority;
        swapped_row.priority = tmp_priority;
    }


}


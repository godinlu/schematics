/**
 * @type {import('../store/devis_store.js').devisStore}
 * @type {import('./devis_row.js').DevisRow}
 */

/**
 * 
 */
class DevisCategory{
    /** @type {Map<string, DevisRow>} */
    rows

    constructor(categ){
        this.categ = categ;
        this.rows = new Map();
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
        `;

        this.attach_event_listeners(footer);

        tbody.appendChild(header);
        this.get_rows_ordered().forEach(el => el.mount(tbody));
        tbody.appendChild(footer);
    }

    /**
     * return the price of all rows of the category
     * @returns {number} - price of all row in this categ
     */
    get_price(){
        let res = 0;
        this.rows.forEach((devis_row) => {res += devis_row.total_amount});
        return res;
    }

    /**
     * return true if the category is empty
     * @returns {boolean} - true if the category is empty
     */
    is_empty(){
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
                const pending_action = {type: "body-add", ref:"", base_category_id: this.categ.id};
                devisStore.dispatch("show-modal", {category_id: this.categ.id, pending_action});
            }else if (btn.dataset.action === "add-text"){
                const action = {type:"body-add-text", ref: "TEXT_"+Date.now(), base_category_id: this.categ.id};
                devisStore.dispatch("submit-action", action);
                devisStore.dispatch("render");
            }
            
        });
    }

    /**
     * 
     * @param {Object} action 
     */
    submit_action(action){
        try{
            if (action.type === "body-add"){
                this.insert_row(action.ref);
            }else if (action.type === "body-remove"){
                this.rows.delete(action.ref);
            }else if (action.type === "body-move"){
                this.#move_row(action.ref, parseInt(action.direction));
            }else if(action.type === "body-edit"){
                this.#edit_row(action.old_ref, action.new_ref);
            }else if (action.type === "body-add-text"){
                let new_row = new DevisRow({
                    ref: action.ref,
                    label: "",
                    prix: 0,
                    category_id: action.base_category_id,
                    priority: this.get_rows_ordered().at(-1)?.priority + 1,
                    base_category_id: action.base_category_id
                });
                this.rows.set(action.ref, new_row);
            }else if (action.type === "body-edit-text"){
                this.rows.get(action.ref).label = action.new_value;
            }else if (action.type === "body-edit-qte"){
                this.rows.get(action.ref).quantity = parseInt(action.new_value);
            }else if(action.type === "body-edit-remise"){
                this.rows.get(action.ref).remise = parseInt(action.new_value);
            }else{
                throw new Error(`Unrecognized action : ${action}`);
            }
            devisStore.action_history.push(action);
        } catch (error){
            console.warn(`Warning : Can't submiting action : ${error}`)
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
     */
    insert_row(ref){
        if (this.rows.has(ref)){
            this.rows.get(ref).quantity += 1;
        }else{
            try{
                const art = devisStore.data_manager.get_article(ref);
                let devis_row = new DevisRow(art);
                this.rows.set(ref, devis_row);
            }catch (error){
                console.log(`Warning : Can't insert article : ${error}`);
            }
        }
    }

    /**
     * switch the row identify with old_ref with a new row identify with new_ref.
     * The switch preserve the priority of the old row
     * @param {string} old_ref 
     * @param {string} new_ref 
     */
    #edit_row(old_ref, new_ref){
        const old_row = this.rows.get(old_ref);
        this.rows.delete(old_ref);
        this.insert_row(new_ref);
        this.rows.get(new_ref).priority = old_row.priority;
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


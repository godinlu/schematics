/**
 * @type {import('../store/devis_store.js').devisStore}
 * @type {import('../utils.js').format_number}
 * @type {import('../utils.js').debounce}
 */

/**
 * 
 */
class DevisRow{
    // /**@type {string} */
    // ref
    /**@type {string} */
    label
    /**@type {number} */
    prix
    /**@type {string} */
    category_id
    /**@type {number} */
    priority
    /**@type {number} */
    remise
    /**@type {number} */
    quantity

    constructor({ref, label, prix, category_id, priority, reason}){
        this.ref = ref;
        this.label = label;
        this.prix = prix;
        this.category_id = category_id;
        this.base_category_id = devisStore.data_manager.get_base_category_id(category_id).id;
        this.priority = priority;
        this.reason = reason;
        this.remise = 0;
        this.quantity = 1;
    }

    /**
     * 
     * @param {HTMLElement} tbody 
     */
    mount(tbody){
        const is_text = this.ref.startsWith("TEXT_");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${(is_text)? "TEXT" : this.ref}</td>
            <td>${this.label}</td>
            <td>${(is_text)? "" : format_number(this.prix) + " €"}</td>
            <td>
                ${(is_text)? "" : 
                `<input class="remise" data-handler="remise-input" type="number" min="0" max="30" value="${this.remise}">`}
            </td>
            <td>
                ${(is_text)? "" : 
                `<input class="qte-input" data-handler="qte-input" type="number" min="-9999" max="9999" value="${this.quantity}">`} 
            </td>
            <td>
                <div class="devis-edit">
                    <button data-handler="edit">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <div class="move-buttons">
                        <button data-handler="move" data-direction="-1">
                            <i class="fa-solid fa-angle-up"></i>
                        </button>
                        <button data-handler="move" data-direction="1">
                            <i class="fa-solid fa-angle-down"></i>
                        </button>
                    </div>
                    <button data-handler="remove">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    ${(this.reason)?`
                        <button class="hint-btn">
                            <i class="fa-solid fa-info"></i>
                            <span class="hint-tooltip">${this.reason}</span>
                        </button>
                    `:""}
                </div>
            </td>
        `;
        this.#attach_event_listeners(tr);
        tbody.appendChild(tr);
    }


    /**
     * Returns True if the row is a text row
     * @returns {boolean} 
     */
    get is_text(){
        return this.ref.startsWith("TEXT_");
    }

    /**
     * Returns the total amount of the row by multiplying the unit price by the quantity
     * @returns {number} - final price of the row
     */
    get total_amount(){
        return this.unit_price * this.quantity;
    }

    /**
     * Returns the unit price of the row
     * @returns {number} - unit price
     */
    get unit_price(){
        return this.prix * (1 - this.remise / 100);
    }

    /**
     * attach all event listeners
     * @param {HTMLTableRowElement} tr 
     */
    #attach_event_listeners(tr){
        const edit_row = () => {
            if (this.ref.startsWith("TEXT")){
                // edit a text row
                this.#edit_text_row(tr);
            }else{
                // normal action edit an article
                const pending_action = {
                    type: "body-edit",
                    payload: {old_ref: this.ref, new_ref: "", base_category_id: this.base_category_id} 
                };
                devisStore.dispatch("show-modal", {category_id: this.category_id, pending_action});
            }
        };

        tr.addEventListener("click", (event) =>{
            const btn = event.target.closest("button");
            if (!btn) return;

            if (btn.dataset.handler === "edit"){
                edit_row();
            }
            else if (btn.dataset.handler === "remove"){
                const action = {type: "body-remove", payload:{ref: this.ref, base_category_id: this.base_category_id}};
                devisStore.submit_action(action);
                devisStore.dispatch("render");
            }
            else if (btn.dataset.handler === "move"){
                const direction = btn.dataset.direction;
                const action = {type: "body-move", payload: {ref: this.ref, base_category_id: this.base_category_id, direction}};
                devisStore.submit_action(action);
                devisStore.dispatch("render");
            }
        });

        tr.addEventListener("dblclick", (event) =>{
            const td = event.target.closest("td");
            if (Array.from(td.parentElement.children).indexOf(td) === 1 ){
                edit_row();
            }
        });

        // create a debounceHandler for both input to avoid spamming action
        const debouncedHandler = debounce((input) => {
            if (input.dataset.handler === "remise-input") {
                const action = {
                    type:"body-edit-remise", 
                    payload:{ref:this.ref, old_value: this.remise, new_value: input.value, base_category_id: this.base_category_id}
                };
                devisStore.submit_action(action);
                devisStore.dispatch("render-footer", action);
            }
            if (input.dataset.handler === "qte-input") {
                const action = {
                    type:"body-edit-qte",
                    payload:{ref:this.ref, old_value: this.quantity, new_value: input.value, base_category_id: this.base_category_id} 
                };
                devisStore.submit_action(action);
                devisStore.dispatch("render-footer", action);
            }
        }, 300);

        tr.addEventListener("input", (event) =>{
            debouncedHandler(event.target);
        });
    }


    /**
     * This function is called when the user edit a text row
     * it show an input text at the label 
     * @param {HTMLTableRowElement} tr 
     */
    #edit_text_row(tr){
        let td = tr.children[1];
        td.innerHTML = "";

        // create the input with correct parameters and append to the td and focus it
        let input = document.createElement("input");
        input.type = "text";
        input.value = this.label;
        td.appendChild(input);
        input.focus();

        const finish_editing = () => {
            // submit the action only if the value change to avoid spamming the history
            if (this.label !== input.value){
                const action = {
                    type:"body-edit-text", 
                    payload: {ref: this.ref, old_value: this.label, new_value: input.value, base_category_id: this.base_category_id}
                };
                devisStore.submit_action(action);
                
            }
            devisStore.dispatch("render");
            
        };

        // attach event listeners to it
        input.addEventListener("keydown", (event) =>{
            if (event.key === "Enter"){
                finish_editing();
            }
        });

        input.addEventListener("blur", () =>{
            finish_editing();
        })
    }
}


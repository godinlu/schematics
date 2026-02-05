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
                `<input class="remise" data-handler="remise-input" type="number" min="0" max="35" value="${this.remise}">`}
            </td>
            <td>
                ${(is_text)? "" : 
                `<input class="qte-input" data-handler="qte-input" type="number" min="-9999" max="9999" value="${this.quantity}">`} 
            </td>
            <td> ${(is_text)?"" : format_number(this.total_amount) + " €"} </td>
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
     * Convertit l'objet ligne de devis en un format JSON prêt à être envoyé
     * à l'API ou utilisé pour le stockage.
     *
     * @returns {Object} Un objet contenant les informations de la ligne de devis :
     *  - article_ref {string} : référence de l'article
     *  - prix_tarif {number} : prix unitaire de l'article
     *  - taux_remise {number} : remise appliquée en pourcentage
     *  - quantite {number} : quantité commandée
     *  - cout_total {number} : total de la ligne après remise
     */
    to_json_data(){
        return {
            article_ref: this.ref,
            prix_tarif: this.prix,
            taux_remise: this.remise,
            quantite: this.quantity,
            cout_total: this.total_amount

        };
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
            if (Array.from(td.parentElement.children).indexOf(td) === 0 ||
                Array.from(td.parentElement.children).indexOf(td) === 1){
                edit_row();
            }
        });

        // create a debounceHandler for both input to avoid spamming action
        const debouncedHandler = debounce((input) => {
            if (input.dataset.handler === "remise-input") {
                const new_value = parseInt(input.value);
                if (!isNaN(new_value) && new_value !== this.remise && new_value >= 0 && new_value <= 35){
                    devisStore.submit_action({
                        type: "body-edit-remise",
                        payload:{
                            ref: this.ref,
                            old_value: this.remise,
                            new_value,
                            base_category_id: this.base_category_id
                        }
                    });
                    devisStore.dispatch("render");
                }                
            }
            if (input.dataset.handler === "qte-input") {
                const new_value = parseInt(input.value);
                if (!isNaN(new_value) && new_value !== this.quantity){
                    devisStore.submit_action({
                        type: "body-edit-qte",
                        payload:{
                            ref: this.ref, 
                            old_value: this.quantity,
                            new_value,
                            base_category_id: this.base_category_id
                        }
                    });
                    devisStore.dispatch("render");
                }
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


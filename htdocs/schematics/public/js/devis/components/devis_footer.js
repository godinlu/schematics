/** 
 * @type {import('../utils.js').format_number} 
 * @type {import('../store/devis_store').devisStore}
 * @type {import('../store/devis_store').action}
 * */

/**
 * 
 */
class DevisFooter{
    constructor(){
        devisStore.subscribe("reset", () => this.reset());
    }

    /**
     * reset the footer to it's initial state
     * this function is called when the event "reset" is dispatched
     */
    reset(){
        this.tva_code = 3;
        this.tva_percent = 20;
    }

    /**
     * Mount on the html the devis footer
     * @param {HTMLDivElement} div 
     * @param {number} total_ht 
     */
    mount(div, total_ht){
        const total_tva = total_ht * (this.tva_percent / 100);

        div.innerHTML = `
            <table>
                <tr>
                    <td>Code TVA</td>
                    <td>Base HT</td>
                    <td>Taux TVA</td>
                    <td>Montant TVA</td>
                    <td>Montant TTC</td>
                </tr>
                <tr>
                    <td><input type="number" value="${this.tva_code}" data-type="tva_code"></td>
                    <td>${format_number(total_ht, 2)} €</td>
                    <td><input type="number" value="${this.tva_percent}" data-type="tva_percent" min="0" max="100"> %</td>
                    <td>${format_number(total_tva, 2)} €</td>
                    <td>${format_number(total_ht + total_tva, 2)} €</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>Montant HT</td>
                    <td>${format_number(total_ht, 2)} €</td>
                </tr>
                <tr>
                    <td>Montant TVA</td>
                    <td>${format_number(total_tva, 2)} €</td>
                </tr>
                <tr>
                    <th>Total TTC</th>
                    <th>${format_number(total_ht + total_tva, 2)} €</th>
                </tr>
            </table>
        `;

        this.#attach_events(div);
    }

    /**
     * Submit the action given.
     * The action type is supposed to start with "footer-".
     * the function handle the edit of the tva_code and tva_percent. 
     * 
     * @param {action} action 
     */
    submit_action(action){
        switch (action.type){
            case "footer-edit-tva_code":
                this.tva_code = action.payload.new_value;
                break;
            case "footer-edit-tva_percent":
                this.tva_percent = action.payload.new_value;
                break;
            default:
                throw new Error("Unrecognized action");
        }
    }


    /**
     * attach events for input of tva_code and tva_percent.
     * @param {HTMLDivElement} div 
     */
    #attach_events(div){
        // avoid stacking events listener on re-render
        if (!this._add_events){
            this._add_events = true;

            const debouncedHandler = debounce((input) =>{
                const new_value = parseInt(input.value);

                switch(input.dataset.type){
                    case "tva_code":
                        if (!isNaN(new_value) && this.tva_code !== new_value){
                            devisStore.submit_action({type:"footer-edit-tva_code", payload:{new_value}});
                        }
                        break;
                    case "tva_percent":
                        if (!isNaN(new_value) && this.tva_percent !== new_value && new_value >= 0 && new_value <= 100){
                            devisStore.submit_action({type:"footer-edit-tva_percent", payload:{new_value}});
                            devisStore.dispatch("render");
                        }
                        break;
                }
            },300);

            div.addEventListener("input", (event) =>{
                debouncedHandler(event.target);                
            });
        }
        
    }
}
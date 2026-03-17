/**
 * @type {import('../store/devis_store').devisStore}
 */

/**
 * class to manage the devis header with all fields editing
 */
class DevisHeader{
    /**@type {Map<string, string>} */
    fields

    constructor(formulaire){
        this.fields = new Map();
        this.formulaire = formulaire;

        devisStore.subscribe("reset", () => this.reset());
    }

    /**
     * reset the devis header to the initial state with default values for all fields
     * this function will be called at each reset
     */
    reset(){
        this.fields.set("header-type_devis", "CHIFFRAGE ESTIMATIF");
        this.fields.set("header-date_devis", new Date().toISOString().split("T")[0]);

        this.fields.set("header-objet", this.formulaire.typeInstallation);

        const client_full_name = [this.formulaire.nom_client?.toUpperCase(), this.formulaire.prenom_client].filter(Boolean).join(" ");
        this.fields.set("header-affaire", client_full_name);

        this.fields.set("header-installateur_entreprise", this.formulaire.installateur);

        this.fields.set("header-installateur_mail", this.formulaire.adresse_mail);
        this.fields.set("header-installateur_nom_prenom", this.formulaire["Prénom/nom"]);

        this.fields.set("header-affaire_suivie_par", this.formulaire.commercial);
        this.fields.set("header-mode_reglement", "Défini par l'ouverture de compte");
        this.fields.set("header-validite", "2 mois");

        const delay = (this.formulaire.typeInstallation.includes("K"))? "3 mois" : "1 mois";
        this.fields.set("header-delai_livraison", delay);

        this._update_download_pdf_button();
    }

    /**
     * mount the devis header manager to the div by adding event listeners
     * editing actions are saved with the blur action
     * @param {HTMLElement} div 
     */
    mount(div){
        for (const [field_name, value] of this.fields){
            const field = div.querySelector(`[data-field_name="${field_name}"]`);
            if (!field){
                console.warn(`[DevisHeader.mount] Unrecognized field : '${field_name}'`);
                continue;
            }
            field.value = value;
        }

        // avoid stacking handlers on re-render
        if (!this.add_handlers){
            this.add_handlers = true;

            div.querySelectorAll('[data-field_name]').forEach(input => {
                input.addEventListener('blur', (event) => {
                    const field = input.dataset.field_name;
                    const new_value = event.target.value;
                    const old_value = this.fields.get(field);

                    if (old_value !== new_value){
                        devisStore.submit_action({
                            type:"header-edit-field",
                            payload: {field, old_value, new_value}
                        });
                    }
                });
            });
        }
        
    }

    /**
     * Submit an header action and add the action to the devisStore.action_history only 
     * if the action can be done correctly.
     * @param {Object} action 
     */
    submit_action(action){
        const payload = action.payload;
        switch (action.type){
            case "header-edit-field":
                if (payload.old_value !== this.fields.get(payload.field)){
                    throw new Error("Old value doesn't match with the real value");
                }
                this.fields.set(payload.field, payload.new_value);

                // disabled or not the pdf download
                this._update_download_pdf_button();
                
                break;
            default:
                throw new Error("Unrecognized action type");
        }
    }

    /**
     * dispatch an "download-disabled" event to disabled or not the download pdf button
     * to be enabled all header fields must be non-empty.
     * @private
     */
    _update_download_pdf_button(){
        const disabled = [...this.fields.values()].some(v => v === "");
        devisStore.dispatch("download-disabled", {disabled});
    }

    /**
     * Get header-date in French format DD/MM/YYYY
     * @returns {string}
     */
    get_date_fr_format() {
        const dateStr = this.fields.get("header-date_devis");
        if (!dateStr) return "";

        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }

    /**
     * convert the header into JSON to saved the devis into bd
     * 
     * @returns {Object<string, string>} - json_data
     */
    to_json_data(){
        let result = {};
        for (const [field_name, value] of this.fields){
            result[field_name.replace("header-","")] = value;
        }
        return result;

    }

}

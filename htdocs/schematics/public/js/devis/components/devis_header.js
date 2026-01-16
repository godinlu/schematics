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
        this.fields.set("header-date", new Date().toISOString().split("T")[0]);

        const full_name = [this.formulaire.nom_client?.toUpperCase(), this.formulaire.prenom_client].filter(Boolean).join(" ");
        const header_objet = [full_name, this.formulaire.typeInstallation].filter(Boolean).join(" - ");
        this.fields.set("header-objet", header_objet);

        this.fields.set("header-affaire", this.formulaire.installateur);
        this.fields.set("header-mail", this.formulaire.adresse_mail);
        this.fields.set("header-installateur", this.formulaire["Prénom/nom"]);
        this.fields.set("header-field1", this.formulaire.commercial);
        this.fields.set("header-field2", "Défini par l'ouverture de compte");
        this.fields.set("header-field3", "2 mois");

        const delay = (this.formulaire.typeInstallation.includes("K"))? "3 mois" : "1 mois";
        this.fields.set("header-field4", delay);
    }

    /**
     * mount the devis header manager to the div by adding event listeners
     * editing actions are saved with the blur action
     * @param {HTMLElement} div 
     */
    mount(div){
        this.fields.forEach((value, field_name) =>{
            div.querySelector(`[data-field_name="${field_name}"]`).value = value;
        });

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
                break;
            default:
                throw new Error("Unrecognized action type");
        }
    }

    /**
     * Get header-date in French format DD/MM/YYYY
     * @returns {string}
     */
    get_date_fr_format() {
        const dateStr = this.fields.get("header-date");
        if (!dateStr) return "";

        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }

}

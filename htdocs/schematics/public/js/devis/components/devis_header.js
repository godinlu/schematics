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

        this.fields.set("header-date", new Date().toISOString().split("T")[0]);

        const full_name = [formulaire.nom_client?.toUpperCase(), formulaire.prenom_client].filter(Boolean).join(" ");
        const header_objet = [full_name, formulaire.typeInstallation].filter(Boolean).join(" - ");
        this.fields.set("header-objet", header_objet);

        this.fields.set("header-affaire", formulaire.installateur);
        this.fields.set("header-mail", formulaire.adresse_mail);
        this.fields.set("header-installateur", formulaire["Prénom/nom"]);
        this.fields.set("header-field1", formulaire.commercial);
        this.fields.set("header-field2", "Défini par l'ouverture de compte");
        this.fields.set("header-field3", "2 mois");

        const delay = (formulaire.typeInstallation.includes("K"))? "3 mois" : "1 mois";
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

        div.querySelectorAll('[data-field_name]').forEach(input => {
            input.addEventListener('blur', (event) => {
                const field = input.dataset.field_name;
                const new_value = event.target.value;
                const old_value = this.fields.get(field);

                if (old_value !== new_value){
                    this.submit_action({
                        type: "header-edit-field",
                        field,
                        old_value,
                        new_value
                    });
                    console.log(devisStore.action_history);
                }
            });
        });
    }

    /**
     * Submit an header action and add the action to the devisStore.action_history only 
     * if the action can be done correctly.
     * @param {Object} action 
     */
    submit_action(action){
        if (action?.type !== "header-edit-field") return;

        if (action.old_value !== this.fields.get(action.field)){
            console.warn("Old value doesn't match with the reel value");
            return;
        }
        this.fields.set(action.field, action.new_value);
        devisStore.action_history.push(action);
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

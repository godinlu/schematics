/**
 * @type {import('../store/devis_store').devisStore}
 */

class DevisHeader{
    constructor(formulaire){
        this.fields = new Map();
        this._debounceTimers = new Map();

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
     * 
     * @param {HTMLElement} div 
     */
    mount(div){
        this.fields.forEach((value, field_name) =>{
            div.querySelector(`[data-field_name="${field_name}"]`).value = value;
        });

        div.querySelectorAll('[data-field_name]').forEach(input => {
            input.addEventListener('input', (event) => {
                const field = input.dataset.field_name;

                clearTimeout(this._debounceTimers.get(field));

                // Set new timeout
                this._debounceTimers.set(field, setTimeout(() => {
                    this.submit_action({
                        type:"header-edit-field",
                        field,
                        old_value:"",
                        new_value: event.target.value
                    });
                    this._debounceTimers.delete(field); // cleanup
                }, 300)); // 300 ms debounce
            });
        });
    }

    /**
     * 
     * @param {Object} action 
     */
    submit_action(action){
        if (action?.type !== "header-edit-field") return;

        if (action.old_value === "") action.old_value = this.fields.get(action.field);
        if (action.old_value !== this.fields.get(action.field)){
            console.warn("Old value doesn't match with the reel value");
            return;
        }
        this.fields.set(action.field, action.new_value);
        devisStore.action_history.push(action);
    }
}

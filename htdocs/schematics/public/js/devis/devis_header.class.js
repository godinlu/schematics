/**
 * @typedef {Object} HeaderAction
 * @property {string} type - action type
 * @property {string} field - field name concern
 * @property {string} old_value - old value of the field
 * @property {string} new_value - new value of the field
 */

class DevisHeader{
    /** @type {HTMLDivElement} */
    header_div

    /** @type {HeaderAction[]} */
    actions

    /**
     * 
     * @param {HTMLDivElement} header_div 
     * @param {object} formulaire
     * @param {HeaderAction[]} actions
     */
    constructor(header_div, formulaire, actions = []){
        this.header_div = header_div;
        this.actions = [];
        this.#init_fields(formulaire);
        this.#init_event_listener();

        actions.forEach(act => this.submit_action(act));
    }

    /**
     * Submit the action given : This function allow only header-edit type action
     * @param {HeaderAction} action 
     */
    submit_action(action){
        try{
            if (action.type === "header-edit"){
                let el = this.#get_field(action.field);
                if (el.value !== action.old_value){
                    throw new Error("The value doesn't match the old value.");
                } 
                el.value = action.new_value;

            }else{
                throw new TypeError("unrecognize action.");
            }

        }catch (error){
            console.warn(`Can't submit action ${action} : ${error}`);
        }
    }


    /**
     * Init the default value of all fields with formulaire installation
     * @param {object} formulaire 
     */
    #init_fields(formulaire){
        this.#get_field("devis-date").value = new Date().toISOString().split("T")[0];

        let devis_objet = formulaire.nom_client.toUpperCase();
        if (formulaire.prenom_client !== "") devis_objet += " " + formulaire.prenom_client;
        if (devis_objet !== "") devis_objet += " - ";
        devis_objet += formulaire.typeInstallation;

        this.#get_field("devis-objet").value = devis_objet;

        this.#get_field("devis-affaire").value =  formulaire.installateur;
        this.#get_field("devis-field1").value = formulaire.commercial;
        this.#get_field("devis-mail").value = formulaire.adresse_mail;
        this.#get_field("devis-installateur").value = formulaire["Prénom/nom"];

    }

    /**
     * Add event listener to all input and textara to save update actions
     * in this.actions. Note : the action are saved 300 ms after edition to reduce spamming
     */
    #init_event_listener(){
        let timer;
        this.header_div.querySelectorAll("input, textarea").forEach((el) => {
            el._old_value = el.value;
            el.addEventListener("input", () => {
                clearTimeout(timer);
                timer = setTimeout(() =>{
                    this.actions.push({type:"header-edit", field: el.name, old_value: el._old_value, new_value: el.value});
                    el._old_value = el.value;
                }, 300);
            });
        });
    }


    /**
     * return the corresponding field indentify by it's name
     * @param {string} field_name 
     * @returns {HTMLElement}
     */
    #get_field(field_name){
        return this.header_div.querySelector(`[name="${field_name}"]`);
    }

}
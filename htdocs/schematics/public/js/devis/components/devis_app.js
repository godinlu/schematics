/**
 * @type {import('../store/devis_store').devisStore}
 * @type {import('./devis_header').DevisHeader}
 * @type {import('./devis_body').DevisBody}
 * @type {import('./devis_footer').DevisFooter}
 * @type {import('./devis_modal').DevisModal}
 * @type {import('./devis_pdf').DevisPdf}
 */


/**
 * 
 */
class DevisApp{
    /**
     * 
     * @param {Object} formulaire 
     * @param {Object[]} action_history 
     */
    constructor(formulaire, action_history){
        this.formulaire = formulaire;

        this.devis_header = new DevisHeader(formulaire);
        this.devis_body = new DevisBody(formulaire);
        this.devis_footer = new DevisFooter();

        this.devis_modal = new DevisModal();        

        this.btn_dl_pdf = document.querySelector("#download-devis-pdf");

        this.#register_store_events();
        this.#attach_event_listeners();

        // submit all saved action
        action_history.forEach((action) =>{
            this.submit_action(action);
        });
    }

    mount(){
        this.devis_header.mount(document.querySelector(".devis-header"));
        this.devis_body.mount(document.querySelector(".devis-body tbody"));
        this.devis_footer.mount(document.querySelector(".devis-footer"), this.get_price());
    }

    submit_action(action){
        if (action?.type.startsWith("header")){
            this.devis_header.submit_action(action);
        }
        if (action?.type.startsWith("body")){
            this.devis_body.submit_action(action);
        }
    }

    /**
     * return the total price of the devis
     * @returns {number} - total price of the devis
     */
    get_price(){
        return this.devis_body.get_price();
    }

    #attach_event_listeners(){
        this.btn_dl_pdf.addEventListener("click", () => this.#download_devis_pdf());
    }

    #register_store_events(){
        devisStore.subscribe("submit-action", action => this.submit_action(action));
        devisStore.subscribe("render", () => this.mount());
        devisStore.subscribe("render-footer", () => {
            this.devis_footer.mount(document.querySelector(".devis-footer"), this.get_price());
        });
        devisStore.subscribe("show-modal", (context) => this.devis_modal.set_content(context));
    }

    /**
     * this function is called when the user click on the download pdf button
     * it will 
     */
    #download_devis_pdf(){
        // create an instance of DevisPdf
        let devis_pdf = new DevisPdf(this.devis_header, this.devis_body, this.devis_footer);

        // create the div to mount the devis pdf
        let div = document.createElement("div");
        div.id = "devis-pdf";
        devis_pdf.mount(div);

        // set the pdf filename
        const filename = "devis" + this.formulaire["nom_affaire"] + ".pdf";

        html2pdf().set({
                margin: 5,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(div).save();  

    }

}
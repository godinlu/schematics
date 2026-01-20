/**
 * @type {import('../store/devis_store').devisStore}
 * @type {import('./devis_header').DevisHeader}
 * @type {import('./devis_body').DevisBody}
 * @type {import('./devis_footer').DevisFooter}
 * @type {import('./devis_modal').DevisModal}
 * @type {import('./devis_pdf').DevisPdf}
 * @type {import('../../public/modal').Modal}
 */


/**
 * 
 */
class DevisApp{
    /**
     * 
     * @param {Object} formulaire 
     */
    constructor(formulaire){
        this.formulaire = formulaire;

        this.devis_header = new DevisHeader(formulaire);
        this.devis_body = new DevisBody(formulaire);
        this.devis_footer = new DevisFooter();

        this.devis_modal = new DevisModal();
        this.info_modal = new Modal(document.querySelector("#modal-info"));        

        this.#register_store_events();
        this.#attach_event_listeners();
    }

    mount(){
        this.devis_header.mount(document.querySelector(".devis-header"));
        this.devis_body.mount(document.querySelector("table.devis-body"));
        this.devis_footer.mount(document.querySelector(".devis-footer"), this.total_amount);
    }

    submit_action(action){
        if (action.type.startsWith("header")){
            this.devis_header.submit_action(action);
        }
        if (action.type.startsWith("body")){
            this.devis_body.submit_action(action);
        }
        if (action.type.startsWith("footer")){
            this.devis_footer.submit_action(action);
        }
    }

    /**
     * return the total amount of the devis before taxes
     */
    get total_amount(){
        return this.devis_body.total_amount;
    }

    #attach_event_listeners(){
        document.querySelector("#download-devis-pdf").addEventListener("click", () => this.#download_devis_pdf());
        document.querySelector("#undo").addEventListener("click", () => devisStore.undo());
        document.querySelector("#redo").addEventListener("click", () => devisStore.redo());

        document.querySelector("#info-user").addEventListener("click", () => this.info_modal.show());

        document.addEventListener("keydown", (e) => {
            // Ctrl + z
            if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
                e.preventDefault(); // prevent the default action of the nav
                devisStore.undo();
            }

            // Ctrl+Y or Ctrl+Shift+Z for redo
            if ((e.ctrlKey && e.key.toLowerCase() === "y") ||
                (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z")) {
                e.preventDefault();
                devisStore.redo();
            }
        });
    }

    #register_store_events(){
        devisStore.subscribe("submit-action", action => this.submit_action(action));
        devisStore.subscribe("render", () => this.mount());
        devisStore.subscribe("render-footer", () => {
            this.devis_footer.mount(document.querySelector(".devis-footer"), this.total_amount);
        });
        devisStore.subscribe("show-modal", (context) => this.devis_modal.set_content(context));

        devisStore.subscribe("history-update", ({can_undo, can_redo}) => {
            document.querySelector("#undo").disabled = !can_undo;
            document.querySelector("#redo").disabled = !can_redo;
        });
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
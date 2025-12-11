/**
 * @type {import('./data_manager.class').DataManager}
 * @type {import('./devis_header.class').DevisHeader}
 * @type {import('./devis_body.class').DevisBody}
 */


class EditableDevis{
    /**
     * 
     * @param {HTMLDivElement} editable_devis_div 
     * @param {DataManager} data_manager 
     * @param {Object} data_installation 
     * @param {Object []} actions
     */
    constructor(editable_devis_div, data_manager, data_installation, actions = []){
        this.editable_devis_div = editable_devis_div;
        this.action_list = [];

        let header_div = this.editable_devis_div.querySelector("div.devis-header");
        this.devis_header = new DevisHeader(header_div, data_installation, this.action_list);

        let body_table = this.editable_devis_div.querySelector("table.devis-body");
        const default_articles_ref = get_default_articles_ref(data_installation);
        this.devis_body = new DevisBody(body_table, data_manager, default_articles_ref, this.action_list);

        actions.forEach(action => this.submit_action(action));
        
        this.devis_body.render();
    }


    /**
     * Submit an action on the editable devis, the action will be redistribute on the header or the footer 
     * @param {Object} action 
     */
    submit_action(action){
        if (action.type.startsWith("header-") ){
            this.devis_header.submit_action(action);
        }else if (action.type.startsWith("body-")){
            this.devis_body.submit_action(action);
        }
    }
}
/**
 * @type {import('./devis_model.class').DevisModel}
 * @type {import('./devis_view.class').DevisView}
 * @type {import('./modal_view.class').ModalView}
 */

class DevisController{
    #timers

    #filters

    /**
     * 
     * @param {DevisModel} model 
     * @param {DevisView} view 
     */
    constructor(model, view){
        this.model = model;
        this.view = view;

        this.modal_view = new ModalView();

        this.view.render(this.model);
        this.setup_header_events();
        this.setup_body_events();
        this.setup_modal_events();

        this.#timers = new WeakMap();
        this.#filters = {ref:"", label:""};
    }

    setup_header_events(){
        this.view.header_div.addEventListener("input", (event) =>{
            if (event.target.dataset.field_name) this.#handler_header_input(event.target);
        });
    }

    setup_body_events(){
        this.view.body_table.addEventListener("click", (event) =>{
            const btn = event.target.closest("button");
            if (!btn) return;
            if (btn.dataset.handler === "body-add") this.#handler_body_add(btn);
            else if (btn.dataset.handler === "body-add-text") this.#handler_body_add_text(btn);
            else if (btn.dataset.handler === "body-remove") this.#handler_body_remove(btn);
            else if (btn.dataset.handler === "body-move") this.#handler_body_move(btn);
            else if (btn.dataset.handler === "body-edit") this.#handler_body_edit(btn);
        });

        this.view.body_table.addEventListener("input", (event) =>{
            if (event.target.dataset.handler === "remise-input") this.#handler_remise_input(event.target);
            else if (event.target.dataset.handler === "qte-input") this.#handler_qte_input(event.target);
        });

        this.view.body_table.addEventListener("keydown", (event) =>{
            if (event.key === "Enter"){
                if (event.target.dataset.handler === "edit_text_article") this.#handler_edit_text_article(event.target);
            }
            
        });

        this.view.body_table.addEventListener("focusout", (event) =>{
            if (event.target.dataset.handler === "edit_text_article") this.#handler_edit_text_article(event.target);
            
        });


    }

    setup_modal_events(){
        this.modal_view.modal.content_div.addEventListener("click", (event) =>{
            const btn = event.target.closest("button");
            if (btn){
                if (btn.dataset.handler === "click_modal_categ") this.#handler_click_modal_categ(btn);
                else if (btn.dataset.handler === "click_modal_all_article") this.#handler_click_modal_all_article(btn);
            }
                        
            const tr = event.target.closest("tr");
            if (tr){
                if (tr.dataset.handler === "click_modal_article") this.#handler_click_modal_article(tr);
            }
            
        });

        this.modal_view.modal.content_div.addEventListener("input", (event) =>{
            const input = event.target;
            if (input.dataset.handler === "filter-articles"){
                this.#handler_input_filter_articles(input);
            } 
        });
    }

    /**
     * This handler is called when the user update an header field
     * @param {HTMLInputElement|HTMLTextAreaElement} elem 
     */
    #handler_header_input(elem){
        clearTimeout(this.#timers.get(elem));
        this.#timers.set(elem, setTimeout(() =>{
            this.model.submit_action({
                type:"header-edit-field",
                field: elem.dataset.field_name, 
                old_value:"",
                new_value: elem.value
            });
            this.#timers.delete(elem);
            console.log(this.model.action_list);
        },300)); 
    }

    /**
     * This handler is called when the user click on the add article button
     * @param {HTMLButtonElement} btn 
     */
    #handler_body_add(btn){
        this.#render_modal({type:"body-add", ref:""}, btn.dataset.categ);
    }

    /**
     * This handler is called when the user click on the add text button
     * @param {HTMLButtonElement} btn 
     */
    #handler_body_add_text(btn){
        const base_category_id = btn.dataset.categ;
        const ref = "TEXT_"+Date.now();
        this.model.submit_action({type: "body-add-text", ref, base_category_id});
        this.view.render(this.model);
    }

    /**
     * This handler is called when the user click on the remove button on a article
     * @param {HTMLButtonElement} event 
     */
    #handler_body_remove(btn){
        this.model.submit_action({type: "body-remove", ref: btn.dataset.ref});
        this.view.render(this.model);
    }

    /**
     * This handler is called when the user click on the up or down arrow on a article
     * @param {HTMLButtonElement} btn 
     */
    #handler_body_move(btn){
        this.model.submit_action({
            type:"body-move",
            ref: btn.dataset.ref,
            direction: parseInt(btn.dataset.direction)
        });
        this.view.render(this.model);
    }

    /**
     * This handler is called when the user click on the edit button on an article.
     * It will open the modal
     * @param {HTMLButtonElement} btn 
     */
    #handler_body_edit(btn){
        const old_ref = btn.dataset.ref;
        if (old_ref.startsWith("TEXT_")){
            // get the second td which corresponding to the label td
            const second_td = btn.closest("tr").children[1];

            // replace the label td with a text input
            second_td.innerHTML = `<input data-handler="edit_text_article" data-ref="${old_ref}" data-old_value="${second_td.textContent}" type="text" value="${second_td.textContent}">`;

            let input = second_td.querySelector("input");
            // set the user focus directly
            input.focus();

            // set the cursor to the end of the text not at the start
            input.setSelectionRange(input.value.length, input.value.length);
        }else{
            this.#render_modal({type:"body-edit", old_ref, new_ref:""}, btn.dataset.categ);
        }
        
    }

    /**
     * This handler is called when the user update the remise of an article
     * @param {HTMLInputElement} input 
     */
    #handler_remise_input(input){
        clearTimeout(this.#timers.get(input));
        this.#timers.set(input, setTimeout(() =>{
            this.model.submit_action({
                type:"body-update-remise",
                ref:input.dataset.ref, 
                old_value:"",
                new_value: parseInt(input.value)
            });
            this.#timers.delete(input);
            this.view.render_footer(this.model);
        },300));        
    }

    /**
     * This handler is called when the user update the quantity of an article
     * @param {HTMLInputElement} input 
     */
    #handler_qte_input(input){
        clearTimeout(this.#timers.get(input));
        this.#timers.set(input, setTimeout(() =>{
            this.model.submit_action({
                type:"body-update-qte",
                ref:input.dataset.ref, 
                old_value:"",
                new_value: parseInt(input.value)
            });
            this.#timers.delete(input);
            this.view.render_footer(this.model);
        },300)); 
    }

    /**
     * This handler is called when the user click on a category on the modal
     * @param {HTMLButtonElement} btn 
     */
    #handler_click_modal_categ(btn){
        const action = JSON.parse(btn.dataset.action);
        const category_id = btn.dataset.categ;
        this.#render_modal(action, category_id);
    }

    /**
     * This handler is called when the user click on the all articles of the current categories
     * @param {HTMLButtonElement} btn 
     */
    #handler_click_modal_all_article(btn){
        const action = JSON.parse(btn.dataset.action);
        const parents_categ = this.model.data_manager.get_parents_categories(btn.dataset.categ); 
        const articles = this.model.data_manager.get_articles_by_category_tree(btn.dataset.categ);

        this.#filters = {ref:"", label:""};
        this.modal_view.render_articles_shell(parents_categ, action);
        this.modal_view.render_articles_rows(articles, action);
    }

    /**
     * This handler is called when the user click on an article on the modal
     * @param {HTMLTableRowElement} tr 
     */
    #handler_click_modal_article(tr){
        const ref = tr.dataset.ref;
        let action = JSON.parse(tr.dataset.action);
        if (action.type === "body-add") action.ref = ref;
        else if (action.type === "body-edit") action.new_ref = ref;

        this.model.submit_action(action);
        this.modal_view.hide();
        this.view.render(this.model);
    }


    /**
     * This handler is called when the user finish to edit a text article,
     * can be called either when he pressed "enter" or when he out focus the input
     * @param {HTMLInputElement} input 
     */
    #handler_edit_text_article(input){
        this.model.submit_action({
                type: "body-edit-text",
                ref: input.dataset.ref,
                old_label: input.dataset.old_value,
                new_label: input.value
        });
        this.view.render(this.model);
    }

    /**
     * This handler is called when the user update a filter input field on the modal article view.
     * @param {HTMLInputElement} input 
     */
    #handler_input_filter_articles(input){
        const action = JSON.parse(input.dataset.action);
        // update of global filters
        this.#filters[input.dataset.type] = input.value;

        // get all articles of the category
        let articles = this.model.data_manager.get_articles_by_category_tree(input.dataset.categ);

        articles = articles.filter((art) => art.ref.toLowerCase().includes(this.#filters.ref));
        articles = articles.filter((art) => art.label.toLowerCase().includes(this.#filters.label));
        this.modal_view.render_articles_rows(articles, action);
    }

    /**
     * 
     * @param {Object} action 
     * @param {string} category_id 
     */
    #render_modal(action, category_id){
        const sub_categs = this.model.data_manager.get_childrens_categories(category_id);
        const parents_categ = this.model.data_manager.get_parents_categories(category_id); 

        if (sub_categs.length > 0){
            this.modal_view.render_category_view(parents_categ, sub_categs, action);
        }else{
            let articles = this.model.data_manager.get_articles_by_category_id(category_id);
            this.#filters = {ref:"", label:""};
            if (category_id !== "capteurs"){
                this.modal_view.render_articles_shell(parents_categ, action);
            }else{
                this.modal_view.render_capteurs_shell(parents_categ, action);
            }
            this.modal_view.render_articles_rows(articles, action);
        }

        this.modal_view.show();
    }

    
}
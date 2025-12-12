/**
 * @type {import('./modal.class').Modal}
 * @type {import('./devis_model.class').DevisModel}
 */ 
class ModalView{
    /** @type {Modal} */
    modal

    constructor(){
        this.modal = new Modal()
    }

    /**
     * 
     * @param {DevisModel} devis_model 
     * @param {Object} action 
     * @param {number} categorie_id 
     */
    open(devis_model, action, categorie_id){
        const sub_categs = devis_model.data_manager.get_childrens_categories(categorie_id);
        const parents_categ = devis_model.data_manager.get_parents_categories(categorie_id);

        // get the correct view depend if we need to show articles or categories
        let html_view;
        if (sub_categs.length > 0) html_view = this.#categorie_view(action, sub_categs);
        else{
            const articles = devis_model.data_manager.get_articles_by_categorie_id(categorie_id);
            html_view = this.#article_view(action, articles);
        }
        this.modal.content_div.innerHTML = `
            <div class="breadcrumb">
                ${parents_categ.map(cat => `
                    <button data-handler="click_modal_categ" data-action=${JSON.stringify(action)} data-categ="${cat.id}">
                        ${cat.short_name}
                    </button>
                `).join("")}
            </div>
            ${html_view}
        `;

        this.modal.show();
    }


    hide(){
        this.modal.hide();
    }


    /**
     * 
     * @param {Object} action 
     * @param {categorie_dict[]} categories 
     * @returns 
     */
    #categorie_view(action, categories){
        return `
        <div class="modal-categorie">
            ${categories.map(cat => `
                <button data-handler="click_modal_categ" data-action=${JSON.stringify(action)} data-categ="${cat.id}">
                    ${cat.name}
                </button>
                `).join("")}
        </div>
        `;
    }

    /**
     * 
     * @param {Object} action 
     * @param {article_dict[]} articles 
     */
    #article_view(action, articles){
        const format_prix = (prix) => {
            return prix.toLocaleString("fr-FR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });
        };
        return `
        <div class="table-scroll">
            <table class="articles-table">
                <thead>
                    <tr>
                        <th>Ref</th>
                        <th>Désignation</th>
                        <th>Prix</th>
                    </tr>
                </thead>
                <tbody>
                    ${articles.map(art => `
                        <tr data-handler="click_modal_article" data-ref="${art.ref}" data-action=${JSON.stringify(action)}>
                            <td>${art.ref}</td>
                            <td>${art.label}</td>
                            <td>${format_prix(art.prix)} €</td>
                        </tr>
                        `).join("")}
                </tbody>
            </table>
        </div>
        `;
    }


    open_view_categories(categories){
        this.modal.content_div.innerHTML = `
        <h1>hello world</h1>
        `;
        console.log(categories);
        this.modal.show();
    }
}
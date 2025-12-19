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
     * Render the modal with a category view
     * @param {category_dict[]} parents_categ 
     * @param {category_dict[]} sub_categs 
     * @param {Object} action 
     */
    render_category_view(parents_categ, sub_categs, action){
        const current_categ = parents_categ.at(-1);
        this.modal.content_div.innerHTML = `
            ${this.#breadcrumb_view(parents_categ, action)}
            <div class="modal-category">
                ${sub_categs.map(cat => `
                    <button data-handler="click_modal_categ" data-action=${JSON.stringify(action)} data-categ="${cat.id}">
                        ${cat.name}
                    </button>
                    `).join("")}
                    <button data-handler="click_modal_all_article" data-action=${JSON.stringify(action)} data-categ="${current_categ.id}">
                        <strong>Tout(e)s les ${current_categ.name}</strong>
                    </button>
             </div>
        `;
    }

    /**
     * Render the modale articles shell, Note that to render articles rows need to call render_articles_rows()
     * @param {category_dict[]} parents_categ 
     * @param {Object} action 
     */
    render_articles_shell(parents_categ, action){
        const categ_id = parents_categ.at(-1).id;
        this.modal.content_div.innerHTML = `
            ${this.#breadcrumb_view(parents_categ, action)}
            <div class="table-scroll">
                <table class="articles-table">
                    <thead>
                        <tr>
                            <th>Ref <input type="text" 
                                            placeholder="Filtrer par réf."
                                            data-handler="filter-articles" 
                                            data-type="ref" 
                                            data-categ="${categ_id}"
                                            data-action=${JSON.stringify(action)}></th>
                            <th>Désignation <input type="text" 
                                            placeholder="Filtrer par désignation."
                                            data-handler="filter-articles" 
                                            data-type="label" 
                                            data-categ="${categ_id}"
                                            data-action=${JSON.stringify(action)}></th>
                            <th>Prix</th>
                        </tr>
                    </thead>
                    <tbody data-zone="articles-body"></tbody>
                </table>
            </div>
        `;
    }

    render_capteurs_shell(parents_categ, action){
        const categ_id = parents_categ.at(-1).id;
        this.modal.content_div.innerHTML = `
            ${this.#breadcrumb_view(parents_categ, action)}
            <table>
                <tr>
                    <td>Type</td>
                    <td>Type de pose</td>
                    <td>Type toiture</td>
                    <td>Inclinaison</td>
                </tr>
                <tr>
                    <td>
                        <select>
                            <option>Capteurs S7 2,5 portrait</option>
                            <option>Capteurs intégrés SID 2,5 m2</option>
                            <option>Capteurs SH 2,5 paysage</option>
                            <option>Capteurs S7 2,5 cadre noir portrait</option>
                            <option>Capteurs S7 2,0 portrait</option>
                            <option>Capteurs SH 2,0 paysage</option>
                        </select>
                    </td>
                    <td>
                        <select>
                            <option>Chassis murale</option>
                            <option>Chassis au sol</option>
                            <option>Chassis de toit</option>
                            <option>Surtoiture</option>
                            <option>Verticale</option>
                            <option>Intégration</option>
                        </select>
                    </td>
                    <td>
                        <select>
                            <option>Ardoise</option>
                            <option>Tuile romane ou forte ondulation</option>
                            <option>Tuiles mécanique</option>
                            <option>Tôle ondulée</option>
                        </select>
                    </td>
                    <td>
                        <select>
                            <option>Pose à 45°</option>
                            <option>Pose à 60°</option>
                            <option>Pose à 70°</option>
                        </select>
                    </td>
                </tr>
            </table>                
            <div class="table-scroll">
                <table class="articles-table">
                    <thead>
                        <tr>
                            <th>Ref <input type="text" 
                                            placeholder="Filtrer par réf."
                                            data-handler="filter-articles" 
                                            data-type="ref" 
                                            data-categ="${categ_id}"
                                            data-action=${JSON.stringify(action)}></th>
                            <th>Désignation <input type="text" 
                                            placeholder="Filtrer par désignation."
                                            data-handler="filter-articles" 
                                            data-type="label" 
                                            data-categ="${categ_id}"
                                            data-action=${JSON.stringify(action)}></th>
                            <th>Prix</th>
                        </tr>
                    </thead>
                    <tbody data-zone="articles-body"></tbody>
                </table>
            </div>
        `;
    }

    /**
     * Render only articles rows on the tbody if the articles shell
     * @param {article_dict[]} articles 
     * @param {Object} action 
     */
    render_articles_rows(articles, action) {
        const tbody = this.modal.content_div.querySelector('[data-zone="articles-body"]');

        tbody.innerHTML = articles.map(art => `
            <tr data-handler="click_modal_article"
                data-ref="${art.ref}"
                data-action='${JSON.stringify(action)}'>
                <td>${art.ref}</td>
                <td>${art.label}</td>
                <td>${format_prix(art.prix)} €</td>
            </tr>
        `).join("");
    }

    /**
     * 
     * @param {category_dict[]} parents_categ 
     * @param {Object} action
     * @returns {string}
     */
    #breadcrumb_view(parents_categ, action){
        return `
            <div class="breadcrumb">
                ${parents_categ.map(cat => `
                    <button data-handler="click_modal_categ" data-action=${JSON.stringify(action)} data-categ="${cat.id}">
                        ${cat.id}
                    </button>
                `).join("")}
            </div>
        `;
    }


    hide(){
        this.modal.hide();
    }

    show(){
        this.modal.show();
    }

}


function format_prix(prix){
    return prix.toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}
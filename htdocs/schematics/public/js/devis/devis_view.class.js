/**
 * @type {import('./devis_model.class').DevisModel}
 * @type {import('./devis_model.class').ArticleRow}
 */
class DevisView{
    /**
     * 
     * @param {HTMLDivElement} editable_devis_div 
     */
    constructor(editable_devis_div){
        this.div = editable_devis_div;
        this.header_div = this.div.querySelector(".devis-header");
        this.body_table = this.div.querySelector(".devis-body");
        this.footer_div = this.div.querySelector(".devis-footer");
    }


    /**
     * 
     * @param {DevisModel} model 
     */
    render(model){
        this.render_header(model);
        this.render_body(model);
        this.render_footer(model);
    }

    /**
     * 
     * @param {DevisModel} model 
     */
    render_header(model){
        this.header_div.querySelectorAll("input, textarea").forEach(el =>{
            if (model.header_fields.has(el.dataset.field_name)){
                el.value = model.header_fields.get(el.dataset.field_name);
            }
        });
    }

    /**
     * 
     * @param {DevisModel} model 
     */
    render_body(model){
        this.body_table.innerHTML = `
        <thead>
            <tr>
                <th>Ref</th>
                <th>Désignation</th>
                <th>Prix</th>
                <th>Remise</th>
                <th>Quantité</th>
                <th>Edition</th>
            </tr>
        </thead>
        <tbody>
            ${model.data_manager.get_childrens_categories(1).map(categ => 
                `
                <tr>
                    <th></th>
                    <th>${categ.name}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                ${model.get_rows_ordered_by_categ(categ.id).map(row => this.#render_article_row(row)).join("")}
                <tr>
                    <td></td>
                    <td class="add-buttons">
                        <button data-handler="body-add" data-categ="${categ.id}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button data-handler="body-add-text" data-categ="${categ.id}">
                            <i class="fa-regular fa-comment"></i>
                        </button>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `
            ).join("")}
        </tbody>
        `;
    }

    /**
     * 
     * @param {DevisModel} model 
     */
    render_footer(model){
        const total_ttc = model.get_total_price();
        const tva = 0.2;
        this.footer_div.innerHTML = `
        <table>
            <tr>
                <td>Code TVA</td>
                <td>Base HT</td>
                <td>Taux TVA</td>
                <td>Montant TVA</td>
                <td>Montant TTC</td>
            </tr>
            <tr>
                <td>3</td>
                <td>${format_number(total_ttc * (1 - tva))} €</td>
                <td>${format_number(tva * 100)} %</td>
                <td>${format_number(total_ttc * tva)} €</td>
                <td>${format_number(total_ttc)} €</td>
            </tr>
        </table>
        <table>
            <tr>
                <td>Montant HT</td>
                <td>${format_number(total_ttc * (1 - tva))} €</td>
            </tr>
            <tr>
                <td>Montant TVA</td>
                <td>${format_number(total_ttc * tva)} €</td>
            </tr>
            <tr>
                <th>Total TTC</th>
                <th>${format_number(total_ttc)} €</th>
            </tr>
        </table>
        `;
    }


    /**
     * 
     * @param {ArticleRow} article_row 
     * @returns {string}
     */
    #render_article_row(article_row){
        const ref_html = article_row.ref.startsWith("TEXT_") ? "TEXT" : article_row.ref;
        return `
            <tr>
                <td>${ref_html}</td>
                <td>${article_row.label}</td>
                <td>${format_number(article_row.prix)} €</td>
                <td><input class="remise" data-handler="remise-input" data-ref="${article_row.ref}" type="number" min="0" max="30" value="${article_row.remise}"></td>
                <td><input class="qte-input" data-handler="qte-input" data-ref="${article_row.ref}" type="number" min="1" max="9999" value="${article_row.quantity}"></td>
                <td>
                    <div class="devis-edit">
                        <button data-handler="body-edit" data-ref="${article_row.ref}" data-categ="${article_row.categorie_id}">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <div class="move-buttons">
                            <button data-handler="body-move" data-ref="${article_row.ref}" data-direction="-1">
                                <i class="fa-solid fa-angle-up"></i>
                            </button>
                            <button data-handler="body-move" data-ref="${article_row.ref}" data-direction="1">
                                <i class="fa-solid fa-angle-down"></i>
                            </button>
                        </div>
                        <button data-handler="body-remove" data-ref="${article_row.ref}">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }


}

/**
 * 
 * @param {number} number 
 * @returns {string}
 */
function format_number(number){
    return number.toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}
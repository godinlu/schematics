/**
 * @type {import('./devis_body.js').DevisBody}
 * @type {import('./devis_footer.js').DevisFooter}
 * @type {import('./devis_header.js').DevisHeader}
 * @type {import('../utils.js').format_number}
 */


/**
 * This class is used to create the final static devis to be downloaded in pdf 
 */
class DevisPdf{
    /**@type {DevisHeader} */
    devis_header

    /**@type {DevisBody} */
    devis_body

    /**@type {DevisFooter} */
    devis_footer

    /**
     * 
     * @param {DevisHeader} devis_header 
     * @param {DevisBody} devis_body 
     * @param {DevisFooter} devis_footer 
     * @param {string|null} devis_reference - Référence du devis, générée par défaut si null
     */
    constructor(devis_header, devis_body, devis_footer, devis_reference){
        this.devis_header = devis_header;
        this.devis_body = devis_body;
        this.devis_footer = devis_footer;
        this.devis_reference = devis_reference ?? `REF-${(new Date()).getFullYear()}-XXXXX`;
    }

    /**
     * Generate the HTML of the devis pdf in the div 
     * @param {HTMLDivElement} div 
     */
    mount(div){
        div.innerHTML = `
        ${this.#devis_header_html()}
        ${this.#devis_body()}
        ${this.#devis_footer()}
        `;
    }


    /**
     * return the string HTML for the header of the devis
     * @returns {string}
     */
    #devis_header_html(){
        return `
        <div class="devis-header">
            <div>
                <div>
                    <img src="../public/img/Solisart-menue.jpg" alt="logo solisart" width="200">
                    <p>220, voie Aristide Bergès<br>73800 SAINTE-HELENE DU LAC<br>Tél: 04 79 60 42 06 <br> Email : contact@solisart.fr </p>
                    <p>
                        <strong>
                            <span>Objet : ${this.devis_header.fields.get("header-objet")}</span>
                            <br>
                            <span>Affaire : ${this.devis_header.fields.get("header-affaire")}</span>
                        </strong>
                    </p>
                </div>
                <div>
                    <table cellspacing="0">
                        <tr><th>${this.devis_header.fields.get("header-type_devis")}</th></tr>
                        <tr><td>${this.devis_reference}</td></tr>
                        <tr><td>${this.devis_header.get_date_fr_format()}</td></tr>
                    </table>
                    <p>
                        A l'attention de ${this.devis_header.fields.get("header-installateur_nom_prenom")}
                        <br>
                        Nom de l'entreprise : ${this.devis_header.fields.get("header-installateur_entreprise")}
                        <br>
                        Mail : ${this.devis_header.fields.get("header-installateur_mail")}  
                    </p>
                </div>
            </div>
            <table>
                <tr>
                    <td>Affaire suivie par</td>
                    <td>Mode de règlement</td>
                    <td>Validité</td>
                    <td>Délai</td>
                </tr>
                <tr>
                    <td>${this.devis_header.fields.get("header-affaire_suivie_par")}</td>
                    <td>${this.devis_header.fields.get("header-mode_reglement")}</td>
                    <td>${this.devis_header.fields.get("header-validite")}</td>
                    <td>${this.devis_header.fields.get("header-delai_livraison")}</td>
                </tr>
            </table>
        </div>
        `;
    }

    /**
     * return the HTML string of the devis body for pdf
     * Loop into every non empty categories and for each categories loop into every devis row
     * @returns {string}
     */
    #devis_body(){
        return `
        <table class="devis-body articles-table" cellspacing="0">
        <thead>
            <tr>
                <th>Ref</th>
                <th>Désignation</th>
                <th>Qté</th>
                <th>Prix tarif</th>
                <th>Remise</th>
                <th>P.U HT</th>
                <th>Montant HT</th>
            </tr>
        </thead>
        <tbody>
            ${this.devis_body.get_devis_categories().map(devis_categ => {
                console.log(devis_categ.get_rows_ordered());
                return `
                <tr>
                    <th></th>
                    <th>${devis_categ.categ.name}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                ${devis_categ.get_rows_ordered().map(devis_row =>`
                    <tr>
                        <td>${(devis_row.is_text? "TEXT": devis_row.ref)}</td>
                        <td>${devis_row.label}</td>
                        <td>${devis_row.is_text? "": devis_row.quantity}</td>
                        <td>${devis_row.is_text? "": format_number(devis_row.prix, 2)}</td>
                        <td>${devis_row.is_text? "": devis_row.remise + " %"}</td>
                        <td>${devis_row.is_text? "": format_number(devis_row.unit_price, 2)}</td>
                        <td>${devis_row.is_text? "": format_number(devis_row.total_amount, 2)}</td>
                    </tr>
                `).join("")}
                `;
            }).join("")}
        </tbody>
    </table>
    `;
    }


    /**
     * return the HTML string of the devis footer with total price HT and TTC
     * @returns {string} - HTML string of the footer
     */
    #devis_footer(){
        const total_ht = this.devis_body.total_amount;
        const total_tva = total_ht * (this.devis_footer.tva_percent / 100);

        return `
        <div class="devis-footer">
            <table>
                <tr>
                    <td>Code TVA</td>
                    <td>Base HT</td>
                    <td>Taux TVA</td>
                    <td>Montant TVA</td>
                    <td>Montant TTC</td>
                </tr>
                <tr>
                    <td>${this.devis_footer.tva_code}</td>
                    <td>${format_number(total_ht, 2)} €</td>
                    <td>${format_number(this.devis_footer.tva_percent, 2)} %</td>
                    <td>${format_number(total_tva, 2)} €</td>
                    <td>${format_number(total_ht + total_tva, 2)} €</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>Montant HT</td>
                    <td>${format_number(total_ht, 2)} €</td>
                </tr>
                <tr>
                    <td>Montant TVA</td>
                    <td>${format_number(total_tva, 2)} €</td>
                </tr>
                <tr>
                    <th>Total TTC</th>
                    <th>${format_number(total_ht + total_tva, 2)} €</th>
                </tr>
            </table>
        </div>
        `;
    }


}
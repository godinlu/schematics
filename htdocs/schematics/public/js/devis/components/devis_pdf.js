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
     */
    constructor(devis_header, devis_body, devis_footer){
        this.devis_header = devis_header;
        this.devis_body = devis_body;
        this.devis_footer = devis_footer;
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
                        <tr><th>CHIFFRAGE ESTIMATIF</th></tr>
                        <tr><td>${this.devis_header.fields.get("header-date")}</td></tr>
                    </table>
                    <p>
                        Mail: ${this.devis_header.fields.get("header-mail")}
                        <br>
                        A l'attention de ${this.devis_header.fields.get("header-installateur")}
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
                    <td>${this.devis_header.fields.get("header-field1")}</td>
                    <td>${this.devis_header.fields.get("header-field2")}</td>
                    <td>${this.devis_header.fields.get("header-field3")}</td>
                    <td>${this.devis_header.fields.get("header-field4")}</td>
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
                ${devis_categ.get_rows_ordered().map(devis_row => `
                    <tr>
                        <td>${(devis_row.ref.startsWith("TEXT_")? "TEXT": devis_row.ref)}</td>
                        <td>${devis_row.label}</td>
                        <td>${devis_row.quantity}</td>
                        <td>${format_number(devis_row.prix, 2)}</td>
                        <td>${devis_row.remise} %</td>
                        <td>${format_number(devis_row.prix * (1 - (devis_row.remise / 100)), 2)}</td>
                        <td>${format_number(devis_row.get_price(), 2)}</td>
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
        const total_ht = this.devis_body.get_price();
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
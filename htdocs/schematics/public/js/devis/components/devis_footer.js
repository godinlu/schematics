/** @type {import('../utils.js').format_number} */

/**
 * 
 */
class DevisFooter{
    constructor(tva_code = 3, tva_percent = 20){
        this.tva_code = tva_code;
        this.tva_percent = tva_percent;
    }

    /**
     * Mount on the html the devis footer
     * @param {HTMLDivElement} div 
     * @param {number} total_ht 
     */
    mount(div, total_ht){
        const total_tva = total_ht * (this.tva_percent / 100);

        div.innerHTML = `
            <table>
                <tr>
                    <td>Code TVA</td>
                    <td>Base HT</td>
                    <td>Taux TVA</td>
                    <td>Montant TVA</td>
                    <td>Montant TTC</td>
                </tr>
                <tr>
                    <td>${this.tva_code}</td>
                    <td>${format_number(total_ht, 2)} €</td>
                    <td>${format_number(this.tva_percent, 2)} %</td>
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
        `;
    }
}
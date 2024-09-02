/**
 * cette class s'occupe de l'aspect visuel du devis 
 * c'est une class statique qui nécessite les variables
 *      -ballon_et_hydraulique
 *      -capteurs_et_fixation
 *      -transport_et_insta
 */
class VisualDevis{
    static format = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2, minimumFractionDigits: 2});
    static EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

    static displayHeader(){

    }
    
    static show(){
        var table = document.querySelector("#table_devis");
        table.innerHTML = "";
        this.#addLine(["Référence","Désignation","Qté","Prix tarif","Remise","P.U HT","Montant HT"], table);

        const categ_devis = devis.getDevisFormat();
        for (const name_categ in categ_devis){
            if (categ_devis[name_categ].length != 0) this.#addLine(["",name_categ,"","","",""], table,"th");
            
            for (var i=0 ; i<categ_devis[name_categ].length ; i++){
                let article = categ_devis[name_categ][i];
                this.#addLine([
                    article.getRef(),
                    article.getLabel(),
                    this.format.format(article.getQuantity()),
                    this.format.format(article.getUnitPrice()),
                    article.getDiscount() + " %",
                    this.format.format(article.getDiscountUnitPrice()),
                    this.format.format(article.getFinalPrice())
                ], table);
            }
        }
        this.#addFooterTable();

    }

    static #addFooterTable(){
        
        var tables = document.querySelectorAll("#footer table");
        tables[0].innerHTML = "";
        tables[1].innerHTML = "";

        const base_ht = devis.getTotal();
        const montant_tva = devis.getTotal() * (devis.TAUX_TVA / 100);
        const montant_TTC = base_ht + montant_tva;

        //ajout des lignes du tableau1
        this.#addLine(["Code TVA","Base HT","Taux TVA","Montant TVA","Montant TTC"],tables[0]);
        this.#addLine([
            devis.CODE_TVA,
            this.format.format( base_ht ),
            this.format.format(devis.TAUX_TVA ),
            this.format.format(montant_tva),
            this.format.format(montant_TTC)
        ],tables[0]);
        //ajout des lignes du tableau2
        this.#addLine(["Montant HT",this.EUR.format(base_ht)],tables[1]);
        this.#addLine(["Montant TVA",this.EUR.format(montant_tva)],tables[1]);
        this.#addLine(["Total TTC",this.EUR.format(montant_TTC)],tables[1],"th");


    }
    static #addLine(array,table,type = "td"){
        var raw = document.createElement("tr");
        var col;
        for (var i=0 ; i<array.length ; i++){
            col = document.createElement(type);
            col.innerHTML = array[i];
            raw.appendChild(col);
        }
        table.appendChild(raw);
    }


}
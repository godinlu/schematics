function manageRaccBT(){
    var nb_bal_tp = document.querySelectorAll("#div_ballonTampon > div").length;
    const tampon = /ballon d'eau chaude sur échangeur|Ballon hygiénique/;
    if (tampon.test(formulaire['ballonECS'])) nb_bal_tp += document.querySelectorAll("#div_ballonECS > div").length;
    if (nb_bal_tp <= 1){
        devis.removeRow("racc_bt")
        return;
    } 
    var row = CSV.ballon_part.filter(row => row.filtre1 == "RACCORDEMENT")[0];
    devis.add("racc_bt",row);
    devis.updateQuantity("racc_bt",nb_bal_tp-1);
}

//cette fonction sert à transformer les "300L" en chiffre pour pouvoir trier par volume du ballon
function extractNumericValue(str){
    if (!str) return 0; // Retourne 0 si la chaîne est nulle
    const numericValue = parseFloat(str.replace(/[^\d.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue; // Retourne 0 si la valeur extraite est NaN
}

class BallonECS extends Champ{
    constructor(id, texte, categorie){
        super(id, texte, categorie);

        const SIMPLE = /ballon ECS tank in tank|Ballon hygiénique avec 1 echangeur/

        //======================================================================
        //                          FONCTIONS
        /**
         * initalise le select du ballon ECS en fonction du ballon ECS choisit dans DATA
         * et des ballons ECS que contient le fichier xlsx ballon_part.xlsx
         * @param {HTMLSelectElement} select 
         */
        function initSelectECS(select){
            const tampon = /ballon d'eau chaude sur échangeur|Ballon hygiénique/;
            var ECS_rows = CSV.ballon_part;


            //cette ligne sert à trier les ballon avec leurs volum en L
            ECS_rows.sort((a, b) => extractNumericValue(a.filtre4) - extractNumericValue(b.filtre4));
            if (tampon.test(formulaire['ballonECS'])){
                ECS_rows = ECS_rows.filter(raw => raw.filtre1 == "TAMPON"); //on filtre sur les ballon tampon
                ECS_rows = ECS_rows.filter(raw => raw.filtre2 != "sans ech"); //ensuite on prend que les bt qui ont un échangeur
                var filter = "";
                //si c'est un ballon hygiènique alors on prend que les serpentin sinon on prend tout sauf les serpentin
                if (/Ballon hygiénique/.test(formulaire['ballonECS'])){
                    filter = "serpentin";  
                    if (/2/.test(formulaire['ballonECS'])) ECS_rows = ECS_rows.filter(raw => raw.filtre2 == "double ech");
                    else ECS_rows = ECS_rows.filter(raw => raw.filtre2 == "ech total")
                    
                } 
                ECS_rows = ECS_rows.filter(raw => raw.filtre3 == filter);
    
            }else{
                ECS_rows = ECS_rows.filter(raw => raw.filtre1 == "ECS");
                if (SIMPLE.test(formulaire['ballonECS'])) ECS_rows = ECS_rows.filter(raw => /simple/.test(raw.filtre2));
                else ECS_rows = ECS_rows.filter(raw => /double/.test(raw.filtre2));
            } 
    
            for (var i=0 ; i<ECS_rows.length ; i++){
                select.addOption(ECS_rows[i].label , ECS_rows[i].ref);
            }
            //ici on gère la partie de default index
            if (!tampon.test(formulaire['ballonECS'])){
                const default_index = ECS_rows.filter(row => row.filtre1 == "ECS" && row.filtre4 == "500L")[0];
                select.value = default_index.ref;
            }
        }

        //======================================================================
        //                          MAIN
        initSelectECS(this.nodes.ballon_ecs);
        this.nodes.ballon_ecs.addEventListener("change",eventSelectUpdateDevis);
        this.nodes.ballon_ecs.addEventListener("change",eventUpdateObjet);
        eventSelectUpdateDevis.call(this.nodes.ballon_ecs);
        manageRaccBT();
    }

    supprimer(){
        devis.removeRow(this.nodes.ballon_ecs.id);
        manageRaccBT();
        VisualDevis.show();
    }
}

class BallonTampon extends Champ{
    static lignes;

    constructor(id, texte, categorie){
        super(id, texte, categorie);

        //======================================================================
        //                          FONCTIONS
        /**
         * initalise le select du ballon tampon en fonction du ballon tampon choisit dans DATA
         * et des ballons tampon que contient le fichier xlsx ballon_part.xlsx
         * @param {HTMLSelectElement} select 
         */
        function initSelectTampon(select){
            //ici on enlève tout les ballon tampon avec serpentin
            let tampons_rows = BallonTampon.lignes.filter(row => row.filtre3 == undefined);
            //cette ligne sert à trier les ballon avec leurs volum en L
            tampons_rows.sort((a, b) => extractNumericValue(a.filtre4) - extractNumericValue(b.filtre4));

            if (formulaire['EchangeurDansBT'] === "on") tampons_rows = tampons_rows.filter(raw => raw.filtre2 == "ech total");
            else if (formulaire['EchangeurDansBT'] === "off" && 
                (formulaire['optionS10'] == "recharge nappes goethermiques sur T15 sur serpentin BTC" ||
                formulaire['optionS10'] == "recharge nappes goethermiques sur T15 sur serpentin BTC") ){
                    tampons_rows = tampons_rows.filter(raw => raw.filtre2 == "ech bas");
                }
            else tampons_rows = tampons_rows.filter(raw => raw.filtre2 == "sans ech");

            for (var i=0 ; i<tampons_rows.length ; i++){
                select.addOption(tampons_rows[i].label , tampons_rows[i].ref);
            }
        }

        //======================================================================
        //                          MAIN
        initSelectTampon(this.nodes.ballon_tampon);
        this.nodes.ballon_tampon.addEventListener("change",eventSelectUpdateDevis);
        this.nodes.ballon_tampon.addEventListener("change",eventUpdateObjet);
        manageRaccBT();
        eventSelectUpdateDevis.call(this.nodes.ballon_tampon);
    }

    supprimer(){
        devis.removeRow(this.nodes.ballon_tampon.id);
        manageRaccBT();
        VisualDevis.show();
    }
}

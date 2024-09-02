/**
 * le fichier csv tubeInox_part est répartie de la manière suivant
 * ID | REF | LABEL | PRIX | TYPE_ARTICLE | TYPE_TUBE | DN
 * 
 * la class TubeInox requis le script devis_general
 * 
 */
class FlexibleInox extends Champ{
    static lignes;

    static TYPE_FLEXIBLE = "filtre2";
    static DN = "filtre3";

    constructor(id, texte, categorie){
        super(id, texte, categorie);
        //on initalise le filtrage
        //ensuite on gère les filtrages
        const selects_filtrage = [
            this.nodes.type_flexible,
            this.nodes.Dimension_flexible,
            this.nodes.flexible_inox
        ];
        const filters_column = [FlexibleInox.TYPE_FLEXIBLE, FlexibleInox.DN, "ref"];
        const void_function = (val)=>{return val};
        const filters_functions = [void_function, void_function, void_function];
        const labelisation = [undefined, undefined, FlexibleInox.getLabel];
        const sort_functions = [undefined, FlexibleInox.DN_filter, FlexibleInox.long_filter]

        const filtrage = new Filtrage(
            FlexibleInox.lignes,
            selects_filtrage,
            filters_column,
            filters_functions,
            labelisation,
            sort_functions
            );

        this.nodes.Dimension_flexible.addEventListener("change",()=>{
            this.filtrer_accesoire()
        });



    }
    /**
     * 
     */
    filtrer_accesoire(){
        //on commence par accéder au select associé des accesoires
        let select = document.getElementById("accessoire_"+this.num);
        //si le select n'existe pas alors on ne fait rien
        if (select === null) return;

        let list_options = Array();
        Accessoire.lignes.forEach(row =>{
            if (row.label.includes(this.nodes.Dimension_flexible.value)) list_options.push(row);
        });
        //on vide les options du select puis on garde que celle résultant du filtre
        select.innerHTML = "";
        list_options.forEach(option => {
            select.addOption(option.label, option.ref);
        });
        select.dispatchEvent(new Event('change'));    

    }

    supprimer(){
        //lorsque l'on supprime le champ on enlève le filtre sur les accesoires associé
        let select = document.getElementById("accessoire_"+this.num);
        if (select !== null){
            Accessoire.lignes.forEach(option => {
                select.addOption(option.label, option.ref);
            });
        }
        
        devis.removeRow(this.nodes.flexible_inox.id);
        VisualDevis.show();
    }

    static getLabel(ref){
        const row = FlexibleInox.lignes.filter(raw => raw.ref == ref)[0];
        return row.label;
    }
    /**
     * cette fonction sert de filtre pour filtrer par rapport à la taille des DN
     * @param {str} chaine 
     * @returns {int}
     */
    static DN_filter(chaine) {
        const regex = /DN(\d+)/;
        const match = regex.exec(chaine);
        return parseInt(match[1]);
    }
    /**
     * cette fonction sert de filtre pour filtrer par rapport à la longueur ex : "lg 20m", "lg 25m",...
     * @param {str} chaine 
     * @returns {int}
     */
    static long_filter(chaine) {
        const regex = /(\d+)m/;
        const match = regex.exec(chaine);
        return match ? parseInt(match[1]) : null;
    }
}


class Accessoire extends Champ{
    static lignes;

    constructor(id, texte, categorie){
        super(id, texte, categorie);

        //on initalise le select 
        Accessoire.lignes.forEach(row => {
            this.nodes.accessoire.addOption(row.label, row.ref);
        });

        //on ajoute le handler sur le select
        this.nodes.accessoire.addEventListener("change",eventSelectUpdateDevis);
        this.nodes.accessoire.addEventListener("change",this.handlerQuantity.bind(this));
        this.nodes.nb_accessoire.addEventListener("input", this.handlerQuantity.bind(this));
        eventSelectUpdateDevis.call(this.nodes.accessoire);
    }

    /**
     * fonction appellé lorsque l'input type number de quantité est modifié
     * met à jour la quantité de l'article dans le devis
     */
    handlerQuantity(){
        const qte = parseInt(this.nodes.nb_accessoire.value);
        devis.updateQuantity(this.nodes.accessoire.id, qte);
        VisualDevis.show();
    }

    supprimer(){
        devis.removeRow(this.nodes.accessoire.id);
        VisualDevis.show();
    }
}


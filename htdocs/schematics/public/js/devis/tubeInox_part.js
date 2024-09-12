class ListFlexibleInox extends ListeChamp{
    ajouter(){
        super.ajouter();
        link_flexible_accesoire();
    }
}


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

        this.nodes.Dimension_flexible.addEventListener("change", link_flexible_accesoire);
        // on met les valeurs d'un nouveau champs au valeur par défaut.
        for (const [key, value] of Object.entries(default_devis_index["flexible_inox"][0])) {
            setElementValue(this.nodes[key], value);
        }
    }

    /**
     * Renvoie la position du champ.
     * @returns {int}
     */
    #get_position(){
        // Accéder à l'élément parent
        const parent_div = this.nodes.champ_flexible_inox.parentNode;

        // Trouver l'index de la div spécifique
        let position = -1;
        parent_div.querySelectorAll('div').forEach((child, index) => {
            if (child === this.nodes.champ_flexible_inox) {
                position = index;
            }
        });
        return position;
    }

    supprimer(){
        //lorsque l'on supprime le champ on enlève le filtre sur les accesoires associé
        let select = document.getElementById("accessoire_"+this.num);
        if (select !== null){
            Accessoire.lignes.forEach(option => {
                select.addOption(option.label, option.ref);
            });
        }
        link_flexible_accesoire();
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


class ListAccessoire extends ListeChamp{
    ajouter(){
        super.ajouter();
        link_flexible_accesoire();
    }
}

class Accessoire extends Champ{
    static lignes;

    constructor(id, texte, categorie){
        super(id, texte, categorie);

        
        this.nodes.type_joint.addEventListener("change", this.handler_type_joint.bind(this));
        this.nodes.dn_dim.addEventListener("input", this.handler_dn_dim.bind(this));
        this.nodes.type_joint.dispatchEvent(new Event('change'));  

    }

    /**
     * fonction appellé lorsque le select type_join change de valeur.
     * Cette fonction met à jour la liste des accessoire en fonction de la valeur de type_join et 
     * de la valeur du DN choisi
     */
    handler_type_joint(){
        // on récupère la dimension du flexible
        let dimension = this.nodes.dn_dim.value;

        // on récupère la valeur du type_joint
        let type_joint = this.nodes.type_joint.value;

        // on filtre avec la dimension et le type de joint
        let rows = Accessoire.lignes.filter(raw => (raw.filtre2.includes(type_joint) && raw.filtre3 == dimension));

        // on regarde si parmis ces lignes il y a un choix et on les enlèves des rows
        let choice = rows.filter(raw => raw.filtre4 == "choix");
        rows = rows.filter(raw => raw.filtre4 != "choix");

        this.supprimer()

        // ensuite on remplie la liste avec tous les articles de rows
        this.nodes.accessoires.innerHTML = "";
        rows.forEach((raw, i) => {
            let li = document.createElement("li");
            li.innerText = raw.label;   
            this.nodes.accessoires.appendChild(li);
            devis.add("kit_joint_"+this.num+i, raw);
        });

        this.create_select_choice(choice);

        
    }

    /**
     * fonction appellé lorsque l'input hidden dn_dim change de valeur.
     */
    handler_dn_dim(){
        if (this.nodes.dn_dim.value == "DN32"){
            setElementValue(this.nodes.type_joint, "joint");
        }
        this.handler_type_joint();
    }

    /**
     * Cette fonction créer un select avec les articles contenue dans choice et
     * l'ajoute à la list this.nodes.accessoires. Si il n'y a aucun choix alors on supprime l'ancienne article.
     * @param {JSON[]} choice 
     */
    create_select_choice(choice){
        // si il n'y a aucun choix alors le select ne doit pas apparaitre
        // et la ligne doit être supprimer du devis
        if (choice.length == 0){
            devis.removeRow("kit_joint_"+this.num);
            VisualDevis.show();
            return;
        }else{
            // ajoute un select avec les choix de choice
            let li = document.createElement("li");
            let select = document.createElement("select");
            select.id = "kit_joint_"+this.num;
            select.classList.add("tubeInox_part");
            activate_select(select, choice);
            li.appendChild(select);
            this.nodes.accessoires.appendChild(li);
        }
    }

    /**
     * fonction appelé lors de la suppression d'un bloque mais aussi lors
     * de la modification du type de joint
     */
    supprimer(){
        // suppression des articles ajouté au devis
        for (let i = 0; i < this.nodes.accessoires.children.length; i++) {
            devis.removeRow("kit_joint_"+this.num+i);
        }
        devis.removeRow("kit_joint_"+this.num);
        link_flexible_accesoire();
        VisualDevis.show();
    }
}

/**
 * Cette fonction fait le lien entre les flexibles inox et les accessoires
 * elle est appellé lorsque que:
 *  - le select DN change de valeur
 *  - lors de l'ajout ou de la suppression de n'importe qu'elle champs.
 */
function link_flexible_accesoire(){
    const champs_flexible_inox = document.getElementById("div_flexible_inox").children;
    const champs_accessoire = document.getElementById("div_accessoire").children;

    for (let i = 0; i < champs_accessoire.length; i++) {
        let dn_dim = "DN20";
        if (i < champs_flexible_inox.length){
            // si pour le champ accessoire il existe un champ flexible inox aligné
            // alors on récupère la dimension de celui-ci
            dn_dim = champs_flexible_inox[i].querySelector(".dn_dim").value;
        }else if (champs_flexible_inox.length != 0){
            dn_dim = champs_flexible_inox[champs_flexible_inox.length-1].querySelector(".dn_dim").value;
        }
        // on récupère l'hidden input responsable de la dimension
        const input = champs_accessoire[i].querySelector("input[type='hidden']");
        setElementValue(input, dn_dim);        
    }

}

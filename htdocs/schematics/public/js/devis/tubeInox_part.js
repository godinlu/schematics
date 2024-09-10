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

        this.nodes.Dimension_flexible.addEventListener("change", this.handler_filtre_join.bind(this));
        this.handler_filtre_join();


    }

    /**
     * fonction appelé lorsque le select de dimension du flexible change de valeur.
     * met à jour le select de type de joint
     */
    handler_filtre_join(){
        //on commence par accéder au select associé des accesoires
        if (this.nodes.champ_flexible_inox.nextElementSibling){
            // ici on est dans le cas ou il y a un flexible inox après celui-ci
            // ce champ doit donc être lié uniquement à l'accessoire en face
            const position = this.#get_position();
            let input = document.querySelector(`#div_accessoire > div:nth-child(${position+1}) input[type="hidden"]`);
            //si le select n'existe pas alors on ne fait rien
            if (input === null) return;
            setElementValue(input, this.nodes.Dimension_flexible.value)
        }else{
            // ici on est dans le cas ou il n'y a pas de flexible apres celui-ci
            // ce champ doit donc être lié à l'accessoire en face et à ceux d'en dessous.
            let childs_div = document.querySelector("#div_accessoire").children;
            for (let i = this.#get_position(); i < childs_div.length; i++) {
                let input = childs_div[i].querySelector('input[type="hidden"]');
                //si le select n'existe pas alors on ne fait rien
                if (input === null) return;
                setElementValue(input, this.nodes.Dimension_flexible.value)
                
            }            
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

        this.nodes.type_joint.addEventListener("change", this.handler_type_joint.bind(this));
        this.nodes.type_joint.dispatchEvent(new Event('change'));  
        this.nodes.dn_dim.addEventListener("input", this.handler_dn_dim.bind(this));

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
        VisualDevis.show();
    }
}


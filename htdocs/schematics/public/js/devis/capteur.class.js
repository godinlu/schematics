class Capteur extends Champ{
    static filtre = ["type_capteur", "nb_capteur", "nb_range", "type_pose", "type_toiture", "ligne_final"];

    //variable qui contient les lignes de capteurs (doivent être initialiser avant d'appeler le constructeur)
    static ligne_capteurs;
    static ligne_habillage;

    //variable qui indique les filtes
    static SURFACE_BRUT = "filtre2";
    static SURFACE_NET = "filtre3";

    constructor(id, texte, categorie){
        super(id, texte, categorie);

        
        //ensuite on gère les filtrages
        const selects_filtrage = [
            this.nodes.type_capteur,
            this.nodes.nb_capteur,
            this.nodes.nb_range,
            this.nodes.type_pose,
            this.nodes.type_toiture
        ];

        const filters_column = ["ref","ref","ref","ref","ref"];
        const filters_functions = [
            Capteur.getType,
            Capteur.getNbCapteur,
            Capteur.getNbRange,
            Capteur.getTypePose,
            Capteur.getTypeToiture

        ];
        const sort_functions = [undefined, parseInt, parseInt, undefined, undefined]
        const labelisation = [undefined, undefined, undefined, this.getLabelTypePose, this.getLabelTypeToiture];
        const filtrage = new Filtrage(
            Capteur.ligne_capteurs,
            selects_filtrage,
            filters_column,
            filters_functions,
            labelisation,
            sort_functions
            );

        //ensuite on gère l'habillage
        this.nodes.nb_capteur.addEventListener("change", () => this.manage_habillage());

        this.nodes.type_pose.addEventListener("change", ()=> this.manage_champ_range());
        this.nodes.nb_champs.addEventListener("input", ()=>this.handlerQuantity());
        this.nodes.type_toiture.addEventListener("change", ()=> this.handlerQuantity());
        this.nodes.type_capteur.addEventListener("change", ()=> this.handlerQuantity());


        this.nodes.habillage.addEventListener("input", eventCheckBoxUpdateDevis);
        this.nodes.type_capteur.dispatchEvent(new Event("change"));
        //this.manage_habillage();

        // on ajoute les index par défaut
        for (const nodes_id in default_devis_index.capteur[0]){
            setElementValue(
                this.nodes[nodes_id],
                default_devis_index.capteur[0][nodes_id]
            );
        }

        
    }


    /**
     * cette fonction regarde si la type de pose est intégré ou non
     * si oui alors elle active la possibilité de choisir le nombre de rangé si non 
     * alors elle active la possibilité de choisir le nombre de champs qui agit comme un selecteur de quantité
     */
    manage_champ_range(){
        if (this.nodes.type_pose.value === "I"){
            this.nodes.row_nb_range.classList.remove("hidden");
            this.nodes.row_nb_champs.classList.add("hidden");
            this.nodes.nb_champs.value = "1";
        }else{
            this.nodes.row_nb_champs.classList.remove("hidden");
            this.nodes.row_nb_range.classList.add("hidden");
        }
    }

    /**
     * cette fonction met à jour la quantité de capteur demandé
     */
    handlerQuantity(){
        const qte = parseInt(this.nodes.nb_champs.value);
        devis.updateQuantity(this.nodes.type_toiture.id, qte);
        VisualDevis.show();
    }

    manage_habillage(){
        const lignes_habillage = Capteur.ligne_habillage.filter(raw => 
            raw.ref.includes(this.nodes.type_capteur.value) && raw.ref.includes(this.nodes.nb_capteur.value)
        );
        if (lignes_habillage[0] === undefined){   //ici si il n'y a aucun habillage pour ce capteur alors on décoche l'habillage et on le rend invisible
            disabledCheckbox(this.nodes.habillage,"",false);
        }else{                          //ici si il y a un habillage on le rend visible et on met la valeur de l'habillage à jour
            enableCheckbox(this.nodes.habillage);
            this.nodes.habillage.value = lignes_habillage[0].ref;
        }
        eventCheckBoxUpdateDevis.call(this.nodes.habillage);
        
    }

    supprimer(){
        devis.removeRow(this.nodes.type_toiture.id);
        devis.removeRow(this.nodes.habillage.id);
        VisualDevis.show();
        delete this;
    }

    getLabelTypePose(type_pose){
        switch(type_pose){
            case "ST": return "Surtoiture";
            case "CT": return "Chassis de toit";
            case "CS": return "Chassis au sol";
            case "CM": return "Chassis murale";
            case "V": return "Vertical";
            case "I": return "Intégration";
            default: throw new Error("Type de pose inconnu");
         }

    }

    getLabelTypeToiture(type_toiture){
        switch(type_toiture){
            case "TO": return "Tôle ondulée";
            case "A": return "Ardoise";
            case "R": return "Tuile romane ou forte ondulation";
            case "T": return "Autre";
            case "Aucun": return "Aucun";
            default: throw new Error("Type de toiture inconnu");
        }
    }


    static getType(ref){
        return ref.match(/^([^-]+)/)[1];
    }

    static getNbCapteur(ref){
        return ref.match(/\d+(?=-0)|[1-9]+$/)[0];
    }

    static getNbRange(ref){
        return String(ref.match(/(?!0)(\d+)(?!.*[a-zA-Z])/g).length);
    }

    static getTypePose(ref){
        try{
            return ref.match(/.*?-(ST|CT|CS|CM|V)-/)[1];
        }catch(e){
            //si le type de pose n'est pas trouvé alors c'est que c'est un capteur intégré
            return "I";
        }
    }

    static getTypeToiture(ref){
        try{
            return ref.match(/-(A|T|TO|R)-/)[1];
        }catch{
            return "Aucun";
        }
    }



}
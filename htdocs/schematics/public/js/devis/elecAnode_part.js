class ElecAnode{
    //////////////////////////////////////////////////////////////////////////
    //----------------------- VARIABLE STATIC--------------------------------  

    static #nb_ResistanceElec = 0;
    static #nb_Rechauffeur_boucle = 0;
    //////////////////////////////////////////////////////////////////////////

    /**
     * initalise le select des resistance eletrique en fonction du fichier elecAnode_part.csv
     * et ajoute la possibilité de choisir aucun
     * @param {HTMLSelectElement} select 
     */
    static #initSelectResistance(select){
        const resistances = CSV.elecAnode_part.filter(row => row.filtre1 == "Resistance elec");
        for (var i=0 ; i<resistances.length ; i++){
            select.addOption(resistances[i].label, resistances[i].ref);
        }
        select.addOption("Aucun","Aucun");
    }

    /**
     * initalise le select des réchauffeur de boucle en fonction du fichier elecAnode_part.csv
     * et ajoute la possibilité de choisir aucun
     * @param {HTMLSelectElement} select 
     */
    static #initSelectRechauffeurBoucle(select){
        const rechauffeur = CSV.elecAnode_part.filter(row => row.filtre1 == "Rechauffeur boucle");
        for (var i=0 ; i<rechauffeur.length ; i++){
            select.addOption(rechauffeur[i].label, rechauffeur[i].ref);
        }
        select.addOption("Aucun","Aucun");
    }

    /**
     * 
     * @param {HTMLSelectElement} select 
     */
    static #initSelectContacteur(select){
        const contacteur = CSV.elecAnode_part.filter(row => row.filtre1 == "contacteur");
        select.addOption("Aucun","Aucun");   
        for (var i=0 ; i<contacteur.length ; i++){
            select.addOption(contacteur[i].label, contacteur[i].ref);
        }
    }


    /**
     * ajoute à la div "div_resistance_elec" un champ permettan à l'utilisateur de choisir une résistance electrique 
     * il peut aussi en choisir aucune
     */
    static addResistanceElec(){
        ElecAnode.#nb_ResistanceElec++;
        var template = document.querySelector("#tp_resistance_elec");
        var clone = template.content.cloneNode(true); 
    
        //on commence par donner des ID au select et adapté les for des labels
        var labels = clone.querySelectorAll("label");
        var inputs = clone.querySelectorAll("select");
    
        clone.querySelector("div").id += "_" + ElecAnode.#nb_ResistanceElec;
        labels.forEach(element => {
            element.htmlFor += "_" + ElecAnode.#nb_ResistanceElec;
        });
        inputs.forEach(element => {
            element.id += "_" + ElecAnode.#nb_ResistanceElec;
        });
        inputs[0].addEventListener("change",eventSelectUpdateDevis);
        ElecAnode.#initSelectResistance(inputs[0]);
        document.querySelector("#div_resistance_elec").appendChild(clone);
        eventSelectUpdateDevis.call(inputs[0]);

    }
    /**
     * ajoute à la div "div_rechauffeur_boucle" un champ permettant à l'utilisateur de choisir:
     *      -un réchauffeur de boucle
     *      -un contacteur si il y a un réchauffeur de boucle
     *      -un kit de montage SC1Z si l'installation est un SC1Z
     */
    static addRechauffeurBoucle(){
        ElecAnode.#nb_Rechauffeur_boucle++;
        var template = document.querySelector("#tp_rechauffeur_boucle");
        var clone = template.content.cloneNode(true); 
    
        //on commence par donner des ID au select et adapté les for des labels
        var label = clone.querySelector("label");
        var inputs = clone.querySelectorAll("select,input");
    
        clone.querySelector("div").id += "_" + ElecAnode.#nb_Rechauffeur_boucle;
        label.htmlFor += "_" + ElecAnode.#nb_Rechauffeur_boucle;
        inputs.forEach(element => {
            element.id += "_" + ElecAnode.#nb_Rechauffeur_boucle;
        });
        //ici si on instancie le checkbox pour le kit montage SC1Z
        const rawSC1Z = CSV.elecAnode_part.filter(row => row.filtre1 == "montage SC1Z")[0]
        label.innerHTML = rawSC1Z.label;
        inputs[2].value = rawSC1Z.ref;
        inputs[2].addEventListener("input",eventCheckBoxUpdateDevis);

        //si le l'installation n'est pas un SC1Z alors on enlève le checkbox et le label
        if (formulaire['typeInstallation'] != "SC1Z"){
            label.remove();
            inputs[2].remove();
        }
        
        inputs[0].addEventListener("change",eventSelectUpdateDevis);
        inputs[0].addEventListener("change",this.eventRechauffeurBoucle);
        inputs[1].addEventListener("change",eventSelectUpdateDevis);
        ElecAnode.#initSelectRechauffeurBoucle(inputs[0]);
        ElecAnode.#initSelectContacteur(inputs[1]);
        document.querySelector("#div_rechauffeur_boucle").appendChild(clone);

        eventSelectUpdateDevis.call(inputs[0]);
    }

    //////////////////////////////////////////////////////////////////////////
    //                      FONCTION EVENT
    //////////////////////////////////////////////////////////////////////////

    /**
     * est appelé lors d'un changement de valeur du select "rechauffeur_boucle"
     * cache la partie contacteur si il y a aucun réchauffeur de boucle
     * montre la partie contacteur si il y a un réchauffeur de boucle
     */
    static eventRechauffeurBoucle(){
        const num = this.id.match(/\d+/)[0];         //on récupère le numéro qui sert d'identifiant
        var contacteur = document.querySelector("#contacteur_"+num);
        if (this.value == ""){  //cas où l'utilisateur à choisi aucun réchauffeur de boucle
            
            contacteur.style.display = "none";
            contacteur.parentNode.previousElementSibling.style.display = "none";    //on cache le texte du contacteur
            contacteur.value = "";
            eventSelectUpdateDevis.call(contacteur);
        }else{
            contacteur.style.display = "inline";
            contacteur.parentNode.previousElementSibling.style.display = "table-cell";  //on montre le texte du contacteur
        }
    }
}
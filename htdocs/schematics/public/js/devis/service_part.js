class Service{
    //////////////////////////////////////////////////////////////////////////
    //----------------------- VARIABLE STATIC--------------------------------  

    static panel = document.querySelector("#panel_services");

    static type_service = "filtre1";
    static type_input = "filtre2";
    static type_prix = "filtre3";
    //////////////////////////////////////////////////////////////////////////

    /**
     * renvoie un label avec un input
     * @param {string} id id du input
     * @param {string} value valeur du input
     * @param {string} className class du input
     * @returns {Node} label + input[type=checkbox]
     */
    static getCheckbox(id,value,className){
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.name = id;
        checkbox.value = value;
        checkbox.classList.add(className);
        return checkbox;
    }

    /**
     * renvoie une list contenant les différents type de service qui sont contenue dans le fichier service_part.csv
     * @returns {string[]}
     */
    static getUniqueArray(array , index){
        var arr = [];
        for (var i=0 ; i<array.length ; i++){
            arr.push(array[i][index]);
        }
        return [...new Set(arr)];
    }

    /**
     * cette fonction créer la partie responsable du service (Assistance, Etude, Transport)
     * la fonction génère les select et les checkbox en fonction du fichier CSV service_part
     */
    static initServicePart(){
        const typeService = Service.getUniqueArray(CSV.service_part, Service.type_service);   //on commence par récupérer les différents type de service
        var div = document.querySelector("#div_service");

        for (var i=0 ; i<typeService.length ; i++){     //ensuite on boucle dans les service
            var template = document.querySelector("#tp_service_part");
            var clone = template.content.cloneNode(true);

            
            const filter = CSV.service_part.filter(row => row[Service.type_service] == typeService[i]);
            //on récupère le type des entrées (option ou checkbox)
            const type_of_input = this.getUniqueArray(filter,Service.type_input);

            clone.querySelector("legend").innerHTML = typeService[i];   //on ajoute la légende

            //////////////////////////// SELECT /////////////////////////////////////////
            if (type_of_input.includes("option")){   //cas où il y a un select
                var select = clone.querySelector("select");
                const options = filter.filter(row => row[Service.type_input] == "option");

                select.id = "S_" + typeService[i] + i;
                select.name = "S_" + typeService[i] + i;
                select.addLabel(options[0][Service.type_service] + " : ");
                for (var j=0 ; j<options.length ; j++){
                    select.addOption(options[j].label , options[j].ref);
                }
                select.addEventListener("change",eventSelectUpdateDevis);
                eventSelectUpdateDevis.call(select);
            }else   //si il n'y a pas de select alors on le supprime
                clone.querySelector("select").remove();
            
            //////////////////////////// CHECKBOX /////////////////////////////////////////
            if (type_of_input.includes("checkbox")){        //cas où il y a un ou plusieurs checkbox
                const CH = filter.filter(row => row[Service.type_input] == "checkbox");
                for (var j=0 ; j<CH.length ; j++){
                    var checkbox = Service.getCheckbox("CH"+typeService[i]+j, CH[j].ref , "service_part");
                    clone.querySelector("div").appendChild(checkbox);
                    checkbox.addLabel(CH[j].label);
                    checkbox.addEventListener("input",eventCheckBoxUpdateDevis);
                }
            }else   //si in n'y a pas de checkbox alors on supprime la division qui était responsable de ça
                clone.querySelector("div").remove();
            
            div.appendChild(clone);

        }

        //on ajoute l'option aucun pour l'assistance:
        document.getElementById("S_Assistance0").addOption("Aucun","Aucun");
    }

    /**
     * cette fonction ajoute un evenement au select transport qui permet d'indiquer un prix
     * pour la zone 05 (ajoute un input type number avec un label correspondant)
     */
    static manageTransportZone5(){
        document.querySelector("#S_Transport2").addEventListener("change",function(){
            const filter = CSV.service_part.filter(row => row.ref == this.value)[0];
            if (filter[Service.type_prix] == "prix variable"){
                var nb = document.createElement("input");
                nb.type = "number";
                nb.id = "price_"+"CHTransport1";
                nb.value = "500";
                nb.min = "1";
                nb.addEventListener("input", Service.eventChangePrice);
                this.after(nb);
                nb.before(document.createElement("br"))
                nb.addLabel("Indiquez le prix : ");

                //cette ligne sert à update la taille du panel 
                if (Service.panel.style.maxHeight) Service.panel.style.maxHeight = Service.panel.scrollHeight + "px";
            }else{
                var nb = document.querySelector("#price_"+"CHTransport1");
                if (nb !== null){
                    nb.remove();
                    document.querySelector("label[for=" + nb.id + "]").remove();
                } 
            }
        });
    }
    /**
     * fonction appelé par l'evenement input, de l'input[type=number] 
     * cette fonction modifie le prix en fonction de la valeur de l'input
     */
    static eventChangePrice(){
        var price = parseFloat(this.value);
        if (isNaN(price) || price <= 0) price = 1;
        devis.updatePrice("S_Transport2",price);
        VisualDevis.show();
    }
}
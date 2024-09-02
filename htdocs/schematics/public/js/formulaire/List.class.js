/*
pour que la class list fonctionne elle a besoin des class static Sonde et ForbidList
la class List est en quelque sorte une class hérité d'un HTMLSelectElement mais au quelle on vient ajouter 
une gestion d'erreur
*/ 
class List{

    /**
     * 
     * @param {HTMLSelectElement} select
     * @param {Object} listOption 
     * @param {boolean} isSonde 
     */
    constructor(select ,DATA_LIST, list_forbidMessage, defaultIndex){
        this.select = select;
        this.DATA_LIST = DATA_LIST;
        this.setListOption();
        this.isSonde = this.select.classList.contains("sonde");
        this.list_forbidMessage = list_forbidMessage;
        this.defaultIndex = defaultIndex;

        this.manageSonde = this.manageSonde.bind(this); //sert à garder le même this peut importe qui appelle drawSchema
    }

    /**
     * crée la list d'options de la list il existe quelque cas particulié 
     * pour     -raccordementHydraulique
     */
    setListOption(){
        if (this.select.id == "raccordementHydraulique"){//il y a une exception pour raccordementHydraulique qui doit prendre en compte la variable global valueRaccord
            this.listOption = this.DATA_LIST[valueRaccord]; //on récupère la list prise grâce à l'id et a la valeur
        }else{
            this.listOption = this.DATA_LIST; //on récupère la list prise à l'id
        }
    }
    /**
     * la fonction loadList recharge une list
     * c'est à dire qu'elle interdit les valeurs qui doivent être interdite 
     * par à la fois la class forbidList mais aussi par la gestion des sondes
     * une fois interdite un title doit être ajouter afin d'expliquer pourquoi cette interdiction
     * si la valeur qui était selectionner a été interdite alors on doit modifier la valeur selectionner
     */
    loadList(){
        var enable_list = this.listOption; 
        if (this.isSonde){
            enable_list = this.getListCompatibleSonde();            
        } 

        enable_list = this.getListAllowed(enable_list);
        this.select.querySelectorAll("option").forEach(option=>{
            if (enable_list[option.value] == undefined){
                option.disabled = true;
                option.title = this.#getForbidMessage(option.value);
                
            } 
            else option.disabled = false;
        });
        this.#setSelectedIndex()

        //si il y a qu'un élément autorisé et que tout les autres sont interdits alors on disabled le select et inversement
        if (Object.keys(enable_list).length == 1) this.select.disabled = true;
        else this.select.disabled = false;
    }

    /**
     * change les options du select avec la variable this.listOption
     * comme les options du select ont changé alors on appelle les callback de sond et la fonction associé
     * si il y en a
     */
    changeOptionSelect(){
        this.select.querySelectorAll("option")
        $(this.select).find("option").remove() //on supprime toute les options de la list 
        for (var key in this.listOption){ //puis on ajoute le contenue de list en option du select
            $(this.select).append($('<option>', {
                value: key,
                text: key
            }));
        }
    }
    ///////////////////////////////////////////////////////////////////////
    //                  METHODE POUR INTERDICTIONS
    ///////////////////////////////////////////////////////////////////////
    /**
     * renvoie les éléments de la list passé en paramètre sans les éléments qui sont interdit
     * @param {Object} list 
     * @returns {Object} list autorisé
     */
    getListAllowed(list){
        return ForbidOption.getListAllowed(this.select.id , list);
    }
    /**
     * lève les interdiction que l'element à envoyer à l'id passé en paramètre
     * @param {List} list 
     */
    enable(list){
        var key = {envoyeur:this.id,receveur:list.id};
        ForbidOption.enable(key);
    }
    /**
     * interdit la list passé en paramètre au select d'id "id"
     * @param {List} list 
     * @param {object} list_options 
     */
    forbid(list,list_options){
        var key = {envoyeur:this.select.id,receveur:list.id};
        ForbidOption.forbid(key,list_options);
    }
    /**
     * 
     * @param {List} list 
     * @param {Object} list_options 
     */
    forbidAll(list,list_options){
        var newList = [];
        for(var key in list.listOption){
            if (!list_options.includes(key)) {
                newList.push(key);
            }
        }
        var key = {envoyeur:this.id,receveur:list.id};
        ForbidOption.forbid(key,newList);
    }
    /**
     * si la valeur selectionné n'est pas interdite alors on sort de la fonction
     * sinon on selectionne la première option dans l'ordre qui n'est pas interdite
     */
    #setSelectedIndex(){
        if (this.select.selectedOptions[0] && !this.select.selectedOptions[0].disabled){
            return;   //si la valeur actuel est disponible on sort de la fonction
        } 
        this.select.value = this.defaultIndex;        //sinon on met la valeur par défaut
        if (this.select.selectedOptions[0] && !this.select.selectedOptions[0].disabled){
            this.value = this.defaultIndex
            return;   
        } 
        //si la valeur par défaut est elle aussi interdite on met la première valeur autorisé
        var list;
        if (this.isSonde) list = this.getListAllowed(this.getListCompatibleSonde());
        else list = this.getListAllowed(this.listOption);
        this.value = Object.keys(list)[0];
        
        
    }

    #getForbidMessage(value){
        const sonde = this.listOption[value];
        if (this.isSonde && !Sonde.compareSonde(sonde,this.getSondesWithout())){
            if (!/unique/.test(sonde)){
                return "Nécessite les sondes "+sonde;
            }
        }
        if (this.list_forbidMessage != undefined && this.list_forbidMessage[value] != undefined){
            return this.list_forbidMessage[value];
        }
        return "";
    }





    ///////////////////////////////////////////////////////////////////////
    //                  METHODE POUR LES SONDES
    ///////////////////////////////////////////////////////////////////////

    /**
     * renvoie une concaténation des sondes sans les sondes prise par l'element passé en paramètre
     * @returns {string} sonde
     */
    getSondesWithout(){
        var totalSondePrise = Sonde.getSondes();
        const sondePriseElem = this.listOption[this.select.value];
        return totalSondePrise.replace(sondePriseElem,"");
    }

    /**
     * renvoie la list de toute les valeurs d'option qui sont autorisé par les sondes
     * @returns {string[]} renvoie une list
     */
    getListCompatibleSonde(){
        var res = {};
        var list = this.listOption;
        for (var key in list){
            if (Sonde.compareSonde(list[key],this.getSondesWithout())){
                res[key] = ""; //seule les clé compte car les sondes prises sont enregistré uniquement dans DATA
            }
            
        }
        return res;

    }
    manageSonde(){
        const sonde = this.listOption[this.value];
        Sonde.sondePrise.set(this.id,sonde);
        //il est obligatoire d'avoir cette fonction dans le code principale
        //on passe en paramètre id pour éviter de load la list courante
        updateAllSelectWithSonde(this.id);
    }
    ///////////////////////////////////////////////////////////////////////
    //                  GETTER ET SETTER
    ///////////////////////////////////////////////////////////////////////
    /**
     * renvoie l'id de la list
     * @returns {string} id
     */
    get id(){
        return this.select.id;
    }
    /**
     * @returns {string} value
     */
    get value(){
        return this.select.value;
    }
    /**
     * @returns {object}
     */
    getListOption(){
        return this.listOption;
    }

    /**
     * selectionne l'option passé en paramètre et si la List à une callback alors on l'appelle
     * cela permet d'appeler la callback uniquement quand un select change de valeur
     * @param {string} value
     */
    set value(value){
        this.select.value = value;
        //
        if (this.func != undefined) this.func();
        if (this.isSonde) this.manageSonde();
    }

    /**
     * ajout une fonction qui est appelé au changement de valeur de cette list
     * si isEvent = true alors on ajoute au this.select un eventListener change avec func comme event
     * @param {Function} func 
     * @param {boolean} isEvent
     */
    setChange(func , isEvent = true){
        this.func = func;
        if (this.isSonde){
            this.select.addEventListener("change",this.manageSonde,false);
        }
        if (isEvent){
            this.select.addEventListener("change",this.func,false);
        }
    }




}
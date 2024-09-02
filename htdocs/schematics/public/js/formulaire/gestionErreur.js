/*CHOSE à RETENIR:
    -la class la plus importante pour la gestion d'erreur est la class List qui va à la fois gérer les interdictions 
    lié aux sondes mais aussi gérer les interdiction de la class ForbidList, la class List est en quelque sorte hérité d'un HTMLSelectElement
    on peut appeler les getter et setter.
    -la méthode qui permet d'appeler la gestion d'erreur est la méthode loadList() 
    cette méthode gère tout seule les appelle d'appelle (si CirculateurC2.loadList() alors la fonction d'action de circulateurC2 sera appelé)
    pour avoir une idée de quelle list doit faire appelle au gestion d'erreur voici la list complète
    Légende: list --> list qui doit subir une gestion d'erreur
        ----typeInstallation ->  ballonTampon, ballonECS, champCapteur
        ----ballonTampon ->  optionS10, optionS11
        ----locAppoint2 ->  appoint1, appoint2,  raccordementHydraulique
        ----appoint1 ->  precisionAppoint1, raccordementHydraulique, optionS10, optionS11
        ----appoint2 ->  circulateurC7 
        ----raccordementHydraulique ->  divers, optionS10, optionS11
        ----ballonECS ->  optionS10, optionS11
        ----circulateurC1 ->  circulateurC2, optionS10, optionS11
        ----circulateurC2 ->  circulateurC3, optionS10, optionS11
        ----circulateurC3 ->  circulateurC7, optionS10, optionS11
        ----champCapteurs -> echangeur dans BT
        ----divers -> optionS10, optionS11
    IMPORTANT : un loadList() appele la fonction d'action associé si et seulement si le 
                loadList() a fait changer de valeurs le select en question
                ex : si CirculateurC3.loadList() est appelé et que le select CirculateurC3 ne change pas de valeur
                     alors la fonction d'action associé à CirculateurC3 ne sera pas appelé

    -données sauvegardé dans la session:
        ----dataForm -> contient tout les données du formulaire pour ne pas les perdre lors d'un changement de 
        page
        ----openList -> contient l'id des liste déroulante et si elle sont ouverte ou nan pour garder le même 
        layout quand l'utilisateur change de page


*/
//////////////////////////////////////////////////////////////////////////
//----------------------- VARIABLE GLOBAL--------------------------------             

/**
 * S représente une list de tout les select du formulaire, les select sont du type List
 * leurs id sont les même que les id des select dans la page HTML
 * @type {{id: List}} id -> string, List -> List
 */
var S = {};            
var valueRaccord = "Autre";         //value raccord est la valeur du select Appoint1 elle peut prendre multiple si on sélectionne un appoint 2 en cascade
var valueDivers = new Array();      //tableau des options divers selectionné
var start = false;                  //sert à faciliter la récupération des index dans la variable dataForm
var dataForm = {};
var list_select_with_sonde = [];
let DATA_LIST, DATA_MSG, DATA_DEFAULT_INDEX;

//variable JQuery
var $precisionAppoint1 = $(".precisionAppoint1");
var $precisionAppoint2 = $(".precisionAppoint2");
var $description = $("#description");
var $texfields = $();
var $EchangeurDansBT = $("#EchangeurDansBT");

//variable du DOM
var ligne_circulateurC3 = document.querySelector("#ligne_circulateurC3");
var label_last_zone = document.querySelector("#label_last_zone");
let champCapteur_surface = document.querySelector("#champCapteur_surface");
let locAppoint2 = document.getElementsByName("locAppoint2");


//////////////////////////////////////////////////////////////////////////

//============================================ DEFINITION FONCTION ============================================
////////////////////////////////////////////////////////////////////////////////////////////////
//                          FONCTION DE MANIPULATION
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
/**
 * renvoie un array en fonction des clé de l'objet, sans les valeur contenue dans array passé 
 * en paramètre
 * @param {Object} object
 * @param {string[]} array 
 * @returns {string[]}
 */
function without(object, array){
    res = [];
    for (var key in object){
        if (!array.includes(key)) res.push(key);
    }
    return res;
}

////////////////////////////////////////////////////////////////////////////////////////////////
//                          FONCTION INITIALISATION

/**
 * initialise tout les select et les input en fonction du contenu de la variable dataForm
 */
function init(){
    
    initInput(); //met les input à leurs valeurs indiqué par dataForm
    if (dataForm.locAppoint2 == "cascade") valueRaccord = "Multiple";
    else valueRaccord = dataForm.appoint1;
    
    initSelect(); //initialise tout les select
    initAccordion(); //ouvre les list qui 


    //on créer une list de tout les id des select qui manipule des sondes
    for (var key in S){
        if (S[key].isSonde) list_select_with_sonde.push(key);
    }



}

/**
 * met tout les input à la valeur qu'ils ont dans dataForm
 */
function initInput(){
    let checkboxs = document.querySelectorAll("input[type=checkbox]");
    let textFields = document.querySelectorAll("#formulaire input[type=text],input[type=email]");

    checkboxs.forEach(checkbox => {
        if (dataForm[checkbox.id] === "on") checkbox.checked = true;
        else checkbox.checked = false;
    });

    textFields.forEach(element =>{
        element.value = dataForm[element.id];
    });

    document.getElementById(dataForm["locAppoint2"]).checked = true;

    
}

/**
 * charge tout les select avec leurs liste et leurs index indiqué dans dataForm
 * si un select a une donné dans DATA alors elle est initialisé grâce à loadList sinon on selectionne juste sont index
 */
function initSelect(){
    $("select").each(function(){
        if (DATA_LIST[this.id] != undefined){
            S[this.id] = new List(this,DATA_LIST[this.id],DATA_MSG[this.id],DATA_DEFAULT_INDEX[this.id]);
            S[this.id].setListOption();
            S[this.id].changeOptionSelect();
            S[this.id].select.value = dataForm[this.id];
        }else{
            this.value = dataForm[this.id];
        }
    });
}
/**
 * ouvre et ferme les list accordéon en fonction de openList
 * @returns 
 */
function initAccordion(){
    if (sessionStorage.getItem("openList") == undefined) return; //ne fait rien si aucune donné n'est renseigné pour openList
    var openList = JSON.parse(sessionStorage.getItem("openList"));
    $(".accordion").each(function(){
        if (openList[this.id]) $(this).click();
    });
}

/**
 * initalise le formulaire et ajoute les events listener
 * est appelé à c
 */
function addEvent() {
    list_select_with_sonde.forEach(id => {
        //cela permet just d'ajouter l'event listener pour manageSonde
        S[id].setChange(undefined,false); 
    });
    //ici on ajoute tout les fonction d'action au List
    S.typeInstallation.setChange(actionType);
    S.champCapteur.setChange(actionChampCapteur);
    S.appoint1.setChange(actionAppoint1);
    S.appoint2.setChange(actionAppoint2);
    document.querySelectorAll(".circulateur").forEach(select => {
        S[select.id].setChange(manageCirculateur);
    });
    S.RH_appoint2.setChange(actionRH_appoint2);
    S.raccordementHydraulique.setChange(actionRaccordementHydro);
    S.ballonTampon.setChange(actionBT);
    S.ballonECS.setChange(actionBECS);
    S.divers.setChange(actionDivers);
    locAppoint2.forEach(radioButton => {
        radioButton.addEventListener("change" , manageLocAppoint2);
    });
    $EchangeurDansBT.attr({"onchange":"actionEchangeurDansBt()"});
    $(".desc").bind("change",description); //on met un bind car on veut garder les attributs onchange d'avant cela actualise la description chaque fois que l'on change la valeur de l'un des élément ayant la class "desc"
    champCapteur_surface.addEventListener("input",description);

    document.querySelectorAll(".saveForm").forEach(a =>{
        a.addEventListener("click" , handleMenuClick);
    });

}
/**
 * lance la gestion d'erreur en simulant des actions pour tout initialisé correctement 
 */
function initGestionError(){
    const change = new Event("change");
    start = true;
    //on simule certaines actions de select pour bien tout initialisé
    valueRaccord = dataForm["appoint1"];
    actionType();
    actionBT();
    manageCirculateur.call(S.circulateurC1);
    manageCirculateur.call(S.circulateurC2);
    manageCirculateur.call(S.circulateurC3);
    manageCirculateur.call(S.circulateurC7);
    document.getElementById(dataForm["locAppoint2"]).dispatchEvent(change);
    actionAppoint2();
    actionBECS();
    //ici il est importer de manage les sondes de toute les listes à sondes pour bien initialiser tout
    list_select_with_sonde.forEach(id => {
        S[id].manageSonde();
    });
    $("#date").text(new Date().toLocaleDateString());
    description();
    start = false;
    //cette ligne sert à gérer le cas de d'un champ capteur sur T15
    manageT15_T16ChampCapteur();
    manageT15_T6PiscineDeporte();

}

////////////////////////////////////////////////////////////////////////////////////////////////
//                          FONCTION BACK-END

/**
 * recharge les list de tout les select qui doivent manageSonde
 * sauf la list d'id passé en paramètre (sert à éviter une double action)
 * @param {string} id 
 */
function updateAllSelectWithSonde(id){
    var L = Object.values(list_select_with_sonde);
    var index = L.indexOf(id);
    if (index !== -1) {
        L.splice(index, 1);
    }
    L.forEach(id => {
        S[id].loadList();
    });

    if ((Sonde.sondePrise.get("raccordementHydraulique") == "" || Sonde.sondePrise.get("raccordementHydraulique") == undefined)
    && Sonde.getSondes().includes("T16")){
        ForbidOption.forbid({envoyeur:"envoyeurSonde",receveur:"appoint1"},["Granulé","Bois"]);
    }else{
        ForbidOption.enable({envoyeur:"envoyeurSonde",receveur:"appoint1"});
    }
    S.appoint1.loadList(); //ici on est obligé d'enlever les action au chargement de la list pour éviter un récursion infinie
    //gère les cas particulier ou un élément se met sur une sonde si et seulement si la sonde est déjà prise
    manageT15_T16ChampCapteur();
    manageT15_T6PiscineDeporte();
   
}
/**
 * Prend en paramètre une liste de radioButton qui doivent avoir le même nom et renvoie la valeur de celui coché
 * @param {HTMLInputElement[]} radioButtons 
 * @returns {string}
 */
function getRadioButtonValue(radioButtons) {
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            return radioButton.value;
        }
    }
    // Si aucun bouton radio n'est coché, vous pouvez décider de renvoyer une valeur par défaut ou null.
    return null;
}

/**
 * fonction récursive
 * renvoie si un raccord sur plancher chauffant est possible sur l'id du circulateur passé en paramètre
 * @param {string} id element que l'on veut tester 
 * @returns {boolean}
 */
function isPC(id){
    const VAL = S[id].value;
    if(VAL.includes("Plancher chauffant") || VAL.includes("PC")){ //premier cas simple
        return true;
    }else if (VAL != "Idem zone N-1"){ //deuxième cas simple 
        return false;
    }else{ //cas récursif (si element.value == "Idem zone N-1")
        const LIST_CIRC = ["circulateurC1","circulateurC2","circulateurC3","circulateurC7"];
        const i = LIST_CIRC.indexOf(id);
        const previousID = LIST_CIRC[i-1];
        return isPC(previousID); //on rappelle la fonction isPC avec l'id précédant
    }

}
/**
 * interdit les champ capteur sur T15 si T16 est libre et inversement
 * est appelé à chàque manageSonde 
 */
function manageT15_T16ChampCapteur(){
     //test si la sonde T16 est prise par autre chose que le champCapteur
     if (start || (Sonde.getSondes().includes("T16") && !/T16/.test(Sonde.sondePrise.get("champCapteur")))){
        ForbidOption.enable({envoyeur:"envoyeurSonde",receveur:"champCapteur"});
    }else{
        const f_list = ["1 champ capteurs découplé sur casse pression sur T15","1 champ capteurs découplé sur échangeur sur T15"];
        ForbidOption.forbid({envoyeur:"envoyeurSonde",receveur:"champCapteur"},f_list);
    }
    //ici on est obligé d'enlever les action au chargement de la list pour éviter un récursion infinie
    S.champCapteur.loadList();
}

/**
 * interdit les champ capteur sur T15 si T16 est libre et inversement
 * est appelé à chàque manageSonde 
 */
function manageT15_T6PiscineDeporte(){
     //test si la sonde T15 est prise par autre chose que l'option S10
     if (start || (Sonde.getSondes().includes("T15") && !/T15/.test(Sonde.sondePrise.get("optionS10")))){
        ForbidOption.enable({envoyeur:"envoyeurSonde",receveur:"optionS10"});
    }else{
        ForbidOption.forbid({envoyeur:"envoyeurSonde",receveur:"optionS10"},["Piscine déportée T6"]);
    }
    //ici on est obligé d'enlever les action au chargement de la list pour éviter un récursion infinie
    S.optionS10.loadList();
}

////////////////////////////////////////////////////////////////////////////////////////////////
//                          FONCTION ACTION (sont appelé lors d'un changement de valeur d'un select)


/**
 * fait quelque chose uniquement si l'appoint 2 n'est pas en cascade
 * change la list de raccordementHydraulique et doit aussi appeler manageSonde car raccordementHydraulique afflue sur les sondes
 * @param {DOM} element list Appoint 1
 */
function actionAppoint1(){
    if (S.appoint1.value != "Aucun"){
        $precisionAppoint1.css({"visibility":"visible"});
        if (S.appoint1.value == "Autre"){
            S.appoint1.enable(S.typeAppoint1);
            S.appoint1.forbid(S.typeAppoint1,["Aucun"]);
        } 
        else S.appoint1.forbidAll(S.typeAppoint1,["Aucun"]);
    }else{
        S.appoint1.forbidAll(S.typeAppoint1,["Aucun"]);
        $precisionAppoint1.css({"visibility":"hidden"});
    }
    
    if (getRadioButtonValue(locAppoint2) !== "cascade") valueRaccord = S.appoint1.value;
    S.raccordementHydraulique.setListOption();
    S.raccordementHydraulique.changeOptionSelect();
    if (start) S.raccordementHydraulique.value = dataForm["raccordementHydraulique"]; //cela sert à l'initialisation d'un formulaire existant
    S.raccordementHydraulique.loadList();
    S.typeAppoint1.loadList();

    manageOption("V3V bypass appoint 1|Electrovanne Appoint 1 ou Flow Switch");
    manageOption("recharge nappes goethermiques sur T15 sur serpentin BTC");
    manageOption("recharge nappes goethermiques sur T15 sur échangeur BTC");

    //ici il est important d'update les sondes car raccordementHydraulique ne change pas de valeur
    //donc les callBack ne sont pas rappelé
    S.raccordementHydraulique.manageSonde();  
    actionRaccordementHydro.call(S.raccordementHydraulique);
    
}

/**
 * doit faire quelque chose uniquement si l'appoint 2 est sur C7
 * @param {Element} element 
 */
function actionAppoint2(){
    //si in n'y a pas d'appoint 2 alors on cache le champ puissance et le champs zone
    if (S.appoint2.value == "Aucun")$precisionAppoint2.css({"visibility":"hidden"});
    else $precisionAppoint2.css({"visibility":"visible"});
    
    if (S.appoint2.value.includes("Appoint")){
        S.appoint2.forbidAll(S.circulateurC7,[S.appoint2.value]);
        S.circulateurC7.value = S.appoint2.value;

    }else{
        const APP_C7 = ["Appoint multiple","Appoint bois","Appoint granulé"];
        S.appoint2.forbid(S.circulateurC7,APP_C7);
    }

    //gère le raccordement hydraulique de l'appoint 2 sur C7
    if (S.appoint2.value == "Appoint multiple"){
        S.appoint2.forbid(S.RH_appoint2, ["simple"]);
    }else{
        S.appoint2.enable(S.RH_appoint2);
    }

    if (S.appoint2.value.includes("Appoint") && S.typeInstallation.value === 'SC1Z'){
        S.appoint2.forbidAll(S.circulateurC3 , ["Aucun"]);
    }else{
        S.appoint2.enable(S.circulateurC3);
    }

    
    S.circulateurC7.loadList();
    S.RH_appoint2.loadList();
    S.circulateurC3.loadList();
    description();
}

/**
 * cette fonction est appelé lorsque le select RH_appoint2 est changé
 * elle s'occupe uniquement d'appelé manageRDHAppoint
 */
function actionRH_appoint2(){
    manageRDHAppoint();
}


/**
 * fonctions à moitié récursive
 * est appelé lorsque l'utilisateur change la valeur du circulateur 1 2 ou 3
 * doit gérer les plancher chauffant et les n-1 
 */
function manageCirculateur(){
    /*ici le this.id désign celui qui appelle la fonction il peut être soit du type 
    HTMLSelectElement ou soit du type List qui ont tout les deux un getter de id
    */
    const id = this.id; 
    let LIST_CIRC = ["circulateurC1","circulateurC2","circulateurC3","circulateurC7"];
    if (S.typeInstallation.value == "SC1Z") LIST_CIRC = ["circulateurC1","circulateurC2","circulateurC7"];
    let i = LIST_CIRC.indexOf(id); 
    if (i == -1) return;
    if (i == 0){
        manageOption("Free Cooling Zone 1");
        manageOption("Décharge sur zone 1|Sortie Idem C1|V3V décharge zone 1");
    } 
    if (i == 1){
        manageOption("Free Cooling Zone 2");
        manageOption("Sortie Idem C2");
    } 
    if (i == 2) {
        manageOption("Free Cooling Zone 3");
        manageOption("Sortie Idem C3");
    } 
    if (id == "circulateurC7"){
        manageOption("Free Cooling Zone 4");
        manageOption("Sortie Idem C7");
        return; //cas simple dès que la fonction arrive sur "circulateurC7" on arrête
    } 
    else{
        
        if(isPC(id)){
            S[id].enable(S[LIST_CIRC[i+1]]);
        }else{
            const INTERDICTION = ["Plancher chauffant","Multi zones PC","Décharge sur zone PC"]; 
            S[id].forbid(S[LIST_CIRC[i+1]],INTERDICTION); //interdit ces 2 options pour le circulateur suivant si il n'y a pas de pc
            //gère le cas ou il faut interdire Idem zone N-1 si il n'y la valeur aucun est choisi
            if (S[id].value == "Aucun") S[id].forbid(S[LIST_CIRC[i+1]],INTERDICTION.concat(["Idem zone N-1"]));
 
        }
        S[LIST_CIRC[i+1]].loadList(); //on recharge la list suivante pour gérer les interdiction
    }
    


}
/**
 * si la description est afficher alors on la cache et si elle est caché alors on l'affiche
 */
function manageDescription(){
    $("#affaire").toggle(400);
}

/**
 * @param {DOM} element 
 */
function actionRaccordementHydro(){
    if (S.raccordementHydraulique.value.includes("réchauffeur")){ // si il y un réchauffeur alors l'utilisateur peut choisir si il se situe à droite ou gauche de la casse pressison
        $(".rechauffeur").css({"visibility":"visible"});
    }else{
        $(".rechauffeur").css({"visibility":"hidden"});
    }
    var D5 = $("#D5");
     var labelD5 = D5.next();

     D5.prop( "disabled", false );
     labelD5.removeClass("disabled");

    if (S.raccordementHydraulique.value == "En direct"){ //si il y a aucun appoint 1 alors on doit désactiver la checkbox et le label
        D5.prop({"disabled":true,"checked":false});
        labelD5.addClass("disabled");
        
        S.raccordementHydraulique.forbid(S.divers,["pompe double gauche","pompe double droite"]);
    }else{ //sinon alors on active tout
        S.raccordementHydraulique.enable(S.divers);
    }
    //sert à activer ou désactiver les input checkbox pour les réhaussement des retours
    manageRDHAppoint();
    S.divers.loadList();
    manageOption("charge BTC si excédent APP1 sur T16 & T6 > T5|charge BTC si excédent APP1 sur T16 & T6 < T5");
}
/**
 * rend activable ou nan les réhaussement des retours dans l'appoint1 ou l'appoint 2
 */
function manageRDHAppoint(){
    const value = S.raccordementHydraulique.value ;
     //partie pour savoir si il y a la possibilité d'avoir un réhaussement des retours sur appoint 1
     var $RDH_app1 =  $(".RDH_appoint1");
     var $RDH_app2 =  $(".RDH_appoint2");

     if (value.includes("simple") 
     || value.includes("tampon")
     || valueRaccord == "PAC"
     || valueRaccord == "Aucun"){
         $RDH_app1.prop({"disabled":true,"checked":false}).addClass("disabled");
    }else{
         $RDH_app1.prop({"disabled":false}).removeClass("disabled");
         
     }
     
     //partie pour savoir si il y a la possibilité d'avoir un réhaussement des retours sur appoint 2
     if (value.includes("double") || S.RH_appoint2.value != "simple" ){
        $RDH_app2.prop({"disabled":false}).removeClass("disabled");
     }else{
        $RDH_app2.prop({"disabled":true,"checked":false}).addClass("disabled");
     }
}

/**
 * active ou désactive le ballon tampon en fonction du module
 * et active et désactive le champ capteur si le module est un hydraubox
 * @param {DOM} element 
 */
function actionType(){

    if (S.typeInstallation.value.includes("2")){ //si le module est un sc au moin 2 alors on active le ballons tampon
        //on met un ballonTampon et un échangeur par défaut si l'on passe d'un sc1 à un sc2
        if (!start){
            S.ballonTampon.value = "Ballon tampon";
            document.querySelector("#EchangeurDansBT").checked = true;
        }
        S.typeInstallation.enable(S.ballonTampon);
        
    }else{  //sinon on désactive le ballon tampon
        S.typeInstallation.forbidAll(S.ballonTampon,["Aucun"]);
    }
    //si l'hydraubox est choisit alors on interdit le champ capteur
    if (/HydrauBox/.test(S.typeInstallation.value)){
        S.typeInstallation.forbidAll(S.champCapteur,["Aucun"]);
    }else{  //si il n'y a pas d'hydraubox on lève l'interdiction mais on interdit la possibilité d'avoir aucun champ cpateur
        S.typeInstallation.enable(S.champCapteur);
        S.typeInstallation.forbid(S.champCapteur,["Aucun"]);
    }
    toggleCirculateurC3();
    S.ballonTampon.loadList();
    S.champCapteur.loadList();

}
/**
 * description s'occupe d'afficher la description elle est appelé lorsque 
 * un élément html qui à la class "desc" change de valeur
 */
function description() {
	
	let chain = "Schéma SolisConfort " + S.typeInstallation.value;
	let circulateur = [S.circulateurC1.value, S.circulateurC2.value, S.circulateurC3.value,S.circulateurC7.value];
	let temp = "";
	let appoint1 = S.appoint1.value;
    let dict_zone = {};

    //on commence par le description des différents circulateur
    for (let i = 0; i < circulateur.length; i++) {
        if (circulateur[i] != "Aucun" && !/Appoint/.test(circulateur[i])) {
            if (dict_zone[circulateur[i]] === undefined) {
                dict_zone[circulateur[i]] = 1;
            }else{
                dict_zone[circulateur[i]] += 1;
            }
        }
    }
    for (let cle in dict_zone){
        if (dict_zone[cle] > 1){
            temp = temp + ", " + dict_zone[cle] + " zones " + cle;
        }else{
            temp = temp + ", " + dict_zone[cle] + " zone " + cle;
        }
    }
	chain=chain+temp;
    

	if (appoint1 == "Autre") chain = chain + ", Appoint 1 "+ S.typeAppoint1.value;
	else if(appoint1 != "Aucun") chain = chain + ", Appoint 1 "+ appoint1;
    if (S.appoint2.value != "Aucun"){
        if (/Appoint/.test(S.appoint2.value)){ //si cette condition est vérifié alors on est dans le cas d'un appoint sur C7
            chain = chain + ", " + S.appoint2.value.replace(/Appoint/,"Appoint 2") + " sur C7";
        }else{  //sinon on est sur un appoint 2 en cascade d'appoint 1
            chain = chain + ", Appoint 2 " + S.appoint2.value + " en cascade";
        }
    } 

    const surface = champCapteur_surface.value;
    if (surface !== "" && !isNaN(surface)){
        chain += ", " + parseFloat(surface) + " m² de capteurs";
    }


    $description.text(chain);
}

/**
 * comme l'element passé en paramètre change tout le temps on est obligé de prendre un autre element qui va 
 * être l'envoyeur des interdiction
 * gère la localisation de l'appoint 2 il peut être soit sur le circulateur C7 soit en cascade soit aucun appoint2
 * @param {Event} event 
 */
function manageLocAppoint2(event){
    
    //permet de faire un gestion d'erreur pour C7 lorsque l'on est plus sur C7
    const value = event.target.value;
    //ici les clé servent à gérer les interdictions de manière avancé
    const key1 = {envoyeur:"key1",receveur:"appoint2"};
    const key2 = {envoyeur:"key2",receveur:"appoint2"};
    const key3 = {envoyeur:"key3",receveur:"appoint2"};
    const APP_C7 = ["Appoint multiple","Appoint bois","Appoint granulé"];

    if (value == "cascade"){ //si l'appoint cascade est selectionné alors le raccordement ser toujours le raccordement multiple
        //donc on change la list du raccordementHydraulique en fonction
        valueRaccord = "Multiple";
        S.raccordementHydraulique.setListOption();
        S.raccordementHydraulique.changeOptionSelect();
        if (start) S.raccordementHydraulique.value = dataForm["raccordementHydraulique"]; //cela sert à l'initialisation d'un formulaire existant
        S.raccordementHydraulique.loadList();
        ForbidOption.enable(key2);  //on lève l'interdiction de la clé 2
        ForbidOption.forbid({envoyeur:"key2",receveur:"appoint1"},["Aucun"]);
    }else{
        //ici la clé 2 correspond à l'interdiction des appoint
        var LIST_ALL = without(S.appoint2.getListOption(),APP_C7);
        LIST_ALL.pop(); //cet ligne sert à enlever Aucun car il n'est pas interdit ici
        ForbidOption.forbid(key2,LIST_ALL);
        ForbidOption.enable({envoyeur:"key2",receveur:"appoint1"});
    }
    //si il C7 alors on autorise les appoints sinon on les interdits
    //si il y a C7 on rend visible aussi les raccordement hydraulique de C7
    if (value == "C7"){
        ForbidOption.enable(key1);
        document.querySelectorAll(".div_RH_appoint2").forEach(elem => elem.style.display = "table-cell");
    } 
    else{
        document.querySelectorAll(".div_RH_appoint2").forEach(elem => elem.style.display = "none");
        S.RH_appoint2.value = "simple"; //on remet simple par défaut lorsque l'on cache les raccordement hydraulique de C7
        ForbidOption.forbid(key1,APP_C7);
    } 

    //si c'est Aucun alors on interdit tout sauf aucun sinon on interdit que Aucun
    const ALL = without(S.appoint2.getListOption(),["Aucun"]);
    if (value == "Aucun") ForbidOption.forbid(key3,ALL);
    else ForbidOption.forbid(key3,["Aucun"]);
    S.appoint2.loadList();
    actionAppoint1();

    //ici il est important d'update les sondes car raccordementHydraulique ne change pas de valeur
    //donc les callBack ne sont pas rappelé
    S.raccordementHydraulique.manageSonde();  
}


/**
 * si l'utilisateur prend aucun ballonTampon alors on cache et on disabled la possibilité de choisir un échangeur et une résistance
 * @param {DOM} element 
 */
function actionBT(){
    const id_chechbox_ech = "EchangeurDansBT";
    const id_chechbox_resElec = "resistanceElectriqueBT";

    //dans le cas ou on a aucun ballon tampon ou 3 ballons tampons en série il faut désactiver l'échangeur et la résistance électrique
    if (S.ballonTampon.value == "Aucun" || S.ballonTampon.value == "3 ballons tampons en série"){
        disabledCheckbox(id_chechbox_ech, false);
        disabledCheckbox(id_chechbox_resElec, false);
    
    //dans le cas ou on a un ballon tampon en eau chaude sanitaire il faut désactiver l'échangeur mais le cocher
    }else if (S.ballonTampon.value == "ballon tampon en eau chaude sanitaire"){
        disabledCheckbox(id_chechbox_ech, true);
        enableCheckbox(id_chechbox_resElec);
    
    //dans les autres cas on active tout
    }else{
        enableCheckbox(id_chechbox_ech);
        enableCheckbox(id_chechbox_resElec);
        if (!start){
            document.getElementById(id_chechbox_ech).checked = true;
            if (S.champCapteur.value.includes("échangeur")){
                document.getElementById(id_chechbox_ech).checked = false;
            }
        } 
        
    }
    
    //ensuite on appelle la fonction d'action d'échangeur
    actionEchangeurDansBt();

    //s'occupe d'interdire ou d'autoriser l'option Idem C6
    manageOption("Sortie Idem C6");
}
/**
 * lorsque qu'il y a une échangeur dans le champ capteur alors on enlève l'échangeur dans le ballon tampon
 */
function actionChampCapteur(){
    let echDansBT = document.getElementById("EchangeurDansBT");
    if (S.champCapteur.value.includes("échangeur") && !start && echDansBT.disabled == false){
        echDansBT.checked = false;
        actionEchangeurDansBt();
    }else if (!start && echDansBT.disabled === false){
        echDansBT.checked = true;
        actionEchangeurDansBt();
    }
    //ici on manage toute les options déportées
    manageOption("Piscine déportée T15|CESI déportée sur T15|CESI déportée sur T16|ON en mode excédent d'énergie l'été");
}

/**
 * 
 * fonction de changement de valeur du ballon ECS interdit l'option :
 * "V3V retour bouclage sanitaire solaire S10 S11 T15 T16"
 * si il n'y a pas de bouclage sanitaire
 */
function actionBECS(){
    if (S.ballonECS.value === "Aucun"){
        S.ballonECS.forbid(S.ballonTampon,["ballon tampon en eau chaude sanitaire"]);
    }else{
        S.ballonECS.enable(S.ballonTampon);
    }
    S.ballonTampon.loadList();
    manageOption("V3V retour bouclage sanitaire solaire");

}
/**
 * fonction du select divers sert à interdire ou autorisé l'aquastat
 */
function actionDivers(){
    manageOption("Aquastat différentiel ON si T15 > T5");
}

/**
 * est appelé à chaque fois que la checkbox échangeur dans BT change de valeur
 * appelle manageOption pour les charge BTC
 */
function actionEchangeurDansBt(){
    manageOption("charge BTC si excédent APP1 sur T16 & T6 > T5|charge BTC si excédent APP1 sur T16 & T6 < T5");
    manageOption("Aquastat différentiel ON si T15 > T5");
    manageOption("recharge nappes goethermiques sur T15 sur serpentin BTC");
    manageOption("recharge nappes goethermiques sur T15 sur échangeur BTC");
}
/**
 * 
 * @param {string} key 
 */
function manageOption(key){
    //variable qui contient les options et leurs conditions d'activation et l'id de l'envoyeur des interdictions
    const condition_for_enable = {
        "Aquastat différentiel ON si T15 > T5":{
            id:"k_aquast",
            cond:($("#EchangeurDansBT").is(':checked') && /deshu|pompe/.test(S.divers.value))
        },
        "charge BTC si excédent APP1 sur T16 & T6 > T5|charge BTC si excédent APP1 sur T16 & T6 < T5":{
            id:"k_charge_BTC",
            cond:(/tampon/.test(S.ballonTampon.value) && /(casse pression|échangeur)[\s\S]*T16/.test(S.raccordementHydraulique.value) && $("#EchangeurDansBT").is(':checked'))
        },
        "V3V bypass appoint 1|Electrovanne Appoint 1 ou Flow Switch":{
            id:"k_appoint1",
            cond:(!/Aucun/.test(S.appoint1.value))
        },
        "Décharge sur zone 1|Sortie Idem C1|V3V décharge zone 1":{
            id:"k_zone_1",
            cond:(!/Aucun/.test(S.circulateurC1.value))
        },
        "Free Cooling Zone 1":{
            id:"k_free_1",
            cond:(/Plancher chauffant|PC/.test(S.circulateurC1.value))
        },
        "Free Cooling Zone 2":{
            id:"k_free_2",
            cond:(/Plancher chauffant|PC/.test(S.circulateurC2.value))
        },
        "Free Cooling Zone 3":{
            id:"k_free_3",
            cond:(/Plancher chauffant|PC/.test(S.circulateurC3.value) || (S.typeInstallation.value == "SC1Z" && /Plancher chauffant|PC/.test(S.circulateurC7.value)))
        },
        "Free Cooling Zone 4":{
            id:"k_free_4",
            cond:(/Plancher chauffant|PC/.test(S.circulateurC7.value) && S.typeInstallation.value != "SC1Z")
        },
        "recharge nappes goethermiques sur T15 sur serpentin BTC":{
            id:"k_serpentin",
            cond:(/tampon/.test(S.ballonTampon.value) && !$("#EchangeurDansBT").is(':checked') && S.appoint1.value == "PAC")
        },
        "recharge nappes goethermiques sur T15 sur échangeur BTC":{
            id:"k_geo_echangeur",
            cond:(/tampon/.test(S.ballonTampon.value) && S.appoint1.value == "PAC")
        },
        "Sortie Idem C2":{
            id:"k_idem_2",
            cond:(!/Aucun/.test(S.circulateurC2.value))
        },
        "Sortie Idem C3":{
            id:"k_idem_3",
            cond:(!/Aucun/.test(S.circulateurC3.value))
        },
        "Sortie Idem C6":{
            id:"k_Idem_6",
            cond:(/tampon/.test(S.ballonTampon.value))
        },
        "Sortie Idem C7":{
            id:"k_idem_7",
            cond:(!/Aucun/.test(S.circulateurC7.value))
        },
        "Piscine déportée T15|CESI déportée sur T15|CESI déportée sur T16|ON en mode excédent d'énergie l'été":{
            id:"k_deporte",
            cond:(!/Aucun/.test(S.champCapteur.value))
        },
        "V3V retour bouclage sanitaire solaire":{
            id:"k_v3v_retour",
            cond:(/bouclage sanitaire/.test(S.ballonECS.value))
        }




    }
    const obj = condition_for_enable[key];
    const keyS10 = {envoyeur:obj.id , receveur:"optionS10"};
    const keyS11 = {envoyeur:obj.id , receveur:"optionS11"};
    if (obj.cond){
        ForbidOption.enable(keyS10);
        ForbidOption.enable(keyS11);
    }else{
        ForbidOption.forbid(keyS10,key.split("|"));
        ForbidOption.forbid(keyS11,key.split("|"));
    }
    S.optionS10.loadList();
    S.optionS11.loadList();
    return;
      

}

////////////////////////////////////////////////////////////////////////////////////////////////
//                          FUNCTION AUTRE
////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * affiche une erreur indiquant à l'utilisateur de remplir les champs installateurs
 */
function setErrorInstallateur(){
    var bt_inst = document.querySelector("#AC_descriptionAffaire");
    var tbody = document.querySelector("#form_installateur");
    if (!bt_inst.classList.contains("active")){
       bt_inst.click();
    }
    tbody.classList.add("blink");
    setTimeout(()=>{
        tbody.classList.remove("blink")
    },600)
    
    

}
/**
 * cette fonction s'occupe de supprimer ou d'autoriser le circulateur C3 
 * (il doit être supprimer lorsque un SC1Z est choisit et autoriser sinon)
 * cette fonction est appelé lorsque typeInstallation change de valeur
 * s'ocupe d'interdire les ballons pour un SC1Z
 */
function toggleCirculateurC3(){
        //gère le cas du type hygiénique
        const LIST_H = ["ballon ECS 2 échangeurs","ballon ECS 2 échangeurs avec bouclage sanitaire","Aucun"];
        const LIST_APPOINT = ["Appoint bois" , "Appoint granulé" , "Appoint multiple" , "Aucun"];

        if (S.typeInstallation.value === "SC1Z"){ //le SC1Z réduit le choix des ballons ECS et enlève la zone 3
            S.typeInstallation.forbidAll(S.ballonECS , LIST_H);
            S.typeInstallation.forbidAll( S.circulateurC7 , LIST_APPOINT );
            
        }else{
            S.typeInstallation.enable(S.ballonECS);
            S.typeInstallation.enable(S.circulateurC7);
        }
        S.circulateurC7.loadList(); //on actualise la liste C7
        //puis on force à manage le circulateur C3 car comme le circulateur C3 peut ne pas changer de valeur il se 
        //peut que C7 ne soit pas mis à jour   

        S.ballonECS.loadList();
}

/**
 * désactive le checkbox et le label associé identifé par l'id du checkbox
 * @param {string} id_chechbox 
 * @param {boolean} checked
 */
function disabledCheckbox(id_chechbox, checked = undefined){
    //on réupère le checkbox et son label associé
    let checkbox = document.querySelector("#"+id_chechbox);
    let label = document.querySelector("label[for='"+id_chechbox+"']");

    //on désactive le checkbox
    checkbox.disabled = true;
    //on coche ou décoche le checkbox
    if (checked != undefined) checkbox.checked = checked;
    //on ajoute une classe pour le griser
    checkbox.classList.add("disabled");
    
    //on ajoute une classe pour griser le label
    label.classList.add("disabled");
}

/**
 * active le checkbox et le label associé identifé par l'id du checkbox
 * @param {string} id_chechbox 
 * @param {boolean} checked
 */
function enableCheckbox(id_chechbox, checked = undefined){
    //on récupère le checkbox et son label associé
    let checkbox = document.querySelector("#"+id_chechbox);
    let label = document.querySelector("label[for='"+id_chechbox+"']");

    //on active le checkbox
    checkbox.disabled = false;
    //on coche ou décoche le checkbox
    if (checked != undefined) checkbox.checked = checked;
    //on ajoute une classe pour le griser
    checkbox.classList.remove("disabled");
    
    //on ajoute une classe pour griser le label
    label.classList.remove("disabled");
}


function handleMenuClick(event){
    event.preventDefault();
    // Exécution du formulaire après la redirection
    const form = document.getElementById('formulaire');
    form.action = event.target.href; // Modifier l'action du formulaire
    saveAllData(form);
    //sauvegarde de données supplémentaire
    form.submit(); // Envoyer le formulaire
}

/**
 * cette fonction ajoute tous les éléments supplémentaire qui doivent être sauvegardé
 * dans le formulaire que par défault il ne prend pas
 * @param {HTMLFormElement} form 
 */
function saveAllData(form){
    //commme par défaut le formulaire n'envoie pas les données des select disabled on les envoie en plus
    document.querySelectorAll("select:disabled").forEach(select =>{
        saveAdditionalData(select.name, select.value, form);
    })
    document.querySelectorAll("input[type=checkbox]:not(:checked), input[type=checkbox]:disabled").forEach(checkbox =>{
        const value = (checkbox.checked) ? "on" : "off";
        saveAdditionalData(checkbox.name , value, form);
    });

    saveAdditionalData('description' , $description.text() , form);
    saveAdditionalData('sondes' , Sonde.getSondes() , form);
}
////////////////////////////////////////////////////////////////////////////////////////////////
//                          MAIN

function main(){
    //on commence par récupérer l'instalation si il y en a une
    for (const key in DATA_DEFAULT_INDEX){
        if (formulaire !== null && formulaire[key] !== undefined){
            dataForm[key] = formulaire[key];
        }else{
            dataForm[key] = DATA_DEFAULT_INDEX[key]
        }
    }
    init();

    addEvent();

    initGestionError();

    if (sessionStorage.getItem("error") == "miss text" ){
        sessionStorage.removeItem("error");
        setErrorInstallateur();
    } 

}

fetch("../config/client/data_list.json")
.then(response => response.json())
.then(json => {
    DATA_LIST = json.listInfo;
    DATA_DEFAULT_INDEX = json.defaultIndex;
    DATA_MSG = json.forbidMessage;
    main();
})












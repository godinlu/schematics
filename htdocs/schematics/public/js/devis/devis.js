//////////////////////////////////////////////////////////////////////////
//----------------------- VARIABLE GLOBAL--------------------------------       

/**
 * variable principale on la remplie tout au long de ligne de devis
 * la priorité sert pour afficher le devis il permet d'ordonné les éléments
 * type {ref:string, label:string, qte:float, prixUnitaire:float, prio:int}[]
 * @type {Devis}
 */
var devis = new Devis(formulaire['nom_client']);
var div_devis = document.querySelector("#div_affichage_devis");

var CSV = {}
var s_GAMME_KIT = document.querySelector("#gamme_kit");
var s_GAMME_MOD = document.querySelector("#module");
var s_APPOINT_C7 = document.querySelector("#appoint_c7");
var s_BALLON_ECS = document.querySelector("#ballon_ecs");
var s_BALLON_TAMPON = document.querySelector("#ballon_tampon");

var div_appoint_c7 = document.querySelector("#div_appoint_c7");


//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////        
//                          PROTOTYPE
//////////////////////////////////////////////////////////////////////////
/**
 * ajouet une option avec un text et une value passé en paramètre au select
 * @param {string} label 
 * @param {string} value 
 */
HTMLSelectElement.prototype.addOption = function(label , value){
    var option = document.createElement("option");
    option.innerHTML = label;
    option.value = value;
    this.appendChild(option);
    if (this.options.length == 1) this.disabled = true;
    else this.disabled = false;
}
Element.prototype.addLabel = function(text){
    var label = document.createElement("label");
    label.htmlFor = this.id;
    label.innerHTML = text;
    this.before(label);
}
//////////////////////////////////////////////////////////////////////////        
//                          FONCTION
//////////////////////////////////////////////////////////////////////////
/**
 * cette fonction enregiste le blob passé en paramètre sous le nom passé en paramètre
 * @param {Blob} blob 
 * @param {String} filename 
 */
function saveAs(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

/**
 * télécharge l'array passé en paramètre sous forme d'un fichier XLSX
 * @param {[][]} array 
 */
 function downloadArray_XLSX(array,file_name = "devis") {

    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title:"SheetJS Tutorial",
        Subject:"Test File",
        Author:"Red Stapler",
        CreatedDate: new Date()
    };
    wb.SheetNames.push("Devis");
    var ws = XLSX.utils.aoa_to_sheet(array);
    wb.Sheets["Devis"] = ws;
    var wbout = XLSX.write(wb,{bookType:'xlsx', type:'binary'});

    function s2ab(s){
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0 ; i<s.length ; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    saveAs(new Blob([s2ab(wbout)] , {type:"application/octet-stream"}) , file_name + '.xlsx');

}

/**
 * cette fonction renvoie la valeur de l'élément passé en paramètre si c'est un
 * checkbox alors on renvoie si il est coché ou non
 * @param {HTMLElement} HtmlElement 
 */
function getValue(HtmlElement){
    if (HtmlElement.tagName === "INPUT" && HtmlElement.type === "checkbox")
        return HtmlElement.checked;
    else
        return HtmlElement.value;
}
//////////////////////////////////////////////////////////////////////////        
//                          FONCTION DE CRÉATION
//////////////////////////////////////////////////////////////////////////
/**
 * créer tout ce qui est nécessaire pour les lignes de devis contenu dans le fichier SC_part.csv
 */
function create_SC_part(){

    //on filtre pour avoir que les ligne qui corresponde au type de l'installation
    CSV.SC_part = CSV.SC_part.filter(function(raw){
        return raw.filtre1.includes(formulaire['typeInstallation']);
    });
    const MOD_row = CSV.SC_part.filter(raw => raw.filtre2 == "module");
    const KIT_rows = CSV.SC_part.filter(raw => raw.filtre2 == "kit module");
    const OPT_rows = CSV.SC_part.filter(raw => raw.filtre2 == "opt zone");   
    const v3v_rows = CSV.SC_part.filter(raw => raw.filtre2 == "v3v") 

    //partie pour le module 
    for (var i = 0 ; i < MOD_row.length ; i++){
        s_GAMME_MOD.addOption(MOD_row[i].label,MOD_row[i].ref);
    }
    s_GAMME_MOD.addOption("Aucun","Aucun");

    s_GAMME_MOD.addEventListener("change",eventUpdateObjet); // on est dans le cas d'un SC1Z
    s_GAMME_MOD.addEventListener("change",eventSelectUpdateDevis); // on est dans le cas d'un SC1Z
    eventSelectUpdateDevis.call(s_GAMME_MOD);
    //partie pour les KIT (vase d'exension)
    VaseExpension.lignes = KIT_rows;
    let liste_vaseExpension = new ListeChamp("panel_module", "vaseExpension",VaseExpension);
    liste_vaseExpension.ajouter();

    addPcDevis(OPT_rows);
    addPiscineZone1Devis();
    addZoneDevis(OPT_rows);
    add_v3v_bypass(v3v_rows)

    VisualDevis.show();
    
}
/**
 * créer tout ce qui est nécessaire pour les lignes de devis contenu dans le fichier bllon_part.csv
 */
function create_ballon_part(){
    //dans le cas d'un SC1Z le ballon se commande dans le module donc on supprime cette partie
    if (formulaire['typeInstallation'] == "SC1Z"){    
        document.querySelector("#panel_ballon").innerHTML = "";
        return;
    }
    BallonTampon.lignes = CSV.ballon_part.filter(row => row.filtre1 == "TAMPON");
    let liste_ballonECS = new ListeChamp("panel_ballon", "ballonECS",BallonECS);
    liste_ballonECS.ajouter();  

    if (formulaire['ballonTampon'] == "Aucun"){
        document.querySelector("#panel_ballon fieldset:nth-child(2)").remove();
        return;
    }
    

    let liste_ballonTampon = new ListeChamp("panel_ballon", "ballonTampon",BallonTampon);
    liste_ballonTampon.ajouter();
    if (/2|3/.test(formulaire['ballonTampon'])) liste_ballonTampon.ajouter();
    if (/3/.test(formulaire['ballonTampon'])) liste_ballonTampon.ajouter();


}
/**
 * s'occupe de créer la partie résponsable des capteurs
 */
function create_capteur_part(){

    Capteur.ligne_capteurs = CSV.capteur_part.filter(row => row["filtre1"] == "capteurs");
    Capteur.ligne_habillage = CSV.capteur_part.filter(row => row["filtre1"] == "habillage");
    
    let CapteursManager = new ListeChamp("panel_capteurs", "capteur", Capteur);
    CapteursManager.ajouter(); 

}
/**
 * s'occupe de créer la partie résponsable des tubes en inox
 */
function create_tubeInox_part(){
    //on initialise les lignes de tube inox
    FlexibleInox.lignes = CSV.tubeInox_part.filter(row => row["filtre1"] == "flexible_inox");
    let flexibleInoxManager = new ListeChamp("panel_racc_capt", "flexible_inox", FlexibleInox);
    flexibleInoxManager.ajouter();

    //on initialise les lignes d'accessoire
    Accessoire.lignes = CSV.tubeInox_part.filter(row => row["filtre1"] == "accessoire");
    let accessoireManager = new ListeChamp("panel_racc_capt", "accessoire", Accessoire);
    accessoireManager.ajouter();

    kit_capteurs_rows = CSV.tubeInox_part.filter(row => row["filtre1"] == "kit capteur");
    addKitCapteur(kit_capteurs_rows);
}
/**
 * créer la partie responsable du choix des résistance éléctrique et des réchauffeur de boucle
 * s'occupe aussi de supprimer ces champs si il ne doivent pas être présents
 */
function create_elecAnode_part(){
    //si il y a aucune resistance electrique alors on supprime le champ resistance electrique
    if (formulaire['resistanceElectriqueBECS'] === "off" && formulaire['resistanceElectriqueBT'] == "off"){
        document.querySelector("#fd_resistance_elec").remove(); //supprime le champ resistance electrique
    }else{  //sinon pour chaque resistance electrique présente on appelle ElecAnode.addResistanceElec
        if (formulaire['resistanceElectriqueBECS'] == "on") ElecAnode.addResistanceElec();
        if (formulaire['resistanceElectriqueBT'] == "on") ElecAnode.addResistanceElec();
    }
    //si il y a aucun réchauffeur de boucle alors on supprime le champ réchauffeur de boucle
    if (formulaire['typeAppoint1'] != "electrique" && formulaire['appoint2'] != "Electrique"){
        document.querySelector("#fd_rechauffeur_boucle").remove();
    }else{  //sinon pour chaque réchauffeur de boucle présente on appelle ElecAnode.addRechauffeurBoucle
        if (formulaire['typeAppoint1'] == "electrique") ElecAnode.addRechauffeurBoucle();
        if (formulaire['appoint2'] == "Electrique") ElecAnode.addRechauffeurBoucle();
    }


    

    
}
/**
 * ajoute si il y a un appoint sur casse pression, le choix de choisir la bouteille casse pression
 */
function create_appoint_part(){;

    if (/casse pression/.test(formulaire['raccordementHydraulique'])){
        var select = document.querySelector("#appoint");
        const rows_CP = CSV.appoint_part.filter(row => row.filtre1 == "casse pression");
        rows_CP.forEach(row =>{
            select.addOption(row.label , row.ref);
        });
        select.addOption('Aucun' , 'Aucun'); 
        select.addEventListener("change",eventSelectUpdateDevis);
        eventSelectUpdateDevis.call(select);
    }else{
        document.querySelector("#div_appoint").style.display = "none";
    }
}
/**
 * ajoute la partie service avec le transport + l'assistance à la mise en service
 */
function create_service_part(){

    Service.initServicePart();
    Service.manageTransportZone5();
}
/**
 * cette fonction est appelé à l'initialisation de la page 
 * elle modifie le header en fonction des champs remplie dans la description de l'affaire
 */
function create_header(){
    var fields = document.querySelectorAll("span.replace_field");
    for (var i=0 ; i<fields.length ; i++){
        fields[i].innerHTML = formulaire[fields[i].id];
    }
}

/**
 * cette fonction s'occupe d'initialiser la partie de la remise
 */
function create_remise_part(){
    let input_remise = document.getElementById("input_remise");
    input_remise.addEventListener("input",()=>{
        Article.setDiscount(input_remise.value);
        VisualDevis.show();
    });
}

//////////////////////////////////////////////////////////////////////////        
//                          FONCTION EVENT
//////////////////////////////////////////////////////////////////////////


/**
 * fonction event qui doit être appelé par un HTMLSelectElement
 * cette fonction est appelé lorsque un select change de valeur
 * elle va supprimer du devis l'ancienne valeur de ce select (celle contenue dans le buffer)
 * et elle va rajouter dans le devis la nouvelle valeur qui à été selectionné
 * !IMPORTANT! la class du select qui va appeler cette fonction doit être class="categorie CSV_file_name"
 */
function eventSelectUpdateDevis(){
    devis.removeRow(this.id);
    if (this.value !="Aucun"){//si on a l'option "Aucun" alors on ajoute rien au devis
        devis.add(
            this.id,
            CSV[this.classList[0]].filter(raw => raw.ref == this.value)[0]
        )
    } 
    VisualDevis.show();
}

/**
 * fonction event qui doit être appelé par un HTMLInputElement de type checkbox
 * cette fonction est appelé lorsque un checkbox change de valeur
 * si la case est décoché : elle va supprimer du devis la valeur (celle contenue dans le buffer)
 * si la case est coché :  elle va rajouter dans le devis la valeur du checkbox
 * !IMPORTANT! la class de l'input qui va appeler cette fonction doit être class="categorie CSV_file_name"
 */
function eventCheckBoxUpdateDevis(){
    if (this.checked){
        devis.add(
            this.id,
            CSV[this.classList[0]].filter(raw => raw.ref == this.value)[0]
        )
    }else{
        devis.removeRow(this.id);
    }
    VisualDevis.show();
}
/**
 * télécharge le devis sous format XLSX et sauvegarde le devis dans la base de donnée
 * commence par générer un array représentant le devis à partir de devis.getDevisFormat()
 * ensuite appelle la fonction downloadArray_XLSX
 */
function downloadXLSX(){
    sauvegardeDevisDansBdd();
    
    var arr = [];
    var tables = [
        document.querySelector("#table_devis"),
        document.querySelectorAll("#footer table")[0],
        document.querySelectorAll("#footer table")[1],
    ];
    var columns , rows;

    for (var tableNum=0 ; tableNum<tables.length ; tableNum++){
        rows = tables[tableNum].querySelectorAll("tr");
        for (var i=0 ; i<rows.length ; i++){
            columns = rows[i].querySelectorAll("td,th");
            arr.push([]);
            for (var j=0 ; j<columns.length ; j++){
                arr[arr.length - 1].push(columns[j].innerHTML.replace(/&nbsp;/," "));
            }
        }
        arr.push([]);
    }
    const form = document.getElementById('formulaire');
    saveAllData(form); 
    form.submit();

    downloadArray_XLSX(arr, "Devis" + formulaire['nom_affaire']);

}

/**
 * cette fonction est appellé lorsque l'utilisateur click sur le bouton bt_dl_pdf
 * cela transforme le tableau html sous forme de canvas puis le télécharge en pdf
 * @param {Event} event
 */
function downloadPDF(event){
    event.preventDefault();
    sauvegardeDevisDansBdd();
    const divToPdf = document.getElementById('div_affichage_devis');
    const filename = 'devis' + formulaire['nom_affaire'] + '.pdf';

    window.scrollTo(0, 0);
    html2pdf().set().from(divToPdf).save(filename);
}
/**
 * cette fonction est appelé lors du changement de valeur de soit :
 *      -module (SC1Z)
 *      -ballon_ecs (SC1 ou SC2 ou plus)
 *      -ballon_tampon (SC2 ou SC2K)
 *      -nb_range (pour tout les champs capteurs)
 * pour actualisé le champ text devis_object
 */
function eventUpdateObjet(){
    var str = "";
    //partie client et type de module
    str += formulaire['nom_client'].toUpperCase() + " " +formulaire['prenom_client'] + " - ";
    str += formulaire['typeInstallation'];

    //si l'installation est un SC1Z alors on ajoute les litres du ballons
    if (formulaire['typeInstallation'] === 'SC1Z'){
        const module_ref = document.getElementById("module").value
        const row = CSV.SC_part.filter(row => row.ref === module_ref)[0]; 
        str += " " + row.filtre5;
    }

    //partie qui s'occupe d'ajouter le champ pour le ballon ECS
    var ballons = document.querySelectorAll("#panel_ballon select");    //on prend tout les select des ballons
    for (var i=0 ; i<ballons.length ; i++){
        const row = CSV.ballon_part.filter(row => row.ref == ballons[i].value)[0];
        str += " + " + row.filtre4;
    }

    //ensuite on gère la partie capteur
    for (let [cle, val] of devis.map){
        if (/CAPT_\d+/.test(cle)){
            const row = CSV.capteur_part.filter(row => row.ref == val.ref)[0];
            str += " + " + row[Capteur.SURFACE_BRUT] + "m²";
        }
    }
    document.querySelector("#devis_object").innerHTML = str;
}

/**
 * cette fonction envoie une requête ajax vers un fichier php
 * qui va traiter les données et les sauvegarder dans la base de donnée
 */
function sauvegardeDevisDansBdd(){
    const URL = "../ajax/sauvegarderDevis.php"; 
    //informations sur le client 
    const donnee = {
        //information sur le client
        "prenom_client" : formulaire['prenom_client'],
        "nom_client" : formulaire['nom_client'],
        "code_postale_client" : formulaire['code_postale_client'],
        "ville_client" : formulaire['ville_client'],
        //information sur l'installateur
        "installateur" : formulaire['installateur'],
        "Prénom/nom" : formulaire['Prénom/nom'],
        "adresse_mail" : formulaire['adresse_mail'],
        //information pour le devis
        "objet" : document.querySelector("#devis_object").innerHTML,
            //pas besoin de la date elle est généré automatiquement
        "cout_total" : devis.getTotal(),
        "taux_remise": Article.discount,
        "nom_commercial" : formulaire['commercial'],
        "articles" : devis.getArticles()
    }
    //on créer un blob qui contient les données à envoyé au script php
    const blob = new Blob([JSON.stringify(donnee)], {type : "application/json"});

    //puis on fait une requête asynchrone vers le serveur
    fetch(URL,{
        method:'POST',
        body:blob
    })
    .then(response => {
        // Vérifier si la requête a réussi (statut 200-299) avant de lire la réponse.
        if (!response.ok) {
            throw new Error('La requête a échoué avec le statut : ' + response.status);
        }
        // Pour une réponse JSON ou texte
        return response.text()
    }).then(data => {
        console.log(data); // Le contenu de la réponse (sous forme d'objet JavaScript si c'est du JSON, ou simplement du texte si c'est du texte)
    })
    .catch(error => {
        console.error('Une erreur est survenue :', error);
    });
}

/**
 * cette fonction sert à sauvegarder le devis dans le session storage de js
 * pour pouvoir le récupérer plus tard
 */
function saveDevisIntoSession(){
    //on récupère toute les données des select et des inputs
    let data = {};
    document.querySelectorAll("#formulaire select, #formulaire input").forEach((element) =>{
        const value = getValue(element);
        if (element.id !== "" && value !== ""){
            data[element.id] = value;
        }
        
    });

    //ensuite on récupère le contenue des champs multiple bien formaté
    const dataChampMultiple = ListeChamp.getAllContent();

    for (const ListeChamp_key in dataChampMultiple){
        //on supprime tout les éléments de data qui sont présent dans dataChampMultiple
        dataChampMultiple[ListeChamp_key].forEach((objet) =>{
            for (const key in objet){
                if (key in data){
                    delete data[key];
                }
            }
        });
        //puis on ajoute les données bien formatté à data
        data[ListeChamp_key] = dataChampMultiple[ListeChamp_key];
    }
    //et enfin on ajoute les articles ajouter depuis le gros tableau
    data["articles"] = getArticlesContent();

}

/**
 * cette fonction redirige le formulaire vers la page souhaité pour sauvegarder les données du devis
 * @param {Event} event 
 */
function handleMenuClick(event){
    event.preventDefault();
    const form = document.getElementById('formulaire');
    form.action = event.target.href
    saveAllData(form); 
    form.submit();
}

/**
 * cette fonction ajoute tous les éléments supplémentaire qui doivent être sauvegardé
 * dans le formulaire que par défault il ne prend pas
 * @param {HTMLFormElement} form 
 */
function saveAllData(form){
    //on sauvegarde en plus les champs multiple
    const dataChampMultiple = ListeChamp.getAllContent()
    for (const key in dataChampMultiple){
        saveAdditionalData(key , JSON.stringify(dataChampMultiple[key]) , form);
    }

    //ensuite on sauvegarde les articles
    saveAdditionalData('articles' , JSON.stringify(getArticlesContent()) , form);
}

/**
 * cette fonction s'occupe de charger le devis contenue dans la session
 * elle est appelé si et seulement si la partie devis !== null
 * l'initialisation de la liste d'articles ce fait dans articles_commentaires.js
 * @param {object} devis_data donné du devis qui doit être chargé 
 */
function loadDevis(devis_data){
    for (const key in devis_data){
        const value = devis_data[key];

        //dans le cas d'un string on met la valeur betement
        if (typeof value !== "object"){
            const element = document.getElementById(key);
            if (element){
                setElementValue(element,value);
            }
        
        }
        else if(typeof value === "object" && key !== "articles"){
            //ici on est dans le cas d'un ListeChamp à initialiser
            ListeChamp.setContent(key, value);
        }
    }

    
}



//////////////////////////////////////////////////////////////////////////        
//                          MAIN
//////////////////////////////////////////////////////////////////////////
function main(){
    div_appoint_c7.style.display = "none";
    //on commence par créer un dictionnaire qui contient tout les tableaux
    //séparé par leur catégorie en fonction de leur id
    //on éxclue les éléments qui sont dans la catégorie inutilisé
    for (var i=0 ; i<json_tarif.length ; i++){
        const key = json_tarif[i].famille;
        if (key === "inutiliser") continue;
        if (CSV[key]){
            CSV[key].push(json_tarif[i]);
        }else{
            CSV[key] = [json_tarif[i]];
        }
        
    }
    create_SC_part();
    create_ballon_part();
    create_capteur_part();
    create_tubeInox_part();
    create_elecAnode_part();
    create_appoint_part();
    create_service_part();
    create_remise_part();

    //ensuite on met à jour l'objet du devis
    eventUpdateObjet();

    //on créer la partie pour ajouter un article / commentaire
    initTableArticle();
    new ListeChamp("panel_article_commentaire", "commentaire", Commentaire);

    //si il y a dans la session un devis alors on charge ce devis en question
    //ici on concatene les données existante avec les valeurs par défaut
    //Cela permet que si il manque certaines données alors les données par défaut soit pris en compte 
    let indexs = { ...default_devis_index, ...devis_index,};

    // ajoute un deuxième champ capteur si il y a 2 champs capteurs
    if (/2/.test(formulaire["champCapteur"]) && indexs["capteur"].length == 1){
        indexs["capteur"].push(indexs["capteur"][0]);
    }
    const double = /ballon ECS et ballon appoint en série|ballon elec en sortie ballon solaire avec bouclage sanitaire|ballon d'eau chaude sur échangeur/;
    if (double.test(formulaire['ballonECS']) && indexs["ballonECS"].length == 1){
        indexs["ballonECS"].push(indexs["ballonECS"][0]);
    }

    loadDevis(indexs);


    //ajout des events listener
    document.querySelector("#bt_dl_xlsx").addEventListener("click",downloadXLSX);
    document.querySelector("#bt_dl_pdf").addEventListener("click",downloadPDF);
    document.querySelectorAll(".saveForm").forEach(a =>{
        a.addEventListener("click" , handleMenuClick);
    });

    create_header();

    

}


main();

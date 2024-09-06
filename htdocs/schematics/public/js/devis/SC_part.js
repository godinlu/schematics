//////////////////////////////////////////////////////////////////////////
//----------------------- VARIABLE GLOBAL--------------------------------  
var nb_commande = 0;

//////////////////////////////////////////////////////////////////////////


/**
 * ajoute au devis ou nan un plancher chauffant 
 * @param {string[][]} OPT_rows 
 */
function addPcDevis(OPT_rows){
    //on test si il ya un plancher chauffant si oui alors on doit ajouter un kit 
    if (!/Plancher chauffant|PC/.test(formulaire['circulateurC1'])) return;
    var raw;
    if (formulaire['circulateurC1'] == "Plancher chauffant sur V3V")  //ici on est dans le cas d'un plancher chauffant sur V3V
        raw = OPT_rows.filter(raw => /plancher chauffant V3V/.test(raw.filtre3));
    else                                                            //ici on est dans le cas d'un plancher chauffant classique
        raw = OPT_rows.filter(raw =>/plancher chauffant/.test(raw.filtre3));
    devis.add("ID_plancherChauffant",raw[0]); //ensuite on l'ajoute au devis 
    
}
/**
 * ajoute les devis pour les zones 2, 3, 4 
 * si il y a des appoints alors appelle la fonction addAppoint2 Precision
 * pour permettre à l'utilisateur de préciser si il y a une sonde magnétique
 * @param {string[][]} OPT_rows 
 */
function addZoneDevis(OPT_rows){
    const list_emplacement = getList_emplacement(formulaire);
    var MAX_ZONE = 4; if (formulaire['typeInstallation'] == "SC1Z") MAX_ZONE = 3;
    var filter1 , filter2;
    var nbZones = 0;
    var raws;

    for (var i = 0 ; i<list_emplacement.length ; i++){
        if (list_emplacement[i] != ""){
            nbZones++;
            if (formulaire[list_emplacement[i]] === "Radiateurs sur échangeur à plaques"){ //ici on ajoute les radiateurs sur échangeur à plaque
                devis.add("ID_radiateurEch",OPT_rows.filter(raw => raw.filtre4 == "ech")[0]);
            }
                
            if (nbZones >= 2){  //comme on ne traite pas la première zone alors on attend d'arriver à la deuxième
                filter1 = "zone x"; if (nbZones == MAX_ZONE) filter1 = "zone 4";   //ici on change le filtre si on arrive à la 4ème zone ou 3ème zone pour un SC1Z
                filter2 = "défaut";                                         //le deuxième filtre sert à déterminer le type de la zone
                if (/Appoint/.test(formulaire[list_emplacement[i]])) filter2 = "appoint bois";
                else if (/Piscine/.test(formulaire[list_emplacement[i]])) filter2 = "piscine";
                
                raws = OPT_rows.filter(raw => raw.filtre4 == filter2 && raw.filtre3 == filter1);
                //on ajoute ensuite le résultat filtrer au devis si l'ajout est impossible on est dans le cas 
                //d'un appoint 2 sur C7 alors on fait appelle à addAppoint2
                if (raws.length == 1) devis.add("ID_ZONE_"+nbZones,raws[0]);
                else if(raws.length > 1) addAppoint2(raws);
                
                //si il y a une piscine sur zone alors on doit appeller la fonction addPiscineSurZone
                if (filter2 == "piscine") addPiscineSurZone(nbZones,formulaire[list_emplacement[i]]);
                
            }
        } 
    }

}
/**
 * affiche la partie responsable de la précision de sonde magnétique dans l'appoint
 * et active le select responsable de ça
 * @param {string[][]} Appoint_raws 
 */
function addAppoint2(Appoint_raws){
    div_appoint_c7.style.display = "block";
    for (var i = 0 ; i<Appoint_raws.length ; i++){
        s_APPOINT_C7.addOption(Appoint_raws[i].label , Appoint_raws[i].ref);
    }
    s_APPOINT_C7.addOption('Aucun' , 'Aucun');
    //ici on ajoute l'event listener à la liste et on simule une action pour ajouter une ligne au devis
    s_APPOINT_C7.addEventListener("change",eventSelectUpdateDevis);
    eventSelectUpdateDevis.call(s_APPOINT_C7);
}

function addPiscineZone1Devis(){
    //on test si il ya un plancher chauffant si oui alors on doit ajouter un kit 
    if (!/Piscine/.test(formulaire['circulateurC1'])) return;
    addPiscineSurZone(1,formulaire['circulateurC1']);
    
}
/**
 * ajoute un template qui permet de choisir les kit piscines sur zone
 * cette fonction doit être appelé pour chaque piscine sur zone
 * elle adapte ses choix en fonction d'un échangeur à plaques ou d'un échangeur multitubulaire
 * @param {int} nbZone 
 * @param {string} value 
 */
 function addPiscineSurZone(nbZone,value){
    //on filtre les CSV pour avoir que les ligne de piscine pour le bonne échangeur
    var filter = "multitubulaire"; if (/échangeur à plaques/.test(value)) filter = "plaque";

    
    const piscine_rows = CSV.SC_part.filter( raw => raw.filtre2 == "kit piscine zone");
    const s_piscine_rows = piscine_rows.filter(raw => raw.filtre3 == filter);
    const c_piscine_rows =  piscine_rows.filter(raw => raw.filtre3 == "optionnel");
    var template = document.querySelector("#tp_piscine_zone");  //on trouve le template des zone piscine
    var clone = template.content.cloneNode(true);               //on le clone

    var select = clone.querySelector("select");                 //on trouve le select 
    var labels = clone.querySelectorAll("label");
    var input = clone.querySelector("input");

    //on initialise tout les éléments pour adapter le template à la zone
    clone.querySelector("legend").innerHTML = "Piscine sur zone " + nbZone;  
    //labels[0].htmlFor = "PISCINE_ZONE_" + nbZone;
    labels[0].htmlFor = "I_PISCINE_ZONE_" + nbZone;
    labels[0].innerHTML = c_piscine_rows[0].label;
    select.id = "PISCINE_ZONE_" + nbZone;
    select.name = "PISCINE_ZONE_" + nbZone;
    input.id = "I_PISCINE_ZONE_" + nbZone;
    input.name = "I_PISCINE_ZONE_" + nbZone;
    input.value = c_piscine_rows[0].ref;

    select.addOption("Aucun" ,"Aucun");  //on ajoute aucun car il n'est pas obligé de selectionner un kit piscine
    for (var i = 0 ; i<s_piscine_rows.length ; i++){  //on ajoute les options que l'utilisateur peut choisir
        select.addOption(s_piscine_rows[i].label , s_piscine_rows[i].ref);
    }
    
    //on ajoute l'eventListener responsable de l'update du devis
    select.addEventListener("change",eventPiscineZone);
    input.addEventListener("change",eventCheckBoxUpdateDevis);
    eventPiscineZone.call(select);
    //puis on ajoute le clone du template dans la zone dédié au picsine
    document.querySelector("#div_piscine_zone").appendChild(clone);



}

/**
 * cette fonction ajoute le select lorsqu'il y a l'option v3v bypass appoint 1.
 * Le select est différent si les 2 options v3v bypass appoint 1 sont selectionné
 * @param {JSON[]} v3v_rows 
 */
function add_v3v_bypass(v3v_rows){
    let select = document.querySelector("#kit_v3v");
    const opt1 = formulaire['optionS10'] == "V3V bypass appoint 1";
    const opt2 = formulaire['optionS11'] == "V3V bypass appoint 1";

    // cas ou les 2 options s10 et s11 sont des V3V bypass appoint 1
    if (opt1 && opt2){
        const rows = v3v_rows.filter(raw => raw.filtre3 == "double");
        activate_select(select, rows);
        if (formulaire['typeInstallation'].includes('K')) setElementValue(select, "KITSSC053");
        else setElementValue(select, "KITSSC018");

    // cas ou une des 2 options sont des V3V bypass appoint 1
    }else if (opt1 || opt2){
        const rows = v3v_rows.filter(raw => raw.filtre3 != "double");
        activate_select(select, rows);
        if (formulaire['typeInstallation'].includes('K')) setElementValue(select, "KITSSC0155");
        else setElementValue(select, "KITSSC069");
    
    // cas ou aucune des options n'est selectionné donc on supprime la div.
    }else{
        document.querySelector("#div_kit_v3v").remove();
    }
}

/**
 * ajoute les lignes de devis pour les kitCapteurs selon le type de capteurs choisi:
 *      -casse pression
 *      -échangeur
 *      -V3V
 * ensuite ajoute les lignes dans un select pour laisser le choix à l'utilisateur
 */
function addKitCapteur(kit_capteurs_rows){
    /*si il n'y a ni de casse pression ni d'échangeur ni de V3V alors on supprime le select 
    et on sort de la fonction
    */
    if (
        !/casse pression/.test(formulaire['champCapteur']) &&
        !/échangeur/.test(formulaire['champCapteur']) &&
        !/V3V/.test(formulaire['champCapteur'])
        ){
            document.querySelector("#kit_capteur").remove();
            return;
        } 

    let select_mod1 = document.querySelector("#kit_capteur_mod1");
    let select_kit1 = document.querySelector("#kit_capteur_kit1");
    let select_mod2 = document.querySelector("#kit_capteur_mod2");

    // dans le cas d'un champ capteur sur V3V on supprime tous les autres select
    // pour garder que le select_kit1 et lui afficher les lignes de v3v
    if (/V3V/.test(formulaire['champCapteur'])){
        let v3v_rows = CSV.SC_part.filter(raw => raw.filtre2 == "v3v" && raw.filtre3 == "double");

        // ici on manipule les données pour que l'options v3v arrive en catégorie capteur.
        v3v_rows.forEach(obj => {
            obj.famille = "tubeInox_part";
        });
        CSV.tubeInox_part = CSV.tubeInox_part.concat(v3v_rows);

        document.querySelector("#tr_module_2").remove();
        document.querySelector("#tr_module_1").remove();
        activate_select(select_kit1, v3v_rows);
    }else{
        let rows;
        if (/casse pression/.test(formulaire['champCapteur'])){
            rows = kit_capteurs_rows.filter(raw => raw.filtre3 == "casse pression");
        }else if (/échangeur/.test(formulaire['champCapteur'])){
            rows = kit_capteurs_rows.filter(raw => raw.filtre3 == "échangeur");
        }
        const mod_rows = rows.filter(raw => raw.filtre2 == "module");
        const kit_rows = rows.filter(raw => raw.filtre2 == "kit");

        activate_select(select_mod1, mod_rows, true);
        activate_select(select_kit1, kit_rows, true);

        if (/2/.test(formulaire["champCapteur"])){
            activate_select(select_mod2, mod_rows, true);
        }else{
            document.querySelector("#tr_module_2").remove();
        }
    }
}
//////////////////////////////////////////////////////////////////////////        
//                          FONCTION EVENT
//////////////////////////////////////////////////////////////////////////
/**
 * cette fonction est appelé lorsque un select de kit piscine sur zone change de valeur
 * elle permet de ajouter ou non des choses aux devis avant d'appeler eventSelectUpdateDevis
 */
function eventPiscineZone(){
    
    if (this.value == "Aucun"){  // si on est dans le cas de Aucun alors on est obligé d'ajouté au devis une sonde et un aquastat
        const piscine_rows = CSV.SC_part.filter( raw => raw.filtre2 == "piscine zone");
        devis.add(this.id+"_A",piscine_rows[0]);    //ici on doit ajouter A ou B à l'id car elle doit gérer plusieurs ligne
        devis.add(this.id+"_B",piscine_rows[1]);
    }else{                  //sinon la sonde et l'aquastat sont comprise dans le kit donc on les supprimes
        devis.removeRow(this.id+"_A");
        devis.removeRow(this.id+"_B");
    }
    eventSelectUpdateDevis.call(this);
}

class VaseExpension extends Champ{
    static lignes;

    constructor(id, texte, categorie){
        super(id, texte, categorie);

        for (let i = 0 ; i < VaseExpension.lignes.length ; i++){
            this.nodes.gamme_kit.addOption(VaseExpension.lignes[i].label, VaseExpension.lignes[i].ref);
        }

        this.nodes.gamme_kit.addEventListener("change",eventSelectUpdateDevis);
        eventSelectUpdateDevis.call(this.nodes.gamme_kit);

    }

    supprimer(){
        devis.removeRow(this.nodes.gamme_kit.id);
        VisualDevis.show();
        delete this;
    }

}
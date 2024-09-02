<?php


function getOptionS10(array $formulaire):string{
    if (preg_match('/S10/', $formulaire[FORM_SONDES]) && $formulaire[FORM_OPTION_S10] === AUCUN){
        return preg_replace('/^\d/', '', $formulaire[FORM_CHAMP_CAPTEUR]);
    }else{
        return $formulaire[FORM_OPTION_S10];
    }
}

function getOptionS11(array $formulaire):string{
    if (preg_match('/S11/', $formulaire[FORM_SONDES]) && $formulaire[FORM_OPTION_S11] === AUCUN){
        return preg_replace('/^\d/', '', $formulaire[FORM_CHAMP_CAPTEUR]);
    }else{
        return $formulaire[FORM_OPTION_S11];
    }
}

function getList_emplacement(array $formulaire) {
    // cette fonction pousse toutes les valeurs une fois à droite
    // les valeurs peuvent être poussées si à droite il y a une chaîne vide ""
    $pushRight = function (&$array) {
        // on met -2 car le dernier objet ne peut jamais être déplacé vu qu'il est tout à droite
        for ($i = count($array) - 2; $i >= 0; $i--) {
            if ($array[$i + 1] == "") { // on teste s'il n'y a aucun objet à droite
                $array[$i + 1] = $array[$i]; // on copie l'objet pour le mettre à droite
                $array[$i] = ""; // on met vide l'objet que l'on vient de déplacer
            }
        }
    };

    $list_zones = ["circulateurC1", "circulateurC2", "circulateurC3", "circulateurC7"];
    $res = [];

    foreach ($list_zones as $id) {
        if ($formulaire[$id] !== AUCUN) {
            $res[] = $id;
        } else {
            $res[] = "";
        }
    }

    $pushRight($res);
    if ($formulaire[FORM_TYPE_INSTALLATION] === 'SC1Z') $pushRight($res);

    return $res;
}

/**
 * renvoie le nombre totale de zone qu'il y a
 * @param {object} formulaire
 * @returns {int} nbzone
 */
function getNbZones(array $formulaire){
    $list_zones = ["circulateurC1","circulateurC2","circulateurC3","circulateurC7"];
    $nbZone = 0;
    foreach($list_zones as $id){
        if ($formulaire[$id] !== AUCUN) $nbZone++;
    }
    return $nbZone;
} 

/**
* Cette fonction prend en paramètre une liste des identifiants des circulateurs
* et renvoie un tableau associatif du type ["id_circulateur" => "text"] ex : ["circulateurC1" => "C2", "circulateurC2" => "hidden"]
* Tous les circulateurs qui doivent être cachés sont remplacés par "hidden"
* Renvoie un tableau vide si aucun radiateur n'est piloté par un autre
* @param array $formulaire formulaire
* @return array Tableau associatif ["id_circulateur" => "text"]
*/
function getPilotageRad(array $formulaire):array{
    $list_id_circ = ["circulateurC1","circulateurC2","circulateurC3","circulateurC7"];
    // Dans le cas d'un SC1Z, on supprime le circulateur C3 car il n'est pas présent
    if ($formulaire['typeInstallation'] === "SC1Z") {
        unset($list_id_circ[2]);
        $list_id_circ = array_values($list_id_circ); // Réorganise les clés du tableau après la suppression
    } 

   $i = 0;
   $pilotage = "";
   $res = [];

   while ($i < count($list_id_circ)) {
       $val = $formulaire[$list_id_circ[$i]];

       // Cas particulier si un radiateur est sur casse pression ou sur échangeur,
       // alors il faut regarder le circulateur suivant et si "Idem zone N-1" est présent,
       // alors le circulateur "Idem zone N-1" pilotera le radiateur et l'image ne sera pas dessinée
       if ($pilotage != "" && $val == "Idem zone N-1") {
           // Ici, on est dans le cas où "Idem zone N-1" n'est pas le circulateur suivant,
           // donc c'est le circulateur qui va piloter le radiateur
           if ($formulaire[$list_id_circ[$i + 1]] != "Idem zone N-1") {
               $res[$pilotage] = str_replace("circulateur", "", $list_id_circ[$i]);
               $pilotage = "";
           }
           $res[$list_id_circ[$i]] = "hidden";
           $i++;
           continue;
       }

       if ($val == "Radiateurs sur échangeur à plaques" || $val == "Radiateurs sur casse pression") {
           $circ_option_S10 = str_replace("Sortie Idem ", "circulateur", $formulaire['optionS10']);
           $circ_option_S11 = str_replace("Sortie Idem ", "circulateur", $formulaire['optionS11']);

           // Ici, on teste aussi si le pilotage se fait depuis le circulateur S10 ou S11.
           // Dans le cas où le pilotage se fait depuis S10 ou S11, on ajoute un label.
           if ($circ_option_S10 === $list_id_circ[$i]) {
               $res[$list_id_circ[$i]] = "S10";
               $pilotage = "";
           } elseif ($circ_option_S11 === $list_id_circ[$i]) {
               $res[$list_id_circ[$i]] = "S11";
               $pilotage = "";
           } else {
               $pilotage = $list_id_circ[$i]; // Le pilotage prend la valeur de l'id du circulateur à piloter
           }
       } else {
           $pilotage = ""; // Sinon, on enlève le pilotage
       }

       $i++;
   }

   return $res;
}

/**
 * return the number of ECS balloon depend on the formulaire
 */
function getNbBallonECS(array $formulaire):int{
    $two = '/ballon ECS et ballon appoint en série|ballon elec en sortie ballon solaire avec bouclage sanitaire|ballon d\'eau chaude sur échangeur/';
    if (preg_match($two , $formulaire[FORM_BALLON_ECS]) ) return 2;
    else return 1;
    
}

/**
 * return the type of Appoint 1 for exemple "bois" 
 */
function getAppoint1Type(array $formulaire):string{
    if ($formulaire[FORM_APPOINT_1] !== "Autre") return $formulaire[FORM_APPOINT_1];
    else return $formulaire[FORM_TYPE_APPOINT_1];
}

function getAppoint2Type(array $formulaire):string{
    if ($formulaire[FORM_LOC_APPOINT_2] !== "cascade") return $formulaire[FORM_APPOINT_2];
    else return "Cascade Appoint 1";
}


?>
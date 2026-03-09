<?php

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
    $two = '/ballon ECS et ballon appoint en série|ballon Appoint en sortie ballon solaire avec bouclage sanitaire|ballon d\'eau chaude sur échangeur/';
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
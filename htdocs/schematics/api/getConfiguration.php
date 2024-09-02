<?php
require_once ("../config/config.php");
require_once (URL_DATA_FORM);
require_once (URL_FORMULAIRE_UTILS);

const TRANSLATION = 'translation';
const CONSEQUENCES = 'consequences';
const _DEFAULT = 'Default';
const THIS_VALUE = 'This_value';

const ROW_NAME = 1;
const ROW_VALUE = 2;

function getModifiedRows(array $formulaire):array{
    $res = array();

    $formulaire[FORM_TYPE_APPOINT_1] = getAppoint1Type($formulaire);
    $formulaire['typeAppoint2'] = getAppoint2Type($formulaire);


    $decoder = json_decode(file_get_contents(APP_BASE_PATH.'config/client/json_to_csv.json') , true);

    foreach($decoder as $form_id => $field){
        if (!isset( $formulaire[$form_id] )){
            throw new Exception("Undefined array_key " . $form_id);
        }
        $form_value = $formulaire[$form_id];

        //we translate this value beetwen formulaire and configuration
        if (isset( $field[TRANSLATION][$form_value] )){
            $key = $field[TRANSLATION][$form_value];
        }else if (isset( $field[TRANSLATION][_DEFAULT] )){
            $key = $field[TRANSLATION][_DEFAULT];
        }else{
            throw new Exception("No translation find for " . $form_value);
        }

        //next we search the consequences in the configuration , it's possible to à $key to have no consequences
        if (isset( $field[CONSEQUENCES][$key] )){
            $res = array_merge($res , $field[CONSEQUENCES][$key]);
        }
        if (isset( $field[CONSEQUENCES][_DEFAULT] )){
            foreach($field[CONSEQUENCES][_DEFAULT] as &$value){
                if ($value === THIS_VALUE) $value = $key;
            }
            $res = array_merge($res , $field[CONSEQUENCES][_DEFAULT]);
        }
        
    }
    return $res;
}

session_start();
$sessionManager = new DataForm;
$formulaire = $sessionManager->getFormulaire();
if (!isset($formulaire)){
    throw new Exception("erreur aucune données trouvées");
}

$row_to_modifie = getModifiedRows($formulaire);
$keys = array_keys($row_to_modifie);

// Ouvrir le fichier CSV en lecture
$handle = fopen(APP_BASE_PATH . 'config/client/default_config.csv', 'r');

// Vérifier si le fichier est ouvert avec succès
if ($handle !== false) {
    // Créer un tableau pour stocker les données modifiées
    $modifiedData = array();

    // Lire et modifier les données ligne par ligne
    while (($data = fgetcsv($handle, null, ';')) !== false) {
        // Modifier les données comme nécessaire
        if (in_array($data[ROW_NAME] , $keys)){
            $data[ROW_VALUE] = $row_to_modifie[ $data[ROW_NAME] ];
        }

        // Ajouter les données modifiées au tableau
        $modifiedData[] = $data;
    }

    // Fermer le fichier CSV en lecture
    fclose($handle);

    // Créer une réponse CSV en utilisant la mémoire tampon de sortie
    ob_start();
    $output = fopen('php://output', 'w');

    // Écrire les données modifiées dans la réponse CSV
    foreach ($modifiedData as $row) {
        fputs($output , implode(';',$row) . PHP_EOL);
    }

    // Fermer le fichier CSV dans la réponse
    fclose($output);

    // Envoyer les en-têtes HTTP appropriés pour le téléchargement du fichier
    $filename = 'config' . $formulaire[FORM_NOM_AFFAIRE] .'.csv';
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    // Renvoyer la réponse CSV au client
    ob_end_flush();

    // Arrêter l'exécution du script après l'envoi de la réponse
    exit();
} else {
    echo "Erreur lors de l'ouverture du fichier CSV en lecture.";
}
?>
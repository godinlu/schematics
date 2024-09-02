<?php
    require_once ("../config/config.php");
    require_once ("../models/DataForm.php");

    session_start();

    //ici on créer un objet de type DataForm pour récupérer les valeurs contenu dans la session
    //Et aussi pour sauvegarder les nouvelles données
    $dataForm = new DataForm;

    //génération du fichier 
    $filename = "installation" . $dataForm->getFormulaire()[FORM_NOM_AFFAIRE] . ".json";
    $tempFilePath = tempnam(sys_get_temp_dir(), $filename); //chemin du fichier

    $content = array(
        'formulaire' => $dataForm->getFormulaire(),
        'fiche_prog' => $dataForm->getFiche_prog(),
        'devis' => $dataForm->getDevis()->getDevisIndex()
    );
    //contenue du fichier
    $fileContent = json_encode($content , JSON_PRETTY_PRINT);

    //écriture du contenue dans le fichier
    file_put_contents($tempFilePath , $fileContent);

    //en tête HTTP pour le téléchargement
    header("Content-Type: application/json");
    header("Content-Disposition: attachment; filename=" . $filename);
    header("Content-Length: " . filesize($tempFilePath));
    header("X-Filename: " . $filename); // Ajout de l'en-tête X-Filename

    // Envoyez le contenu du fichier au navigateur
    readfile($tempFilePath);

    // Supprimez le fichier temporaire
    unlink($tempFilePath);


?>
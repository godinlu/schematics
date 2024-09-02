<?php
    // Inclure la bibliothèque FPDF
    require_once('../config/config.php');
    require_once(URL_FPDF);
    require_once (URL_SCHEMA_HYDRAULIQUE_WITH_LEGEND);
    require_once (URL_SCHEMA_EXE);
    require_once (URL_ETIQUETAGE);
    require_once (URL_IMAGE_FICHE_PROG);    
    require_once (URL_DATA_FORM);

    session_start();
    $dataForm = new DataForm;


    $schemaHydrau = new SchemaHydrauWithLegend($dataForm->getFormulaire());

    $schemaExe = new SchemaExe($dataForm->getFormulaire());  

    $etiquetage = new Etiquetage($dataForm->getFormulaire());

    $ficheProg = new ImageFicheProg($dataForm->getFormulaire() , $dataForm->getFiche_prog());

    // Créer une instance de la classe FPDF
    $pdf = new FPDF();


    $schemaHydrau->addToPDF($pdf , "schemaHydrau.png");
    $schemaExe->addToPDF($pdf, "schemaExe.png");
    $etiquetage->addToPDF($pdf , "etiquetage.png");
    $ficheProg->addToPDF($pdf , "ficheProg.png");

    $fileName = 'dossier' . $dataForm->getFormulaire()[FORM_NOM_AFFAIRE] .'.pdf';

    // Enregistrer le PDF sur le serveur
    $pdf->Output('D', $fileName, true);


?>
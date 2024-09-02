<?php
require_once ("../config/config.php");
require_once (URL_DATA_FORM);
require_once (URL_FPDF);

session_start();
$dataForm = new DataForm;

if (!isset($_GET['image'])){
    throw new Exception("le paramètre 'image' n'a pas été trouvé");
}


switch ($_GET['image']){
    case "SchemaHydrau":
        require_once (URL_SCHEMA_HYDRAULIQUE);
        $schema = new SchemaHydrau($dataForm->getFormulaire());
        break;
    case "SchemaHydrauWithLegend":
        require_once (URL_SCHEMA_HYDRAULIQUE_WITH_LEGEND);
        $schema = new SchemaHydrauWithLegend($dataForm->getFormulaire());
        break;
    case "SchemaExe":
        require_once (URL_SCHEMA_EXE);
        $schema = new SchemaExe($dataForm->getFormulaire());
        break;
    case "Etiquetage":
        require_once (URL_ETIQUETAGE);
        $schema = new Etiquetage($dataForm->getFormulaire());
        break;
    case "ImageFicheProg":
        require_once (URL_IMAGE_FICHE_PROG);
        $schema = new ImageFicheProg($dataForm->getFormulaire() , $dataForm->getFiche_prog());
        break;
    default:
        throw new Exception("le schéma " . $_GET['image'] . " n'existe pas");
        break;
}

if (isset($_GET['format']) && $_GET['format'] === "PDF"){
    // Créer une instance de la classe FPDF
    $pdf = new FPDF();

    $schema->addToPDF($pdf);

    if (isset($_GET['dl']) && $_GET['dl'] === "TRUE"){
        $pdf->Output('D' , $schema->getName());
    }else {
        $pdf->Output('I' , $schema->getName());
    }
     // Enregistrer le PDF sur le serveur
     

}else{
    $schema->show();
}



?>
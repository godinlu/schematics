<?php
require_once ("../config/config.php");
require_once (URL_DATA_FORM);
require_once (URL_FPDF);

session_start();
$dataForm = new DataForm;

$image = $_GET['image'] ?? "SchemaHydrau";
$format = $_GET['format'] ?? "png";
$dl = $_GET['dl'] ?? false;
$debug = $_GET['debug'] ?? false;

switch (strtolower($image)){
    case "schemahydrau":
        require_once (URL_SCHEMA_HYDRAULIQUE);
        $gd_image = generate_full_hydraulic_diagram($dataForm->getFormulaire());
        break;
    default:
        throw new Exception("le schéma " . $image . " n'existe pas");
        break;
}
switch (strtolower($format)){
    case "png":
        header('Content-Type: image/png');
        imagepng($gd_image);
        break;
    default:
        throw new Exception("Invalid image format : " . $format);
        break;
}


?>
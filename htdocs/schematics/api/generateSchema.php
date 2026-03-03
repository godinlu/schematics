<?php
require_once ("../config/config.php");
require_once (URL_FPDF);
require_once (URL_SCHEMA_HYDRAULIQUE);

$input_json = file_get_contents("php://input");
$input = json_decode($input_json, true);

$image = $_GET['image'] ?? "schema_hydrau_brut";
$format = $_GET['format'] ?? "png";
$debug = $_GET['debug'] ?? false;

switch (strtolower($image)){
    case "schema_hydrau_brut":
        $gd_image = generate_hydraulic_base_diagram($input);
        break;
    case 'schema_hydrau_annote':
        $gd_image = generate_hydraulic_base_diagram($input);
        $gd_image = add_header_and_footer_on_base($gd_image, $input);
        break;
    case 'schema_hydrau_complet':
        $gd_image = generate_hydraulic_base_diagram($dataForm->getFormulaire());
        $gd_image = add_header_and_footer_on_base($gd_image, $dataForm->getFormulaire());
        $gd_image = add_legend_equipments($gd_image, $dataForm->getFormulaire());
        break;
    case 'schema_exe':
        require_once(URL_SCHEMA_EXE);
        $schema = new SchemaExe($dataForm->getFormulaire());
        $gd_image = $schema->get_img();
        break;
    case 'etiquetage':
        require_once(URL_ETIQUETAGE);
        $schema = new Etiquetage($dataForm->getFormulaire());
        $gd_image = $schema->get_img();
        break;
    case 'fiche_prog':
        require_once(URL_FICHE_PROG);
        $schema = new ImageFicheProg($dataForm->getFormulaire(), $dataForm->getFiche_prog());
        $gd_image = $schema->get_img();
        break;
    default:
        throw new Exception("Invalid image name : $image");
        break;
}
switch (strtolower($format)){
    case "png":
        header('Content-Type: image/png');
        imagepng($gd_image);
        exit;
    case "pdf":
        $pdf = new FPDF(); // taille image
        add_img_to_pdf($gd_image, $pdf);

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="schema_'.$image.'.pdf"');
        echo $pdf->Output('S'); // output en string pour header
        exit;

    default:
        throw new Exception("Invalid image format : " . $format);
        break;
}


?>
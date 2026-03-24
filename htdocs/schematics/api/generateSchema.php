<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/functions/images/SchemaHydrau.php';
require_once __DIR__ . '/../includes/functions/images/ImageFicheProg.php';
require_once __DIR__ . '/../includes/functions/images/SchemaExe.php';
require_once __DIR__ . '/../includes/functions/images/Etiquetage.php';
require_once __DIR__ . '/../includes/libs/fpdf/fpdf.php';

$input_json = file_get_contents("php://input");
$input = json_decode($input_json, true);

$image = $_GET['image'] ?? "schema_hydrau_brut";
$format = $_GET['format'] ?? "png";

switch (strtolower($image)){
    case "schema_hydrau_brut":
        $gd_image = generate_hydraulic_base_diagram($input);
        break;
    case 'schema_hydrau_annote':
        $gd_image = generate_hydraulic_base_diagram($input);
        $gd_image = add_header_and_footer_on_base($gd_image, $input);
        break;
    case 'schema_hydrau_complet':
        $gd_image = generate_hydraulic_base_diagram($input);
        $gd_image = add_header_and_footer_on_base($gd_image, $input);
        $gd_image = add_legend_equipments($gd_image, $input);
        break;
    case 'schema_exe':
        $schema = new SchemaExe($input);
        $gd_image = $schema->get_img();
        break;
    case 'etiquetage':
        $schema = new Etiquetage($input);
        $gd_image = $schema->get_img();
        break;
    case 'fiche_prog':
        $gd_image = generate_fiche_prog_img($input);
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
        header('Content-Disposition: inline; filename="'.$image.'.pdf"');
        echo $pdf->Output('S'); // output en string pour header
        exit;

    default:
        throw new Exception("Invalid image format : " . $format);
        break;
}


?>
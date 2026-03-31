<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/functions/images/HydraulicSchema.php';
require_once __DIR__ . '/../includes/functions/images/ImageFicheProg.php';
require_once __DIR__ . '/../includes/functions/images/SchemaExe.php';
require_once __DIR__ . '/../includes/functions/images/Etiquetage.php';
require_once __DIR__ . '/../includes/libs/fpdf/fpdf.php';

// get the input json
$input_json = file_get_contents("php://input");
$input = json_decode($input_json, true);

// read the formulaire and the fiche_prog
$formulaire = $input['formulaire'];
$fiche_prog = $input['fiche_prog'];

// 1. create the full schema hydrau
$img_hydrau = (new HydraulicSchema($formulaire, IMG_DIR . "schema_hydro/"))->full()->render();

// 2. create the schemaExe
$schema_exe = new SchemaExe($formulaire);  
$img_exe = $schema_exe->get_img();

// 3. create the etiquetage
$etiquetage = new Etiquetage($formulaire);
$img_etiquetage = $etiquetage->get_img();

// 4. create the fiche prog
$img_fiche_prog = generate_fiche_prog_img($fiche_prog);

// Create the PDF
$pdf = new FPDF();

add_img_to_pdf($img_hydrau, $pdf);
add_img_to_pdf($img_exe, $pdf);
add_img_to_pdf($img_etiquetage, $pdf);
add_img_to_pdf($img_fiche_prog, $pdf);

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="dossier.pdf"');
echo $pdf->Output('S');

?>
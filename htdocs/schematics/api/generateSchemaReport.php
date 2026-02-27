<?php
require_once('../config/config.php');
require_once(URL_FPDF);
require_once(URL_SCHEMA_HYDRAULIQUE);
require_once (URL_SCHEMA_EXE);
require_once (URL_ETIQUETAGE);
require_once (URL_IMAGE_FICHE_PROG);    
require_once (URL_DATA_FORM);

session_start();
$dataForm = new DataForm;

// 1. create the full schema hydrau
$img_hydrau = generate_hydraulic_base_diagram($dataForm->getFormulaire());
$img_hydrau = add_header_and_footer_on_base($img_hydrau, $dataForm->getFormulaire());
$img_hydrau = add_legend_equipments($img_hydrau, $dataForm->getFormulaire());

// 2. create the schemaExe
$schema_exe = new SchemaExe($dataForm->getFormulaire());  
$img_exe = $schema_exe->get_img();

// 3. create the etiquetage
$etiquetage = new Etiquetage($dataForm->getFormulaire());
$img_etiquetage = $etiquetage->get_img();

// 4. create the fiche prog
$fp = new ImageFicheProg($dataForm->getFormulaire(), $dataForm->getFiche_prog());
$img_fiche_prog = $fp->get_img();


// Create the PDF
$pdf = new FPDF();

add_img_to_pdf($img_hydrau, $pdf);
add_img_to_pdf($img_exe, $pdf);
add_img_to_pdf($img_etiquetage, $pdf);
add_img_to_pdf($img_fiche_prog, $pdf);

header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="dossier'.$dataForm->getFormulaire()[FORM_NOM_AFFAIRE].'.pdf"');
echo $pdf->Output('S');

?>
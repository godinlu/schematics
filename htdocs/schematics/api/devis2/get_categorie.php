<?php
require_once ("../../config/config.php");
require_once URL_DEVIS_DATA_IMPORTER;

$data_importer = new DataImporter();

$data = array();

$data["articles"] = $data_importer->get_used_articles();
$data["categories"] = $data_importer->get_all_categorie();

header('Content-Type: application/json');
echo json_encode($data);
?>
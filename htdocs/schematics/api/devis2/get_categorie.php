<?php
require_once '../../models/devis2/data_importer.php';

$data_importer = new DataImporter();

$data = array();

$data["articles"] = $data_importer->get_used_articles();
$data["categories"] = $data_importer->get_all_categorie();

header('Content-Type: application/json');
echo json_encode($data);
?>
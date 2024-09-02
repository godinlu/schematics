<?php
require_once('../includes/vendor/autoload.php');

use PhpOffice\PhpSpreadsheet\IOFactory;

function sheetToJson(PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $worksheet) {
    $data = [];
    $headerRow = $worksheet->getRowIterator()->current();
  
    foreach ($headerRow->getCellIterator() as $cell) {
      $headerValues[] = $cell->getValue();
    }
  
    $rowIterator = $worksheet->getRowIterator();
    $rowIterator->next(); // Skip the header row
  
    while ($rowIterator->valid()) {
      $rowData = [];
      $columnIndex = 0;
      foreach ($rowIterator->current()->getCellIterator() as $cell) {
        $headerValue = $headerValues[$columnIndex];
        $cellValue = $cell->getValue() ?? "";
        $rowData[$headerValue] = $cellValue;

        $columnIndex++;
      }
  
      $data[] = $rowData;
      $rowIterator->next();
    }
  
    return $data;
}

function genererRequeteInsert($tableau) {
    $table = 'Tarif';
    $keys = implode(', ', array_keys($tableau));
    $values = array_map(function($value) {
        if ($value == ''){
            $value = 'NULL';
        }else if (is_string($value)){
            $value = str_replace("'", "''", $value); // Échapper les guillemets simples
            $value = str_replace('"', '\"', $value); // Échapper les guillemets doubles
            $value = "'$value'";
        }
        return $value;
    }, $tableau);
    $values = implode(', ', $values);
    $requete = "INSERT INTO $table ($keys) VALUES ($values);";
    return $requete;
}


$chemin = "../client/includes/devis/tarif.xlsx";
$fichier_tarif = IOFactory::load($chemin);
$feuille = $fichier_tarif->getActiveSheet();

$json_tarif = sheetToJson($feuille);
$sqlFile = 'insertions.sql';
$sql = "";
foreach($json_tarif as $article){
    $requete = genererRequeteInsert($article);

    $sql .= $requete . "\n";
    
}
// Écriture des requêtes INSERT dans le fichier .sql
file_put_contents($sqlFile, $sql);

echo "Les requêtes ont été enregistrées dans le fichier $sqlFile";

?>
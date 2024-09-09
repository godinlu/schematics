<?php
require_once '../models/categorie_manager.php';

$categorie_manager = new CategorieManager();
$categories = $categorie_manager->get_all_categorie();

header('Content-Type: application/json');
echo json_encode($categories);
?>
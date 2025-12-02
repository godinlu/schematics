<?php
require_once '../models/Model.php';

class CategorieManager extends Model{
    public function get_categories(){
        return $this->getAll('Categorie','Article');
    }
}

$categorie_manager = new CategorieManager;
header('Content-Type: application/json');
echo json_encode($categorie_manager->get_categories());

?>
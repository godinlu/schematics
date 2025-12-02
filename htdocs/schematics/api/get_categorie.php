<?php
require_once '../models/Model.php';

class CategorieManager extends Model{
    public function get_categories(){
        return $this->select("SELECT * FROM Categorie");
    }
}

$categorie_manager = new CategorieManager;

// $data = array_values($categorie_manager->get_categories());
// var_dump($data);
// exit;
header('Content-Type: application/json');
echo json_encode($categorie_manager->get_categories());

?>
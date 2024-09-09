<?php
require_once "Model.php";

class CategorieManager extends Model{

    /**
     * renvoie toute les catégories contenu dans la table Categorie,
     * tel qu'elle.
     */
    public function get_all_categorie(){
        $query = "SELECT * FROM Categorie";
        $req = $this->getBdd()->prepare($query);
        $req->execute();
        
        $categories = array();
        // Parcours des résultats et création des objets correspondants
        while($data = $req->fetch(PDO::FETCH_ASSOC)){
            $categories[] = $data;
        }
        return $categories;
    }
}
?>


<?php
// ce fichier contient une classe permettant l'import des données depuis la base
class DataImporter extends Model{

    /**
     * cette fonction renvoie une array d'array représentant les articles 
     * utilisé dans le devis.
     * @return array[]
     */
    public function get_used_articles(): array{
        $query = "SELECT DISTINCT T.ref, T.label, T.prix FROM Tarif T, ArticleCategorie A WHERE A.ref = T.ref";
        return $this->select($query);
    }

    /**
     * cette fonction renvoie une array d'array représentant les catégories.
     * @return array[]
     */
    public function get_all_categorie() : array {
        $query = "SELECT * FROM Categorie";
        return $this->select($query);
    }
}



?>
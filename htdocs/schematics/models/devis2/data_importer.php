<?php
require_once URL_BDD_MODEL;


// ce fichier contient une classe permettant l'import des données depuis la base
class DataImporter extends Model{
    private array $ids_filter;

    public function __construct(array $formulaire = null){
        if (isset($formulaire)){
            // si le formulaire n'est pas null alors on résoud les filtres avec le contenue de celui-ci
            // et on garde seulement l'id des filtre valide
            $this->ids_filter = $this->resolve_filters($formulaire);
        }else{
            // si le formulaire est vide alors on prend tous les ids des filtres
            $this->ids_filter = array_column($this->select("SELECT id FROM Filter"), 'id');
        }
        
    }

    /**
     * cette fonction renvoie une array d'array représentant les articles 
     * utilisé dans le devis, il est important de noté que les articles sont dans l'ordre d'apparition.
     * @return array[]
     */
    public function get_used_articles(): array{
        $str_ids = "('" . implode("', '", $this->ids_filter) . "')";
        $query = "
        SELECT T.ref, T.label, T.prix, A.category_id
        FROM Tarif T, ArticleInfo A, Categorie C
        WHERE T.ref = A.ref AND A.category_id = C.id AND (A.id_filter in $str_ids OR A.id_filter IS NULL)
        ORDER BY C.parent_id ASC, C.priority ASC
        ";
        return $this->select($query);    
    }

    public function get_default_articles(?array $devis_data):array{
        if (isset($devis_data)){
            // si des lignes sont sauvegarder alors on récupère une liste des catégories
            // déjà utilisé pour éviter de les ajouter par défaut
            $edited_articles = array_filter($devis_data, function($article) {
                return isset($article['tag']) && $article['tag'] === 'edited';
            });
            $categs_id = array_column($edited_articles, "categ");
            $refs = array_keys($edited_articles);
            $str_categs_id = "('" . implode("', '", $categs_id) . "')";
            $str_refs = "('" . implode("', '", $refs) . "')";
        }else{
            $str_categs_id = "('')";
            $str_refs = "('')";
        }
        $str_ids = "('" . implode("', '", $this->ids_filter) . "')";
        $query = "
        SELECT T.ref, A.category_id 
        FROM Tarif T, ArticleInfo A, Categorie C 
        WHERE T.ref = A.ref AND A.category_id = C.id 
            AND ((A.id_default_filter in $str_ids AND A.category_id NOT IN $str_categs_id) 
                OR (T.ref in $str_refs))
        ORDER BY C.parent_id ASC, C.priority ASC;
        ";
        return $this->select($query);
    }

    /**
     * cette fonction renvoie une array d'array représentant les catégories.
     * @return array[]
     */
    public function get_all_categorie() : array {
        $query = "SELECT * FROM Categorie ORDER BY priority";
        
        return $this->select($query);
    }

    /**
     * transforme le filtre en boolean avec les informations contenu dans formulaire.
     * Cette fonction est récursive
     * ex de filtre : 
     * -"typeInstallation="SC1Z"" => $formulaire["typeInstallation"] == "SC1Z"
     * -"typeInstallation!=SC1Z" => $formulaire["typeInstallation"] != "SC1Z" 
     * -"filtre1=1&filtre2=2" => $formulaire["filtre1"] == "1" && $formulaire["filtre2"] == "2"
     * symbologies:
     *  - "=": ==
     *  - "!=": !=
     *  - "=/ex/": test avec la regex /ex/
     *  - "&": ajoute une deuxième condition en and
     *  - "|": ajoute une deuxième condition en or
     */
    public function validate_filter(array $formulaire, string $filter): bool{
        // Suppression des espaces en trop
        $filter = trim($filter);
    
        // Gestion des conditions avec opérateurs logiques (AND, OR)
        if (strpos($filter, '&') !== false) {
            // On divise les conditions par le symbole "&" (AND)
            $conditions = explode('&', $filter);
            foreach ($conditions as $condition) {
                if (!$this->validate_filter($formulaire, $condition)) {
                    return false;
                }
            }
            return true;
        }
    
        if (strpos($filter, '|') !== false) {
            // On divise les conditions par le symbole "|" (OR)
            $conditions = explode('|', $filter);
            foreach ($conditions as $condition) {
                if ($this->validate_filter($formulaire, $condition)) {
                    return true;
                }
            }
            return false;
        }
    
        // Gestion des conditions d'inégalité (!=)
        if (strpos($filter, '!=') !== false) {
            list($field, $value) = explode('!=', $filter, 2);
            return isset($formulaire[trim($field)]) && $formulaire[trim($field)] != trim(trim($value), '"');
        }
    
        // Gestion des conditions d'égalité (== ou =)
        if (strpos($filter, '=') !== false) {
            list($field, $value) = explode('=', $filter, 2);
    
            // Supprimer les guillemets autour de la valeur si présents
            $value = trim(trim($value), '"');
    
            // Cas particulier : si la valeur est une regex (commence et se termine par des "/")
            if (preg_match('/^\/.*\/$/', $value)) {
                $regex = trim($value, '/');
                return isset($formulaire[trim($field)]) && preg_match('/' . $regex . '/', $formulaire[trim($field)]);
            }
    
            // Sinon, comparateur simple d'égalité
            return isset($formulaire[trim($field)]) && $formulaire[trim($field)] == $value;
        }
    
        return false; // Par défaut, on retourne false si aucun filtre valide n'est trouvé
    }

    /**
     * Cette methode importe tous les filtres de la base filter puis les résous tous
     * et renvoie une liste d'id des filtres valide.
     */
    private function resolve_filters(array $formulaire): array{
        $filters = $this->select("SELECT * FROM Filter");
        $ids = array();
        foreach ($filters as $filter) {
            if ($filter["type"] === "basic" && $this->validate_filter($formulaire, $filter["filter"])){
                $ids[] = $filter["id"];
            }
        }
        return $ids;
    }

    /**
     * Cette fonction ajoute la colone list_priority qui représente une liste 
     * permettant de connaitre l'ordre 
     */
    private function add_category_priorities_in_place(array &$categories) {
        $categoryById = [];

        // Indexer les catégories par leur id pour faciliter la recherche
        foreach ($categories as &$category) {
            $categoryById[$category['id']] = &$category;
        }

        // Fonction pour construire le chemin de priorités et l'ajouter dans chaque catégorie
        foreach ($categories as &$category) {
            $path = [];
            $current = $category;

            // Remonter dans la hiérarchie parent-enfant pour construire le chemin
            while ($current !== null) {
                array_unshift($path, $current['priority']); // Ajouter la priorité au début
                $current = isset($current['parent_id']) ? $categoryById[$current['parent_id']] : null;
            }

            // Ajouter la colonne list_priority à la catégorie
            $category['list_priority'] = $path;
        }
    }
}



?>
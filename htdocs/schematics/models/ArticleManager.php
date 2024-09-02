<?php
require_once "Model.php";
require_once "Article.php";

class ArticleManager extends Model{
    /**
     * renvoie un tableau associatif pour chaque catégorie d'article
     */
    public function getUsedArticles(){
        $whereClauses = "famille != :famille";
        $data = ['famille' => 'inutiliser'];
        return $this->getAll('Tarif','Article',$data, $whereClauses);
    }

    public function getAllArticles(){
        return $this->getAll('Tarif','Article');
    }

    public function updateArticleByRef(string $ref, string|null $label, float $prix):int{
        $article = $this->getArticleByRef($ref);
        $prix = round($prix, 2);
        if (!isset($article)) return -1;

        //CAS OU L'ARTICLE EST PRESENT DANS LA BASE
        if ($article->getLabel() == $label && $article->getPrix() == $prix){
            //CAS OU L'ARTICLE EST DEJA A JOUR
            return 0;
        }else{
            //CAS OU IL FAUT METTRE A JOUR L'ARTICLE
            $data = ['label' => $label , 'prix' => $prix];
            $whereClauses = array("ref" => $ref);
            $this->update('Tarif' , $data , $whereClauses);
            return 1;
        }

    }

    public function insertArticle(string $ref, string|null $label, float $prix):int{
        return $this->insert('Tarif',array(
            "ref" => $ref,
            "label" => $label,
            "prix" => $prix,
            "famille" => 'inutiliser',
            "filtre1" => NULL, 
            "filtre2" => NULL, 
            "filtre3" => NULL,
            "filtre4" => NULL,
            "filtre5" => NULL,
            "filtre6" => NULL,
        ));
    }

    private function getArticleByRef(string $ref): Article|null{
        $data = ['ref' => $ref];
        $articles = $this->getAll('Tarif','Article',$data);
        if (empty($articles)){
            return null;
        }else{
            return $articles[0];
        }
    }

    public function getNbArticles():int{
        return $this->countElements('Tarif');
    }
}
?>
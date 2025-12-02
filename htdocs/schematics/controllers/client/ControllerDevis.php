<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');

class CategorieManager extends Model{
    public function get_categories(){
        return $this->select("SELECT * FROM Categorie");
    }
}

class ArticleCategorieManager extends Model{
    public function get_article_categories(){
        return $this->select("SELECT * FROM ArticleCategorie");
    }
}

class TarifManager extends Model{
    public function get_articles(){
        return $this->select("SELECT * FROM Tarif");
    }
}

class ControllerDevis
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->devis();
        
    }


    private function devis(){

      session_start();
      $dataForm = new DataForm;
      $formulaire = $dataForm->getFormulaire();
      if (!isset($formulaire)){
        header('Location: formulaire');
        exit;
      }
      $categorie_manager = new CategorieManager;
      $article_categorie_manager = new ArticleCategorieManager;
      $tarif_manager = new TarifManager;

      $this->_view = new View('Devis');
      $this->_view->generate(array(
        "categories" => $categorie_manager->get_categories(),
        "article_categories" => $article_categorie_manager->get_article_categories(),
        "articles" => $tarif_manager->get_articles()
      ));
    }
}

?>
<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');

class CatalogueManager extends Model {

    /**
     * Retourne les catégories avec une priorité absolue
     */
    public function get_categories() {
        return $this->select("SELECT * FROM category ORDER BY priority");
    }

    /**
     * Retourne les articles triés selon la priorité absolue
     * de leur catégorie
     */
    public function get_articles() {
        $articles = $this->select("
            SELECT a.ref, a.label, a.prix, a.category_id
            FROM article a
            INNER JOIN category c
                ON a.category_id = c.id
            ORDER BY c.priority, a.prix
        ");

        $priority = 1;

        foreach ($articles as &$article) {
            $article['priority'] = $priority;
            $priority++;
        }

        unset($article); // bonne pratique avec les références

        return $articles;
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

      $catalogue_manager = new CatalogueManager;

      $this->_view = new View('Devis');
      $this->_view->generate(array(
        "categories" => $catalogue_manager->get_categories(),
        "articles" => $catalogue_manager->get_articles(),
        "formulaire" => $formulaire,
        "devis_saved" => $dataForm->getDevis()
      ));
    }
}

?>
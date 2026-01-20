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


    public function get_articles(){
        $article_category = $this->select("
            SELECT a.ref, a.label, a.prix, ac.category_id
            FROM category_article ac
            INNER JOIN article a ON a.ref = ac.article_ref
            INNER JOIN category c ON c.id = ac.category_id
            ORDER BY c.priority, a.prix
        ");

        $priority = 1;

        foreach ($article_category as &$row) {
            $row['priority'] = $priority;
            $priority++;
        }

        unset($row); // bonne pratique avec les références

        return $article_category;
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
        "devis_tables" => array(
            "categories" => $catalogue_manager->get_categories(),
            "articles" => $catalogue_manager->get_articles(),
        ),
        "formulaire" => $formulaire,
        "devis_saved" => $dataForm->getDevis()
      ));
    }
}

?>
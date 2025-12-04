<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');

class CategorieManager extends Model{
    public function get_categories(){
        return $this->select("SELECT * FROM Categorie");
    }
}

class TarifManager extends Model{
    public function get_articles(){
        $query = "  SELECT 
                        A.ref, 
                        A.label, 
                        A.prix, 
                        A.categorie_id,
                        ROW_NUMBER() OVER (ORDER BY C.parent_id ASC, C.priority ASC) AS priority
                    FROM Article A
                    JOIN Categorie C ON A.categorie_id = C.id
                    ORDER BY C.parent_id ASC, C.priority ASC";
        return $this->select($query);
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
      $tarif_manager = new TarifManager;

      $this->_view = new View('Devis');
      $this->_view->generate(array(
        "categories" => $categorie_manager->get_categories(),
        "articles" => $tarif_manager->get_articles()
      ));
    }
}

?>
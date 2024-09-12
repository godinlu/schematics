<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');
require_once URL_DEVIS_DATA_IMPORTER;

//use PhpOffice\PhpSpreadsheet\IOFactory;

class ControllerDevis2
{
    private $_view;
    private $_articleManager;

    public function __construct($url)
    {
        if (isset($url))
          $this->devis();
            
        
    }


    private function devis(){

      session_start();
      $data_form = new DataForm;
      $formulaire = $data_form->getFormulaire();
      var_dump($data_form->get_devis2());
      if (!isset($formulaire)){
        header('Location: formulaire');
        exit;
      }

      $data_importer = new DataImporter();

      $articles = $data_importer->get_used_articles();
      $categories = $data_importer->get_all_categorie();

      // on récupère les catégories de bases du devis
      $base_categories = array_filter($categories, fn($row) => $row['parent_id'] === 0);

      $this->_view = new View('Devis2');
      $this->_view->generate(array(
          'articles' => $articles,
          'formulaire' => $formulaire,
          'categories' => $categories,
          'base_categories' => $base_categories
      ));
    }
}

?>
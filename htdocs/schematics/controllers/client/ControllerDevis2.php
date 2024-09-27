<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');
require_once URL_DEVIS_DATA_IMPORTER;

//use PhpOffice\PhpSpreadsheet\IOFactory;

class ControllerDevis2
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url))
          $this->devis();
            
        
    }

    private function devis(){

      session_start();
      $data_form = new DataForm;
      $formulaire = $data_form->getFormulaire();
      if (!isset($formulaire)){
        header('Location: formulaire');
        exit;
      }
      $devis_data = $data_form->get_devis2();
      $data_importer = new DataImporter($formulaire);

      $articles = $data_importer->get_used_articles();
      $categories = $data_importer->get_all_categorie();
      $default_articles = $data_importer->get_default_articles();

      $this->_view = new View('Devis2');
      $this->_view->generate(array(
          'articles' => $articles,
          'default_articles' => $default_articles,
          'categories' => $categories,
          'devis_data' => $devis_data
      ));
    }
}

?>
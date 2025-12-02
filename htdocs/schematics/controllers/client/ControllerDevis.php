<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');

//use PhpOffice\PhpSpreadsheet\IOFactory;

class ControllerDevis
{
    private $_view;
    private $_articleManager;

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
      $data_importer = new DataImporter($formulaire);

      $this->_view = new View('Devis');
      $this->_view->generate(array(
      ));
    }
}

?>
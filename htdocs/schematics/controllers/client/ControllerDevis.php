<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');

require_once (URL_REPOS . "ArticleCategoryRepository.php");

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

      $article_category_repo = new ArticleCategoryRepository;

      $this->_view = new View('Devis');
      $this->_view->generate(array(
        "devis_tables" => array(
            "categories" => $article_category_repo->get_categories(),
            "articles" => $article_category_repo->get_articles_sorted(),
        ),
        "formulaire" => $formulaire,
        "devis_saved" => $dataForm->getDevis()
      ));
    }
}

?>
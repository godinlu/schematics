<?php 
require_once ('views/View.php');
require_once ('models/ArticleManager.php');
require_once ('models/DataForm.php');

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
      $dataForm = new DataForm;
      $formulaire = $dataForm->getFormulaire();
      if (!isset($formulaire)){
        header('Location: formulaire');
        exit;
      }
      //cette partie sert uniquement pour le développement afin d'avoir accès à la base de donné même sur le serveur
      //de teste
      if ($_SERVER['SERVER_NAME'] === 'localhost'){
        // Effectue les requêtes GET
        $tarif = file_get_contents("https://www.solisart.fr/schematics/api/getTarif.php");
        $categories = file_get_contents("https://www.solisart.fr/schematics/api/get_categorie.php");
        
        // Vérifier si la requête a réussi
        if (!$tarif || !$categories) {
          throw new Exception("erreur les requêtes api n'ont pas abouti.");
        }

      }else{
        $this->_articleManager = new ArticleManager;
        //on récupère les articles utilisé
        $articles = $this->_articleManager->getAllArticles();
        //ensuite on transforme l'array d'articles en array d'array
        foreach($articles as &$article){
          $article = $article->toArray();
        }
        $articles = json_encode($articles);
        unset($article);
      }

      // on récupère les catégories de bases du devis
      $base_categories = array_filter(json_decode($categories, true), fn($row) => $row['parent_id'] === 0);

      $this->_view = new View('Devis2');
      $this->_view->generate(array(
          'articles' => $tarif,
          'formulaire' => $formulaire,
          'categories' => $categories,
          'base_categories' => $base_categories
      ));
    }
}

?>
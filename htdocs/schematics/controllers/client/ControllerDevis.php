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
      //cette partie sert uniquement pour le développement afin d'avoir accès à la base de donné même sur le serveur
      //de teste
      if ($_SERVER['SERVER_NAME'] === 'localhost'){
        $url = "https://dev.solisart.fr/schematics/api/getTarif.php";

        // Effectuer la requête GET
        $response = file_get_contents($url);
        // Vérifier si la requête a réussi
        if ($response !== false) {
          // Traitement de la réponse
          $articles = $response;
        } else {
          // Gérer l'erreur de la requête
          throw new Exception("erreur l'api getTarif.php n'a pas été trouvé");
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
      
      $devis_index = $dataForm->getDevis()->getDevisIndex();
      $default_devis_index = $dataForm->getDevis()->getDefaultDevisIndex();

      $this->_view = new View('Devis');
      $this->_view->generate(array(
        'articles' => $articles,
        'formulaire' => $formulaire,
        'devis_index' => $devis_index,
        'default_devis_index' => $default_devis_index
      ));
    }
}

?>
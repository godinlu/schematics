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


    private function get_articles_in_devis(array $articles, array $default_articles, ?array $devis_data){
      if (!isset($devis_data)) return $default_articles;
      
      $articles_in_devis = $default_articles;

      // la première étape est de modifier la quantité (si modifié)
      // des articles par défaut
      foreach ($devis_data as $ref => $value) {
        foreach($articles_in_devis as $i => $article){
          if ($ref === $article["ref"] && in_array($value["tag"], ["edited","default"])){
            $articles_in_devis[$i]["tag"] = $value["tag"];
            $articles_in_devis[$i]["qte"] = intval($value["qte"]);
          }
        }
        if ($value["tag"] === "added"){
          $new_article = array(
            "ref" => $ref, "category_id" => intval($value["categ"]),
            "tag" => $value["tag"], "qte" => intval($value["qte"])
          );
          $articles_in_devis[] = $new_article;
        }
      }
      return $articles_in_devis;
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
      $default_articles = $data_importer->get_default_articles($devis_data);

      $articles_in_devis = $this->get_articles_in_devis($articles, $default_articles, $devis_data);

      // on récupère les catégories de bases du devis
      $base_categories = array_filter($categories, fn($row) => $row['parent_id'] === 0);

      $this->_view = new View('Devis2');
      $this->_view->generate(array(
          'articles' => $articles,
          'articles_in_devis' => $articles_in_devis,
          'formulaire' => $formulaire,
          'categories' => $categories,
          'base_categories' => $base_categories
      ));
    }
}

?>
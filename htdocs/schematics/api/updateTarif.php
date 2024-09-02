<?php
require_once "../models/ArticleManager.php";

try{
    if ($_SERVER['REQUEST_METHOD'] != 'POST'){
        throw new Exception("Méthode non autorisée", 405);
    } 
    // Récupération du JSON envoyé depuis le script Python
    $json = file_get_contents('php://input');
    if (!$json){
        throw new Exception("Aucune donné json trouvé",412);
    }

    // Décodage du JSON en tableau associatif
    $json = str_replace('\u0094', '”', $json);
    $json = str_replace('\u0092', '\'', $json);
    $json = str_replace('\u0099', '™', $json);
    $json = str_replace('\u0091', '‘', $json);
    $data = json_decode($json, true);    
    if (!isset($data)){
        throw new Exception("Format json invalide",422);
    }

    //test si les données json contienne bien les bons attributs
    $test_row = $data[0];
    if (!isset($test_row['ref']) || !is_string($test_row['ref'])){
        throw new Exception("Donné manquante : ref",422);
    }
    if (!isset($test_row['label']) || !is_string($test_row['label'])){
        throw new Exception("Donné manquante : label",422);
    }
    if (!isset($test_row['prix']) || !is_numeric($test_row['prix'])){
        throw new Exception("Donné manquante : prix",422);
    }

    //toute les données sont bien présente on commence donc la modification du fichier de tarif
    $article_manager = new ArticleManager;
    $compteur = [
        'articles insérés' => [],
        'articles déjà à jour' => [],
        'articles mis à jour' => []
    ];
    foreach($data as $objet){
        $res = $article_manager->updateArticleByRef($objet['ref'], $objet['label'] , $objet['prix']);


        if ($res === -1){
            $article_manager->insertArticle($objet['ref'], $objet['label'] , $objet['prix']);
            array_push($compteur['articles insérés'] ,$objet['ref'] );
        }else if ($res === 0){
            array_push($compteur['articles déjà à jour'] ,$objet['ref'] );
        }else if ($res === 1){
            array_push($compteur['articles mis à jour'] ,$objet['ref'] );
        }
    }

    // Envoyer la réponse
    http_response_code(200); // OK
    echo "\nRésultat de la mise à jour du tarif\n\n";
    echo "Nombre d'articles envoyés : ". count($data) . "\n";
    echo "Nombre d'articles dans la base de données : ". $article_manager->getNbArticles() . "\n";
    foreach($compteur as $key => $refs){
        echo "\n\t-$key (".count($refs).")\n";
        if ($key !== "articles déjà à jour"){
            foreach($refs as $ref){
                echo $ref."   ";
            }
        }
    }
    echo "Mise à jour effectué avec succès";

}catch (Exception $e){
    $errorCode = $e->getCode();

    // Conversion manuelle de certaines erreurs PDO courantes en codes HTTP appropriés
    if ($errorCode === '23000') { // Violation de contrainte d'intégrité
        $errorCode = 400; // Code HTTP pour une mauvaise requête
    } elseif ($errorCode === 'HY000') { // Erreur générique du pilote PDO
        $errorCode = 500; // Code HTTP pour une erreur interne du serveur
    }

    if (is_string($errorCode)) $errorCode = 500;
    http_response_code($errorCode);
    echo "Erreur : " . $e->getMessage();
}

?>
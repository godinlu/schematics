<?php
require_once '../models/ArticleManager.php';

$article_manager = new ArticleManager;
$articles = $article_manager->getAllArticles();

//ensuite on transforme l'array d'articles en array d'array
foreach($articles as &$article){
    $article = $article->toArray();
}
unset($article);
header('Content-Type: application/json');
echo json_encode($articles);
?>
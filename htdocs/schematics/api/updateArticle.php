<?php
require_once ("../config/config.php");
require_once (URL_REPOS . "ArticleCategoryRepository.php");

// Définir le type de réponse JSON
header('Content-Type: application/json; charset=utf-8');

const MANDATORY_KEYS = ["CODE ARTICLE", "PV", "LIBELLE"];

try {
    // Vérifier que la requête est bien en POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405); // Méthode non autorisée
        echo json_encode(['error' => 'Method not allowed. Use POST.']);
        exit;
    }

    // Lire le JSON envoyé par le client
    $json = file_get_contents('php://input');
    if (!$json) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'No JSON data received.']);
        exit;
    }

    // Décoder le JSON
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(422); // Unprocessable Entity
        echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Vérification des clés de chaque items + formattage attendue pour la BD
    $valid_items = [];
    foreach($data as $item){
        foreach(MANDATORY_KEYS as $key){
            if (!array_key_exists($key, $item)){
                http_response_code(422);
                echo json_encode(['error' => "Missing mandatory key : $key"]);
                exit;
            }
        }
        $valid_items[] = [
            'ref' => $item['CODE ARTICLE'],
            'prix' => floatval($item['PV']),
            'label' => $item['LIBELLE'],
            'is_used' => true
        ];
    }

    $article_category_repo = new ArticleCategoryRepository;


    // Récupérer les articles existants dans la bd
    $existing_articles = $article_category_repo->get_articles();
    $existing_refs = array_flip(array_column($existing_articles, 'ref'));

    // Séparer les articles nouveaux de ceux déjà existants
    $new_items = array_filter($valid_items, fn($item) => !isset($existing_refs[$item['ref']]));
    $existing_items = array_filter($valid_items, fn($item) => isset($existing_refs[$item['ref']]));

    // mettre tous les articles à is_used = 0
    $article_category_repo->disable_all_articles();

    // --- Insertion batch des nouveaux articles ---
    $insert_count = 0;
    if (!empty($new_items)) {
        $insert_count = $article_category_repo->insert_articles_batch($new_items);
    }

    // --- Mise à jour batch des articles existants ---
    $update_count = 0;
    if (!empty($existing_items)) {
        $update_count = $article_category_repo->update_articles_batch($existing_items);
    }

    // Exemple de traitement (à remplacer par ta logique métier)
    $response = [
        'message' => 'Data processed successfully',
        'insert_count' => $insert_count,
        'update_count' => $update_count
    ];

    // Répondre avec succès
    http_response_code(200);
    echo json_encode($response, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    // Gestion générale des exceptions
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage()
    ]);
}
?>

<?php
require_once ("../config/config.php");
require_once (APP_BASE_PATH . 'models/SchematicsDatabase.php');

// ------------------------
// CONFIGURATION DE SÉCURITÉ
// ------------------------
// Clé API simple pour limiter l'accès
$API_KEY = 'b7f3c9d2a8e44c1f'; // à générer et conserver confidentiellement

// Vérifier que la clé est fournie en header
if (!isset($_GET['api_key']) || $_GET['api_key'] !== $API_KEY) {
    http_response_code(401);
    echo json_encode(["error" => "Accès non autorisé"]);
    exit;
}

$includeArticles = isset($_GET['include_articles']) && $_GET['include_articles'] == '1';

try {
    $pdo = SchematicsDatabase::getConnection();

    if ($includeArticles){
        $query = "
            SELECT 
                CONCAT(d.reference, IF(d.version > 1, CONCAT('-V', d.version), '')) AS reference,
                d.date_devis,
                d.affaire,
                d.installateur_entreprise,
                d.type_devis,
                d.cout_total_ht AS devis_cout_total_ht,
                d.cout_total_ttc AS devis_cout_total_ttc,
                d.taux_remise AS devis_taux_remise,
                d.taux_tva,
                d.code_tva,
                d.objet,
                d.installateur_nom_prenom,
                d.installateur_mail,
                d.affaire_suivie_par,
                d.mode_reglement,
                d.validite,
                d.delai_livraison,
                
                dl.article_ref AS ligne_article_ref,
                dl.prix_tarif AS ligne_prix_tarif,
                dl.taux_remise AS ligne_taux_remise,
                dl.quantite AS ligne_quantite,
                dl.cout_total_ht AS ligne_cout_total_ht

            FROM devis_genere d
            INNER JOIN devis_ligne dl
                ON dl.id_devis = d.id;
        ";
    }else{
        $query = "
            SELECT 
                CONCAT(d.reference, IF(d.version > 1, CONCAT('-V', d.version), '')) AS reference,
                d.date_devis,
                d.affaire,
                d.installateur_entreprise,
                d.type_devis,
                d.cout_total_ht AS devis_cout_total_ht,
                d.cout_total_ttc AS devis_cout_total_ttc,
                d.taux_remise AS devis_taux_remise,
                d.taux_tva,
                d.code_tva,
                d.objet,
                d.installateur_nom_prenom,
                d.installateur_mail,
                d.affaire_suivie_par,
                d.mode_reglement,
                d.validite,
                d.delai_livraison

            FROM devis_genere d;
        ";
    }

    // Récupérer les devis et éventuellement les lignes
    $stmt = $pdo->query($query);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Définir l’en-tête CSV
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=devis_export.csv');

    $output = fopen('php://output', 'w');

    if (count($rows) > 0) {
        // Ajouter les titres
        fputcsv($output, array_keys($rows[0]));

        // Ajouter les données
        foreach ($rows as $row) {
            fputcsv($output, $row);
        }
    }

    fclose($output);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
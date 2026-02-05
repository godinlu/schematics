<?php
require_once ("../config/config.php");
require_once (APP_BASE_PATH . 'models/SchematicsDatabase.php');

header('Content-Type: application/json');

$required_fields = [
    'affaire',
    'installateur_entreprise',
    'lignes'
];

try{
    // se connecter à la base de donnée
    $pdo = SchematicsDatabase::getConnection();

    // Lire le JSON
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) throw new Exception("Données JSON invalides");

    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Champ obligatoire manquants : $field");
        }
    }

    $affaire = $data['affaire'];
    $installateur = $data['installateur_entreprise'];

    // Commencer transaction
    $pdo->beginTransaction();

    // 1. Vérifier s'il existe déjà un devis pour cette affaire + installateur
    $stmt = $pdo->prepare("
        SELECT reference, MAX(version) as last_version
        FROM devis_genere
        WHERE affaire = ? AND installateur_entreprise = ?
        GROUP BY reference
        ORDER BY last_version DESC
        LIMIT 1
    ");
    $stmt->execute([$affaire, $installateur]);
    $last = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($last && $last['reference']) {
        // Même référence, nouvelle version
        $reference = $last['reference'];
        $version = intval($last['last_version']) + 1;
    } else {
        // Nouvelle référence racine
        $stmt = $pdo->query("SELECT COUNT( DISTINCT reference) FROM devis_genere WHERE YEAR(date_generation) = YEAR(CURDATE())");
        $count = $stmt->fetchColumn() + 1;
        $reference = sprintf("REF-%d-%05d", date("Y"), $count);
        $version = 1;
    }


    $stmt = $pdo->prepare("
        INSERT INTO devis_genere (
            reference, version, date_devis, affaire, installateur_entreprise,
            type_devis, cout_total_ht, cout_total_ttc, taux_remise, taux_tva, code_tva,
            objet, installateur_nom_prenom, installateur_mail,
            affaire_suivie_par, mode_reglement, validite, delai_livraison
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $reference,
        $version,
        $data['date_devis'] ?? null,         // null => la BD prend la valeur par défaut
        $affaire,
        $installateur,
        $data['type_devis'] ?? null,
        $data['cout_total_ht'] ?? null,                          // toujours calculé
        $data['cout_total_ttc'] ?? null,
        $data['taux_remise'] ?? null,
        $data['taux_tva'] ?? null,
        $data['code_tva'] ?? null,
        $data['objet'] ?? null,
        $data['installateur_nom_prenom'] ?? null,
        $data['installateur_mail'] ?? null,
        $data['affaire_suivie_par'] ?? null,
        $data['mode_reglement'] ?? null,
        $data['validite'] ?? null,
        $data['delai_livraison'] ?? null
    ]);

    $pdo->commit();

    $fullReference = $reference;
    if ($version > 1) {
        $fullReference .= "-V" . $version;
    }

    echo json_encode([
        "success" => true,
        "reference" => $fullReference
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>

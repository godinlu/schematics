<?php
require_once ("../config/config.php");
require_once (APP_BASE_PATH . 'models/SchematicsDatabase.php');

header('Content-Type: application/json');

try{
    // se connecter à la base de donnée
    $pdo = SchematicsDatabase::getConnection();

    // Lire le JSON
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) throw new Exception("Données JSON invalides");
    if (empty($data['objet']) || empty($data['lignes'])) {
        throw new Exception("Champs obligatoires manquants");
    }

    // Générer référence automatique
    $stmt = $pdo->query("SELECT COUNT(*) FROM devis_genere WHERE YEAR(date_generation) = YEAR(CURDATE())");
    $count = $stmt->fetchColumn() + 1;
    $reference = sprintf("DEV-%d-%05d", date("Y"), $count);

    // Commencer transaction
    $pdo->beginTransaction();

    // Insérer le devis
    $stmt = $pdo->prepare("
        INSERT INTO devis_genere (
            date_generation, reference, objet, cout_total, taux_remise, nom_commercial, statut,
            client_prenom, client_nom, client_mail, client_code_postal, client_ville,
            installateur_societe, installateur_prenom_nom, installateur_mail
        ) VALUES (
            DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    ");

    $stmt->execute([
        $reference,
        $data['objet'],
        $data['cout_total'],
        $data['taux_remise'] ?? 0,
        $data['nom_commercial'] ?? null,
        $data['statut'] ?? 'brouillon',
        $data['client']['prenom'] ?? null,
        $data['client']['nom'] ?? null,
        $data['client']['mail'] ?? null,
        $data['client']['code_postal'] ?? null,
        $data['client']['ville'] ?? null,
        $data['installateur']['societe'] ?? null,
        $data['installateur']['prenom_nom'] ?? null,
        $data['installateur']['mail'] ?? null
    ]);

    $devisId = $pdo->lastInsertId();


    // Insérer les lignes
    $stmt = $pdo->prepare("
        INSERT INTO devis_ligne (id_devis, article_ref, prix_tarif, taux_remise, quantite, cout_total)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($data['lignes'] as $ligne) {
        $stmt->execute([
            $devisId,
            $ligne['article_ref'],
            $ligne['prix_tarif'],
            $ligne['taux_remise'],
            $ligne['quantite'],
            $ligne['cout_total']
        ]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "reference" => $reference
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>

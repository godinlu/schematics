<?php
require_once ROOT_PATH . 'includes/functions/db/SchematicsDatabase.php';

class DevisController {

    private array $required_fields = ['affaire', 'installateur_entreprise', 'lignes'];

    /**
     * Crée un nouveau devis.
     * Route : POST /api/devis
     */
    public function create(): void {
        $data = readJsonBody();

        foreach ($this->required_fields as $field) {
            if (empty($data[$field])) {
                respond(422, ['error' => "Champ obligatoire manquant : $field"]);
            }
        }

        if (!is_array($data['lignes']) || count($data['lignes']) === 0) {
            respond(422, ['error' => 'Le devis doit contenir au moins une ligne']);
        }

        try {
            $pdo = SchematicsDatabase::getConnection();
            $pdo->beginTransaction();

            [$reference, $version] = $this->resolveReference($pdo, $data['affaire'], $data['installateur_entreprise']);

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
                $data['date_devis'] ?? null,
                $data['affaire'],
                $data['installateur_entreprise'],
                $data['type_devis'] ?? null,
                $data['cout_total_ht'] ?? null,
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
                $data['delai_livraison'] ?? null,
            ]);

            $id_devis = $pdo->lastInsertId();

            $stmtLigne = $pdo->prepare("
                INSERT INTO devis_ligne (id_devis, article_ref, prix_tarif, taux_remise, quantite, cout_total_ht)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            foreach ($data['lignes'] as $index => $ligne) {
                if (empty($ligne['article_ref']) || !isset($ligne['prix_tarif'], $ligne['quantite'], $ligne['cout_total_ht'])) {
                    throw new Exception("Ligne invalide à l'index $index");
                }
                $stmtLigne->execute([
                    $id_devis,
                    $ligne['article_ref'],
                    $ligne['prix_tarif'],
                    $ligne['taux_remise'] ?? 0,
                    $ligne['quantite'],
                    $ligne['cout_total_ht'],
                ]);
            }

            $pdo->commit();

            $fullReference = $reference . ($version > 1 ? "-V$version" : '');

            respond(201, ['reference' => $fullReference]);

        } catch (Exception $e) {
            if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
            respond(500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Exporte les devis au format CSV.
     * Route : GET /api/devis
     * Auth  : Authorization: Bearer <API_KEY>
     */
    public function export(): void {
        requireAuth();

        $includeArticles = isset($_GET['include_articles']) && $_GET['include_articles'] === '1';

        try {
            $pdo = SchematicsDatabase::getConnection();

            if ($includeArticles) {
                $query = "
                    SELECT
                        CONCAT(d.reference, IF(d.version > 1, CONCAT('-V', d.version), '')) AS reference,
                        d.date_devis, d.affaire, d.installateur_entreprise, d.type_devis,
                        d.cout_total_ht AS devis_cout_total_ht,
                        d.cout_total_ttc AS devis_cout_total_ttc,
                        d.taux_remise AS devis_taux_remise,
                        d.taux_tva, d.code_tva, d.objet,
                        d.installateur_nom_prenom, d.installateur_mail,
                        d.affaire_suivie_par, d.mode_reglement, d.validite, d.delai_livraison,
                        dl.article_ref AS ligne_article_ref,
                        dl.prix_tarif AS ligne_prix_tarif,
                        dl.taux_remise AS ligne_taux_remise,
                        dl.quantite AS ligne_quantite,
                        dl.cout_total_ht AS ligne_cout_total_ht
                    FROM devis_genere d
                    INNER JOIN devis_ligne dl ON dl.id_devis = d.id
                ";
            } else {
                $query = "
                    SELECT
                        CONCAT(d.reference, IF(d.version > 1, CONCAT('-V', d.version), '')) AS reference,
                        d.date_devis, d.affaire, d.installateur_entreprise, d.type_devis,
                        d.cout_total_ht AS devis_cout_total_ht,
                        d.cout_total_ttc AS devis_cout_total_ttc,
                        d.taux_remise AS devis_taux_remise,
                        d.taux_tva, d.code_tva, d.objet,
                        d.installateur_nom_prenom, d.installateur_mail,
                        d.affaire_suivie_par, d.mode_reglement, d.validite, d.delai_livraison
                    FROM devis_genere d
                ";
            }

            $rows = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);

            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename=devis_export.csv');

            $output = fopen('php://output', 'w');
            if (count($rows) > 0) {
                fputcsv($output, array_keys($rows[0]));
                foreach ($rows as $row) {
                    fputcsv($output, $row);
                }
            }
            fclose($output);

        } catch (Exception $e) {
            respond(500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Retourne [reference, version] pour un nouveau devis.
     */
    private function resolveReference(PDO $pdo, string $affaire, string $installateur): array {
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
            return [$last['reference'], intval($last['last_version']) + 1];
        }

        $count = $pdo->query("SELECT COUNT(DISTINCT reference) FROM devis_genere WHERE YEAR(date_generation) = YEAR(CURDATE())")->fetchColumn() + 1;
        $reference = sprintf('REF-%d-%05d', date('Y'), $count);
        return [$reference, 1];
    }
}

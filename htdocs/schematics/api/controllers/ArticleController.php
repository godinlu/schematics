<?php
require_once ROOT_PATH . 'includes/functions/db/ArticleCategoryRepository.php';

class ArticleController {

    private const MANDATORY_KEYS = ['CODE ARTICLE', 'PV', 'LIBELLE'];

    /**
     * Met à jour les articles en batch.
     * Route : PUT /api/articles
     */
    public function update(): void {
        $data = readJsonBody();

        if (!is_array($data) || empty($data)) {
            respond(422, ['error' => 'Le corps doit être un tableau non vide d\'articles']);
        }

        $valid_items = [];
        foreach ($data as $item) {
            foreach (self::MANDATORY_KEYS as $key) {
                if (!array_key_exists($key, $item)) {
                    respond(422, ['error' => "Clé obligatoire manquante : $key"]);
                }
            }
            $valid_items[] = [
                'ref'     => $item['CODE ARTICLE'],
                'prix'    => floatval($item['PV']),
                'label'   => $item['LIBELLE'],
                'is_used' => true,
            ];
        }

        try {
            $repo = new ArticleCategoryRepository();

            $existing_articles = $repo->get_articles();
            $existing_refs     = array_flip(array_column($existing_articles, 'ref'));

            $new_items      = array_values(array_filter($valid_items, fn($item) => !isset($existing_refs[$item['ref']])));
            $existing_items = array_values(array_filter($valid_items, fn($item) => isset($existing_refs[$item['ref']])));

            $previously_active = $repo->disable_all_articles();

            $insert_count = !empty($new_items)      ? $repo->insert_articles_batch($new_items)      : 0;
            $update_count = !empty($existing_items) ? $repo->update_articles_batch($existing_items) : 0;

            $disabled_count = max(0, $previously_active - $update_count);

            respond(200, [
                'message'         => 'Import réalisé avec succès',
                'total_processed' => count($valid_items),
                'insert_count'    => $insert_count,
                'update_count'    => $update_count,
                'disabled_count'  => $disabled_count,
            ]);

        } catch (Exception $e) {
            respond(500, ['error' => $e->getMessage()]);
        }
    }
}

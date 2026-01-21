<?php
require_once (APP_BASE_PATH . 'models/SchematicsDatabase.php');

/**
 * Class ArticleCategoryRepository
 *
 * Provides methods to access articles and categories from the database.
 * Handles retrieval of categories and articles sorted by category priority and price.
 */
class ArticleCategoryRepository
{
    /**
     * @var PDO The database connection object
     */
    private PDO $db;

    /**
     * ArticleCategoryRepository constructor.
     *
     * Initializes the repository with a PDO connection from SchematicsDatabase singleton.
     */
    public function __construct()
    {
        $this->db = SchematicsDatabase::getConnection();
    }

    /**
     * Retrieves all categories ordered by their priority.
     *
     * @return array<int, array<string, mixed>> Array of categories with keys like 'id', 'name', 'priority', etc.
     */
    public function get_categories(): array
    {
        $stmt = $this->db->prepare("SELECT * FROM category ORDER BY priority");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    /**
     * Retrieves all articles.
     *
     * @return array<int, array<string, mixed>> Array of categories with keys 'ref', 'label', 'prix', 'is_used'.
     */
    public function get_articles(): array
    {
        $stmt = $this->db->prepare("SELECT * FROM article");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Retrieves all articles along with their category association, sorted by category priority and article price.
     * Adds a sequential 'priority' field to each article.
     *
     * @return array<int, array<string, mixed>> Array of articles with keys:
     *                                         'ref', 'label', 'prix', 'category_id', 'priority'
     */
    public function get_articles_sorted(): array
    {
        $stmt = $this->db->prepare("
            SELECT a.ref, a.label, a.prix, ac.category_id
            FROM category_article ac
            INNER JOIN article a ON a.ref = ac.article_ref
            INNER JOIN category c ON c.id = ac.category_id
            WHERE a.is_used = 1
            ORDER BY c.priority, a.prix
        ");
        $stmt->execute();
        $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $priority = 1;

        foreach ($articles as &$row) {
            $row['priority'] = $priority;
            $priority++;
        }

        unset($row); // bonne pratique avec les références

        return $articles;
    }


    /**
     * Inserts multiple articles into the database in a single batch.
     *
     * @param array<int, array{ref: string, label: string|null, prix: float, is_used: bool}> $articles
     *        Array of articles to insert, each article must have keys: 'ref', 'label', 'prix', 'is_used'
     *
     * @return int Number of inserted rows
     *
     * @throws Exception If the insertion fails due to a database error
     */
    public function insert_articles_batch(array $articles): int
    {
        if (empty($articles)) {
            return 0;
        }

        try {
            $values = [];
            $placeholders = [];

            foreach ($articles as $index => $article) {
                $placeholders[] = "(:ref{$index}, :label{$index}, :prix{$index}, :is_used{$index})";
                $values[":ref{$index}"] = $article['ref'];
                $values[":label{$index}"] = $article['label'];
                $values[":prix{$index}"] = $article['prix'];
                $values[":is_used{$index}"] = $article['is_used'] ? 1 : 0;
            }

            $sql = "INSERT INTO article (ref, label, prix, is_used) VALUES " . implode(", ", $placeholders);

            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            return $stmt->rowCount();

        } catch (PDOException $e) {
            throw new Exception("Failed to insert batch of articles: " . $e->getMessage());
        }
    }


    /**
     * Updates multiple existing articles in a batch.
     * Only updates fields if they differ from current values.
     *
     * @param array<int, array{ref: string, label: string|null, prix: float, is_used: bool}> $articles
     *        Array of articles to update
     *
     * @return array<int, string> List of article refs that were actually updated
     *
     * @throws Exception If the update fails
     */
    public function update_articles_batch(array $articles): int
    {
        if (empty($articles)) {
            return 0;
        }

        $placeholders = [];
        $values = [];
        foreach ($articles as $i => $art) {
            $placeholders[] = "(:ref{$i}, :label{$i}, :prix{$i}, :is_used{$i})";
            $values[":ref{$i}"] = $art['ref'];
            $values[":label{$i}"] = $art['label'];
            $values[":prix{$i}"] = $art['prix'];
            $values[":is_used{$i}"] = $art['is_used'] ? 1 : 0;
        }

        $sql = "
            INSERT INTO article (ref, label, prix, is_used)
            VALUES " . implode(", ", $placeholders) . "
            ON DUPLICATE KEY UPDATE
                label = IF(VALUES(label) <> label, VALUES(label), label),
                prix = IF(VALUES(prix) <> prix, VALUES(prix), prix),
                is_used = IF(VALUES(is_used) <> is_used, VALUES(is_used), is_used)
        ";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($values);

            return $stmt->rowCount() / 2;

        } catch (PDOException $e) {
            throw new Exception("Failed to update batch of articles: " . $e->getMessage());
        }
    }

}
?>
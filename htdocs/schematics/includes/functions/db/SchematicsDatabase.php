<?php

/**
 * Class SchematicsDatabase
 *
 * Singleton class to manage the database connection using PDO.
 * Loads configuration from a config file and ensures a single PDO instance.
 */
class SchematicsDatabase
{
    /**
     * @var PDO|null The singleton PDO connection instance
     */
    private static ?PDO $pdo = null;

    /**
     * Private constructor to prevent instantiation
     */
    private function __construct() {}

    /**
     * Establish the PDO connection if it doesn't exist yet.
     *
     * @throws PDOException if the connection fails
     */
    private static function connect(): void
    {
        if (self::$pdo !== null) {
            return;
        }

        $db_host = $_ENV['DB_HOST'];
        $db_name = $_ENV['DB_NAME'];

        self::$pdo = new PDO(
            "mysql:host=$db_host;dbname=$db_name;charset=utf8",
            $_ENV['DB_USER'],
            $_ENV['DB_PASS'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
    }

    /**
     * Get the singleton PDO connection.
     * Initializes the connection if it has not been established yet.
     *
     * @return PDO The PDO connection instance
     * @throws PDOException if the connection cannot be established
     */
    public static function getConnection(): PDO
    {
        self::connect();
        return self::$pdo;
    }

}
?>
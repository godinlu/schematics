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
     * @var string Database username loaded from config
     */
    private static string $username;

    /**
     * @var string Database password loaded from config
     */
    private static string $password;

    /**
     * Private constructor to prevent instantiation
     */
    private function __construct() {}

    /**
     * Load database configuration from a text file.
     *
     * Expects a config file at ../config/config.txt with lines:
     * DB_USERNAME=your_username
     * DB_PASSWORD=your_password
     *
     * @throws Exception if the file is missing or configuration is invalid
     */
    private static function loadConfig(): void
    {

        $filepath = __DIR__ . '/../config/config.txt';

        if (!file_exists($filepath)) {
            throw new Exception("Configuration file not found");
        }

        foreach (file($filepath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            if (str_starts_with(trim($line), '#')) continue;

            [$key, $value] = explode('=', $line, 2);

            if ($key === 'DB_USERNAME') self::$username = trim($value);
            if ($key === 'DB_PASSWORD') self::$password = trim($value);
        }

        if (!isset(self::$username, self::$password)) {
            throw new Exception("Invalid database configuration");
        }

    }


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

        self::loadConfig();

        self::$pdo = new PDO(
            "mysql:host=localhost;dbname=schemateque;charset=utf8",
            self::$username,
            self::$password,
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
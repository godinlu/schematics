<?php
class Authentification{
    private static $username;
    private static $password;

    public static function load_config(){
        $filepath = __DIR__ . '/../config/config.txt';
        if (file_exists($filepath)) {
            $lines = file($filepath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue; // Ignorer les commentaires
                list($key, $value) = explode('=', $line, 2);
                if ($key === "ADMIN_USERNAME") self::$username = $value;
                elseif ($key === "ADMIN_PASSWORD") self::$password = $value;
            }
        } else {
            throw new Exception("Le fichier de configuration n'existe pas.");
        }
    }

    public static function connect(string $username, string $password){
        self::load_config();
        
        if ($username === self::$username && $password === self::$password){
            session_start();
            $_SESSION['username'] = $username;
            // Authentification réussie, redirigez l'utilisateur vers une page sécurisée
            header('Location: devis');

        }else{
            throw new Exception("Mot de passe ou nom d'utilisateur incorrecte");
        }
    }


    public static function test(){
        session_start();
        if (!isset($_SESSION['username'])){
            header('Location: login');
            exit("Connexion refusé");
        }
    }
}

?>
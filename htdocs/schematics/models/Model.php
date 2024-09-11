<?php
abstract class Model{
    private static $_bdd;
    private static $username;
    private static $password;

    public static function load_config(){
        $filepath = __DIR__ . '/../config/config.txt';
        if (file_exists($filepath)) {
            $lines = file($filepath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue; // Ignorer les commentaires
                list($key, $value) = explode('=', $line, 2);
                if ($key === "DB_USERNAME") self::$username = $value;
                elseif ($key === "DB_PASSWORD") self::$password = $value;
            }
        } else {
            throw new Exception("Le fichier de configuration n'existe pas.");
        }
    }

    private static function setBdd(){
        self::load_config();
        self::$_bdd = new PDO(
            "mysql:host=localhost;dbname=schemateque;charset=utf8",
            self::$username,
            self::$password
        );
        self::$_bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    protected function getBdd(): PDO{
        if (self::$_bdd == null){
            Model::setBdd();
        }
        return self::$_bdd;
    }

    /**
     * cette fonction execute la query select passé en paramètre
     * et renvoie le résultat tel qu'elle.
     */
    protected function select(string $query): array{
        if (strpos(trim($query), 'SELECT') !== 0) throw new Exception("The query need to start with select");
        $req = $this->getBdd()->prepare($query);
        $req->execute();
        
        $arr = array();
        // Parcours des résultats et création des objets correspondants
        while($data = $req->fetch(PDO::FETCH_ASSOC)){
            $arr[] = $data;
        }
        return $arr;
    }

    protected function getAll(string $table, string $obj, array|null $data = null, string|null $whereClauses = null){
        $var = array();
        
        // Construction de la requête SQL
        $query = "SELECT * FROM " . $table;
        if (isset($data) && isset($whereClauses)){
            $query.= " WHERE ". $whereClauses;
        } else if (isset($data) && !isset($whereClauses)){
            $query.= " WHERE ". self::generatWhereClauses($data);
        }    
        // Préparation et exécution de la requête
        $req = $this->getBdd()->prepare($query);
        $req->execute($data);
        
        // Parcours des résultats et création des objets correspondants
        while($data = $req->fetch(PDO::FETCH_ASSOC)){
            $var[] = new $obj($data);
        }
        // Fermeture du curseur et retour des résultats
        $req->closeCursor();
        return $var;
    }

    protected function update(string $table, array $data, array $whereClauses) {
        // Construction de la requête SQL
        $query = "UPDATE " . $table . " SET ";
        $fields = array();

        foreach ($data as $key => $value) {
            $fields[] = $key . " = :" . $key;
        }

        $query .= implode(", ", $fields);
        $query .= " WHERE " . self::generatWhereClauses($whereClauses);

        // Préparation et exécution de la requête
        $req = $this->getBdd()->prepare($query);
        $req->execute(array_merge($data, $whereClauses));
    }

    protected function insert(string $table, array $data):int {
        // Construction de la requête SQL
        $query = "INSERT INTO " . $table . " (";
        $fields = array();
        $placeholders = array();
    
        foreach ($data as $key => $value) {
            $fields[] = $key;
            $placeholders[] = ":" . $key;
        }
    
        $query .= implode(", ", $fields);
        $query .= ") VALUES (";
        $query .= implode(", ", $placeholders);
        $query .= ")";
    
        // Préparation et exécution de la requête
        $req = $this->getBdd()->prepare($query);
        $req->execute($data);
        return $this->getBdd()->lastInsertId();
    }

    protected function delete(string $table, array $whereClauses){
        $query = "DELETE FROM $table WHERE " . self::generatWhereClauses($whereClauses);
        $req = $this->getBdd()->prepare($query);
        $req->execute($whereClauses);

    }

    protected function countElements($table, $whereClauses = ""):int {
        // Construction de la requête SQL
        $query = "SELECT COUNT(*) as total FROM " . $table;
        
        if (!empty($whereClauses)) {
            $query .= " WHERE " . $whereClauses;
        }
    
        // Préparation et exécution de la requête
        $req = $this->getBdd()->prepare($query);
        $req->execute();
        
        // Récupération du résultat
        $result = $req->fetch(PDO::FETCH_ASSOC);
    
        // Retourne le nombre total d'éléments
        return $result['total'];
    }

    private static function generatWhereClauses(array &$data):string {
        $whereClauses = array();
        foreach ($data as $key => $value){
            if (isset($value)){
                $whereClauses[] = $key . " = :" . $key;
            }else{
                unset($data[$key]);
                $whereClauses[] = $key . " IS NULL";
            }
            
        }
        return implode(" AND " , $whereClauses);
    }   
     
}

?>
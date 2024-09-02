<?php
class Client{
    private $_id;
    private $_prenom;
    private $_nom;
    private $_code_postal;
    private $_ville;

    public function __construct(array $data){
        $this->hydrate($data);
    }
    public function toArray(){
        return array(
            'id' => $this->_id,
            'prenom' => $this->_prenom,
            'nom' => $this->_nom,
            'code_postal' => $this->_code_postal,
            'ville' => $this->_ville
        );
    }

    private function hydrate(array $data){
        foreach($data as $key => $value){
            $method = 'set'.ucfirst($key);

            if (method_exists($this,$method)){
                $this->$method($value);
            }
        }
    }

    //SETTERS
    public function setId($id){
        $id = (int) $id;
        if ( $id > 0){
            $this->_id = $id;
        }
    }
    public function setPrenom($prenom){
        if (isset($prenom) && is_string($prenom) && !empty($prenom)){
            $this->_prenom = $prenom;
        }else{
            throw new Exception("le prénom n'est pas valide");
        }
    }
    public function setNom($nom){
        if (isset($nom) && is_string($nom) && !empty($nom)){
            $this->_nom = $nom;
        }else{
            throw new Exception("le nom n'est pas valide");
        }
    }
    public function setCode_postal($code_postal){
        if (isset($code_postal) && !empty($code_postal)){
            $this->_code_postal = $code_postal;
        }
    }
    public function setVille($ville){
        if (isset($ville) && !empty($ville)){
            $this->_ville = $ville;
        }
    }

    //GETTERS
    public function getId(){
        return $this->_id;
    }
    public function getPrenom(){
        return $this->_prenom;
    }
    public function getNom(){
        return $this->_nom;
    }
    public function getCode_postal(){
        return $this->_code_postal;
    }
    public function getVille(){
        return $this->_ville;
    }
}
?>
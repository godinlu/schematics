<?php
class Installateur{
    private $_id;
    private $_societe;
    private $_prenom_nom;
    private $_mail;
    
    public function __construct(array $data){
        $this->hydrate($data);
    }
    public function toArray(){
        return array(
            'id' => $this->_id,
            'societe' => $this->_societe,
            'prenom_nom' => $this->_prenom_nom,
            'mail' => $this->_mail
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
        if ($id > 0){
            $this->_id = $id;
        }
    }
    public function setSociete($societe){
        if (isset($societe) && !empty($societe)){
            $this->_societe = $societe;
        }
    }
    public function setPrenom_nom($prenom_nom){
        if (!empty($prenom_nom)){
            $this->_prenom_nom = $prenom_nom;
        }
    }
    public function setMail($mail){
        if (!empty($mail)){
            $this->_mail = $mail;
        }
    }

    //GETTERS
    public function getID(){
        return $this->_id;
    }
    public function getSociete(){
        return $this->_societe;
    }
    public function getPrenom_nom(){
        return $this->_prenom_nom;
    }
    public function getMail(){
        return $this->_mail;
    }
}
?>
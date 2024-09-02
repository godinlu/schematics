<?php
class Article{
    private $_ref;
    private $_label;
    private $_prix;
    private $_famille;
    private $_filtre1;
    private $_filtre2;
    private $_filtre3;
    private $_filtre4;
    private $_filtre5;
    private $_filtre6;

    public function __construct(array $data){
        $this->hydrate($data);
    }

    public function hydrate(array $data){
        foreach($data as $key => $value){
            $method = 'set'.ucfirst($key);

            if (method_exists($this,$method)){
                $this->$method($value);
            }
        }
    }

    /**
     * renvoie l'article sous la forme d'un tableau associatif
     */
    public function toArray():array{
        $array = [];
        foreach(get_object_vars($this) as $key => $value){
            if (isset($value)){
                $new_key = str_replace("_","",$key);
                $array[$new_key] = $value;
            }
            
        }
        return $array;
    }

    //SETTERS
    public function setRef(string $ref){
        if (is_string($ref)){
            $this->_ref = $ref;
        }
    }

    public function setLabel(string|null $label){
        if (is_string($label)){
            $this->_label = $label; 
        }
    }

    public function setPrix(int|float $prix){
        $this->_prix = round ((float)$prix, 2);
    }

    public function setFamille(string $famille){
        if (is_string($famille)){
            $this->_famille = $famille;
        }
    }

    public function setFiltre1(string|null $filtre1){
        $this->_filtre1 = $filtre1;
    }
    public function setFiltre2(string|null $filtre2){
        $this->_filtre2 = $filtre2;
    }
    public function setFiltre3(string|null $filtre3){
        $this->_filtre3 = $filtre3;
    }
    public function setFiltre4(string|null $filtre4){
        $this->_filtre4 = $filtre4;
    }
    public function setFiltre5(string|null $filtre5){
        $this->_filtre5 = $filtre5;
    }
    public function setFiltre6(string|null $filtre6){
        $this->_filtre6 = $filtre6;
    }

    //GETTERS
    public function getRef():string{
        return $this->_ref;
    }
    public function getLabel():string|null{
        return $this->_label;
    }
    public function getPrix():float{
        return $this->_prix;
    }
    public function getFamille():string{
        return $this->_famille;
    }
    public function getFiltre1():string{
        return $this->_filtre1;
    }
    public function getFiltre2():string{
        return $this->_filtre2;
    }
    public function getFiltre3():string{
        return $this->_filtre3;
    }
    public function getFiltre4():string{
        return $this->_filtre4;
    }
    public function getFiltre5():string{
        return $this->_filtre5;
    }
    public function getFiltre6():string{
        return $this->_filtre6;
    }



}
?>
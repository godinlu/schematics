<?php
require_once (APP_BASE_PATH .  "models/schema/Schema.php");
require_once (APP_BASE_PATH .  "config/utils/formulaire_utils.php");

abstract class Module extends Schema{
    protected array $_formulaire;
    protected int $_nb_zone;
    protected array $_list_emplacement;
    protected bool $_is_SC1Z;
    private array $_position;
    
    
    private static $POSITION_PATH = APP_BASE_PATH . 'config/client/coord_module.json';

    protected function __construct(int $width, int $height, array $formulaire){
      $this->_pathToImg .= 'schema_exe/';
      parent::__construct($width , $height);
      

      $this->_formulaire = $formulaire;
      $this->_nb_zone = getNbZones($formulaire);
      $this->_list_emplacement = getList_emplacement($formulaire);
      $this->_position = json_decode(file_get_contents(self::$POSITION_PATH) , true);
      $this->_is_SC1Z = ($this->_formulaire['typeInstallation'] === 'SC1Z');

      $this->setImageModule();
    }


    private function setImageModule() {
      $path = "module/";
      $MOD = preg_replace('/K/', '', preg_replace('/HydrauBox /', 'SC', $this->_formulaire['typeInstallation']));
      $PC = '/Plancher chauffant|PC/';
      $path .= $MOD;
      $path .= " " . $this->getNameModule();
      $coord = $this->_is_SC1Z ? $this->_position['coord_module']['SC1Z'] : $this->_position['coord_module']['default'];
      if ($this->_is_SC1Z) $this->_position['coord_label'][5] = [524,256];    //on doit décalé le label C5 

        $this->addImage($path , $coord);

        if (!$this->isColZ0()) {
          $offset = $this->_position['offset_cache_col_froid'][$MOD];
          $coord_cache_col_froid = [$coord[0] + $offset[0], $coord[1] + $offset[1]];
          $this->addImage("module/" . $MOD . "_cache_col_froid", $coord_cache_col_froid);
        }
      
        if (preg_match($PC, $this->_formulaire['circulateurC1'])) {
          $offset = $this->_position['offset_pc'][$MOD];
          $coord_pc = [$coord[0] + $offset[0], $coord[1] + $offset[1]];
          $this->addImage("module/" . $MOD . "_pc", $coord_pc);
        }

        //si il n'y a pas de ballon alors on enlève C4 et C5
        if (!$this->_is_SC1Z && $this->_formulaire['ballonECS'] === AUCUN){
          $this->addImage("module/" . $MOD . " sans C4 C5", $coord);
        }
      
        $labels = ["C1", "C2", "C3", "C4"];
        $yellow = [255, 255, 0];
        for ($i = 0; $i < count($this->_list_emplacement); $i++) {
          if ($this->_list_emplacement[$i] != "") {
            $text = preg_replace('/circulateur/', '', $this->_list_emplacement[$i]);
            $this->addLabel($text, $this->_position['coord_label'][$i], 11, $yellow);
          }
        }
        
        if ($this->_formulaire['ballonECS'] !== AUCUN){
          $this->addLabel("C4", $this->_position['coord_label'][4], 11, $yellow);
        }
        
        if (($this->_formulaire['champCapteur'] !== AUCUN || 
            $this->_formulaire['ballonTampon'] !== AUCUN) &&
            $this->_formulaire['ballonECS'] !== AUCUN
        ) {
          $this->addLabel("C5", $this->_position['coord_label'][5],11, $yellow);
        }
        if (strpos($this->_formulaire['typeInstallation'], "SC2") !== false) {
          $this->addLabel("C6", $this->_position['coord_label'][6],11, $yellow);
        }

        
    }


    private function isColZ0():bool{
      $RGX = '/Plancher chauffant|PC|Idem zone N-1/';
      $max_zone = ($this->_formulaire['typeInstallation'] === 'SC1Z')? 3 : 4;  //variable qui représente l'index de la première zone
    
      return !(   $this->_nb_zone == $max_zone &&
                  preg_match($RGX , $this->_formulaire['circulateurC1']) &&
                  preg_match($RGX , $this->_formulaire['circulateurC2'])
                  );

    }

    private function getNameModule(){
      $res = "";
      foreach($this->_list_emplacement as $id){
        if ($id === "") $res .= '_';
        else $res .= 'X';
      }
      return $res;
    }
}
?>
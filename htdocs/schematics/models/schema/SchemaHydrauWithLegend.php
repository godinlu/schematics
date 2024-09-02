<?php
require_once(APP_BASE_PATH . "models/schema/SchemaHydrau.php");

class SchemaHydrauWithLegend extends SchemaHydrau{
    private static $LEGEND_PATH = APP_BASE_PATH . 'config/client/legend_schema_hydrau.json';

    private array $_legend;

    public function __construct(array $formulaire){
        self::$_width = 1170;
        parent::__construct($formulaire);

        $this->_legend = json_decode(file_get_contents(self::$LEGEND_PATH) , true);

        $this->addTable(
            $this->getListLegend(), 
            [880 ,30], 
            $this->_legend['title'],
            5,
            8
        );
    }

    /**
     * renvoie le tableau de la légende en fonction des sondes qui sont effectivement présente dans schéma 
     */
    private function getListLegend():array{
        $res = [];

        foreach ($this->_legend['content'] as $L) {
            $type = $L[0];
            $values = array_slice($L, 1);
    
            switch ($type) {
                case "":
                    $res[] = $values;
                    break;
    
                case "appointC7":
                    if ($this->_formulaire['locAppoint2'] === "C7") {
                        $res[] = $values;
                    }
                    break;
    
                case "sondes":
                    if (strpos($this->_formulaire['sondes'], $values[0]) !== false) {
                        $res[] = $values;
                    }
                    break;
    
                case "circulateurC7 sans appoint":
                    if ($this->_formulaire['circulateurC7'] !==AUCUN && strpos($this->_formulaire['circulateurC7'], "Appoint") === false) {
                        $res[] = $values;
                    }
                    break;
    
                case "circulateurC5":
                    $capteur = $this->_formulaire['champCapteur'];
                    $ballonTampon = $this->_formulaire['ballonTampon'];
                    if ($capteur !== "Aucun" || $ballonTampon !== "Aucun") {
                        $res[] = $values;
                    }
                    break;
    
                case "circulateurC6":
                    $capteur = $this->_formulaire['champCapteur'];
                    $ballonTampon = $this->_formulaire['ballonTampon'];
                    if ($capteur !== "Aucun" && $ballonTampon !== "Aucun") {
                        $res[] = $values;
                    }
                    break;
    
                default:
                    if ($this->_formulaire[$type] !== "Aucun") {
                        $res[] = $values;
                    }
                    break;
            }
        }
    
        return $res;
    }
    
}
?>
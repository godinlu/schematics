<?php
class DataDevis{
    private array $_formulaire;
    private ?array $_devis_index; 
    private array $_json_data;

    public function __construct(array $formulaire, ?array $devis_index){
        $this->_formulaire = $formulaire;
        $this->_devis_index = $devis_index;
    }

    public function getDevisIndex():?array{
        return $this->_devis_index;
    }

    public function getDefaultDevisIndex():array{
        //we start to import the file of default index
        $this->_json_data = json_decode(file_get_contents(URL_DEVIS_DEFAULT_INDEX) , true);

        $SC1Z = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'SC1Z';
        $SC1 = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'SC1';
        $SC2 = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'SC2';
        $SC1K = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'SC1K';
        $SC2K = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'SC2K';
        $HydrauBox_1 = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'HydrauBox 1';
        $HydrauBox_2 = $this->_formulaire[FORM_TYPE_INSTALLATION] === 'HydrauBox 2';
        $avec_echangeur = $this->_formulaire[FORM_ECHANGEUR_DANS_BT] === 'on';
        $ballon_tampon = $this->_formulaire[FORM_BALLON_TAMPON] !== AUCUN;


        $res = array();
        
        foreach ($this->_json_data as $id => $options){
            foreach ($options as $str_cond => $value){
                $cond  = eval('return ' . $str_cond . ';');
                if ($cond){
                    if (is_string($value)) $res[ $id ] = $value;
                    else $res[ $id ] = array( $value );
                }
                
            }
            
            //if ($field['type'] === 'simple_field')
        }

        return $res;
    }

}
?>
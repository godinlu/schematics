<?php
require_once ("Module.php");

class Etiquetage extends Module{
    private int $_width = 500;
    private int $_height = 700;
    private array $_position;

    private static $POSITION_PATH = APP_BASE_PATH . 'config/client/coord_etiquetage_exe.json';

    public function __construct(array $formulaire){
        $this->_offset = (($formulaire['typeInstallation'] === 'SC1Z'))? [-430 ,90] : [-400 ,50];
        parent::__construct($this->_width , $this->_height , $formulaire);
        $this->_orientation = 'p';

        $this->_position = json_decode(file_get_contents(self::$POSITION_PATH) , true);
        $this->addAllArrows();
    }
    
    public function getName():string{
        return 'etiquetage' . $this->_formulaire[FORM_NOM_AFFAIRE];
    }

    private function addAllArrows(){
        $position = ($this->_is_SC1Z) ? $this->_position['SC1Z'] : $this->_position['default'];

        $this->addBaseLegend($position['base']);
        if (!$this->_is_SC1Z && $this->_formulaire['ballonECS'] !== 'Aucun'){
            $this->addBaseLegend($position['adaptative']['ballon ecs']);
        }
        $this->addSC2Legend($this->_position['default']['adaptative']['SC2']);
        $this->addPCLegend($position['adaptative']['plancher chauffant']);
        $this->addAppointLegend($position['adaptative']['Appoint2']);
        $this->addZoneLegend($position['adaptative']['zones']);
        $this->addLabelLegend($this->_position['legend']);
        $this->addCartouche([440,550]);
        //throw new Exception("salut");
    }

    /**
     * Ajoute toutes les légendes de base dans le buffer.
     * @param array $data_base_etiquetage
     */
    private function addBaseLegend($data_base_etiquetage){
        for ($i = 0; $i < count($data_base_etiquetage); $i++) {
            $this->addEtiquetage($data_base_etiquetage[$i]);
        }
    }

    /**
     * Ajoute toutes les légendes en fonction des options choisies dans le buffer.
     * @param array $etiquetages_SC2
     */
    private function addSC2Legend($etiquetages_SC2){
        if (!preg_match('/2/', $this->_formulaire['typeInstallation'])) {
            return; // Si le module n'est pas un SC2, on sort de la fonction sans rien faire
        }

        // Sinon, on ajoute tous les étiquetages du SC2
        $this->addEtiquetage($etiquetages_SC2[0]);
        $this->addEtiquetage($etiquetages_SC2[1]);
        $this->addEtiquetage($etiquetages_SC2[2]);
    }
    /**
     * Ajoute la légende du plancher chauffant avec le label de toutes les zones qui sont raccordées au plancher chauffant.
     * @param array $etiquetage_pc (Etiquetage)
     */
    private function addPCLegend(array $etiquetage_pc){
        if (!preg_match('/Plancher chauffant|PC/', $this->_formulaire['circulateurC1'])) {
            return; // Si le plancher chauffant n'est pas présent, on n'ajoute aucune légende
        }

        $FIRST_ZONE = 4 - $this->_nb_zone; // Variable qui représente l'index de la première zone
        for ($i = $FIRST_ZONE; $i < count($this->_list_emplacement); $i++) {
            if (!empty($this->_list_emplacement[$i]) &&
                preg_match('/Plancher chauffant|PC/', $this->_formulaire[$this->_list_emplacement[$i]])) {
                // On ajoute au label toutes les zones du kit PC sachant que le numéro de la zone est ($i - $FIRST_ZONE + 1)
                $etiquetage_pc['label']['text'] .= ", " . ($i - $FIRST_ZONE + 1);
            }
        }
        $etiquetage_pc['label']['text'] = preg_replace('/ ,/', '', $etiquetage_pc['label']['text']); // Ensuite, on enlève la virgule pour des raisons esthétiques
        $this->addEtiquetage($etiquetage_pc);
    }

    /**
     * Ajoute les raccordements chaud et froid de l'appoint 2 sur C7.
     * @param array $etiquetages_Appoint (Etiquetage)
     */
    private function addAppointLegend($etiquetages_Appoint){
        if (!preg_match('/Appoint/', $this->_formulaire['circulateurC7'])) {
            return; // Si l'appoint 2 sur C7 n'est pas présent, on n'ajoute aucune légende
        }

        // Sinon, on ajoute l'étiquetage chaud et froid de l'appoint 2
        $this->addEtiquetage($etiquetages_Appoint[0]);
        $this->addEtiquetage($etiquetages_Appoint[1]);
    }

    /**
     * Ajoute les légendes des zones en fonction des étiquetages des zones.
     * @param array $etiquetages_zone 
     */
    private function addZoneLegend(array $etiquetages_zone){
        $num_zone = 1;
        $CHAUD = 0;
        $FROID = 1;

        // Ici, on gère les zones sachant que les étiquetages doivent s'adapter en fonction des emplacements des zones
        for ($i = 0; $i < count($this->_list_emplacement); $i++) {
            if ($this->_list_emplacement[$i] != "") { // On teste s'il faut mettre un étiquetage pour la zone en question
                $etiquetage = $etiquetages_zone[$i];

                // Il faut remplacer le X du chaud et du froid par num_zone
                $etiquetage[$CHAUD]['label']['text'] = str_replace("X", $num_zone, $etiquetage[$CHAUD]['label']['text']);
                $etiquetage[$FROID]['label']['text'] = str_replace("X", $num_zone, $etiquetage[$FROID]['label']['text']);

                // Les cas que l'on ne traite pas sont gérés par les méthodes addPCLegend et addAppointLegend
                if (!preg_match('/Appoint/', $this->_formulaire[$this->_list_emplacement[$i]])) {
                    
                    if (!preg_match('/Plancher chauffant|PC|Idem zone N-1/', $this->_formulaire[$this->_list_emplacement[$i]])) {
                        //ici on traite le cas particulier ou il y a 4 zones avec un pc en zone 1 et pas de pc en zone 2
                        //le racordement chaud de zone 2 doit allé en zone 1
                        if ($num_zone === 2 && $this->_nb_zone === 4 &&
                            preg_match('/Plancher chauffant|PC/', $this->_formulaire[$this->_list_emplacement[0]])){
                                $etiquetage[$CHAUD]['arrow'] = $etiquetages_zone[0][$CHAUD]['arrow'];
                                $etiquetage[$CHAUD]['label']['coord'] = $etiquetages_zone[0][$CHAUD]['label']['coord'];
                        }
                        $this->addEtiquetage($etiquetage[$CHAUD]);
                    }
                    $this->addEtiquetage($etiquetage[$FROID]);
                    $num_zone++;
                }
            }
        }
    }

     /**
     * ajoute les labels pour le titre et la description de l'affaire
     * @param array data_legend_etiquetage 
     */
    private function addLabelLegend(array $data_legend_etiquetage) {
        $title = "Etiquetage |S|olis |C|onfort |SC|" . str_replace("SC", "", $this->_formulaire['typeInstallation']);
        // Lorsque l'on a un SC1, on descend toute la légende de 60
        // Donc ici, on est obligé d'annuler la descente pour que le titre reste au même endroit
        if ($this->_is_SC1Z) {
            $data_legend_etiquetage['title'][1] -= 60;
        }
        $this->addTitle($title, $data_legend_etiquetage['title']);
    }
    /**
     * Ajoute l'image et les labels nécessaires pour ajouter une cartouche à l'étiquetage.
     * @param array $coord 
     */
    private function addCartouche(array $coord){
        if ($this->_is_SC1Z) {
            $coord[1] += -60;
        }
        $this->addImage("legend_desc_affaire", $coord); // On ajoute d'abord l'image du rectangle
        // Ensuite, on ajoute les labels de la description de l'affaire
        $date = date("d/m/Y");
        $coord_date = [$coord[0] + 275, $coord[1] + 65];
        $coord_affaire = [$coord[0] + 7, $coord[1] + 65];
        $coord_description = [$coord[0] + 7, $coord[1] + 17];

        $affaire_value = "non renseigné";
        if (!empty($this->_formulaire['nom_client']) || !empty($this->_formulaire['prenom_client'])) {
            $affaire_value = strtoupper($this->_formulaire['nom_client']) . " " . $this->_formulaire['prenom_client'];
        }
        $this->addLabel("Affaire : " . $affaire_value, $coord_affaire);

        $desc = str_replace("Schéma", "Étiquetage", $this->_formulaire['description']);
        $this->addParagraphe($desc , $coord_description, 57);
        $this->addLabel( $date, $coord_date);
    }




    private function addEtiquetage(array $etiquetage){
        $arrow = $etiquetage['arrow'];

        $this->drawArrow($arrow['coord_a'] , $arrow['coord_b'] , hexdec($arrow['color']));
        $this->addLabel($etiquetage['label']['text'] , $etiquetage['label']['coord']);
    }


}
?>
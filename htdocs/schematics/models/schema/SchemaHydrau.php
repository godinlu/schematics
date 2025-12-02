<?php
require_once ("Schema.php");
require_once (APP_BASE_PATH ."config/utils/formulaire_utils.php");

class SchemaHydrau extends Schema{
    protected static $_width = 891;
    protected static $_heigth = 666;
    private static $POSITION_PATH = APP_BASE_PATH.'config/client/coord_schema_hydrau.json';

    protected $_formulaire;
    private $_position;

    public function __construct(array $formulaire){
        parent::__construct(self::$_width, self::$_heigth);
        $this->_pathToImg.= "schema_hydro/";
        $this->_formulaire = $formulaire;

        $this->_position = json_decode(file_get_contents(self::$POSITION_PATH) , true);


        $this->addAllImage();
    }

    public function getName():string{
        return 'schemaHydrau' . $this->_formulaire[FORM_NOM_AFFAIRE];
    }

    private function addAllImage(){
        $this->addImage("base schema", $this->_position['base_schema']);
        $this->setImageRaccord($this->_position['raccord']);
        $this->setImageAppoint($this->_position['appoint']);
        $this->setImageChampCapteur($this->_position['champCapteur']);
        $this->setImageBallonECS($this->_position['ballonECS']);
        $this->setImageCirculateurs($this->_position['circulateurs']);
        $this->setImageBallonTampon($this->_position['ballonTampon']);
        
        if ($this->_formulaire['resistanceElectriqueBECS'] === "on") $this->addImage("ballonTampon/Resistance",$this->_position['resistanceECS']);
        if ($this->_formulaire['resistanceElectriqueBT'] === "on") $this->addImage("ballonTampon/Resistance",$this->_position['resistanceBT']);
        if ($this->_formulaire['ballonECS'] !== "Aucun" && 
            ($this->_formulaire['champCapteur'] !== 'Aucun' || $this->_formulaire['ballonTampon'] !== "Aucun")
        ){
            $this->addImage("ballonECS/circulateur c5",$this->_position['circulateurC5']);
        } 

        $this->setLegendAppointC7();
        $this->setImageDivers($this->_position['divers']);
        $this->setImageOption($this->_position['option']);
        $this->setLabelDescription();

    }


    private function setImageRaccord(array $position){
        $circulateurs = array("circulateurC1","circulateurC2","circulateurC3","circulateurC7");

        if ($this->_formulaire['champCapteur'] !== 'Aucun' || $this->_formulaire['ballonTampon'] !== 'Aucun'){
            $this->addImage('raccord/raccord champCapteur' , $position['capteur']);
        }
        foreach($circulateurs as $circ){
            if ($this->_formulaire[$circ] !== 'Aucun'){
                $this->addImage('raccord/raccord ' . $circ , $position['circulateurs']);
                $this->addImage('raccord/sonde T9' , $position['sonde T9']);
                break;
            }
        }
        if ($this->_formulaire['ballonECS'] !== 'Aucun'){
            $this->addImage("raccord/raccord ballonECS", $position['ballonECS']);
        }
    }

    private function setImageAppoint(array $position){
        $rh = $this->_formulaire['raccordementHydraulique'];
        $rdh1 = $this->_formulaire['RDH_appoint1'];
        $rdh2 = $this->_formulaire['RDH_appoint2'];
        $loc_app2 = $this->_formulaire['locAppoint2'];

        # $mapping is a dict where key represent the image_name and the value represent a boolean
        # which is TRUE if the image need to be added
        $mapping = [
            "Appoint" => preg_match("/Appoint/i", $rh),
            "En directe" => preg_match("/En direct/i", $rh),
            "RDH_app1" => ($rdh1 === "on"),
            "RDH_app2" => ($rdh2 === "on" && $loc_app2 === "cascade"),
            "casse pression" => preg_match("/casse pression/i", $rh),
            "échangeur" => preg_match("/échangeur/i", $rh),
            "en cascade" => preg_match("/Appoint double en cascade/i", $rh),
            "double sur" => preg_match("/Appoint double sur/i", $rh),
            "appoint sur tampon" => preg_match("/Appoint sur tampon avec échangeur/i", $rh),
            "T16 simple" => preg_match("/simple T16/i", $rh),
            "T16 échangeur" => preg_match("/échangeur T16/i", $rh),
            "T16 casse pression" => preg_match("/casse pression T16/i", $rh),
            
        ];

        $path = "Appoint/";

        $this->addImage($path . "raccord Appoint",$position['raccord']);

        foreach($mapping as $image_name => $is_matched){
            if ($is_matched){
                $this->addImage($path . $image_name, $position['base']);
            }

        }  

    }

    /**
     * ajoute les images et les labels nécessaires au champ capteurs
     * @param array $coord
     */
    private function setImageChampCapteur(array $coord){
        $value = $this->_formulaire['champCapteur'];
        $sonde = "/T15|T16/";
        $list_str = ["capteurs","casse pression","échangeur","2 champs capteurs en","2 champs capteurs découplés","V3V","double circulateur"];

        if ($value == "Aucun") {
            return; // si aucun capteur, aucune image n'est affichée
        }

        for ($i = 0; $i < count($list_str); $i++) {
            if (strpos($value, $list_str[$i]) !== false) {
                $this->addImage("champCapteur/" . $list_str[$i], $coord);
            }
        }

        if (preg_match($sonde, $value, $matches)) {
            $this->addLabel($matches[0], [$coord[0] + 92, $coord[1] + 235], 10);
        }
    }

    /**
     * ajoute l'image pour le ballon ECS s'il y en a un
     * @param array $coord
     */
    private function setImageBallonECS(array $coord){
        if ($this->_formulaire['ballonECS'] != "Aucun") {
            $this->addImage("ballonECS/" . $this->_formulaire['ballonECS'], $coord);
        }
    }

    /**
     * @param array $list_coords
     */
    private function setImageCirculateurs(array $list_coords){
        $list_circ = array_keys($list_coords);

        $pilotage_rad = getPilotageRad($this->_formulaire);

        foreach ($list_circ as $circ) {
            $img_name = $this->_formulaire[$circ]; // Nom de l'image
            $path = $circ . '/'; // Chemin du répertoire de l'image

            if ($img_name != "Aucun") {

                // Cas particulier d'un pilotage d'un radiateur
                if (isset($pilotage_rad[$circ])) {
                    if ($pilotage_rad[$circ] == "hidden") {
                        continue;
                    } else {
                        $this->addLabel($pilotage_rad[$circ], $list_coords[$circ]['posLabel'], 9);
                    }
                }

                // Cas particulier d'un appoint sur le circulateur C7
                if ($circ == "circulateurC7" && preg_match("/Appoint/", $img_name)) {
                    $path .= "AppointC7/";
                    if ($img_name != "Appoint multiple") {
                        $img_name = "Appoint";
                    }
                    $img_name .= " " . $this->_formulaire['RH_appoint2'] . " " . $this->_formulaire['RDH_appoint2'];
                }

                $this->addImage($path . $img_name, $list_coords[$circ]['pos']);
            }
        }
    }

    /**
     * Ajoute l'image pour le ballon tampon et ajoute également l'échangeur et le raccordement.
     * @param array $coord
     */
    private function setImageBallonTampon(array $coord){
        $ech_BT = $this->_formulaire['EchangeurDansBT'] ?? "off";
        $BT = $this->_formulaire['ballonTampon'];
        $PATH = "ballonTampon/";

        if (!$BT || $BT === 'Aucun') {
            return;
        }
        $this->addImage($PATH . $BT . " " . $ech_BT, $coord); // Ajout du ballonTampon adapté en prenant en compte l'echangeurDansBT

        // Si un ballon tampon en eau chaude sanitaire est présent et qu'il n'y a pas de bouclage sanitaire,
        // il faut ajouter une image pour que tout soit joli.
        if ($BT === "ballon tampon en eau chaude sanitaire"
            && !preg_match("/bouclage sanitaire/", $this->_formulaire['ballonECS'])) {
            $this->addImage($PATH . "extension pas bouclage", [353, 317]); // Ajout du raccordement du ballon tampon
        }

        // Ensuite, on place le vase d'expansion si toutes les conditions sont réunies.
        if ($ech_BT === "on"
            && $BT !== "ballon tampon en eau chaude sanitaire"
            && !(
                preg_match("/échangeur/", $this->_formulaire['raccordementHydraulique'])
                && (
                    preg_match("/charge BTC/", $this->_formulaire['optionS10'])
                    || preg_match("/charge BTC/", $this->_formulaire['optionS11'])
                )
            )) {
            $vase_coord = [$coord[0] + 87, $coord[1] + 113];
            if (preg_match("/\d/", $BT)) {
                $vase_coord = [$coord[0] + 87, $coord[1] + 150];
                $this->addImage($PATH . "vase d'expension 2", [$coord[0] + 80, $coord[1] + 40]); // Ajout du deuxième vase d'expansion lorsqu'il y a un 2ème ballon tampon
            }
            $this->addImage($PATH . "vase d'expension", $vase_coord);
        }

        // Enfin, on place le raccordement capteur (V3V et circulateur) s'il y a un champ capteur.
        if ($this->_formulaire['champCapteur'] != "Aucun") {
            $this->addImage($PATH . "raccord capteur", [$coord[0] + 27, $coord[1] + 200]);
        }
    }

    /**
     * Ajoute la légende pour l'appoint C7.
     */
    private function setLegendAppointC7(){
        if (!strstr($this->_formulaire['circulateurC7'], "Appoint")) {
            return;
        }
        $this->addImage("legend/legend_appoint_C7", [422, 515]);
        $this->addImage("legend/legend_sur_appoint1", [570, 372]);
        $this->addImage("legend/legend_sur_C7", [626, 375]);
        $this->addImage("legend/legend_sur_champCapteurs", [130, 172]);
    }

    /**
     * Ajoute les images pour les options diverses.
     * @param {array} $DATA_DIVERS
     */
    private function setImageDivers($DATA_DIVERS){
        $divers = $this->_formulaire['divers'];

        if ($this->_formulaire['D5'] === "on") {
            $this->addImage("divers/comptage energétique utile solaire D3", $DATA_DIVERS["comptage energétique utile solaire D3"]);
        }
        if ($this->_formulaire['D3'] === "on") {
            $this->addImage("divers/comptage energétique utile appoint D5", $DATA_DIVERS["comptage energétique utile appoint D5"]);
        }
        if (strstr($divers, "pompe")) {
            $this->addImage("divers/" . $divers, $DATA_DIVERS[$divers]);
        } else if ($divers == "deshu sur appoint 1") {
            $this->addImage("divers/deshu sur appoint 1", $DATA_DIVERS["deshu sur appoint 1"]);
            if ($this->_formulaire['raccordementHydraulique'] == "En direct") {
                $this->addImage("divers/appoint inde", $DATA_DIVERS["appoint inde"]);
            }
        }
    }

    /**
     * Ajoute les images pour les options S10 ou S11 et ajoute les labels correspondants.
     * @param {array} $DATA_OPTION
     */
    private function setImageOption($DATA_OPTION){
        // Compteur pour détecter 2 options identiques ex: les options déportées [0] et les V3V bypass [1]
        $count = [0, 0];
        $options = [$this->_formulaire['optionS10'], $this->_formulaire['optionS11']];
        foreach ($options as $index => $value) {
            // Le texte du label prend soit S10 soit S11
            $text_label = ($index == 0) ? "S10" : "S11";
            $path = "options/";
            if ($value != "Aucun") {
                // Remplace les signes > < par x car une image ne peut pas contenir ">" ou "<"
                $nameIMG = preg_replace('/>|</', 'x', $value);
                $attribut = $DATA_OPTION[$nameIMG]?? null;
                switch ($nameIMG) {
                    case "CESI déportée sur T15":
                    case "Piscine déportée T15":
                    case "Piscine déportée T6":
                    case "CESI déportée sur T16":
                    case "ON en mode excédent d'énergie l'été":
                        $attribut = $DATA_OPTION["déporté"];
                        // Si c'est la première option déportée, elle sera placée en position haute
                        // Si c'est la deuxième option déportée, elle sera placée en dessous de l'autre
                        if ($count[0] === 1) {
                            $attribut['pos'][1] += 85;
                            $attribut['posLabel'][0] += 18;
                            $attribut['posLabel'][1] += 92;
                        }
                        $count[0]++;
                        break;
                    case "charge BTC si excédent APP1 sur T16 & T6 x T5":
                    case "Aquastat différentiel ON si T15 x T5":
                        $path .= "optionBT/"; // On pointe vers le fichier option dans BT
                        $attribut = $DATA_OPTION['optionBT'];
                        // On ajoute le bon raccordement en fonction du ballon tampon
                        if ($nameIMG == "Aquastat différentiel ON si T15 x T5") {
                            // Dans le cas d'un aquastat différentiel, on le met à gauche ou à droite en fonction de la pompe
                            if ($this->_formulaire['raccordementHydraulique'] == "En direct") {
                                $raccord_pos = [$attribut['pos'][0] + 291, $attribut['pos'][1] + 33];
                                $this->addImage($path . "raccord aquastat appoint inde", $raccord_pos);
                            }
                            if (preg_match('/gauche/', $this->_formulaire['divers'])) {
                                $nameIMG .= " gauche";
                            } else {
                                $nameIMG .= " droite";
                            }
                            $this->addImage($path . "raccordement rouge bleu " . $this->_formulaire['ballonTampon'], $attribut['pos']);
                        } else {
                            $this->addImage($path . "raccordement orange " . $this->_formulaire['ballonTampon'], $attribut['pos']);
                        }
                        $attribut['posLabel'] = $attribut['posLabel'][$nameIMG];
                        break;
                    case "Electrovanne Appoint 1 ou Flow Switch":
                        // Place l'image du label un peu au-dessus
                        $this->addLabel($text_label, [445, 110]);
                        break;
                    case "recharge nappes goethermiques sur T15 sur échangeur BTC":
                        // Place l'image du label un peu au-dessus
                        $this->addLabel($text_label, [267, 489]);
                        break;
                    case "V3V bypass appoint 1":
                        if ($count[1] == 1) {
                            $this->addLabel($text_label, [$attribut['posLabel'][0], $attribut['posLabel'][1] - 13]);
                            $attribut = null;
                        }
                        $count[1]++;
                        break;
                    case "V3V décharge zone 1":
                    case "Décharge sur zone 1":
                        $path .= "decharge/"; // On pointe vers le fichier option dans BT
                        // Ici, la V3V décharge zone 1 n'est pas la même s'il y a un plancher chauffant
                        if (preg_match('/Plancher chauffant|PC/', $this->_formulaire['circulateurC1'])) {
                            $nameIMG .= " pc";
                            $attribut['posLabel'][0] -= 55; // Décalage du label lorsque la décharge est raccordée sur un plancher chauffant
                        } else if ($nameIMG == "V3V décharge zone 1" && preg_match('/Piscine/', $this->_formulaire['circulateurC1'])) {
                            $nameIMG .= " piscine";
                        }
                        break;
                }
                // Si aucun attribut n'existe pour cette valeur, cela veut dire que l'option n'affecte pas le schéma
                if (is_null($attribut)) {
                    continue;
                }
                if ($attribut['pos'][0] !== 0 || $attribut['pos'][1] !== 0) {
                    $this->addImage($path . $nameIMG, $attribut['pos']);
                }
                $this->addLabel($text_label, $attribut['posLabel']);
            }
        }
    }

    /**
     * Ajoute le titre et les labels de description.
     */
    private function setLabelDescription(){
        $date = date("d/m/Y");
        $this->addLabel($date, [710, 648]);
        $affaire_value = "non renseigné";
        if ($this->_formulaire['nom_client'] != "" || $this->_formulaire['prenom_client'] != "") {
            $affaire_value = strtoupper($this->_formulaire['nom_client']) . " " . strtoupper($this->_formulaire['prenom_client']);
        }
        $this->addLabel("Affaire : " . $affaire_value, [433, 646]);

        $title = "Schéma hydraulique |S|olis |C|onfort |SC|" . str_replace( "SC", "", $this->_formulaire['typeInstallation']); 

        $this->addTitle($title , [250,20]);
        $desc = str_replace("Schéma", "Schéma hydraulique", $this->_formulaire['description']);
        $this->addParagraphe($desc , [433, 599] , 57);
        $this->addLabel("option S10 : " . getOptionS10($this->_formulaire), [433, 572]);
        $this->addLabel("option S11 : " . getOptionS11($this->_formulaire), [433, 584]);
    }


}
?>
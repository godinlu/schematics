<?php
require_once (APP_BASE_PATH . "models/schema/Module.php");

class SchemaExe extends Module{
    private int $_width = 891;
    private int $_heigth = 666;
    private $_position;

    private static $POSITION_PATH = APP_BASE_PATH . 'config/client/coord_schema_exe.json';


    public function __construct(array $formulaire){
        $this->_offset = (($formulaire['typeInstallation'] === 'SC1Z'))? [-90 ,50] : [-90 ,-10];

        parent::__construct($this->_width , $this->_heigth , $formulaire);
        $this->_position = json_decode(file_get_contents(self::$POSITION_PATH) , true);
        

        $this->addAllImage();
        
    }
    public function getName():string{
        return 'schemaExe' . $this->_formulaire[FORM_NOM_AFFAIRE];
    }

    private function addAllImage(){
        if ($this->_is_SC1Z) $this->addImage("vanne SC1Z",[587,247]);
        else $this->addImage("vanne",[357,252]);
        $this->setImageChampCapteur($this->_position['champCapteur']);
        $this->setImageCirculateurs(
            $this->_position['circulateurs']['raccordement'],
            $this->_position['circulateurs']['images'],
            $this->_position['circulateurs']['gap']
        );
        if (!$this->_is_SC1Z) $this->setImageBallonECS($this->_position['ballonECS']);
        else $this->setImageSC1Z([475,-23]);
        $this->setImageAppoint($this->_position['appoint']);
        $this->setImageBallonTampon($this->_position['ballonTampon']);
        $this->setImageDivers($this->_position['divers']);
        $this->setImageOptions($this->_position['option']);
        $this->setLabelOptions($this->_position['option']);
        $this->setLegend($this->_position['legend']);

    }

    /**
     * Ajoute l'image ou les images dans le imageManager pour le champ capteurs, avec les coordonnées passées en paramètre.
     * Gère également les options déportées.
     * @param int[] $coord
     */
    private function setImageChampCapteur(array $coord){
        $P = "champCapteur/";

        $str = $this->_formulaire['champCapteur'];
        if ($str == "Aucun") return; // Ici, si aucun capteur n'est sélectionné, aucune image n'est affichée.

        // Regex de test
        $is2 = '/2/';
        $cassePression = '/casse pression/';
        $echangeur = '/échangeur/';
        $V3V = '/V3V/';
        $T15 = '/T15/';
        $T16 = '/casse pression|échangeur|T16/';
        $parallele_serie = '/série|parallèle/';

        $rcc = ""; // $rcc correspond au raccord qui doit être utilisé pour le champ capteur, soit " SC1Z" soit "" par défaut
        if ($this->_is_SC1Z) $rcc = " SC1Z";  // Si $Z est vrai, on utilise le raccord du SC1Z
        $this->addImage($P . "champ capteurs" . $rcc, $coord); // Ajout de l'image du capteur de base

        // Ajoute les bonnes images en fonction de ce qu'il y a pour les champs capteurs
        if (preg_match($V3V, $str)) $this->addImage($P . "champ capteurs V3V", $coord);
        elseif (preg_match($parallele_serie, $str)) $this->addImage($P . "T10", $coord);
        elseif (preg_match($is2, $str)) $this->addImage($P . "2 capteurs", $coord);

        if (preg_match($cassePression, $str)) $this->addImage($P . "casse pression", $coord);
        if (preg_match($echangeur, $str)) $this->addImage($P . "echangeur", $coord);
        if (preg_match('/double circulateur/', $str)) $this->addImage($P . "double circulateur", $coord);

        if (preg_match($T15, $str)) $this->addLabel("T15", [$coord[0] + 204, $coord[1] + 116]);
        elseif (preg_match($T16, $str)) $this->addLabel("T16", [$coord[0] + 204, $coord[1] + 116]);
    }

    /**
     * @param int[][] $list_coord_racc constante des coordonnées
     * @param int[][] $list_coord_img constante des décalages pour les multizones
     * @param int[] $gap
     */
    private function setImageCirculateurs($list_coord_racc, $list_coord_img, $gap){
        $plancher_chauffant = '/Plancher chauffant|PC/';

        $pilotage_rad = getPilotageRad($this->_formulaire);
        // Equivaut à la première zone soit 0 par défaut et si c'est un SC1Z la première zone est 1
        $FIRST_ZONE = 0;
        if ($this->_is_SC1Z) $FIRST_ZONE = 1;
        $is_SC1Z = "";
        if ($this->_is_SC1Z) $is_SC1Z = " SC1Z";

        // On parcourt la liste des emplacements de circulateurs
        for ($i = $FIRST_ZONE; $i < count($this->_list_emplacement); $i++) {
            $id = $this->_list_emplacement[$i]; // $id correspond à l'id du circulateur
            if (!$id) continue; // Ici, on ne fait rien si aucun circulateur n'est défini

            $value = $this->getNameImageCirculateurs($this->_formulaire[$id]);
            $path = "circulateurs/objet/"; // Chemin pour ajouter un objet (ex: radiateur)
            $path_racc = "circulateurs/raccordement/zone" . $i . "/racc"; // Chemin pour ajouter le bon raccordement

            // Cas particulier d'un pilotage d'un radiateur
            if (isset($pilotage_rad[$id])) {
                if ($pilotage_rad[$id] === "hidden") continue;
                else {
                    $coord = [$list_coord_img[$i][0] + 51, $list_coord_img[$i][1] + 30];
                    $this->addLabel($pilotage_rad[$id], $coord);
                }
            }

            // Exceptions pour Idem zone N-1 ou appoint sur C7
            
            if ($value == "Idem zone N-1") {
                $this->addImage($path_racc . " zone-1", $list_coord_racc[$i]);
                continue;
            }
            if (preg_match('/Appoint/', $value)) {
                $this->addImage($path . "appointC7/" . $value, $list_coord_racc[$i]);
                continue;
            }

            // Si il y a un plancher chauffant, on utilise le raccord plancher chauffant
            if (preg_match($plancher_chauffant, $value)) $path_racc = $path_racc . " pc" . $is_SC1Z;
            // Sinon, si il y a un plancher chauffant en zone 0, on inverse le raccord en zone 1
            elseif ($i == $FIRST_ZONE + 1 && 
                    !empty($this->_list_emplacement[$FIRST_ZONE]) &&
                    preg_match($plancher_chauffant, $this->_formulaire[$this->_list_emplacement[$FIRST_ZONE]])
                    ) $path_racc = $path_racc . " inverse";

            
            // On ajoute le raccordement
            $this->addImage($path_racc, $list_coord_racc[$i]);

            // Si on est dans le cas d'un multizone
            if (preg_match('/Multi zones/', $value)) {
                $coord_multi = [$list_coord_img[$i][0] + $gap[0], $list_coord_img[$i][1] + $gap[1]];
                if (preg_match('/radiateurs/', $value)) { // Cas d'un multizone radiateur
                    $this->addImage($path . "Radiateurs", $list_coord_img[$i]); // On ajoute l'image d'un radiateur
                    $this->addImage($path . $value, $coord_multi); // On ajoute l'image multizone
                } else { // Cas d'un multizone plancher chauffant
                    $this->addImage($path . "Plancher chauffant", $list_coord_img[$i]); // On ajoute l'image d'un plancher chauffant
                    $this->addImage($path . "Multi zones PC", $coord_multi); // On ajoute l'image multizone
                }
            } else {
                $this->addImage($path . $value, $list_coord_img[$i]);
            }
        }
    }

    /**
     * Renvoie le nom de l'image pour les zones en fonction de la valeur des zones.
     * @param string $value
     * @return string $nameImg
     */
    private function getNameImageCirculateurs(string $value):string{
        switch ($value) {
            case "Plancher chauffant sur V3V":
            case "Décharge sur zone PC":
                return "Plancher chauffant";
            case "Piscine sur échangeur multi tubulaire":
            case "Piscine sur échangeur à plaques":
                return "Piscine";
            case "Multi zones PC sur V3V":
                return "Multi zones PC";
            case "Décharge sur zone":
                return "Radiateurs";
            case "Appoint bois":
            case "Appoint granulé":
            case "Appoint multiple":
                if ($value != "Appoint multiple") $res = "Appoint";
                else $res = $value;
                $res .= " " . $this->_formulaire['RH_appoint2'] . " " . $this->_formulaire['RDH_appoint2'];
                return $res;
            default:
            return $value;

        }
    }

    /**
     * Ajoute l'image du ballon ECS. Il existe des exceptions lorsqu'il y a un ballon ECS mixte, qu'il n'y a pas de ballon tampon et que c'est un SC2.
     * Alors on rajoute un petit raccord.
     * @param int[] $coord
     */
    private function setImageBallonECS(array $coord){
        if ($this->_formulaire['ballonECS'] === AUCUN) return; // Si aucun ballon ECS n'est sélectionné, on ne fait rien

        $MIXTE = '/ballon ECS tank in tank|ballon d\'eau chaude sur échangeur|Ballon hygiénique avec 1 echangeur|Ballon hygiénique avec 2 echangeurs/';
        $this->addImage("ballonECS/" . $this->_formulaire['ballonECS'], $coord); // Ajout de l'image du ballon de base
        // Condition pour ajouter le petit raccord
        if (preg_match($MIXTE, $this->_formulaire['ballonECS']) && $this->_formulaire['typeInstallation'] == "SC2" && $this->_formulaire['ballonTampon'] == "Aucun") {
            $this->addImage("ballonECS/petit raccord", $coord); // Ajout de l'image du petit raccord
        }
    }

    /**
     * Ajoute l'image du retour de ballon ECS dans le cas d'un SC1Z.
     * @param int[] $coord
     */
    private function setImageSC1Z($coord){
        $path = "ballonECS/SC1Z";
        if (preg_match('/bouclage sanitaire/', $this->_formulaire['ballonECS'])) $path .= " bouclage sanitaire";
        $this->addImage($path, $coord);
    }

    /**
     * Ajoute les images des appoints en fonction des raccordements hydrauliques.
     * @param int[] $coord
     */
    private function setImageAppoint(array $coord){
        $list_str = ["tampon", "casse pression", "échangeur", "en cascade", "double sur", "RDH_app1", "RDH_app2", "réchauffeur de boucle Gauche", "réchauffeur de boucle Droite", "simple T16", "T16"];
        $value = $this->_formulaire['raccordementHydraulique'];
        $path = "appoint/";

        $rcc = ""; // $rcc correspond au raccord qui doit être utilisé pour le champ capteur, soit " SC1Z" soit "" par défaut
        if ($this->_is_SC1Z) $rcc = " SC1Z";  // Si $Z est vrai, on utilise le raccord du SC1Z
        if ($value == "En direct") {  // Si le raccordement est en direct, on ajoute le raccord et on quitte la fonction
            $this->addImage($path . "En direct" . $rcc, $coord);
            return;
        }
        $this->addImage($path . "Appoint" . $rcc, $coord); // Ajout de l'image du raccord de base

        if ($this->_formulaire['RDH_appoint1'] === "on") $value .= "RDH_app1";
        if ($this->_formulaire['locAppoint2'] == "cascade" && $this->_formulaire['RDH_appoint2'] === "on") $value .= "RDH_app2";
        if (preg_match('/réchauffeur de boucle/', $value)) $value .= "réchauffeur de boucle " . $this->_formulaire['Gauche_droite'];

        if ($value === "Appoint double") $this->addImage($path . 'double sur', $coord);

        foreach ($list_str as $str) {
            if (strpos($value, $str) !== false) $this->addImage($path . $str, $coord);
            if (($str == "simple T16" && strpos($value, $str) !== false)
                || ($str == "tampon" && strpos($value, $str) !== false)) break;
        }
    }

    /**
     * Ajoute les images pour le ballon tampon à l'imageManager, avec les échangeurs s'il y en a.
     * @param int[] $coord
     */
    private function setImageBallonTampon($coord){
        $path = "ballonTampon/";
        $BT_val = $this->_formulaire['ballonTampon'];
        if ($BT_val == "Aucun") return;
        // Ici, dans le cas d'un ballon tampon en eau chaude sanitaire, on décale l'image de 110px car l'image est plus grande
        else if ($BT_val == "ballon tampon en eau chaude sanitaire") {
            $new_coord = [$coord[0] - 110, $coord[1]];
            $this->addImage($path . $BT_val . " " . $this->_formulaire['EchangeurDansBT'], $new_coord);
            $this->addImage($path . "extension ballon solaire", [783, 235]);
        } else {
            $this->addImage($path . $BT_val . " " . $this->_formulaire['EchangeurDansBT'], $coord);
        }

        // Ensuite, on place le vase d'expansion si toutes les conditions sont réunies
        if (
            $this->_formulaire['EchangeurDansBT'] === "on" &&
            !(
                (preg_match('/échangeur/', $this->_formulaire['raccordementHydraulique'])) &&
                (preg_match('/charge BTC/', $this->_formulaire['optionS10']) || preg_match('/charge BTC/', $this->_formulaire['optionS11']))
            )
        ) {
            $this->addImage($path . "vase d'expension", $coord);
        }
    }

    /**
     * Ajoute les images nécessaires aux divers éléments.
     * @param array $list_coord
     */
    private function setImageDivers($list_coord){
        $divers = $this->_formulaire['divers'];

        if ($this->_formulaire['D3'] === "on") $this->addImage("divers/comptage energétique utile solaire D3", $list_coord["comptage energétique utile solaire D3"]["coordImg"]);
        if ($this->_formulaire['D5'] === "on") $this->addImage("divers/comptage energétique utile appoint D5", $list_coord["comptage energétique utile appoint D5"]["coordImg"]);
        if (preg_match('/pompe/', $divers)) {
            $this->addImage("divers/" . $divers, $list_coord[$divers]["coordImg"]);
        } else if ($divers == "deshu sur appoint 1" || $divers == "radiateur sur appoint 1") {
            $this->addImage("divers/".$divers, $list_coord[$divers]["coordImg"]);
            if ($this->_formulaire['raccordementHydraulique'] == "En direct") {
                $this->addImage("divers/appoint inde", $list_coord["appoint inde"]["coordImg"]);
            }
        }
    }

    /**
     * Ajoute toutes les images nécessaires aux options S10 et S11.
     * @param array $list_coord
     */
    private function setImageOptions($list_coord){
        $OPTIONS = ["optionS10", "optionS11"];
        $PATH = "option/";
        for ($i = 0; $i < count($OPTIONS); $i++) {
            $value = str_replace(['>', '<'], 'x', $this->_formulaire[$OPTIONS[$i]]); // On remplace les caractères < ou > par x car un nom d'image ne peut pas les contenir
            if (isset($list_coord[$value])) {
                switch ($value) {
                    case "charge BTC si excédent APP1 sur T16 & T6 x T5":
                    case "Aquastat différentiel ON si T15 x T5":
                        $fullPath = $PATH . "optionBT/";
                        $this->addImage($fullPath . "raccordement " . $this->_formulaire['ballonTampon'], $list_coord[$value]["coordImg"]);
                        $fullPath .= $value;
                        // Dans le cas d'un aquastat, il faut le positionner soit à gauche soit à droite
                        if ($value == "Aquastat différentiel ON si T15 x T5") {
                            if (preg_match('/gauche/', $this->_formulaire['divers'])) $fullPath .= " gauche";
                            else $fullPath .= " droite";
                        }
                        break;
                    case "Free Cooling Zone 1":
                    case "Free Cooling Zone 2":
                    case "Free Cooling Zone 3":
                    case "Free Cooling Zone 4":
                    case "V3V décharge zone 1":
                    case "Décharge sur zone 1":
                        // On commence par pointer la bonne image
                        preg_match('/\s(\d)/', $value, $matches);
                        $zone = (int)$matches[0];
                        if ($this->_nb_zone != 4) {   // Si toutes les zones ne sont pas présentes, il faut décaler de 1
                            $zone++;
                            if ($this->_nb_zone != 3 && $this->_is_SC1Z) $zone++;
                            if ($this->_is_SC1Z && ($zone == 3 || $zone == 2)) $value = preg_replace('/ \d/', ' ' . $zone . ' SC1Z', $value); // On change l'image du Free Cooling Zone 3 pour le SC1Z
                            $value = preg_replace('/ \d/', ' ' . $zone, $value);
                        }
                        if (preg_match('/Free Cooling/', $value)) {
                            $fullPath = $PATH . "free_cooling/" . $value;
                        } else if (preg_match('/Décharge sur zone/', $value)) {
                            // On déclare les variables qui servent à détecter les PC et SC1Z
                            $pc = (preg_match('/Plancher chauffant|PC/', $this->_formulaire['circulateurC1'])) ? " pc" : "";
                            $sc1z = $this->_is_SC1Z ? " SC1Z" : "";

                            $value = "Décharge sur zone 1" . $sc1z;
                            $fullPath = $PATH . "decharge/décharge zone " . $zone . $pc . $sc1z;
                        } else {
                            $fullPath = $PATH . "V3V décharge zone 1";
                        }
                        break;
                    case "ON en mode excédent d'énergie l'été":
                        $fullPath = $PATH . $value . " " . $OPTIONS[$i]; // Dans ce cas, l'image doit changer en fonction de S10 ou S11
                        break;
                    default:
                        $fullPath = $PATH . $value;
                }
                $this->addImage($fullPath, $list_coord[$value]["coordImg"]);
            }
        }
    }

    /**
     * Ajoute les labels pour les options S10 et S11 aux bons emplacements, grâce aux données contenues dans $list_coord.
     * @param array $list_coord
     */
    private function setLabelOptions($list_coord){
        $OPTIONS = ["optionS10", "optionS11"];
        $compteur = [0];
        for ($i = 0; $i < count($OPTIONS); $i++) {
            $value = str_replace(['>', '<'], 'x', $this->_formulaire[$OPTIONS[$i]]); // On remplace les caractères < ou > par x car un nom d'image ne peut pas les contenir
            if (isset($list_coord[$value])) {
                $text_label = ($i == 0) ? "S10" : "S11";
                switch ($value) {
                    case "Aquastat différentiel ON si T15 x T5":
                        // Permet d'adapter la position du label pour qu'il aille à gauche ou à droite en fonction de la position de la pompe double
                        if (!preg_match('/gauche/', $this->_formulaire['divers'])) $list_coord[$value]["coordLabel"] = [296, 164];
                        else $list_coord[$value]["coordLabel"] = [233, 164];
                        break;
                    case "V3V bypass appoint 1":
                        $compteur[0]++;
                        if ($compteur[0] == 2) { // Ici, nous sommes dans le cas d'une V3V bypass pilotée sur 3 points, donc nous ajoutons un nouveau label légèrement en dessous du premier
                            $list_coord[$value]["coordLabel"] = [$list_coord[$value]["coordLabel"][0], $list_coord[$value]["coordLabel"][1] + 10];
                        }
                        break;
                    case "recharge nappes goethermiques sur T15 sur échangeur BTC":
                    case "Electrovanne Appoint 1 ou Flow Switch":
                        $this->addLabel($text_label, $list_coord[$value]["coordLabel2"], 8);
                        break;
                    case "ON en mode excédent d'énergie l'été":
                        if ($i == 1) $list_coord[$value]["coordLabel"] = $list_coord[$value]["coordLabel2"];
                }

                // Si $coordLabel est défini, cela signifie qu'il faut ajouter un label au schéma d'exécution
                if (isset($list_coord[$value]["coordLabel"])) {
                    $this->addLabel($text_label, $list_coord[$value]["coordLabel"], 8);
                }
            }
        }
    }

    /**
     * Ajoute tous les labels pour la légende, c'est-à-dire la description de l'affaire et le titre.
     * @param array $list_coord
     */
    private function setLegend($list_coord){
        // Si l'installation est un SC1Z, on doit décaler la légende
        if ($this->_is_SC1Z) {
            foreach ($list_coord as &$coord) {
                $coord[1] -= 60;
            }
        }

        // Partie titre
        $title = "Schéma d'exe |S|olis |C|onfort |SC|" . str_replace("SC", "", $this->_formulaire['typeInstallation']);
        $this->addTitle($title, $list_coord['title']);

        // Partie description de l'affaire
        $this->addImage("legend_desc_affaire", $list_coord['img_desc_affaire']); // On ajoute d'abord l'image du rectangle

        // Ensuite, on ajoute les labels de la description de l'affaire
        $date = (new DateTime())->format("d/m/Y");
        $coord_date = [$list_coord['img_desc_affaire'][0] + 275, $list_coord['img_desc_affaire'][1] + 65];
        $coord_affaire = [$list_coord['img_desc_affaire'][0] + 7, $list_coord['img_desc_affaire'][1] + 65];
        $coord_description = [$list_coord['img_desc_affaire'][0] + 7, $list_coord['img_desc_affaire'][1] + 17];

        $affaire_value = "non renseigné";
        if (!empty($this->_formulaire['nom_client']) || !empty($this->_formulaire['prenom_client'])) {
            $affaire_value = strtoupper($this->_formulaire['nom_client']) . " " . $this->_formulaire['prenom_client'];
        }
        $this->addLabel("Affaire : " . $affaire_value, $coord_affaire);

        $desc = str_replace("Schéma", "Schéma d'exe", $this->_formulaire['description']);
        $this->addParagraphe($desc , $coord_description, 57);
        $this->addLabel($date, $coord_date);

        // Partie nom des options
        $this->addLabel("Option S10: " . getOptionS10($this->_formulaire), $list_coord['label_optionS10']);
        $this->addLabel("Option S11: " . getOptionS11($this->_formulaire), $list_coord['label_optionS11']);
    }




}
?>
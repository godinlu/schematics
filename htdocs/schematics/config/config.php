<?php 
const VERSION = "2.0.24";
//cette constante une fois indiqué à true va forcer le rechargement des fichiers javaScript pour
//éviter qu'ils soit mis en cache
const DISABLED_CACHE = false;

//constante d'url
define('APP_BASE_PATH' , __DIR__ . '/../');
define('URL_FICHE_PROG', APP_BASE_PATH.'models/FicheProg.php');
define('URL_DATA_FORM', APP_BASE_PATH . "models/DataForm.php");
define('URL_FORMULAIRE_UTILS', APP_BASE_PATH.'config/utils/formulaire_utils.php');
define('URL_SCHEMA', APP_BASE_PATH.'models/schema/Schema.php');
define('URL_SCHEMA_HYDRAULIQUE',APP_BASE_PATH . 'models/schema/SchemaHydrau.php');
define('URL_SCHEMA_HYDRAULIQUE_WITH_LEGEND',APP_BASE_PATH . 'models/schema/SchemaHydrauWithLegend.php');
define('URL_SCHEMA_EXE',APP_BASE_PATH . 'models/schema/SchemaExe.php');
define('URL_ETIQUETAGE',APP_BASE_PATH . 'models/schema/Etiquetage.php');
define('URL_IMAGE_FICHE_PROG',APP_BASE_PATH . 'models/schema/ImageFicheProg.php');
define('URL_DATA_DEVIS', APP_BASE_PATH.'models/client/DataDevis.php');
define('URL_DEVIS_DEFAULT_INDEX', APP_BASE_PATH.'config/client/devis_default_index.json');
define('URL_FPDF' , APP_BASE_PATH . "config/libraries/fpdf/fpdf.php");

const FORM_SONDES = 'sondes';
const FORM_OPTION_S10 = 'optionS10';
const FORM_OPTION_S11 = 'optionS11';
const FORM_CHAMP_CAPTEUR = 'champCapteur';
const FORM_TYPE_INSTALLATION = 'typeInstallation';
const FORM_NOM_AFFAIRE = 'nom_affaire';
const FORM_ECHANGEUR_DANS_BT = 'EchangeurDansBT';
const FORM_BALLON_TAMPON = 'ballonTampon';
const FORM_BALLON_ECS = 'ballonECS';
const FORM_APPOINT_1 = 'appoint1';
const FORM_APPOINT_2 = 'appoint2';
const FORM_TYPE_APPOINT_1 = 'typeAppoint1';
const FORM_LOC_APPOINT_2 = 'locAppoint2';

const AUCUN = 'Aucun';

if (DISABLED_CACHE) echo "CACHE DESACTIVE";

class DependencyLoader {
    private $_dependences;
    private $_pageName;
    private $_part;
    private $_version;
    
    public function __construct(string $pageName, string $part = 'client') {
        $fileContent = file_get_contents("config/dependences.json");
        $this->_dependences = json_decode($fileContent, true);
        $this->_pageName = $pageName;
        $this->_part = $part;
        $this->_version = (DISABLED_CACHE)? date('Y-m-d H:i:s') : VERSION;
    }
    
    public function includeCSS() {
        $public_files = $this->_dependences['css'][$this->_part]['public'] ?? [];
        $private_files = $this->_dependences['css'][$this->_part][$this->_pageName] ?? [];
        $version = 

        $cssFiles = array_merge($public_files, $private_files);
        foreach($cssFiles as $path) {
            echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"../public/css/".$path."?v=".$this->_version."\">";
        }
    }
    
    public function includeJS() {
        $this->includeCDN();
        $public_files = $this->_dependences['js'][$this->_part]['public'] ?? [];
        $private_files = $this->_dependences['js'][$this->_part][$this->_pageName] ?? [];

        $jsFiles = array_merge($public_files, $private_files);
        foreach($jsFiles as $path) {
            echo "<script type=\"text/javascript\" src=\"../public/js/".$path."?v=".$this->_version."\" defer=\"defer\"></script>";
        }
        
    }

    private function includeCDN(){
        $cssFiles = $this->_dependences['cdn'][$this->_pageName] ?? [];
        foreach($cssFiles as $path) {
            echo "<script type=\"text/javascript\" src=\"".$path."\"></script>";
        }
    }
}

    
?>
<?php
require_once (URL_DATA_DEVIS);

class DataForm{
    private static string $FORMULAIRE = "formulaire";
    private static string $FICHE_PROG = "fiche_prog";
    private static string $DEVIS = "devis";
    private static string $DEVIS2 = "devis2";

    public function __construct(){
        if (session_status() !== PHP_SESSION_ACTIVE){
            throw new Exception("la session doit être activé");
        }

        $this->saveAll();

        $this->uploadFile();
    }

    public function saveFormulaire(array $formulaire){
        if (empty($formulaire['nom_client'])){
            $formulaire[FORM_NOM_AFFAIRE] = '-'. date('dmY');
        }else{
            $formulaire[FORM_NOM_AFFAIRE] = '-' . $formulaire['nom_client'] .'-'. date('dmY');
        }
        $_SESSION[self::$FORMULAIRE] = $formulaire;
    }
    public function getFormulaire(): array|null{
        return ($_SESSION[ self::$FORMULAIRE ])?? null;
    }
    public function clearFormulaire(){
        unset($_SESSION[self::$FORMULAIRE]);
    }

    public function clear_devis2(){
        unset($_SESSION[self::$DEVIS2]);
    }

    public function saveFiche_Prog(array $fiche_prog){
        $_SESSION[self::$FICHE_PROG] = $fiche_prog;
    }
    public function getFiche_prog():array|null{
        return ($_SESSION[self::$FICHE_PROG])?? null;
    }
    public function clearFiche_prog(){
        unset($_SESSION[self::$FICHE_PROG]);
    }


    public function saveDevis(array $devis){
        //ici au moment de sauvegarder le devis on parcours chaque éléments pour décoder les champs multiples
        foreach($devis as $key => $value){
            if (!is_string($value)) continue;
            $temp = json_decode($value);
            if (isset($temp)){
                $devis[$key] = $temp;
            }
        }
        $_SESSION[self::$DEVIS] = $devis;
    }

    public function save_devis2(array $post_data){
        if (isset($post_data["actions"])){
            $post_data["actions"] = json_decode($post_data["actions"], true);
        }
        $_SESSION[self::$DEVIS2] = $post_data;
    }

    public function getDevis():DataDevis{
        $devis_index = ($_SESSION[self::$DEVIS])?? null;
        return new DataDevis($_SESSION[self::$FORMULAIRE] , $devis_index);
    }

    public function get_devis2() : ?array {
        return ($_SESSION[self::$DEVIS2])?? null;
    }
    public function clearDevis(){
        unset($_SESSION[self::$DEVIS]);
    }
    
    private function saveAll(){
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_SERVER['HTTP_REFERER'])) return;
            $url = explode('/', filter_var($_SERVER['HTTP_REFERER'], FILTER_SANITIZE_URL));
            $sender_name = $url[count($url) - 1];
            

            if (strpos($sender_name , self::$FORMULAIRE) !== false){
                $this->saveFormulaire($_POST);
            }else if (strpos($sender_name , self::$FICHE_PROG) !== false){
                $this->saveFiche_Prog($_POST);
            }else if (strpos($sender_name , self::$DEVIS2) !== false){
                $this->save_devis2($_POST);
            }else if (strpos($sender_name , self::$DEVIS) !== false){
                $this->saveDevis($_POST);
            }
        }
    }

    private function uploadFile(){
        if (isset($_FILES['fichier'])  &&  $_FILES['fichier']['error'] === UPLOAD_ERR_OK){
            $fichierJson = $_FILES['fichier']['tmp_name'];

            // Lire le contenu du fichier JSON
            $contenuJson = file_get_contents($fichierJson);
            
            // Traiter les données JSON
            $donnees = json_decode($contenuJson, true);

            if (!isset( $donnees['formulaire'] )){
                $donnees = $this->formatData($donnees);
            }
            

            $this->saveFormulaire($donnees['formulaire']);
            if (isset($donnees['devis'])) $this->saveDevis($donnees['devis']);
            if (isset($donnees['fiche_prog'])) $this->saveFiche_Prog($donnees['fiche_prog']);
        }
    }

    /**
     * cette fonction prend en paramètre un array qui est l'ancien format de sauvegarde de données
     * et renvoie ces données au nouveau format 
     */
    private function formatData(array $data): array{
        $res = array(
            'formulaire' => array(),
            'devis' => null,
            'fiche_prog' => array()
        );
        foreach($data as $key => $value){
            if ($key === 'devis'){
                $res['devis'] = $value;
            }else if ($key === 'commentaire' || $key === 'Delai' || $key === 'NumCommande' || $key === 'NumSerie'){
                $res['fiche_prog'][$key] = $value;
            }else if ($key !== 'sondesPrise'){
                if ($value === 'oui') $value = 'on';
                else if ($value === 'non') $value = 'off';
                $res['formulaire'][$key] = $value;
            }
        }

        if (!isset($res['formulaire']['RH_appoint2'])){
            $res['formulaire']['RH_appoint2'] = 'simple';
        }

        return $res;
    }
}
?>
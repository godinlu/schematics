<?php
require_once ("../models/DevisManager.php");

const PRENOM_CLIENT = "prenom_client";
const NOM_CLIENT = "nom_client";
const CODE_POSTAL_CLIENT = "code_postale_client";
const VILLE_CLIENT = "ville_client";

const SOCIETE_INSTALLATEUR = "installateur";
const PRENOM_NOM_INSTALLATEUR = "Prénom/nom";
const MAIL_INSTALLATEUR = "adresse_mail";

const OBJET_DEVIS = "objet";
const COUT_TOTAL_DEVIS = "cout_total";
const TAUX_REMISE_DEVIS = "taux_remise";
const NOM_COMMERCIAL_DEVIS = "nom_commercial";

const ARTICLES = "articles";
const REF_ARTICLE = "ref";
const QTE_ARTICLE = "qte";

try{
    // Récupérer les données JSON envoyées
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);

    // Vérifier si les données ont été correctement décodées
    if ($data === null) {
        throw new Exception("données Json invalide");
    }

    try{
        $client = new Client(array());
        $client->setPrenom($data[PRENOM_CLIENT]);
        $client->setNom($data[NOM_CLIENT]);
        $client->setCode_postal($data[CODE_POSTAL_CLIENT]);
        $client->setVille($data[VILLE_CLIENT]);
    }catch (Exception $e){
        throw new Exception("Client : ".$e->getMessage());
    }
    $devis = new Devis(array());
    $devis->setDate(date('Y-m-d H:i:s'));
    $devis->setObjet($data[OBJET_DEVIS]);
    $devis->setCout_total($data[COUT_TOTAL_DEVIS]);
    $devis->setTaux_remise($data[TAUX_REMISE_DEVIS]);
    $devis->setNom_commercial($data[NOM_COMMERCIAL_DEVIS]);
    $devis->setClient($client);

    if (!empty($data[SOCIETE_INSTALLATEUR])){
        $installateur = new Installateur(array());
        $installateur->setSociete($data[SOCIETE_INSTALLATEUR]);
        $installateur->setPrenom_nom($data[PRENOM_NOM_INSTALLATEUR]);
        $installateur->setMail($data[MAIL_INSTALLATEUR]);

        $devis->setInstallateur($installateur);
    }

    $devis_manager = new DevisManager;
    $id_devis = $devis_manager->getIdDevis($devis);
    if ($id_devis !== -1){
        //alors on update le devis
        $devis_manager->updateDevis($devis, $id_devis);
        $devis_manager->updateComposition($id_devis, $data[ARTICLES]);
        echo "Le devis à été mis à jour avec succès";
    }else{
        //alors on insert le devis
        $id_devis = $devis_manager->insertDevis($devis);
        $devis_manager->insertComposition($id_devis, $data[ARTICLES]);
        echo "Le devis à été insérer avec succès";
    }
    
    
    http_response_code(200);
    

}catch (Exception $e){
    http_response_code(200); 
    echo "Le devis n'a pas pu être sauvegardé : " . $e->getMessage();
}

?>
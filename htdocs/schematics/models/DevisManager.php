<?php
require_once "Model.php";
require_once "Devis.php";

class DevisManager extends Model{

    public function getAllDevis($whereClauses = null){
        $list_devis = [];

        $query = "SELECT * FROM Devis";
        if (isset($whereClauses)){
            $query.= " WHERE ". $whereClauses;
        }  
        $request = $this->getBdd()->prepare($query);
        $request->execute();

        $installateurs = $this->getAll('Installateur','Installateur');
        $clients = $this->getAll('Client','Client');
        
        while($data = $request->fetch(PDO::FETCH_ASSOC)){
            $devis = new Devis($data);
            //on ajout l'installateur au devis si il existe
            if (isset($data['id_installateur'])){
                foreach($installateurs as $installateur){
                    if ($installateur->getId() === $data['id_installateur']){
                        $devis->setInstallateur($installateur);
                    }
                }
            }
            foreach($clients as $client){
                if ($client->getId() === $data['id_client']){
                    $devis->setClient($client);
                }
            }

            $list_devis[] = $devis;
        }
        $this->setComposition($list_devis);
        return $list_devis;

    }

    private function setComposition(array $list_devis){
        $query = "SELECT id_devis, quantite, ref, label,prix FROM Composition JOIN Tarif ON Composition.ref_article = Tarif.ref";

        $request = $this->getBdd()->prepare($query);
        $request->execute();

        while($data = $request->fetch(PDO::FETCH_ASSOC)){
            foreach($list_devis as $devis){
                if ($devis->getId() === $data['id_devis']){
                    $devis->addArticle(new Article($data) , $data['quantite']);
                }
            }
        }
    }

    public function insertDevis(Devis $devis):int{
        $id_installateur = null;

        if ($devis->getInstallateur() !== null){
            $id_installateur = $this->getIdInstallateur($devis->getInstallateur());
            if ($id_installateur === -1 ){
                $id_installateur = $this->insertInstallateur($devis->getInstallateur());
            }
        }
        //si l'on insert un devis cela veut forcément dire que le client n'éxiste pas
        $id_client = $this->insertClient($devis->getClient());

        return $this->insert('Devis',array(
            'date' => $devis->getDate()->format('Y-m-d H:i:s'),
            'objet' => $devis->getObjet(),
            'cout_total' => $devis->getCout_total(),
            'taux_remise' => $devis->getTaux_remise(),
            'nom_commercial' => $devis->getNom_commercial(),
            'id_installateur' => $id_installateur,
            'id_client' => $id_client
        ));
        
    }

    public function insertComposition(string $id_devis, array $articles){
        foreach($articles as $article){
            $data = array(
                'id_devis' => $id_devis,
                'ref_article' => $article[REF_ARTICLE],
                'quantite' => $article[QTE_ARTICLE]
            );
            $this->insert('Composition', $data);
        }
    }

    /**
     * cette fonction met à jour la composition elle commence par supprimer toutes les lignes associé et les recréer
     */
    public function updateComposition(string $id_devis, array $articles){
        $this->delete('Composition', array('id_devis' => $id_devis));
        $this->insertComposition($id_devis, $articles);
    }

    private function insertInstallateur(Installateur $installateur):int{
        return $this->insert('Installateur', array(
            'societe' => $installateur->getSociete(),
            'prenom_nom' => $installateur->getPrenom_nom(),
            'mail' => $installateur->getMail()
        ));
    }
    private function insertClient(Client $client):int{
        return $this->insert('Client', array(
            'prenom' => $client->getPrenom(),
            'nom' => $client->getNom(),
            'code_postal' => $client->getCode_postal(),
            'ville' => $client->getVille()
        ));  
    }

    public function updateDevis(Devis $devis, int $id_devis){
        if ($devis->getInstallateur() !== null){
            $query = "SELECT id_installateur FROM Devis WHERE id = :id";
            $req = $this->getBdd()->prepare($query);
            $req->execute(array('id' => $id_devis));
            $id_installateur = $req->fetchAll(PDO::FETCH_ASSOC)[0]['id_installateur'];

            //si l'installateur existe déjà alors on l'update sinon on l'insert
            if (isset($id_installateur)){
                $this->updateInstallateur($devis->getInstallateur(), $id_installateur);
            }else{
                $id_installateur = $this->insertInstallateur($devis->getInstallateur());
            }
        }
    
        $data = array(
            'date' => $devis->getDate()->format('Y-m-d H:i:s'),
            'objet' => $devis->getObjet(),
            'cout_total' => $devis->getCout_total(),
            'taux_remise' => $devis->getTaux_remise(),
            'nom_commercial' => $devis->getNom_commercial(),
            'id_installateur' => $id_installateur
        );
        $this->update('Devis', $data , array('id' => $id_devis));
    }

    /**
     * cette fonction revoie l'id du devis dans la base si le devis existe
     * pour qu'un devis soit considéré comme existant il suffit que le client soit reconnu
     * et renvoie -1 si il n'existe pas 
     */
    public function getIdDevis(Devis $devis):int{
        $id_client = $this->getIdClient($devis->getClient());
        var_dump($id_client);
        $data = array('id_client' => $id_client);
        $existing_devis = $this->getAll('Devis','Devis', $data);
        if (count($existing_devis) > 0 ){
            return $existing_devis[0]->getId();
        }else{
            return -1;
        }
    }

    private function updateInstallateur(Installateur $installateur, int $id_installateur){
        $data = array(
            'societe' => $installateur->getSociete(),
            'prenom_nom' => $installateur->getPrenom_nom(),
            'mail' => $installateur->getMail()
        );
        $this->update('Installateur',  $data, array('id' => $id_installateur));

    }
    /**
     * cherche dans la base de donné si l'installateur passé en paramètre existe déjà dans la base de donné
     * si oui alors on renvoie sont id si non alors on renvoie -1
     */
    private function getIdInstallateur(Installateur $installateur):int{
        $data = [
            'societe' => $installateur->getSociete(),
            'prenom_nom' => $installateur->getPrenom_nom(),
            'mail' => $installateur->getMail()
        ];
        $existing_installateurs = $this->getAll('Installateur','Installateur',$data);
        if (count($existing_installateurs) === 1 ){
            return $existing_installateurs[0]->getId();
        }else{
            return -1;
        }
    }

    /**
     * cherche dans la base de donné si le client passé en paramètre existe déjà dans la base de donné
     * si oui alors on renvoie sont id si non alors on renvoie -1
     */
    private function getIdClient(Client $client):int{
        $data = [
            'prenom' => $client->getPrenom(),
            'nom' => $client->getNom(),
            'code_postal' => $client->getCode_postal(),
            'ville' => $client->getVille()
        ];
        $existing_clients = $this->getAll('Client','Client',$data);
        if (count($existing_clients) > 0 ){
            return $existing_clients[0]->getId();
        }else{
            return -1;
        }
    }

}
?>
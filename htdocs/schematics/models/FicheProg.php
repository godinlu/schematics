<?php
require_once (URL_FORMULAIRE_UTILS);

class FicheProg{
    private array $_formulaire;
    private ?array $_fiche_prog;

    public function __construct(array $formulaire , ?array $fiche_prog){
        $this->_formulaire = $formulaire;
        $this->_fiche_prog = $fiche_prog;
    }

    private function getAppoint1():string{
        $appoint1 = $this->_formulaire['appoint1'];
        if ($appoint1 === AUCUN) return AUCUN;

        $type = ($appoint1 === 'Autre')? $this->_formulaire['typeAppoint1'] : $appoint1;
        return $type . ', ' . $this->_formulaire['Zone'];
    }

    private function getAppoint2():string{
        if ($this->_formulaire['locAppoint2'] === AUCUN) return AUCUN;

        $str = $this->_formulaire['appoint2'];
        if (!empty($this->_formulaire['puissanceApp1Multiple'])){
            $str .= $this->_formulaire['puissanceApp1Multiple'] . ' KW';
        } 
        return $str . ', ' . $this->_formulaire['ZoneMultiple'];
    }

    public function getTitle():string{
        return 'module ' . $this->_formulaire[FORM_TYPE_INSTALLATION];
    }
    public function getHeader():array{
        return array(
            ['Date' , date('d/m/Y')],
            'delai' =>['Délai' , ($this->_fiche_prog['delai'])?? ""],
            'numCommande' => ['N° de commande', ($this->_fiche_prog['numCommande'])?? ""],
            'numSerie' => ['N° de série' ,($this->_fiche_prog['numSerie'])?? ""]
        );
    }
    public function getContent():array{
        //cette variable est une liste de tout les choix de ballon ECS qui comporte 2 ballons
        $ballon2 = array(
            "ballon ECS et ballon appoint en série",
            "ballon ECS et ballon appoint en série avec bouclage sanitaire",
            "ballon d'eau chaude sur échangeur",
            "ballon elec en sortie ballon solaire avec bouclage sanitaire"
        );
        if (in_array($this->_formulaire['ballonECS'] , $ballon2)) $nb_ballon_ecs = 2;
        else if ($this->_formulaire['ballonECS'] !== AUCUN ) $nb_ballon_ecs = 1;
        else $nb_ballon_ecs = 0;

        $champs_capteur = $this->_formulaire['champCapteur'];

        $surface_capteurs = (!empty($this->_formulaire['champCapteur_surface']))?
             $this->_formulaire['champCapteur_surface'] . ' m²' : "";

        return array(
            ['Installateur' , $this->_formulaire['installateur']],
            ['Prénom/Nom' ,  $this->_formulaire['Prénom/nom']],
            ['Adresse mail' , $this->_formulaire['adresse_mail'] ],
            ['Commercial' , $this->_formulaire['commercial'] ],

            ['Client'],
            ['Nom' , $this->_formulaire['nom_client'] ],
            ['Prénom' , $this->_formulaire['prenom_client'] ],
            ['Adresse' , $this->_formulaire['adresse_client'] ],
            ['Code postale' , $this->_formulaire['code_postale_client'] ],
            ['Ville' , $this->_formulaire['ville_client'] ],
            ['Tél' , $this->_formulaire['tel_client'] ],
            ['Mail' , $this->_formulaire['mail_client'] ],

            ['Installation'],
            ['Ballon tampon' , ($this->_formulaire['ballonTampon'] !== AUCUN)? 'oui' : 'non'],
            ['Nombre de ballon ECS' , $nb_ballon_ecs ],
            ['Nombre de champs capteurs' ,  $champs_capteur ],
            ['Surface capteurs' , $surface_capteurs ],
            ['Type d\'appoint 1' , $this->getAppoint1() ],
            ['Type d\'appoint 2' , $this->getAppoint2() ],
            ['Sortie 48 (option)' , getOptionS10($this->_formulaire) ],
            ['Sortie 49 (option)' , getOptionS11($this->_formulaire) ],       

            ['Type d\'émetteur'],
            ['Circulateur C1' , $this->_formulaire['circulateurC1'] ],
            ['Circulateur C2' , $this->_formulaire['circulateurC2'] ],
            ['Circulateur C3' , $this->_formulaire['circulateurC3'] ],
            ['Circulateur C7' , $this->_formulaire['circulateurC7'] ],
            'commentaire' => ['Commentaire' , ($this->_fiche_prog['commentaire'])?? '' ],

        );
    }
    public function getName():string{
        return 'ficheProg' . $this->_formulaire[FORM_NOM_AFFAIRE];
    }
}

?>
<?php 
require_once ('views/View.php');
require_once ('models/Authentification.php');
require_once ('models/DevisManager.php');

class ControllerDevis
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->devis();
        
    }


    private function devis()
    {
        Authentification::test();
        $devisManager = new DevisManager;
        $list_devis = $devisManager->getAllDevis();
       
        //ici on précise que la vue est admin
        $this->_view = new View('Devis', 'admin');
        $this->_view->generate(array(
            'list_devis' => $list_devis
        ));
    }
}

?>
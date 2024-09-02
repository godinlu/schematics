<?php 
require_once ('views/View.php');
require_once ('models/Authentification.php');

class ControllerTarif
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->tarif();
        
    }


    private function tarif()
    {
        Authentification::test();
       
        //ici on précise que la vue est admin
        $this->_view = new View('Tarif', 'admin');
        $this->_view->generate(array());
    }
}

?>
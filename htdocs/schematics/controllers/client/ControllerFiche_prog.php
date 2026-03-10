<?php 
require_once('views/View.php');

class ControllerFiche_prog
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->fiche_prog();
        
    }


    private function fiche_prog()
    {        
        $this->_view = new View('Fiche_prog');
        $this->_view->generate(array());
    }
}

?>
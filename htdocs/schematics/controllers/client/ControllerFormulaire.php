<?php 
require_once('views/View.php');

class ControllerFormulaire
{
    private $_view;
    private static $REINIT = "reinit";

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->formulaire();
        
    }


    private function formulaire()
    {


        $this->_view = new View('Formulaire');
        $this->_view->generate(array());
    }
}

?>
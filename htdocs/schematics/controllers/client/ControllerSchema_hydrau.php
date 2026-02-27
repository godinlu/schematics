<?php
require_once('views/View.php');

class ControllerSchema_hydrau{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->schema_hydrau();
        
    }


    private function schema_hydrau()
    {

        $this->_view = new View('Schema_hydrau');
        $this->_view->generate(array());
    }
}
?>
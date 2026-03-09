<?php
require_once('views/View.php');

class ControllerSchema_exe{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->schema_exe();
        
    }


    private function schema_exe()
    {
        $this->_view = new View('Schema_exe');
        $this->_view->generate(array(
        ));
    }
}
?>
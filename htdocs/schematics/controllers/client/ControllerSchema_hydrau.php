<?php
require_once('views/View.php');
require_once ('models/DataForm.php');
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
        session_start();
        $dataForm = new DataForm;
        $formulaire = $dataForm->getFormulaire();
        if (!isset($formulaire)){
            header('Location: formulaire');
            exit;
        }

        $this->_view = new View('Schema_hydrau');
        $this->_view->generate(array(
            "formulaire" => $formulaire
        ));
    }
}
?>
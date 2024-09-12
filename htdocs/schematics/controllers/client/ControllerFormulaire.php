<?php 
require_once('views/View.php');
require_once ('models/DataForm.php');
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
        session_start();
        $dataForm = new DataForm;

        if (isset($_GET['action'])){
            if ($_GET['action'] === ControllerFormulaire::$REINIT){
                $dataForm->clearFormulaire();
                $dataForm->clearFiche_prog();
                $dataForm->clearDevis();
                $dataForm->clear_devis2();
                header('location:formulaire');
                exit;
            }
        }

        $this->_view = new View('Formulaire');
        $this->_view->generate(array(
            'formulaire' => $dataForm->getFormulaire()
        ));
    }
}

?>
<?php 
require_once('views/View.php');
require_once('models/DataForm.php');
require_once(URL_FICHE_PROG);

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
        session_start();
        $dataForm = new DataForm;
        $formulaire = $dataForm->getFormulaire();
        if (!isset($formulaire)){
            header('Location: formulaire');
            exit;
        }
        $ficheProg = new FicheProg($formulaire , $dataForm->getFiche_prog());

        
        $this->_view = new View('Fiche_prog');
        $this->_view->generate(array(
            'title' => $ficheProg->getTitle(),
            'header' => $ficheProg->getHeader(),
            'content' => $ficheProg->getContent()
        ));
    }
}

?>
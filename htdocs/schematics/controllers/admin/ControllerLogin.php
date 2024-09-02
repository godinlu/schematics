<?php 
require_once ('views/View.php');
require_once ('models/Authentification.php');

class ControllerLogin
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->login();
        
    }


    private function login()
    {
        $message = null;
        if (isset($_POST['username']) && isset($_POST['password'])){
            try{
                Authentification::connect($_POST['username'] , $_POST['password']);
            }catch(Exception $e){
                $message = $e->getMessage();
            }
            
        }
       
        //ici on précise que la vue est admin
        $this->_view = new View('Login', 'admin');
        $this->_view->generate(array(
            'message' => $message
        ));
    }
}

?>
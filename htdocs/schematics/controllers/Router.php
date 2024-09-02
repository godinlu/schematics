<?php

class Router{
    private $_ctrl;
    private $_view;

    public function routeReq()
    {
        try
        {
            //CHARGEMENT AUTOMATIQUE DES CLASSES
            spl_autoload_register(function($class){
                require_once('models/'.$class.'.php');
            });

            $url = '';
            // LE CONTROLEUR EST INCLUS SELON L'ACTION DE L'UTILISATEUR
            if (isset($_GET['url']))
            {
                $url = explode('/', filter_var($_GET['url'], FILTER_SANITIZE_URL));
                $controller = ucfirst(strtolower($url[1]));
                $controllerClass = "Controller".$controller;
                $controllerFile = "controllers/".$url[0]."/".$controllerClass.".php";
                if (file_exists($controllerFile))
                {
                    require_once($controllerFile);
                    $this->_ctrl = new $controllerClass($url);
 
                    
                }
                else
                    throw new Exception('Page introuvable');
            }
            // SINON AFFICHAGE DE LA PAGE FORMULAIRE
            else
            {
                header('Location: client/formulaire');
            }

        }
        // GESTION DES ERREURS
        catch (Exception $e)
        {
            $errorMsg = $e->getMessage();
            require_once('views/viewError.php');
        }
    }
}
?>
<?php 
require_once('views/View.php');
class ControllerVersion
{
    private $_view;

    public function __construct($url)
    {
        if (isset($url) && count($url) > 2)
            throw new Exception('Page introuvable');
        else
            $this->version();
        
    }


    private function version()
    {
        // Chemin vers le fichier JSON
        $file_path = 'config/version.json';

        // Lecture du contenu du fichier JSON
        $JSONContent = file_get_contents($file_path);

        // Conversion du contenu JSON en tableau associatif PHP
        $versions = json_decode($JSONContent, true);

        // Vérification si la conversion a réussi
        if ($versions === null) {
            // Gestion des erreurs si la conversion a échoué
            throw new Exception("Erreur lors de la conversion du JSON en tableau PHP.");
        }

        $this->_view = new View('Version');
        $this->_view->generate(array(
            'versions' => $versions,
            'actual_version' => VERSION
        ));
    }
}

?>
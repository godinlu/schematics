<?php
class View{
    private $_file;
    private $_t;
    private $_part;

    public function __construct(string $action, string $part = 'client'){
        $this->_part = $part;
        $this->_file = 'views/'.$part.'/view'.$action.'.php';        
        $this->_t = $action;
    }

    // Génère et affiche la vue
    public function generate($data){
        // Partie spécifique de la vue
        $content = $this->generateFile($this->_file, $data);

        $template = "template" . ucfirst($this->_part).".php";
        // Template
        $view = $this->generateFile('views/'.$template, array(
            't' => $this->_t,
            'dependencyLoader' => new DependencyLoader($this->_t, $this->_part),
            'content' => $content));

        echo $view;
    }

    // Génère un fichier vue et renvoie le résultat produit
    private function generateFile($file, $data){
        if (file_exists($file)){
            extract($data);

            ob_start();

            require $file;

            return ob_get_clean();
        }
        else
            throw new Exception('Fichier '.$file.' introuvable');
    } 

}
?>
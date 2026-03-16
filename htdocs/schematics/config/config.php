<?php 
require_once __DIR__.'/env.php';
load_env(__DIR__ . '/.env');

define('ROOT_PATH' , __DIR__ . '/../');
define('IMG_DIR' , ROOT_PATH . 'assets/img/');

//constante d'url
if ($_SERVER['SERVER_NAME'] === "localhost"){
    define('BASE_URL', '/schematics/htdocs/schematics/');
}else{
    define('BASE_URL', '/schematics/');
}

define('ASSETS', BASE_URL . 'assets/');
define('CSS', ASSETS . 'css/');
define('JS', ASSETS . 'js/');
define('IMG', ASSETS . 'img/');

/**
 * Génère une balise <link> ou <script> avec filemtime pour le cache busting
 *
 * @param string $path Chemin relatif depuis la racine web (ex: "/assets/css/style.css")
 * @param string $type 'css' ou 'js'
 * @return string HTML à inclure
 */
function asset_tag(string $path, string $type = 'css'): string {
    $fullPath = ROOT_PATH . $path;

    // Vérifie que le fichier existe
    $version = file_exists($fullPath) ? filemtime($fullPath) : time();

    if ($type === 'css') {
        return '<link rel="stylesheet" href="' . $path . '?v=' . $version . '">' . PHP_EOL;
    } elseif ($type === 'js') {
        return '<script src="' . $path . '?v=' . $version . '" defer></script>' . PHP_EOL;
    }

    throw new Exception("Type asset inconnu: $type");
} 
?>
<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/controllers/SchemaController.php';
require_once __DIR__ . '/controllers/DevisController.php';
require_once __DIR__ . '/controllers/ArticleController.php';

$method = $_SERVER['REQUEST_METHOD'];

// Extrait le chemin relatif après BASE_URL + "api/"
// ex: /schematics/htdocs/schematics/api/schemas/hydrau/brut → schemas/hydrau/brut
$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(str_replace(BASE_URL . 'api', '', $uri), '/');

// Table de routage : "METHOD chemin" → callable
$routes = [
    'POST schemas/hydrau/brut'    => fn() => (new SchemaController())->generate('schema_hydrau_brut'),
    'POST schemas/hydrau/annote'  => fn() => (new SchemaController())->generate('schema_hydrau_annote'),
    'POST schemas/hydrau/complet' => fn() => (new SchemaController())->generate('schema_hydrau_complet'),
    'POST schemas/exe'            => fn() => (new SchemaController())->generate('schema_exe'),
    'POST schemas/etiquetage'     => fn() => (new SchemaController())->generate('etiquetage'),
    'POST schemas/fiche-prog'     => fn() => (new SchemaController())->generate('fiche_prog'),
    'POST schemas/report'         => fn() => (new SchemaController())->report(),

    'POST devis'                  => fn() => (new DevisController())->create(),
    'GET devis'                   => fn() => (new DevisController())->export(),

    'PUT articles'                => fn() => (new ArticleController())->update(),
];

$key = "$method $path";

if (isset($routes[$key])) {
    try{
        $routes[$key]();
    }catch (Exception $e){
        respond(500, [
            'error' => "Internal Server Error",
            'message' => $e->getMessage()
        ]);
    }
    
} else {
    respond(404, ['error' => "Route introuvable : $method /$path"]);
}

<?php
require_once(__DIR__ . '/config/config.php');

$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$route = str_replace(BASE_URL, '', $request);

$route = trim($route, '/');

$routes = [
    '' => 'formulaire.php',
    'formulaire' => 'formulaire.php',
    'schema_exe' => 'schema_exe.php',
    'schema_hydrau' => 'schema_hydrau.php',
    'fiche_prog' => 'fiche_prog.php',
    'devis' => 'devis.php',
    'admin' => 'admin.php'
];
if (array_key_exists($route, $routes)){
    require __DIR__ . '/pages/' . $routes[$route];
}else{
    require __DIR__ . '/pages/' . $routes[''];
}

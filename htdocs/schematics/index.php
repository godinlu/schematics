<?php
  require_once("config/config.php");
  require_once('controllers/Router.php');
  $router = new Router();
  $router->routeReq();

?>
<?php
use System\Session;
use System\WebSite;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once("prepare.php"); // Chargement de la configuration et de l'ensemble des éléments communs.

$session = Session::getInstance();

if(!isset($session->user_isConnected)) {
	$session->user_isConnected = false;
}

$website = new WebSite(ABSPATH);

$website->SetPages(array(
	"login",
	"home",
	"profil",
	"sites"
));
$website->DefaultPage("login");

$website->Run();
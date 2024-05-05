<?php
use System\Session;
use System\WebSite;

$session = Session::getInstance();

if (!isset($session->admin_isConnected)) {
	$session->admin_isConnected = false;
}

$website = new WebSite(ABSPATH . 'admin', true); // true = Enable admin mode

$website->SetPages(array(
	'login',
	'home',
	'profil',
	'admins',
	'options',
	'users'
));
$website->DefaultPage("login");

$website->Run();
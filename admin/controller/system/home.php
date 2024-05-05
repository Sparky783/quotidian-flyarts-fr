<?php
use System\ToolBox;
use System\WebSite;

// ==== Access security ====
if (!$session->admin_isConnected) {
	WebSite::redirect('login', true);
}
// =========================

global $router;

// Nom de l'utilisateur connecté
$name = $session->admin_name;

// Lien disponible pour l'utilisateur connecté
$links = "";

if (ToolBox::searchInArray($session->admin_roles, ['admin'])) {
	$links .= "<a class='btn btn-secondary btn-lg btn-block' href='" . $router->getUrl('users') . "'><i class='fas fa-cog'></i> Utilisateurs</a>";
}

if (ToolBox::searchInArray($session->admin_roles, ['admin'])) {
	$links .= "<a class='btn btn-secondary btn-lg btn-block' href='" . $router->getUrl('options') . "'><i class='fas fa-cog'></i> Options du site</a>";
}

if (ToolBox::searchInArray($session->admin_roles, ['admin'])) {
	$links .= "<a class='btn btn-secondary btn-lg btn-block' href='" . $router->getUrl('admins') . "'><i class='fas fa-cog'></i> Administrateurs</a>";
}
?>
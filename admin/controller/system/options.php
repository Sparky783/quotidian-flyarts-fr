<?php
use System\ToolBox;
use System\WebSite;
use System\Session;
use System\Options;

// ==== Access security ====
if(!$session->admin_isConnected || !ToolBox::SearchInArray($session->admin_roles, array("admin")))
	WebSite::Redirect("login", true);
// =========================

include_once(ABSPATH . "model/system/Options.php");

$session = Session::getInstance();

if(!isset($session->websiteOptions))
{
	$options = new Options();
	$options->LoadFromDatabase();
	$session->websiteOptions = serialize($options);
}
else
{
	$options = unserialize($session->websiteOptions);
}
?>
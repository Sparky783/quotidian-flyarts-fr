<?php
use System\ToolBox;
use System\WebSite;

// ==== Access security ====
if (!$session->admin_isConnected || !ToolBox::searchInArray($session->admin_roles, ['admin'])) {
	WebSite::redirect('login', true);
}
// =========================
?>
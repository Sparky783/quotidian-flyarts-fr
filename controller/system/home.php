<?php
use System\WebSite;

// ==== Access security ====
if(!$session->user_isConnected)
	WebSite::Redirect("login");
// =========================
?>
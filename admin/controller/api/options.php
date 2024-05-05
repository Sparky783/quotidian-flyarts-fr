<?php
use System\ToolBox;
use System\Session;

if(ToolBox::SearchInArray($session->admin_roles, array("admin")))
{
	$app->Post("/apply_options", function($args) {
		$session = Session::getInstance();
		
		if(isset($session->websiteOptions))
		{
			$options = unserialize($session->websiteOptions);

			// Récupération des données
			//$options->IS_OPEN_INSCRIPTION = $args['open_inscription'];

			if($options->SaveToDatabase())
				$session->websiteOptions = serialize($options);
		}
	});
}
?>
<?php
use ApiCore\Api;
use System\Session;
use Quotidian\Site;

if ($session->user_isConnected) {
	$app->post('/get_sites', function($args) {
		$session = Session::getInstance();
		$sites = Site::getList($session->user_id);
		$list = [];
		$today = new DateTime();

		foreach ($sites as $site) {
			if ($site->getNextDate() < $today) {
				$site->setToVisit(true);
			}

			$list[] = $site->toArray();
		}

		API::sendJSON(['sites' => $list]);
	});

	// Met a jour la base de données pour le site visité.
	$app->post('/visit_site', function($args) {
		$session = Session::getInstance();
		$site = Site::getById($args['id_site']);

		if ($site->getIdUser() == $session->user_id) {
			$site->setLastVisit(new DateTime());
			$site->searchNextDate();

			API::sendJSON($site->saveToDatabase());
		}

		API::sendJSON(false);
	});
}
?>
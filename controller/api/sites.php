<?php
use ApiCore\Api;
use System\Session;
use Quotidian\Site;

if ($session->user_isConnected) {
	$app->post('/sites', function($args) {
		$session = Session::getInstance();
		$sites = [];

		foreach (Site::getList($session->user_id) as $site) {
			$sites[] = $site->toArray();
		}

		$reponse = [
			'sites' => $sites
		];

		API::sendJSON($reponse);
	});

	$app->post('/add_site', function($args) {
		$session = Session::getInstance();

		$site = new Site();
		$site->setIdUser($session->user_id);
		$site->setName($args['name']);
		$site->setUrl($args['url']);
		$site->setFrequency($args['frequency']);
		$site->setNextDate(new DateTime($args['next_date']));
		$site->setLastVisit(new DateTime());
		$site->searchNextDate();

		$site->saveToDatabase();

		API::sendJSON($site->getId());
	});

	$app->post('/edit_site', function($args) {
		$session = Session::getInstance();
		$site = Site::getById($args['id_site']);

		if ($site->getIdUser() === $session->user_id) {
			$site->setName($args['name']);
			$site->setUrl($args['url']);
			$site->setFrequency($args['frequency']);
			$site->setNextDate(new DateTime($args['next_date']));
			$site->searchNextDate();
			
			API::sendJSON($site->saveToDatabase());
		}
	});

	$app->post('/remove_site', function($args) {
		$session = Session::getInstance();
		$result = Site::removeFromDatabase($args['id_site'], $session->user_id);

		API::sendJSON($result);
	});
}
?>
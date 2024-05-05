<?php
use ApiCore\Api;
use System\ToolBox;
use System\Session;
use System\User;
use Common\EmailTemplates;

if ($session->user_isConnected){
	// Met a jour les informations de l'utilisateur connecté.
	$app->post('/profil_update_infos', function($args) {
		$args['name'] = trim($args['name']);
		
		if ($args['name'] !== '') {
			$session = Session::getInstance();
			$user = User::getById($session->user_id);
			$user->setName($args['name']);
			
			if ($user->saveToDatabase()) {
				$session->user_name = $user->getName();
			
				$response = [
					'type' => 'success',
					'message' => 'Vos informations ont bien été mises à jour.'
				];
			} else {
				$response = [
					'type' => 'error',
					'message' => "Une erreur s'est produit lors de la mise à jour de vos informations."
				];
			}
		} else {
			$response = [
				'type' => 'error',
				'message' => 'Vous devez entrer un nom.'
			];
		}
		
		API::sendJSON($response);
	});

	$app->post('/profil_update_password', function($args) {
		$session = Session::getInstance();
		$old_password = sha1(sha1(AUTH_SALT) . sha1($args['old_password']));
		
		if ($args['old_password'] !== '' &&
			$args['new_password'] !== '' &&
			$args['confirm_password'] !== '' &&
			$old_password === $session->user_password &&
			$args['new_password'] === $args['confirm_password']
		){
			$user = User::getById($session->user_id);
			$user->setPassword($args['new_password']);
			
			if($user->saveToDatabase()) {
				$session->user_password = $user->getPassword();
			
				$response = [
					'type' => 'success',
					'message' => 'Votre mot de passe à été mises à jour.'
				];
			} else {
				$response = [
					'type' => 'error',
					'message' => "Une erreur s'est produit lors de la mise à jour de votre mot de passe."
				];
			}
		} else {
			$response = [
				'type' => 'error',
				'message' => "Les informations que vous avez fournis ne sont pas correcte ou ne correspondent pas."
			];
		}
		
		API::sendJSON($response);
	});

	$app->post('/profil_reinit_password', function($args) {
		$password = ToolBox::generatePassword();

		$user = User::getById($args['id_user']);
		$user->setPassword($password);
		$user->saveToDatabase();

		// E-mail d'information
		$resultEmail = false;
		$mail = new PHPMailer(true); // Passing `true` enables exceptions

		try {
			//Server settings
			$mail->isSMTP();
			$mail->Host = SMTP_HOST;
			$mail->SMTPAuth = SMTP_AUTH;
			$mail->Username = SMTP_USERNAME;
			$mail->Password = SMTP_PASSWORD;
			$mail->SMTPSecure = SMTP_SECURE;
			$mail->Port = SMTP_PORT;
			$mail->CharSet = 'utf-8';

			//Recipients
			$mail->setFrom(EMAIL_WEBSITE, 'Reinitialisation du mot de passe | ' . TITLE);
			if (ENV === 'PROD') {
				$mail->addAddress($user->getEmail(), $user->getName());
			} else { // ENV DEV
				$mail->addAddress(EMAIL_WABMASTER, $user->getName());
			}

			//Content
			$subject = 'Réinitialisation du mot de passe - ' . TITLE;
			$message = "
				Bonjour " . $user->getName() . ",
				<br /><br />
				Voici votre nouveau mot de passe. Retenez-le cette fois_ci ^^. Utilisez un gestionnaire de mot de passe si besoin.
				<br /><br />
				Mot de passe: " . $password . "
				<br /><br />
				A bientôt,
				<br /><br />
				Les Snakes
			";

			$mail->isHTML(true); // Set email format to HTML
			$mail->Subject = $subject;
			$mail->Body    = EmailTemplates::standardHtml($subject, $message);
			$mail->AltBody = EmailTemplates::standardText('Réinitialisation du mot de passe - ' . TITLE);

			$mail->send();
			$resultEmail = true;
		}
		catch (Exception $e) { }

		API::sendJSON($resultEmail);
	});
}
?>
<?php
use ApiCore\Api;
use System\ToolBox;
use System\User;
use System\Database;
use Common\EmailTemplates;
use Quotidian\Site;

if(ToolBox::SearchInArray($session->admin_roles, array("admin")))
{
	$app->Post("/users_list", function($args) {
		$users = User::GetList();
		$list = array();
		
		foreach($users as $user)
		{
			$list[] = array(
				"id_user" => $user->GetId(),
				"email" => $user->GetEmail(),
				"name" => $user->GetName(),
				"nbSites" => count(Site::GetList($user->GetId()))
			);
		}

		API::SendJSON(array('users' => $list));
	});

	$app->Post("/user_add", function($args) {
		$password = ToolBox::GeneratePassword();

		$user = new User();
		$user->SetEmail($args['email']);
		$user->SetPassword($password);
		$user->SetName($args['name']);
		
		if($user->SaveToDatabase())
		{
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
				$mail->setFrom(EMAIL_WEBSITE, 'Nouveau compte | ' . TITLE);
				$mail->addAddress($user->GetEmail(), $user->GetName());
				$mail->addAddress(EMAIL_WABMASTER,  $user->GetName());

				//Content
				$subject = "Nouveau compte - " . TITLE;
				$message = "
					Coucou " .  $user->GetName() . ",
					<br /><br />
					Wesh, voici ton compte, voici tes identifiants afin que tu puisse te connecter à l'espace d'useristration.
					Cette interface en ligne vous offre plein d'outils vous permettant de gérer le club ainsi que d'afficher ls information essentiel sur les adhérents.
					<br /><br />
					Identifiant: " . $user->GetEmail() . "<br />
					Mot de passe: " . $password . "
					<br /><br />
					Pour vous connecter, rendez-vous directement sur l'espace d'useristration en cliquant sur ce lien:<br />
					<a href='" . URL . "/user.php'>" . URL . "/user.php</a>
					<br /><br />
					Pensez à l'enregistrer dans vos favoris afin d'y avoir accès plus rapidement.
					<br /><br />
					Des zoubis,
					<br /><br />
					Quotidian
				";

				$mail->isHTML(true); // Set email format to HTML
				$mail->Subject = $subject;
				$mail->Body    = EmailTemplates::standardHtml($subject, $message);
				$mail->AltBody = EmailTemplates::standardText("Nouveau compte - " . TITLE);

				$mail->send();
				$resultEmail = true;
			}
			catch (Exception $e) { }

			if($resultEmail)
				API::SendJSON($user->GetId());
			else
				API::SendJSON(false);
		}
	});

	$app->Post("/user_edit", function($args) {
		$user = User::GetById($args['id_user']);
		$user->SetEmail($args['email']);
		$user->SetName($args['name']);

		API::SendJSON($user->SaveToDatabase());
	});

	$app->Post("/user_remove", function($args) {
		API::SendJSON(User::RemoveFromDatabase($args['id_user']));
	});

	$app->Post("/reinit_user_password", function($args) {
		$database = new Database();
		$result = $database->Query(
			"SELECT * FROM users WHERE id_user=:id_user",
			array("id_user" => intval($args['id_user']))
		);
		$user = $result->fetch();

		$password = ToolBox::GeneratePassword();

		$database->Update("users", "id_user", intval($user['id_user']),
			array(
				"password" => sha1(sha1(AUTH_SALT) . sha1($password))
			)
		);

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
			if(ENV == "PROD") {
				$mail->addAddress($user['email'], $user['name']);
			} else { // ENV DEV
				$mail->addAddress(EMAIL_WABMASTER, $user['name']);
			}

			//Content
			$subject = "Réinitialisation du mot de passe - " . TITLE;
			$message = "
				Bonjour " . $user['name'] . ",
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
			$mail->AltBody = EmailTemplates::standardText("Réinitialisation du mot de passe - " . TITLE);

			$mail->send();
			$resultEmail = true;
		}
		catch (Exception $e) { }

		API::SendJSON($resultEmail);
	});
}
?>
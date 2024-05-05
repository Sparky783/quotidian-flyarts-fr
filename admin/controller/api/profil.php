<?php
use ApiCore\Api;
use System\ToolBox;
use System\Session;
use System\Admin;
use Common\EmailTemplates;

if(ToolBox::SearchInArray($session->admin_roles, array("admin", "member")))
{
	// Met a jour les informations de l'utilisateur connecté.
	$app->Post("/profil_update_infos", function($args) {
		$args['name'] = trim($args['name']);
		
		if($args['name'] != "")
		{
			$session = Session::GetInstance();
			$admin = Admin::GetById($session->admin_id);
			$admin->SetName($args['name']);
			
			if($admin->SaveToDatabase())
			{
				$session->admin_name = $admin->GetName();
			
				$response = array(
					"type" => "success",
					"message" => "Vos informations ont bien été mises à jour."
				);
			}
			else
			{
				$response = array(
					"type" => "error",
					"message" => "Une erreur s'est produit lors de la mise à jour de vos informations."
				);
			}
		}
		else
		{
			$response = array(
				"type" => "error",
				"message" => "Vous devez entrer un nom."
			);
		}
		
		API::SendJSON($response);
	});

	$app->Post("/profil_update_password", function($args) {
		$session = Session::GetInstance();
		$old_password = sha1(sha1(AUTH_SALT) . sha1($args['old_password']));
		$password = "";
		
		if ($args['old_password'] != "" &&
			$args['new_password'] != "" &&
			$args['confirm_password'] != "" &&
			$old_password == $session->admin_password &&
			$args['new_password'] == $args['confirm_password']
		){
			$admin = Admin::getById($session->admin_id);
			$admin->setPassword($args['new_password']);
			
			if($admin->saveToDatabase())
			{
				$session->admin_password = $admin->getPassword();
			
				$response = array(
					"type" => "success",
					"message" => "Votre mot de passe à été mises à jour."
				);
			}
			else
			{
				$response = array(
					"type" => "error",
					"message" => "Une erreur s'est produit lors de la mise à jour de votre mot de passe."
				);
			}
		}
		else
		{
			$response = array(
				"type" => "error",
				"message" => "Les informations que vous avez fournis ne sont pas correcte ou ne correspondent pas."
			);
		}
		
		API::SendJSON($response);
	});

	$app->Post("/profil_reinit_password", function($args) {
		$password = ToolBox::GeneratePassword();

		$admin = Admin::GetById($args['id_admin']);
		$admin->SetPassword($password);
		$admin->SaveToDatabase();

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
			if(ENV == "PROD")
				$mail->addAddress($admin->GetEmail(), $admin->GetName());
			else // ENV DEV
				$mail->addAddress(EMAIL_WABMASTER, $admin->GetName());

			//Content
			$subject = "Réinitialisation du mot de passe - " . TITLE;
			$message = "
				Bonjour " . $admin->GetName() . ",
				<br /><br />
				Voici votre nouveau mot de passe. Retenez-le cette fois_ci ^^. Utilisez un gestionnaire de mot de passe si besoin.
				<br /><br />
				Mot de passe: " . $password . "
				<br /><br />
				Cordialement,
				<br /><br />
				L'administrateur
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
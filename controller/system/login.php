<?php
use System\Session;
use System\WebSite;
use System\RememberMe;
use System\User;
use System\UserToken;

$cookieName = "rememberme-user";
$errorHtml = "";

$session = Session::getInstance();

if ($session->user_isConnected) {
	if (isset($_GET['logout']) && $_GET['logout'] === "true") {
		$session->user_isConnected = false;

		// Supprimer le token de la BDD s'il existe.
		if($session->user_idToken > -1) {
			UserToken::removeFromDatabase($session->user_idToken);

			// On supprime le cookie de connexion
			RememberMe::removeCookie($cookieName);
		}

		$session->destroy();
	} else {
		WebSite::redirect("home", true);
	}
} else {
	// Vérifie si l'option Remember Me est active
	$cookie = isset($_COOKIE[$cookieName]) ? $_COOKIE[$cookieName] : false;

	if ($cookie) {
		list ($idToken, $tokenKey, $mac) = explode('-', $cookie);
		
		// Vérification de la correspondant avec le mac.
        if (!hash_equals(hash_hmac('sha256', $idToken . '-' . $tokenKey, AUTH_SALT), $mac)) {
            return false;
		}
		
		$token = UserToken::getById($idToken);

		// Remember Me option trouvé
		if ($token !== false) {
			if (hash_equals($token->getValue(), $tokenKey)) {
				$user = User::getById($token->getIdUser());
				saveUserInSession($user, $token->getId());
				WebSite::redirect('home', true);
			}
		}
    }

	// Sinon on tente de connecter la personne.
	if (isset($_POST['email']) && isset($_POST['password'])) {
		$email = strip_tags($_POST['email']);
		$password = strip_tags($_POST['password']);
		
		if ($email !== '' && $password !== '') {
			$password = sha1(sha1(AUTH_SALT) . sha1($password));
			$user = User::login($email, $password);
			
			if ($user !== false) { // Connexion réussi
				$idToken = -1;

				// Ajoute le cookie si souhaité
				if (isset($_POST[$cookieName]) && $_POST[$cookieName] === "on") {
					$tokenKey = UserToken::generateRandomToken();

					$token = new UserToken();
					$token->setIdUser($user->getId());
					$token->setValue($tokenKey);
					$token->saveToDatabase();

					$idToken = $token->getId();

					$result = RememberMe::CreateCookie($cookieName, $token->getId(), $tokenKey);

					if (!$result) {
						$errorHtml = "Impossible de sauvegarder le cookie de session.";
					}
				}

				saveUserInSession($user, $idToken);
				WebSite::redirect('login', true);
			} else {  // Connexion échoué
				$errorHtml = "L'E-mail ou le mot de passe est incorrect.";
			}
		} else {
			$errorHtml = "L'un des champs est vide.";
		}
	}
}

function saveUserInSession(User $user, int $idToken = -1): void
{
	$session = Session::getInstance();

	$session->user_isConnected = true;
	$session->user_id = $user->getId();
	$session->user_name = $user->getName();
	$session->user_email = $user->getEmail();
	$session->user_password = $user->getPassword();
	$session->user_status = $user->getStatus();
	$session->user_idToken = $idToken;
}
?>
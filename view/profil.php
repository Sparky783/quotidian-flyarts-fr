<?php global $router; ?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<?php include_once("HEAD.php"); ?>
		<title><?php echo TITLE; ?> - Profil</title>
		
		<link rel="stylesheet" type="text/css" href="view/css/profil.css" />
		<script type="text/javascript" src="view/js/profil.js"></script>
		<script type="text/javascript">
			var api_url = "<?php $router->API(""); ?>";
		</script>
	</head>
	<body>
		<?php include_once("HEADER.php"); ?>
		<div class="container">
			<div class="row">
				<div id="title" class="col-md-12">
					<h1 class="text-center">Espace profil</h1>
				</div>
				<section class="col-md-6 offset-md-3">
					<div class="card border-primary">
						<div id="entete" class="card-header bg-primary text-white text-center">
							<?php echo $name; ?>
						</div>
						<div id="profil" class="card-body">
							<div id="alertSuccess" class="alert alert-success alert-dismissible fade show" role="alert"></div>
							<div id="alertError" class="alert alert-danger alert-dismissible fade show" role="alert"></div>
							
							<p class="d-grid gap-2">
								<button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUpdateInfos" aria-expanded="false" aria-controls="collapseUpdateInfos">
									Modifier vos infos
								</button>
							</p>
							<p>
								<div class="collapse" id="collapseUpdateInfos" data-bs-parent="#profil">
									<form id="formUpdateInfos" class="card card-body border-info">
										<p>
											<div class="form-group">
												<label for="nameInput">Nom</label>
												<input id="nameInput" class="form-control" type="text" value="<?php echo $name; ?>">
											</div>
										</p>
										<div class="text-end">
											<button class="accepteButton btn btn-info float-right" type="submit">Modifier</button>
										</div>
									</form>
								</div>
							</p>
							<p class="d-grid gap-2">
								<button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUpdatePassword" aria-expanded="false" aria-controls="collapseUpdatePassword">
									Modifier votre mot de passe
								</button>
							</p>
							<p>
								<div class="collapse" id="collapseUpdatePassword" data-bs-parent="#profil">
									<form id="formUpdatePassword" class="card card-body border-info">
										<p>
											<div class="form-group">
												<label for="passwordOldInput">Ancien mot de passe</label>
												<input id="passwordOldInput" class="form-control" type="password">
											</div>
											<div class="form-group">
												<label for="passwordNewInput">Nouveau mot de passe</label>
												<input id="passwordNewInput" class="form-control" type="password">
											</div>
											<div class="form-group">
												<label for="passwordConfirmInput">Confirmation du mot de passe</label>
												<input id="passwordConfirmInput" class="form-control" type="password">
											</div>
										</p>
										<div class="text-end">
											<button class="accepteButton btn btn-info float-right" type="submit">Modifier</button>
										</div>
									</form>
								</div>
							</p>
						</div>
						<div class="card-footer text-center">
							<a class="btn btn-danger btn-lg btn-block" href=<?php $router->Url("login", array("logout" => "true")); ?>>Se déconnecter</a>
						</div>
					</div>
				</section>
			</div>
		</div>
		<?php include_once("FOOTER.php"); ?>
	</body>
</html>
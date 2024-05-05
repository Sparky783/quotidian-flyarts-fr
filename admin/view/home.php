<?php global $router; ?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<?php include_once("HEAD.php"); ?>
		<title><?php echo TITLE; ?> - Administration</title>
		
		<link rel="stylesheet" type="text/css" href="admin/view/css/home.css" />
		<script type="text/javascript" src="admin/view/js/home.js"></script>
		<script type="text/javascript">
			var api_url = "<?php $router->API(""); ?>";
		</script>
	</head>
	<body>
		<?php include_once("HEADER.php"); ?>
		<div class="container">
			<div class="row">
				<div id="title" class="col-md-12">
					<h1 class="text-center">Bonjour, <?php echo $name; ?></h1>
				</div>
				<section id="loginForm" class="col-md-6 offset-md-3">
					<div class="card border-primary">
						<div class="card-header bg-primary text-white text-center">
							Espace administrateur
						</div>
						<div class="card-body">
							<div class="links d-grid gap-2">
								<?php echo $links; ?>
								<span class="separator"></span>
								<a class="btn btn-danger btn-lg btn-block" href=<?php $router->Url("login", array("logout" => "true")); ?>>Se déconnecter</a>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
		<?php include_once("FOOTER.php"); ?>
	</body>
</html>
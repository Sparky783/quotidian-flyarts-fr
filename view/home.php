<?php global $router; ?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<?php include_once("HEAD.php"); ?>
		<title><?php echo TITLE; ?> - Site de suivi des sites quotidiens.</title>
		<meta name="description" content="">
		
		<link rel="stylesheet" type="text/css" href="view/css/home.css" />

		<script type="text/javascript" src="view/js/home.js"></script>
		<script type="text/javascript">
			var url_api = "<?php $router->API(""); ?>";
		</script>
	</head>
	<body>
		<?php include_once("HEADER.php"); ?>

		<main class="container">
			<section id="google">
				<a href="https://google.fr">
					<img src="view/img/google_logo.png" alt="Logo de Google" />
				</a>
			</section>
			
			<div class="row">
				<section class="col-md-12">
					<div id="topList" class="row">
						<div class="col-md-4"><h3>Ma liste</h3></div>
						<div class="col-md-8 text-end"><a class="btn btn-outline-secondary" href="<?php $router->Url("sites"); ?>">Modifier</a></div>
					</div>
					<div class="card">
						<div class="card-header">
							<div class="btn-group" role="group" aria-label="filters">
								<button class="btn btn-outline-secondary filter" type="button" data-filter-type="all">
									Tous
								</button>
								<button class="btn btn-outline-primary filter" type="button" data-filter-type="daily">
									<i class="fas fa-circle"></i>
									<span class="filter-text">Quotidiens</span>
									</button>
								<button class="btn btn-outline-danger filter" type="button" data-filter-type="weekly">
									<i class="fas fa-circle"></i>
									<span class="filter-text">Hebdomadaires</span>
								</button>
								<button class="btn btn-outline-warning filter" type="button" data-filter-type="monthly">
									<i class="fas fa-circle"></i>
									<span class="filter-text">Mensuels</span>
								</button>
								<button class="btn btn-outline-success filter" type="button" data-filter-type="yearly">
									<i class="fas fa-circle"></i>
									<span class="filter-text">Annuels</span>
								</button>
							</div>
						</div>
						<table class="card-body table table-hover">
							<tbody id="sitesList"></tbody>
						</table>
					</div>
				</section>
			</div>
		</main>
		
		<?php include_once("FOOTER.php"); ?>
	</body>
</html>
<?php global $router; ?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<?php include_once("HEAD.php"); ?>
		<title><?php echo TITLE; ?> - Administration</title>
		
		<link rel="stylesheet" type="text/css" href="view/css/sites.css" />
		<script type="text/javascript" src="view/js/sites.js"></script>
		<script type="text/javascript">
			var api_url = "<?php $router->API(""); ?>";
		</script>
	</head>
	<body>
		<?php include_once("HEADER.php"); ?>
		<div class="container">
			<div class="row">
				<section class="col-md-12">
					<h1>Gestion des Sites</h1>
					<div class="card">
						<div class="card-header clearfix">
							<span id="nbSitesText" class="float-left">Il y a <span id="nbSites"></span> sites</span>
							<button id="addSiteButton" class="btn btn-primary float-right" type="button"><i class="fas fa-plus-circle"></i> Ajouter un site</button>
						</div>
						<table id="tableSites" class="card-body table table-hover">
							<thead>
								<tr>
									<th scope="col">Nom</th>
									<th scope="col">Fréquence</th>
									<th scope="col">Prochaine date</th>
									<th class="text-right" scope="col">Actions</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
		<?php include_once("FOOTER.php"); ?>
		
		<!-- Modals -->
		<div id="editSiteModal" class="modal fade" tabindex="-1" aria-labelledby="editModalTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<form action="" method="post">
						<div class="modal-header">
							<h5 id="editModalTitle" class="modal-title">Ajouter un site</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<div class="form-group">
								<label for="name">Nom</label>
								<input id="nameInput" class="form-control" type="text">
							</div>
							<div class="form-group">
								<label for="name">Lien URL</label>
								<input id="urlInput" class="form-control" type="text">
							</div>
							<div class="form-group">
								<label for="name">Fréquence</label>
								<select id="frequencyInput" class="form-control">
									<option value="daily">Quotidien</option>
									<option value="weekly">Hebdomadaire</option>
									<option value="monthly">Mensuel</option>
									<option value="yearly">Annuel</option>
								</select>
							</div>
							<div class="form-group">
								<label for="name">Prochaine date</label>
								<input id="nextDateInput" class="form-control" type="date">
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
							<button id="acceptEditButton" class="btn btn-primary" type="submit">Ajouter</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		
		<div id="removeSiteModal" class="modal fade" tabindex="-1" aria-labelledby="removeModalTitle" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<form action="" method="post">
						<div class="modal-header">
							<h5 class="modal-title" id="removeModalTitle">Supprimer un Site</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							Voulez-vous vraiment supprimer le site "<span id="nameSite"></span>"?
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Non</button>
							<button class="btn btn-primary" type="submit">Oui</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</body>
</html>
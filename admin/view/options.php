<?php global $router; ?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<?php include_once("HEAD.php"); ?>
		<title><?php echo TITLE; ?> - Administration</title>
		
		<link rel="stylesheet" type="text/css" href="admin/view/css/options.css" />
		<script type="text/javascript" src="admin/view/js/options.js"></script>
		<script type="text/javascript">
			var api_url = "<?php $router->API(""); ?>";
		</script>
	</head>
	<body>
		<?php include_once("HEADER.php"); ?>
		<div class="container">
			<h1>Options du site internet</h1>

			<div class="row">
			</div>
		</div>
		<?php include_once("FOOTER.php"); ?>
	</body>
</html>
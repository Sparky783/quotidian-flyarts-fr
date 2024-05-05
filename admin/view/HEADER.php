<?php
use System\ToolBox;

global $router;
?>

<header>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container">
			<a class="navbar-brand" href=<?php echo URL; ?>>
				Quotidian Admin
			</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu" aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div id="navbarMenu" class="collapse navbar-collapse">
				<div class="me-auto mb-2 mb-lg-0"></div>
				<ul class="navbar-nav d-flex">
					<li class="nav-item active">
						<a class="nav-link" href=<?php $router->Url("home"); ?>>Accueil</a>
					</li>
					
					<?php if(ToolBox::SearchInArray($session->admin_roles, array("admin"))) { ?>
						<li class="nav-item">
							<a class="nav-link" href=<?php $router->Url("admins"); ?>>Utilisateurs</a>
						</li>
					<?php } ?>
					
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
							Profil
						</a>
						<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
							<li><a class="dropdown-item" href=<?php $router->Url("profil"); ?>>Profil</a></li>
							<li><hr class="dropdown-divider" /></li>
							<li><a class="dropdown-item" href=<?php $router->Url("login", array("logout" => "true")); ?>>Se déconnecter</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>
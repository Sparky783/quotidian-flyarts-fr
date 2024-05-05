<?php global $router; ?>

<header>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container">
			<a class="navbar-brand" href=<?php $router->Url("home"); ?>>
				Quotidian
			</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div id="navbarSupportedContent" class="collapse navbar-collapse">
				<div class="me-auto mb-2 mb-lg-0"></div>
				<ul class="navbar-nav d-flex">
					<li class="nav-item">
						<a class="nav-link" href=<?php $router->Url("home"); ?>>Accueil</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href=<?php $router->Url("profil"); ?>>Profil</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</header>
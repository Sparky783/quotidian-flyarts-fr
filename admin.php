<?php
use System\Session;

include_once('prepare.php'); // Chargement de la configuration et de l'ensemble des éléments communs.

$session = Session::getInstance();

include_once(ABSPATH . 'admin/index.php');
<?php

require_once "../config/config.php";
require_once "../models/Trajet.php";

$trajet = new Trajet();

$trajets = $trajet->afficherTrajets($pdo);

header('Content-Type: application/json');

echo json_encode($trajets);

?>
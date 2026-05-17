<?php

require_once "../config/config.php";
require_once "../models/Trajet.php";

$depart = $_GET['depart'] ?? '';
$destination = $_GET['destination'] ?? '';

$trajet = new Trajet();

$resultats = $trajet->rechercherTrajets(
    $pdo,
    $depart,
    $destination
);

header('Content-Type: application/json');

echo json_encode($resultats);

?>
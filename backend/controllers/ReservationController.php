<?php

session_start();

require_once "../config/config.php";
require_once "../models/Reservation.php";

$reservation = new Reservation();

$reservation->idUtilisateur =
    $_SESSION['user']['id'];

$reservation->idTrajet =
    $_POST['idTrajet'];

$reservation->nombrePlaces =
    $_POST['nombrePlaces'];

$reservation->statut = "Confirmée";

if ($reservation->reserver($pdo)) {

    echo "Réservation effectuée";

} else {

    echo "Erreur réservation";
}

?>
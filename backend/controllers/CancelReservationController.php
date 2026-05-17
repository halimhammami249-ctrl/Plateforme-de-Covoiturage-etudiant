<?php

session_start();

require_once "../config/config.php";
require_once "../models/Reservation.php";

$reservation = new Reservation();

$reservation->id = $_POST['id'];

if ($reservation->annulerReservation($pdo)) {

    echo "Réservation annulée";

} else {

    echo "Erreur";
}

?>
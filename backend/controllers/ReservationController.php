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

$reservation->statut = "En attente";

if ($reservation->reserver($pdo)) {

    echo "

<script>

alert('Demande envoyée avec succès !');

window.location.href =
'../../frontend/pages/my-trips.html';

</script>

";

} else {

    echo "Erreur réservation";
}

?>
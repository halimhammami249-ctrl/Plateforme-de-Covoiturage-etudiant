<?php

session_start();

require_once "../config/config.php";
require_once "../models/Trajet.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $trajet = new Trajet();

    // USER CONNECTED
    $trajet->idUtilisateur = $_SESSION['user']['id'];

    $trajet->lieuDepart = $_POST['lieuDepart'];
    $trajet->destination = $_POST['destination'];
    $trajet->dateHeure = $_POST['dateHeure'];
    $trajet->prixParPlace = $_POST['prixParPlace'];
    $trajet->nombrePlaces = $_POST['nombrePlaces'];

    // initially same value
    $trajet->placesDisponibles = $_POST['nombrePlaces'];

    $trajet->statut = "Disponible";

    if ($trajet->creerTrajet($pdo)) {

       echo "

<script>

alert('Trajet publié avec succès !');

window.location.href =
'../../frontend/pages/my-trips.html';

</script>

";

    } else {

        echo "Erreur lors de la création";
    }
}
?>
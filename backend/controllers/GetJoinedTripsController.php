<?php

session_start();

require_once "../config/config.php";

$userId = $_SESSION['user']['id'];

$sql = "SELECT

            Reservation.id AS reservationId,
            Reservation.nombrePlaces,
            Reservation.statut,

            Trajet.*,

            Utilisateurs.nom

        FROM Reservation

        INNER JOIN Trajet
        ON Reservation.idTrajet = Trajet.id

        INNER JOIN Utilisateurs
        ON Trajet.idUtilisateur = Utilisateurs.id

        WHERE Reservation.idUtilisateur = ?

        AND Reservation.statut = 'Acceptée'";

$stmt = $pdo->prepare($sql);

$stmt->execute([$userId]);

$trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($trajets);

?>
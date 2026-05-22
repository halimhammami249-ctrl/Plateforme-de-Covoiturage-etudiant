<?php

session_start();

require_once "../config/config.php";

$userId = $_SESSION['user']['id'];

$sql = "SELECT

            Reservation.id AS reservationId,
            Reservation.nombrePlaces,
            Reservation.statut,
                Reservation.dateReservation,

            Utilisateurs.nom,
            Utilisateurs.prenom,

            Trajet.lieuDepart,
            Trajet.destination

        FROM Reservation

        INNER JOIN Trajet
        ON Reservation.idTrajet = Trajet.id

        INNER JOIN Utilisateurs
        ON Reservation.idUtilisateur = Utilisateurs.id

        WHERE Trajet.idUtilisateur = ?
        AND Reservation.statut = 'En attente'";

$stmt = $pdo->prepare($sql);

$stmt->execute([$userId]);

$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($requests);

?>
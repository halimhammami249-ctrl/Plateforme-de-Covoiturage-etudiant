<?php

session_start();

require_once "../config/config.php";

$currentUser =
    $_SESSION['user']['id'];

$otherUser =
    $_GET['user_id'];

$sql = "SELECT *

        FROM Reservation

        INNER JOIN Trajet
        ON Reservation.idTrajet = Trajet.id

        WHERE

        Reservation.statut = 'Acceptée'

        AND (

            (
                Reservation.idUtilisateur = ?
                AND Trajet.idUtilisateur = ?
            )

            OR

            (
                Reservation.idUtilisateur = ?
                AND Trajet.idUtilisateur = ?
            )
        )";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $currentUser,
    $otherUser,

    $otherUser,
    $currentUser
]);

$canChat =
    $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode([
    "allowed" => $canChat ? true : false
]);

?>
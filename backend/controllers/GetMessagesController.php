<?php

session_start();

require_once "../config/config.php";

$expediteur =
    $_SESSION['user']['id'];

$recepteur =
    $_GET['recepteur_id'];


// MARK AS READ
$update = "UPDATE Message

           SET vu = 1

           WHERE recepteur_id = ?
           AND expediteur_id = ?";

$stmt = $pdo->prepare($update);

$stmt->execute([
    $expediteur,
    $recepteur
]);


// GET MESSAGES
$sql = "SELECT *

        FROM Message

        WHERE

        (expediteur_id = ?
        AND recepteur_id = ?)

        OR

        (expediteur_id = ?
        AND recepteur_id = ?)

        ORDER BY dateEnvoi ASC";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $expediteur,
    $recepteur,
    $recepteur,
    $expediteur
]);

$messages =
    $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode([
    "currentUser" => $expediteur,
    "messages" => $messages
]);

?>
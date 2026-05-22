<?php

session_start();

require_once "../config/config.php";

$userId =
    $_SESSION['user']['id'];

$sql = "SELECT COUNT(*) AS total

        FROM Message

        WHERE recepteur_id = ?
        AND vu = 0";

$stmt = $pdo->prepare($sql);

$stmt->execute([$userId]);

$count =
    $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($count);

?>
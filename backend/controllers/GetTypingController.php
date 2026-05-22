<?php

require_once "../config/config.php";

$userId =
    $_GET['user_id'];

$sql = "SELECT isTyping

        FROM Utilisateurs

        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$userId]);

$data =
    $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($data);

?>
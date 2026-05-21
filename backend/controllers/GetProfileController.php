<?php

session_start();

require_once "../config/config.php";

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {

    echo json_encode([
        "success" => false,
        "message" => "Non connecté"
    ]);

    exit;
}

$userId = $_SESSION['user']['id'];

$sql = "SELECT *
        FROM Utilisateurs
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$userId]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "user" => $user
]);

?>
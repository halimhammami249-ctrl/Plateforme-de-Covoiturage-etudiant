<?php

session_start();

require_once "../config/config.php";

$currentUserId = $_SESSION['user']['id'];

$sql = "SELECT id, nom, prenom, email
        FROM Utilisateurs
        WHERE id != ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$currentUserId]);

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($users);

?>
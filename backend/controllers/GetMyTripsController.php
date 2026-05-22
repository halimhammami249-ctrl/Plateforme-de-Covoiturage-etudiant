<?php

session_start();

require_once "../config/config.php";

$userId = $_SESSION['user']['id'];

$sql = "SELECT * FROM Trajet
        WHERE idUtilisateur = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$userId]);

$trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($trajets);

?>
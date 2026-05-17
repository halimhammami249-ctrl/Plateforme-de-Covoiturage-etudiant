<?php

require_once "../config/config.php";

$id = $_GET['id'];

$sql = "SELECT * FROM Trajet WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$id]);

$trajet = $stmt->fetch(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($trajet);

?>
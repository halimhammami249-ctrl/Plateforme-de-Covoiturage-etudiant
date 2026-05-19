<?php

require_once "../config/config.php";

$id = $_POST['id'];

$sql = "UPDATE Reservation

        SET statut = 'Acceptée'

        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$success = $stmt->execute([$id]);

echo $success
    ? "Réservation acceptée"
    : "Erreur";

?>
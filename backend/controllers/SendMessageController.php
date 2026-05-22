<?php

session_start();

require_once "../config/config.php";

$expediteur =
    $_SESSION['user']['id'];

$recepteur =
    $_POST['recepteur_id'];

$contenu =
    $_POST['contenu'];

$sql = "INSERT INTO Message
        (expediteur_id,
        recepteur_id,
        contenu,
        dateEnvoi)

        VALUES (?, ?, ?, NOW())";

$stmt = $pdo->prepare($sql);

$success = $stmt->execute([
    $expediteur,
    $recepteur,
    $contenu
]);

echo json_encode([
    "success" => $success
]);

?>
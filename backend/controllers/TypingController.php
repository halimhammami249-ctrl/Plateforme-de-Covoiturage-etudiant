<?php

session_start();

require_once "../config/config.php";

header('Content-Type: application/json');

$userId =
    $_SESSION['user']['id'];

$isTyping =
    $_POST['typing'] ?? 0;

try {

    $sql = "UPDATE Utilisateurs
            SET isTyping = ?
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);

    $success = $stmt->execute([
        $isTyping,
        $userId
    ]);

    echo json_encode([
        "success" => $success,
        "typing" => $isTyping,
        "userId" => $userId,
        "rowCount" => $stmt->rowCount()
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "error" => $e->getMessage()
    ]);
}

?>
<?php

session_start();

require_once "../config/config.php";

$userId = $_SESSION['user']['id'];

$sql = "

SELECT DISTINCT

    u.id,
    u.nom,
    u.prenom,

    (
        SELECT contenu
        FROM Message
        WHERE

        (
            expediteur_id = u.id
            AND recepteur_id = ?
        )

        OR

        (
            expediteur_id = ?
            AND recepteur_id = u.id
        )

        ORDER BY id DESC
        LIMIT 1

    ) AS lastMessage,

    (
        SELECT COUNT(*)
        FROM Message
        WHERE recepteur_id = ?
        AND expediteur_id = u.id
        AND vu = 0
    ) AS unreadCount

FROM Utilisateurs u

INNER JOIN Message m

ON (
    u.id = m.expediteur_id
    OR
    u.id = m.recepteur_id
)

WHERE u.id != ?

AND
(
    m.expediteur_id = ?
    OR
    m.recepteur_id = ?
)

";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $userId,
    $userId,
    $userId,
    $userId,
    $userId,
    $userId
]);

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');

echo json_encode($users);

?>
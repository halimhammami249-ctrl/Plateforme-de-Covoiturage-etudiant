<?php

require_once "../config/config.php";

$id =
    $_POST['id'];


// GET PASSENGER ID
$sql = "SELECT idUtilisateur
        FROM Reservation
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$id]);

$reservation =
    $stmt->fetch(PDO::FETCH_ASSOC);

$passagerId =
    $reservation['idUtilisateur'];


// ACCEPT RESERVATION
$sql = "UPDATE Reservation

        SET statut = 'Acceptée'

        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$success =
    $stmt->execute([$id]);


// REDIRECT TO CHAT
echo "

<script>

alert('Demande acceptée !');

window.location.href =
'../../frontend/pages/chat.html?id=$passagerId';

</script>

";

?>
<?php

require_once "../config/config.php";

$id =
    $_POST['id'];

$sql = "UPDATE Reservation
        SET statut = 'Refusée'
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$id]);

echo "

<script>

alert('Demande refusée.');

window.location.href =
'../../frontend/pages/requests.html';

</script>

";

?>
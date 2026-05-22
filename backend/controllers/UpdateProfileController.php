<?php

session_start();

require_once "../config/config.php";

if (!isset($_SESSION['user'])) {

    echo "Utilisateur non connecté";

    exit;
}

$userId = $_SESSION['user']['id'];

$nom = $_POST['nom'];
$prenom = $_POST['prenom'];
$email = $_POST['email'];
$telephone = $_POST['telephone'];

$sql = "UPDATE Utilisateurs

        SET
            nom = ?,
            prenom = ?,
            email = ?,
            telephone = ?

        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$success = $stmt->execute([
    $nom,
    $prenom,
    $email,
    $telephone,
    $userId
]);

if ($success) {

    $_SESSION['user']['nom'] = $nom;
    $_SESSION['user']['prenom'] = $prenom;
    $_SESSION['user']['email'] = $email;

    echo "

    <script>

    alert('Profil mis à jour avec succès !');

    window.location.href =
    '../../frontend/pages/profile.html';

    </script>

    ";

} else {

    echo "

    <script>

    alert('Erreur lors de la mise à jour.');

    window.history.back();

    </script>

    ";
}

?>
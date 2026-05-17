<?php

require_once "../config/config.php";
require_once "../models/Utilisateur.php";

$user = new Utilisateur();

$user->nom = $_POST['nom'];
$user->prenom = $_POST['prenom'];
$user->email = $_POST['email'];
$user->motDePasse = password_hash($_POST['motDePasse'], PASSWORD_BCRYPT);
$user->telephone = $_POST['telephone'];


if ($user->inscrire($pdo)) {
    echo "Inscription réussie";
} else {
    echo "Erreur";
}
?>
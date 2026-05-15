<?php

require_once "../config/config.php";
require_once "../models/Utilisateur.php";

$user = new Utilisateur();

$user->nom = $_POST['nom'];
$user->prenom = $_POST['prenom'];
$user->email = $_POST['email'];
$user->motDePasse = $_POST['motDePasse'];

if ($user->inscrire($pdo)) {
    echo "Inscription réussie";
} else {
    echo "Erreur";
}
?>
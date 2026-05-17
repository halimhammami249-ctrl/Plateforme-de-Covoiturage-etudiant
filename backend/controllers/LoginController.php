<?php

require_once "../config/config.php";
require_once "../models/Utilisateur.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $user = new Utilisateur();

    $user->email = $_POST['email'];
    $user->motDePasse = $_POST['motDePasse'];

    echo $user->connecter($pdo);
}
?>
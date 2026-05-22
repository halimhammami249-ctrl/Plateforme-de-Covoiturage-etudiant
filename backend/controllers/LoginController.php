<?php

require_once "../config/config.php";
require_once "../models/Utilisateur.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $user = new Utilisateur();

    $user->email =
        $_POST['email'];

    $user->motDePasse =
        $_POST['motDePasse'];

    $result =
        $user->connecter($pdo);

    if ($result == "Connexion réussie") {

        echo "

        <script>

        alert('Connexion réussie !');

        window.location.href =
        '../../frontend/pages/dashboard.html';

        </script>

        ";

    } else {

        echo "

        <script>

        alert('$result');

        window.location.href =
        '../../frontend/pages/login.html';

        </script>

        ";
    }
}

?>
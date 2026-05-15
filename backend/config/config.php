<?php

$host = "localhost";
$dbname = "data";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $user,
        $pass
    );


    echo "Connexion réussie";
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
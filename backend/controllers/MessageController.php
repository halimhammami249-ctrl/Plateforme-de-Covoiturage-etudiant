<?php

require_once "../config/config.php";
require_once "../models/Message.php";

$message = new Message();

$message->expediteur_id = $_POST['expediteur_id'];
$message->recepteur_id = $_POST['recepteur_id'];
$message->contenu = $_POST['contenu'];

if ($message->envoyer($pdo)) {
    echo "Message envoyé";
} else {
    echo "Erreur";
}
?>
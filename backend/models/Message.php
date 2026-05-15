<?php

class Message {

    public $id;
    public $expediteur_id;
    public $recepteur_id;
    public $contenu;
    public $dateEnvoi;

    public function envoyerMessage() {
        echo "Message envoyé";
    }

    public function supprimerMessage() {
        echo "Message supprimé";
    }

    public function afficherMessages() {
        echo "Affichage des messages";
    }
}
?>
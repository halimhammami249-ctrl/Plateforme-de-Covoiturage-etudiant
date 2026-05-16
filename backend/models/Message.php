<?php

class Message {

    public $id;
    public $expediteur_id;
    public $recepteur_id;
    public $contenu;
    public $dateEnvoi;

     public function envoyer($pdo) {

        $sql = "INSERT INTO Message
        (expediteur_id, recepteur_id, contenu, dateEnvoi)

        VALUES (?, ?, ?, NOW())";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            $this->expediteur_id,
            $this->recepteur_id,
            $this->contenu
        ]);
    }

    public function supprimerMessage() {
        echo "Message supprimé";
    }

    public function afficherMessages() {
        echo "Affichage des messages";
    }
}
?>
<?php

class Utilisateur {

    public $id;
    public $dateSession;
    public $nom;
    public $prenom;
    public $email;
    public $motDePasse;
    public $telephone;
    public $permisConduire;
    public $vehicule;
    public $dateInscription;

    public function inscrire($pdo) {

    $sql = "INSERT INTO Utilisateurs
    (nom, prenom, email, motDePasse)

    VALUES

    (?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    return $stmt->execute([
        $this->nom,
        $this->prenom,
        $this->email,
        $this->motDePasse
    ]);
}

    public function connecter() {
        echo "Utilisateur connecté";
    }

    public function deconnecter() {
        echo "Utilisateur déconnecté";
    }

    public function modifierProfil() {
        echo "Profil modifié";
    }

    public function supprimerCompte() {
        echo "Compte supprimé";
    }

    public function afficherProfil() {
        echo "Affichage du profil";
    }
}
?>
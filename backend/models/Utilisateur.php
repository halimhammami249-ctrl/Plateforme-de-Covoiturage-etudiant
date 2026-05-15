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

    public function inscrire() {
        echo "Utilisateur inscrit";
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
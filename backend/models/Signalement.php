<?php

class Signalement {

    public $id;
    public $idUtilisateur;
    public $motif;
    public $description;
    public $dateSignalement;
    public $statut;

    public function creerSignalement() {
        echo "Signalement créé";
    }

    public function traiterSignalement() {
        echo "Signalement traité";
    }

    public function supprimerSignalement() {
        echo "Signalement supprimé";
    }

    public function afficherSignalement() {
        echo "Affichage du signalement";
    }
}
?>
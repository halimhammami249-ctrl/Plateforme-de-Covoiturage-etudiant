<?php

class Avis {

    public $id;
    public $idUtilisateur;
    public $note;
    public $commentaire;
    public $dateAvis;

    public function ajouterAvis() {
        echo "Avis ajouté";
    }

    public function modifierAvis() {
        echo "Avis modifié";
    }

    public function supprimerAvis() {
        echo "Avis supprimé";
    }

    public function afficherAvis() {
        echo "Affichage des avis";
    }
}
?>
<?php

class Administrateur {

    public $id_admin;
    public $utilisateur_id;

    public function supprimerUtilisateur() {
        echo "Utilisateur supprimé par l'administrateur";
    }

    public function supprimerTrajet() {
        echo "Trajet supprimé par l'administrateur";
    }

    public function gererSignalements() {
        echo "Gestion des signalements";
    }

    public function afficherStatistiques() {
        echo "Affichage des statistiques";
    }
}
?>
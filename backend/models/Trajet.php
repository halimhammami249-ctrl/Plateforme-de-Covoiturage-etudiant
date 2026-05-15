<?php

class Trajet {

    public $id;
    public $idUtilisateur;
    public $lieuDepart;
    public $destination;
    public $dateHeure;
    public $prixParPlace;
    public $nombrePlaces;
    public $placesDisponibles;
    public $statut;

    public function creerTrajet() {
        echo "Trajet créé";
    }

    public function modifierTrajet() {
        echo "Trajet modifié";
    }

    public function supprimerTrajet() {
        echo "Trajet supprimé";
    }

    public function afficherTrajet() {
        echo "Affichage du trajet";
    }

    public function rechercherTrajet() {
        echo "Recherche du trajet";
    }
}
?>
<?php

class Paiement {

    public $id;
    public $idReservation;
    public $montant;
    public $datePaiement;
    public $methode;
    public $statut;
    public $reference;

    public function effectuerPaiement() {
        echo "Paiement effectué";
    }

    public function annulerPaiement() {
        echo "Paiement annulé";
    }

    public function verifierPaiement() {
        echo "Paiement vérifié";
    }

    public function afficherPaiement() {
        echo "Affichage du paiement";
    }
}
?>
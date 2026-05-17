<?php

class Reservation {

    public $id;
    public $idUtilisateur;
    public $idTrajet;
    public $dateReservation;
    public $statut;
    public $nombrePlaces;

    public function reserver() {
        echo "Réservation effectuée";
    }

    public function annulerReservation($pdo) {

    $sql = "DELETE FROM Reservation
    WHERE id = ?";

    $stmt = $pdo->prepare($sql);

    return $stmt->execute([
        $this->id
    ]);
    }


    public function confirmerReservation() {
        echo "Réservation confirmée";
    }

    public function afficherReservation() {
        echo "Affichage de la réservation";
    }
}
?>
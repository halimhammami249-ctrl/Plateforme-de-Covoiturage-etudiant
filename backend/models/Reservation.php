<?php

class Reservation {

    public $id;
    public $idUtilisateur;
    public $idTrajet;
    public $dateReservation;
    public $statut;
    public $nombrePlaces;

    public function reserver($pdo) {

        $sql = "INSERT INTO Reservation
        (idUtilisateur, idTrajet, dateReservation, statut, nombrePlaces)

        VALUES (?, ?, NOW(), ?, ?)";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            $this->idUtilisateur,
            $this->idTrajet,
            $this->statut,
            $this->nombrePlaces
        ]);
    }

    public function annulerReservation() {
        echo "Réservation annulée";
    }

    public function confirmerReservation() {
        echo "Réservation confirmée";
    }

    public function afficherReservation() {
        echo "Affichage de la réservation";
    }
}
?>
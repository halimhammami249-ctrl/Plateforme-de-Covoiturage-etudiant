<?php

class Reservation {

    public $id;
    public $idUtilisateur;
    public $idTrajet;
    public $dateReservation;
    public $statut;
    public $nombrePlaces;

    public function reserver($pdo) {
$check = "SELECT placesDisponibles
          FROM Trajet
          WHERE id = ?";

$stmt = $pdo->prepare($check);

$stmt->execute([$this->idTrajet]);

$trajet = $stmt->fetch(PDO::FETCH_ASSOC);

if ($trajet['placesDisponibles']
    < $this->nombrePlaces) {

    return false;
}
    // INSERT RESERVATION
    $sql = "INSERT INTO Reservation
    (idUtilisateur, idTrajet,
    dateReservation, statut, nombrePlaces)

    VALUES (?, ?, NOW(), ?, ?)";

    $stmt = $pdo->prepare($sql);

    $success = $stmt->execute([
        $this->idUtilisateur,
        $this->idTrajet,
        $this->statut,
        $this->nombrePlaces
    ]);

    if ($success) {

        // UPDATE AVAILABLE SEATS
        $update = "UPDATE Trajet

                   SET placesDisponibles =
                   placesDisponibles - ?

                   WHERE id = ?";

        $stmt = $pdo->prepare($update);

        $stmt->execute([
            $this->nombrePlaces,
            $this->idTrajet
        ]);
    }

    return $success;
}

    public function annulerReservation($pdo) {

    // GET RESERVATION INFO
    $sql = "SELECT *
            FROM Reservation
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([$this->id]);

    $reservation =
        $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        return false;
    }

    // DELETE RESERVATION
    $delete = "DELETE FROM Reservation
               WHERE id = ?";

    $stmt = $pdo->prepare($delete);

    $success = $stmt->execute([$this->id]);

    if ($success) {

        // RESTORE SEATS
        $update = "UPDATE Trajet

                   SET placesDisponibles =
                   placesDisponibles + ?

                   WHERE id = ?";

        $stmt = $pdo->prepare($update);

        $stmt->execute([
            $reservation['nombrePlaces'],
            $reservation['idTrajet']
        ]);
    }

    return $success;
}


    public function confirmerReservation() {
        echo "Réservation confirmée";
    }

    public function afficherReservation() {
        echo "Affichage de la réservation";
    }
}
?>
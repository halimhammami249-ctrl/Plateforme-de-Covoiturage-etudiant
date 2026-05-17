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

        public function creerTrajet($pdo) {

        $sql = "INSERT INTO Trajet
        (idUtilisateur, lieuDepart, destination,
        dateHeure, prixParPlace,
        nombrePlaces, placesDisponibles, statut)

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            $this->idUtilisateur,
            $this->lieuDepart,
            $this->destination,
            $this->dateHeure,
            $this->prixParPlace,
            $this->nombrePlaces,
            $this->placesDisponibles,
            $this->statut
        ]);
    }

    public function modifierTrajet() {
        echo "Trajet modifié";
    }

    public function supprimerTrajet() {
        echo "Trajet supprimé";
    }

    public function afficherTrajets($pdo) {

    $sql = "SELECT * FROM Trajet
            ORDER BY dateHeure DESC";

    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

   public function rechercherTrajets($pdo, $depart, $destination) {

    $sql = "SELECT * FROM Trajet
            WHERE lieuDepart LIKE ?
            AND destination LIKE ?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "%$depart%",
        "%$destination%"
    ]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
}
?>
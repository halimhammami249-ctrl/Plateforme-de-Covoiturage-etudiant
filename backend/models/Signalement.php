<?php

class Signalement {

    public $id;
    public $idUtilisateur;
    public $motif;
    public $description;
    public $dateSignalement;
    public $statut;

    public function creerSignalement($pdo) {
        $sql = "INSERT INTO Signalement
        (idUtilisateur, motif, description, dateSignalement, statut)
        VALUES (?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);

        $dateSignalement = $this->dateSignalement ?? date('Y-m-d');
        $statut = $this->statut ?? 'en_attente';

        return $stmt->execute([
            $this->idUtilisateur,
            $this->motif,
            $this->description,
            $dateSignalement,
            $statut
        ]);
    }

    public function traiterSignalement($pdo) {
        if (!$this->id || !$this->statut) {
            return false;
        }

        $sql = "UPDATE Signalement SET statut = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            $this->statut,
            $this->id
        ]);
    }

    public function supprimerSignalement($pdo) {
        if (!$this->id) {
            return false;
        }

        $sql = "DELETE FROM Signalement WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        return $stmt->execute([$this->id]);
    }

    public function afficherSignalement($pdo) {
        if ($this->id) {
            $sql = "SELECT * FROM Signalement WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$this->id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        $sql = "SELECT * FROM Signalement ORDER BY dateSignalement DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
<?php

class Administrateur {

    public $id_admin;
    public $utilisateur_id;

    public function estAdministrateur($pdo, $utilisateur_id) {
        $sql = "SELECT COUNT(*) FROM Administrateur WHERE utilisateur_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$utilisateur_id]);
        return (bool) $stmt->fetchColumn();
    }

    public function supprimerUtilisateur($pdo, $idUtilisateur) {
        $sql = "DELETE FROM Utilisateurs WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$idUtilisateur]);
    }

    public function supprimerTrajet($pdo, $idTrajet) {
        $sql = "DELETE FROM Trajet WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$idTrajet]);
    }

    public function traiterSignalement($pdo, $idSignalement, $statut) {
        $sql = "UPDATE Signalement SET statut = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$statut, $idSignalement]);
    }

    public function afficherStatistiques($pdo) {
        $stats = [];

        $stats['utilisateurs'] = (int) $pdo->query("SELECT COUNT(*) FROM Utilisateurs")->fetchColumn();
        $stats['trajets'] = (int) $pdo->query("SELECT COUNT(*) FROM Trajet WHERE statut = 'actif'")->fetchColumn();
        $stats['signalements_en_attente'] = (int) $pdo->query("SELECT COUNT(*) FROM Signalement WHERE statut = 'en_attente'")->fetchColumn();
        $stats['reservations'] = (int) $pdo->query("SELECT COUNT(*) FROM Reservation")->fetchColumn();

        return $stats;
    }

    public function listerUtilisateurs($pdo) {
        $sql = "SELECT id, nom, prenom, email, telephone, dateInscription FROM Utilisateurs ORDER BY id DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listerTrajets($pdo) {
        $sql = "SELECT t.*, CONCAT(u.prenom, ' ', u.nom) AS conducteur FROM Trajet t LEFT JOIN Utilisateurs u ON t.idUtilisateur = u.id ORDER BY t.id DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listerSignalements($pdo) {
        $sql = "SELECT s.*, CONCAT(u.prenom, ' ', u.nom) AS utilisateur FROM Signalement s LEFT JOIN Utilisateurs u ON s.idUtilisateur = u.id ORDER BY s.id DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function supprimerSignalement($pdo, $idSignalement) {
        $sql = "DELETE FROM Signalement WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$idSignalement]);
    }
}
?>
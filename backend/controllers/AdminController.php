<?php
/**
 * AdminController.php — API administration
 * Usage: AdminController.php?action=stats|users|trips|reports|...
 * À connecter avec la BDD via config.php (PDO)
 */

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/config.php";
require_once __DIR__ . "/../models/Administrateur.php";
require_once __DIR__ . "/../models/Utilisateur.php";
require_once __DIR__ . "/../models/Trajet.php";
require_once __DIR__ . "/../models/Signalement.php";

$action = $_GET["action"] ?? $_POST["action"] ?? "";

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

try {
    switch ($action) {

        case "stats":
            $stats = [
                "utilisateurs" => (int) $pdo->query("SELECT COUNT(*) FROM Utilisateurs")->fetchColumn(),
                "trajets" => (int) $pdo->query("SELECT COUNT(*) FROM Trajet WHERE statut = 'actif'")->fetchColumn(),
                "signalements_en_attente" => (int) $pdo->query("SELECT COUNT(*) FROM Signalement WHERE statut = 'en_attente'")->fetchColumn(),
                "reservations" => (int) $pdo->query("SELECT COUNT(*) FROM Reservation")->fetchColumn(),
            ];
            jsonResponse(["success" => true, "data" => $stats]);
            break;

        case "users":
            $stmt = $pdo->query("SELECT id, nom, prenom, email, telephone, dateInscription FROM Utilisateurs ORDER BY id DESC");
            jsonResponse(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case "delete_user":
            $id = (int) ($_POST["id"] ?? 0);
            if ($id <= 0) jsonResponse(["success" => false, "message" => "ID invalide"], 400);
            $stmt = $pdo->prepare("DELETE FROM Utilisateurs WHERE id = ?");
            jsonResponse(["success" => $stmt->execute([$id])]);
            break;

        case "trips":
            $stmt = $pdo->query("
                SELECT t.*, CONCAT(u.prenom, ' ', u.nom) AS conducteur
                FROM Trajet t
                LEFT JOIN Utilisateurs u ON t.idUtilisateur = u.id
                ORDER BY t.id DESC
            ");
            jsonResponse(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case "delete_trip":
            $id = (int) ($_POST["id"] ?? 0);
            if ($id <= 0) jsonResponse(["success" => false, "message" => "ID invalide"], 400);
            $stmt = $pdo->prepare("DELETE FROM Trajet WHERE id = ?");
            jsonResponse(["success" => $stmt->execute([$id])]);
            break;

        case "reports":
            $stmt = $pdo->query("
                SELECT s.*, CONCAT(u.prenom, ' ', u.nom) AS utilisateur
                FROM Signalement s
                LEFT JOIN Utilisateurs u ON s.idUtilisateur = u.id
                ORDER BY s.id DESC
            ");
            jsonResponse(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case "update_report":
            $id = (int) ($_POST["id"] ?? 0);
            $statut = $_POST["statut"] ?? "";
            if ($id <= 0 || !$statut) jsonResponse(["success" => false, "message" => "Paramètres invalides"], 400);
            $stmt = $pdo->prepare("UPDATE Signalement SET statut = ? WHERE id = ?");
            jsonResponse(["success" => $stmt->execute([$statut, $id])]);
            break;

        case "delete_report":
            $id = (int) ($_POST["id"] ?? 0);
            if ($id <= 0) jsonResponse(["success" => false, "message" => "ID invalide"], 400);
            $stmt = $pdo->prepare("DELETE FROM Signalement WHERE id = ?");
            jsonResponse(["success" => $stmt->execute([$id])]);
            break;

        default:
            jsonResponse([
                "success" => false,
                "message" => "Action inconnue",
                "available" => [
                    "stats", "users", "delete_user",
                    "trips", "delete_trip",
                    "reports", "update_report", "delete_report",
                ],
            ], 400);
    }
} catch (PDOException $e) {
    jsonResponse(["success" => false, "message" => $e->getMessage()], 500);
}

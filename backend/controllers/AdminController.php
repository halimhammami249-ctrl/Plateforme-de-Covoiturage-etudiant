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
    $admin = new Administrateur();
    switch ($action) {
        case "stats":
            $stats = $admin->afficherStatistiques($pdo);
            jsonResponse(["success" => true, "data" => $stats]);
            break;

        case "users":
            $data = $admin->listerUtilisateurs($pdo);
            jsonResponse(["success" => true, "data" => $data]);
            break;

        case "delete_user":
            $id = (int) ($_POST["id"] ?? 0);
            if ($id <= 0) jsonResponse(["success" => false, "message" => "ID invalide"], 400);
            jsonResponse(["success" => $admin->supprimerUtilisateur($pdo, $id)]);
            break;

        case "trips":
            $data = $admin->listerTrajets($pdo);
            jsonResponse(["success" => true, "data" => $data]);
            break;

        case "delete_trip":
            $id = (int) ($_POST["id"] ?? 0);
            if ($id <= 0) jsonResponse(["success" => false, "message" => "ID invalide"], 400);
            jsonResponse(["success" => $admin->supprimerTrajet($pdo, $id)]);
            break;

        case "reports":
            $data = $admin->listerSignalements($pdo);
            jsonResponse(["success" => true, "data" => $data]);
            break;

        case "update_report":
            $id = (int) ($_POST["id"] ?? 0);
            $statut = $_POST["statut"] ?? "";
            if ($id <= 0 || !$statut) jsonResponse(["success" => false, "message" => "Paramètres invalides"], 400);
            jsonResponse(["success" => $admin->traiterSignalement($pdo, $id, $statut)]);
            break;

        case "delete_report":
            $id = (int) ($_POST["id"] ?? 0);
            if ($id <= 0) jsonResponse(["success" => false, "message" => "ID invalide"], 400);
            jsonResponse(["success" => $admin->supprimerSignalement($pdo, $id)]);
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

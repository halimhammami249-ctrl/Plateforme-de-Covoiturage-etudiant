<?php

session_start();

require_once "../config/config.php";
require_once "../models/Signalement.php";

header('Content-Type: application/json; charset=utf-8');

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

$userId = $_SESSION['user']['id'] ?? null;
if (!$userId) {
    jsonResponse(["success" => false, "message" => "Utilisateur non authentifié"], 401);
}

$action = $_REQUEST['action'] ?? "";
$signalement = new Signalement();

switch ($action) {
    case "create":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            jsonResponse(["success" => false, "message" => "Méthode invalide"], 405);
        }

        $motif = trim($_POST['motif'] ?? "");
        $description = trim($_POST['description'] ?? "");

        if (!$motif || !$description) {
            jsonResponse(["success" => false, "message" => "Motif et description requis"], 400);
        }

        $signalement->idUtilisateur = $userId;
        $signalement->motif = $motif;
        $signalement->description = $description;
        $signalement->dateSignalement = date('Y-m-d');
        $signalement->statut = 'en_attente';

        if ($signalement->creerSignalement($pdo)) {
            jsonResponse(["success" => true, "message" => "Signalement créé"]);
        }

        jsonResponse(["success" => false, "message" => "Impossible de créer le signalement"], 500);
        break;

    case "delete":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            jsonResponse(["success" => false, "message" => "Méthode invalide"], 405);
        }

        $id = (int) ($_POST['id'] ?? 0);
        if ($id <= 0) {
            jsonResponse(["success" => false, "message" => "ID invalide"], 400);
        }

        $sql = "SELECT idUtilisateur FROM Signalement WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$report) {
            jsonResponse(["success" => false, "message" => "Signalement introuvable"], 404);
        }

        if ((int) $report['idUtilisateur'] !== (int) $userId) {
            jsonResponse(["success" => false, "message" => "Accès refusé"], 403);
        }

        $signalement->id = $id;
        if ($signalement->supprimerSignalement($pdo)) {
            jsonResponse(["success" => true, "message" => "Signalement supprimé"]);
        }

        jsonResponse(["success" => false, "message" => "Impossible de supprimer le signalement"], 500);
        break;

    case "list":
        $sql = "SELECT * FROM Signalement WHERE idUtilisateur = ? ORDER BY dateSignalement DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$userId]);
        $signalements = $stmt->fetchAll(PDO::FETCH_ASSOC);

        jsonResponse(["success" => true, "data" => $signalements]);
        break;

    default:
        jsonResponse([
            "success" => false,
            "message" => "Action inconnue",
            "available" => ["create", "delete", "list"]
        ], 400);
}

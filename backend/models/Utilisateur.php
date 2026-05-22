<?php

class Utilisateur {

    public $id;
    public $dateSession;
    public $nom;
    public $prenom;
    public $email;
    public $motDePasse;
    public $telephone;
    public $permisConduire;
    public $vehicule;
    public $dateInscription;

    public function inscrire($pdo) {

    $sql = "INSERT INTO Utilisateurs
    (nom, prenom, email, motDePasse, telephone)

    VALUES

    (?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    return $stmt->execute([
        $this->nom,
        $this->prenom,
        $this->email,
        $this->motDePasse,
        $this->telephone,
    ]);
}

       public function connecter($pdo) {

        session_start();

        $sql = "SELECT * FROM Utilisateurs
                WHERE email = ?";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$this->email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return "Email incorrect";
        }

        if (!password_verify($this->motDePasse, $user['motDePasse'])) {
            return "Mot de passe incorrect";
        }

        $_SESSION['user'] = [
            'id' => $user['id'],
            'nom' => $user['nom'],
            'prenom' => $user['prenom'],
            'email' => $user['email']
        ];

        $update = "UPDATE Utilisateurs
                   SET dateSession = ?
                   WHERE id = ?";

        $stmt = $pdo->prepare($update);

        $stmt->execute([
            date('Y-m-d H:i:s'),
            $user['id']
        ]);

        return "Connexion réussie";
    }

    // DECONNEXION
    public function deconnecter() {

        session_start();

        session_unset();
        session_destroy();

        return "Utilisateur déconnecté";
    }

    public function modifierProfil() {
        echo "Profil modifié";
    }

    public function supprimerCompte() {
        echo "Compte supprimé";
    }

    public function afficherProfil() {
        echo "Affichage du profil";
    }
}
?>
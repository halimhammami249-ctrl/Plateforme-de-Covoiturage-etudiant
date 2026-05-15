CREATE DATABASE data;
USE data;

-- =========================
-- Table : Utilisateurs
-- =========================
CREATE TABLE Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateSession VARCHAR(255),
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    motDePasse VARCHAR(255),
    telephone VARCHAR(20),
    permisConduire VARCHAR(100),
    vehicule VARCHAR(100),
    dateInscription DATE
);

-- =========================
-- Table : Administrateur
-- =========================
CREATE TABLE Administrateur (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT UNIQUE,
    
    FOREIGN KEY (utilisateur_id)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE
);

-- =========================
-- Table : Trajet
-- =========================
CREATE TABLE Trajet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT,
    lieuDepart VARCHAR(255),
    destination VARCHAR(255),
    dateHeure DATE,
    prixParPlace DOUBLE,
    nombrePlaces INT,
    placesDisponibles INT,
    statut VARCHAR(100),

    FOREIGN KEY (idUtilisateur)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE
);

-- =========================
-- Table : Reservation
-- =========================
CREATE TABLE Reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT,
    idTrajet INT,
    dateReservation DATE,
    statut VARCHAR(100),
    nombrePlaces INT,

    FOREIGN KEY (idUtilisateur)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE,

    FOREIGN KEY (idTrajet)
    REFERENCES Trajet(id)
    ON DELETE CASCADE
);

-- =========================
-- Table : Paiement
-- =========================
CREATE TABLE Paiement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idReservation INT UNIQUE,
    montant DOUBLE,
    datePaiement DATE,
    methode VARCHAR(100),
    statut VARCHAR(100),
    reference VARCHAR(255),

    FOREIGN KEY (idReservation)
    REFERENCES Reservation(id)
    ON DELETE CASCADE
);

-- =========================
-- Table : Avis
-- =========================
CREATE TABLE Avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT,
    note INT,
    commentaire TEXT,
    dateAvis DATE,

    FOREIGN KEY (idUtilisateur)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE
);

-- =========================
-- Table : Signalement
-- =========================
CREATE TABLE Signalement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUtilisateur INT,
    motif VARCHAR(255),
    description TEXT,
    dateSignalement DATE,
    statut VARCHAR(100),

    FOREIGN KEY (idUtilisateur)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE
);

-- =========================
-- Table : Message
-- =========================
CREATE TABLE Message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT,
    recepteur_id INT,
    contenu TEXT,
    dateEnvoi DATE,

    FOREIGN KEY (expediteur_id)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE,

    FOREIGN KEY (recepteur_id)
    REFERENCES Utilisateurs(id)
    ON DELETE CASCADE
);
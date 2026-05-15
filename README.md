# Plateforme de Covoiturage Etudiant

## Description

Projet universitaire de développement d'une plateforme de covoiturage destinée aux étudiants.

## Membres du groupe

- Halim
- khalil
- wassin
- nidhal

## Technologies prévues

- Frontend :hml css js
- Backend : php
- Base de données :sql

## Fonctionnalités principales

Import schema.sql locally (data base definition)

## member 1

member 1 — Authentication & Users

Works on:

RegisterController
LoginController
logout
user session
profile page
Utilisateur model improvements

Files:

controllers/
├── RegisterController.php
├── LoginController.php

models/
├── Utilisateur.php

## member 2

Member 2 — Trajets (Trips)

Works on:

creating trips
displaying trips
search trips
trip cards/UI

Files:

controllers/
├── TrajetController.php

models/
├── Trajet.php

## member 3

Member 3 — Reservations & Payments

Works on:

reservation logic
payment logic
reservation history

Files:

controllers/
├── ReservationController.php
├── PaiementController.php

## member 4

Member 4 — Messaging + Admin + UI polishing

Works on:

messaging system
signalements
admin dashboard
navbar/footer
responsive design

Files:

controllers/
├── MessageController.php
├── AdminController.php

models/
├── Message.php
├── Signalement.php
├── Administrateur.php

<?php

require_once "../config/config.php";

class LogoutController {

    public function deconnecter() {

        session_start();

        // Destroy all session data
        session_unset();
        session_destroy();

        echo "OK";
    }
}

// RUN CONTROLLER
$controller = new LogoutController();
$controller->deconnecter();
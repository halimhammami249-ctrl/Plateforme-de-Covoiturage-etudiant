<?php

session_start();

header('Content-Type: application/json');

if (isset($_SESSION['user'])) {

    echo json_encode([
        "connected" => true
    ]);

} else {

    echo json_encode([
        "connected" => false
    ]);
}
?>
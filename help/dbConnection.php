<?php
function dbConnection() {
    if (!defined('SAE_MYSQL_HOST_M')) {
        $pdo = new PDO("mysql:host=127.0.0.1;dbname=analytics", 'root', '');
    } else {
        $pdo = new PDO("mysql:host=" . SAE_MYSQL_HOST_M . ";port=" . SAE_MYSQL_PORT . ";dbname=" . SAE_MYSQL_DB, SAE_MYSQL_USER, SAE_MYSQL_PASS);
    }
    return $pdo;
}
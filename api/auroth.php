<?php
/**
 * Auroth: The manager of APIs
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

require_once(__DIR__ . '/../help/DatabaseHelper.php');

class Auroth {
    function __construct() {
        $api = $_GET['api'];
        $version = $_GET['v'];
        $this->load($api);

        $apiClass = str_replace('.', '_', $api);
        $handler = new $apiClass();
        $results = $handler->exec($version, $_GET);
        $this->callback(0, $results);
    }

    function callback($code, $results) {
        $results = json_encode($results);
        header('Content-Type: application/javascript');
        echo("{$_GET['callback']}($code, $results)");
    }

    function load($api) {
        $fileName = $api . '.php';
        require_once($fileName);
    }
}
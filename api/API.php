<?php
/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

class API {
    public $dbHelper = null;

    function __construct() {
        $this->dbHelper = new DatabaseHelper();
    }

    function exec($version, $options) {
        $method = 'v' . str_replace('.', '_', $version);
        return $this->$method($options);
    }
}
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
        $version = 'v' . str_replace('.', '_', $version);
        return $this->$version($options);
    }
}
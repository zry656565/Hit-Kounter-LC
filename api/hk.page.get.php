<?php
/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

class hk_page_get   {

    public $dbHelper = null;

    function __construct() {
        $this->dbHelper = new DatabaseHelper();
    }

    function exec($version, $options) {
        $version = 'v' . str_replace('.', '_', $version);
        return $this->$version($options['domain'], json_decode($options['pages']));
    }

    function v1_0($domain, $pages) {
        foreach ($pages as $index => $page) {
            if (isset($page->url)) {
                $row = $this->dbHelper->query('page', [
                    'url' => $page->url,
                    'domain' => $domain,
                ]);
                if (is_null($row)) {
                    $page->count = 0;
                } else {
                    $page->title = $row['title'];
                    $page->count = intval($row['count']);
                }
            } else {
                unset($pages[$index]);
            }
        }
        return $pages;
    }
}
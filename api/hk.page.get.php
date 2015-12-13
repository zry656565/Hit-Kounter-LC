<?php
/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

require_once(__DIR__ . '/API.php');

/***
 * hk.page.get
 * Usage: get the count of several pages
 */
class hk_page_get extends API {

    function v1_0($options) {
        $domain = $options['domain'];
        $pages = json_decode($options['pages']);
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
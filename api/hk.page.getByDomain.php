<?php
/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

require_once(__DIR__ . '/API.php');

/***
 * hk.page.getByDomain
 * Usage: get the count of all pages under the same domain
 */
class hk_page_getByDomain extends API {

    function v1_0($options) {
        $domain = $options['domain'];
        $pages = [];
        $rows = $this->dbHelper->queryAll('page', [ 'domain' => $domain ]);
        foreach ($rows as $row) {
            $pages[] = [
                'url' => $row['url'],
                'title' => $row['title'],
                'count' => intval($row['count']),
            ];
        }
        return $pages;
    }
}
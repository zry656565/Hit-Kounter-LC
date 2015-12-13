<?php
/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

require_once(__DIR__ . '/API.php');

/***
 * hk.page.getTop
 * Usage: get the pages which have been mostly visited
 */
class hk_page_getTop extends API {

    function v1_0($options) {
        $domain = $options['domain'];
        $num = $options['num'];
        $rows = $this->dbHelper->queryAll('page', [
            'domain' => $domain
        ], [
            'count' => intval($num),
            'orderBy' => 'count'
        ]);
        $result = [];
        foreach ($rows as $row) {
            $result[] = [
                'url' => $row['url'],
                'title' => $row['title'],
                'count' => intval($row['count']),
            ];
        }
        return $result;
    }
}
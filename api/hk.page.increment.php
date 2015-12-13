
<?php
/**
 * Author: Jerry Zou
 * Email: jerry.zry@outlook.com
 */

require_once(__DIR__ . '/API.php');

/***
 * hk.page.increment
 * Usage: increase the count of a visited page
 */
class hk_page_increment extends API {

    function v1_0($options) {
        $domain = $options['domain'];
        $url = $options['url'];
        $title = $options['title'];
        $row = $this->dbHelper->query('page', [
            'url' => $url,
            'domain' => $domain,
        ]);
        $count = 1;
        if (isset($row)) {
            $count = ++$row['count'];
            $this->dbHelper->update('page', [ 'count' => $count ], [ 'id' => $row['id'] ]);
        } else {
            $this->dbHelper->insert('page', [
                'url' => $url,
                'domain' => $domain,
                'title' => $title,
                'count' => 1
            ]);
        }
        return [
            'url' => $url,
            'domain' => $domain,
            'title' => $title,
            'count' => $count,
        ];
    }
}
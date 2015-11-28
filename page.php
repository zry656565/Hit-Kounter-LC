<?php
require_once('help/DatabaseHelper.php');

function parse() {
    $db = dbConnection(); // todo
    $dbHelper = new DatabaseHelper();

    switch($_GET['type']) {
        // get the count of several pages
        case 'get':
            $pages = json_decode($_GET['pages']);
            if (!is_array($pages)) {
                header("HTTP/1.1 400 Bad Request");
                return '';
            }
            foreach ($pages as $index => $page) {
                if (isset($page->url) && isset($page->domain)) {
                    $result = $dbHelper->query('page', [
                        'url' => $page->url,
                        'domain' => $page->domain,
                    ]);
                    if (is_null($result)) {
                        $page->count = 0;
                    } else {
                        $page->title = $result['title'];
                        $page->count = intval($result['count']);
                    }
                } else {
                    unset($pages[$index]);
                }
            }
            return json_encode($pages);

        // increase the count of a visited page
        case 'increment':
            $row = $dbHelper->query('page', [
                'url' => $_GET['url'],
                'domain' => $_GET['domain'],
            ]);
            if (isset($row)) {
                $count = ++$row['count'];
                $dbHelper->update('page', [ 'count' => $count ], [ 'id' => $row['id'] ]);
            } else {
                $dbHelper->insert('page', [
                    'url' => $_GET['url'],
                    'domain' => $_GET['domain'],
                    'title' => $_GET['title'],
                    'count' => 1
                ]);
                $row = [
                    'url' => $_GET['url'],
                    'domain' => $_GET['domain'],
                    'title' => $_GET['title'],
                    'count' => 1,
                ];
            }
            unset($row['id']);
            return json_encode($row);

        // get the pages which have been mostly visited
        case 'getTop':
            $rows = $dbHelper->queryAll('page', [
                'domain' => $_GET['domain']
            ], [
                'count' => intval($_GET['number']),
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
            return json_encode($result);

        // get the count of all pages under the same domain
        case 'getByDomain':
            $pages = [];
            $rows = $dbHelper->queryAll('page', [ 'domain' => $_GET['domain'] ]);
            foreach ($rows as $row) {
                $pages[] = [
                    'url' => $row['url'],
                    'title' => $row['title'],
                    'count' => intval($row['count']),
                ];
            }
            return json_encode($pages);
        default:
            return null;
    }
}

$result = parse();
if ($result) header('Content-Type: application/javascript');
echo "{$_GET['callback']}($result);";
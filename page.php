<?php
function dbConnection() {
    if (!defined('SAE_MYSQL_HOST_M')) {
        $pdo = new PDO("mysql:host=127.0.0.1;dbname=analytics", 'root', '');
    } else {
        $pdo = new PDO("mysql:host=" . SAE_MYSQL_HOST_M . ";port=" . SAE_MYSQL_PORT . ";dbname=" . SAE_MYSQL_DB, SAE_MYSQL_USER, SAE_MYSQL_PASS);
    }
    return $pdo;
}


function parse() {
    $db = dbConnection();

    // get the count of several pages
    if ($_GET['type'] === 'get') {
        $pages = json_decode($_GET['pages']);
        if (!is_array($pages)) {
            header("HTTP/1.1 400 Bad Request");
            return '';
        }
        foreach ($pages as $index => $page) {
            if (isset($page->url) && isset($page->domain)) {
                $sql = $db->prepare("SELECT * FROM page WHERE url = :url AND `domain` = :domain");
                $sql->execute([
                    ':url' => $page->url,
                    ':domain' => $page->domain,
                ]) or die(print_r($sql->errorInfo(), true));
                if ($sql->rowCount()) {
                    $row = $sql->fetch(PDO::FETCH_ASSOC);
                    $page->title = $row['title'];
                    $page->count = intval($row['count']);
                } else {
                    $page->count = 0;
                }
            } else {
                unset($pages[$index]);
            }
        }
        return json_encode($pages);
    }
    // increase the count of a visited page
    else if ($_GET['type'] === 'increment') {
        $sql = $db->prepare("SELECT * FROM page WHERE url = :url AND `domain` = :domain");
        $sql->execute([
            ':url' => $_GET['url'],
            ':domain' => $_GET['domain'],
        ]) or die(print_r($sql->errorInfo(), true));
        if ($sql->rowCount()) {
            $row = $sql->fetch(PDO::FETCH_ASSOC);
            $count = ++$row['count'];
            $sql = $db->prepare("UPDATE page SET `count` = :count WHERE id = :id");
            $sql->execute([
                ':count' => $count,
                ':id' => $row['id'],
            ]) or die(print_r($sql->errorInfo(), true));
        } else {
            $sql = $db->prepare("INSERT INTO page (url, `domain`, title, `count`) VALUES (:url, :domain, :title, 1)");
            $sql->execute([
                ':url' => $_GET['url'],
                ':domain' => $_GET['domain'],
                ':title' => $_GET['title'],
            ]) or die(print_r($sql->errorInfo(), true));
            $row = [
                'url' => $_GET['url'],
                'domain' => $_GET['domain'],
                'title' => $_GET['title'],
                'count' => 1,
            ];
        }
        unset($row['id']);
        return json_encode($row);
    }
    // get the pages which have been mostly visited
    else if ($_GET['type'] === 'getTop') {
        $sql = $db->prepare("SELECT * FROM page WHERE `domain` = :domain ORDER BY `count` DESC LIMIT :number");
        $number = intval($_GET['number']);
        $sql->bindParam(':number', $number, PDO::PARAM_INT);
        $sql->bindParam(':domain', $_GET['domain']);
        $sql->execute() or die(print_r($sql->errorInfo(), true));
        $rows = $sql->fetchAll();
        $result = [];
        foreach ($rows as $row) {
            $result[] = [
                'url' => $row['url'],
                'title' => $row['title'],
                'count' => intval($row['count']),
            ];
        }
        return json_encode($result);
    }
    // get the count of all pages under the same domain
    else if ($_GET['type'] === 'getByDomain') {
        $result = [];
        $sql = $db->prepare("SELECT * FROM page WHERE `domain` = :domain");
        $sql->execute([':domain' => $_GET['domain']]);
        $rows = $sql->fetchAll() or die(print_r($sql->errorInfo(), true));
        foreach ($rows as $row) {
            $result[] = [
                'url' => $row['url'],
                'title' => $row['title'],
                'count' => intval($row['count']),
            ];
        }
        return json_encode($result);
    }
}

$result = parse();
if ($result) header('Content-Type: application/javascript');
echo "{$_GET['callback']}($result);";
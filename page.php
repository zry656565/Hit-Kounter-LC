<?php
function dbConnection() {
	if (!defined('SAE_MYSQL_HOST_M')) {
		$pdo = new PDO("mysql:host=127.0.0.1;dbname=analytics", 'root', '');
	} else {
		$pdo = new PDO("mysql:host=".SAE_MYSQL_HOST_M.";port=".SAE_MYSQL_PORT.";dbname=".SAE_MYSQL_DB, SAE_MYSQL_USER, SAE_MYSQL_PASS);
	}
	return $pdo;
}


function parse() {
	$db = dbConnection();
	if($_GET['type'] === 'get') {
		$pages = json_decode($_GET['pages']);
		if (!is_array($pages)) {
			header("HTTP/1.1 400 Bad Request");
			return '';
		}
		foreach ($pages as $index => $page) {
			if (isset($page->url) && isset($page->domain)) {
				$sql = "SELECT * FROM page WHERE url = '{$page->url}' AND `domain` = '{$page->domain}'";
				$rows = $db->query($sql) or die(print_r($db->errorInfo(), true));
				if ($rows->rowCount()) {
					$row = $rows->fetch(PDO::FETCH_ASSOC);
					$page->count = $row['count'];
				} else {
					$page->count = 0;
				}
			} else {
				unset($pages[$index]);
			}
		}
		return json_encode($pages);
	} else if($_GET['type'] === 'increment') {
		$sql = "SELECT * FROM page WHERE url = '{$_GET['url']}' AND `domain` = '{$_GET['domain']}'";
		$rows = $db->query($sql) or die(print_r($db->errorInfo(), true));
		if ($rows->rowCount()) {
			$row = $rows->fetch(PDO::FETCH_ASSOC);
			$count = ++$row['count'];
			$sql = "UPDATE page SET `count` = $count WHERE id = {$row['id']}";
			$db->exec($sql) or die(print_r($db->errorInfo(), true));
		} else {
			$sql = "INSERT INTO page (url, `domain`, `count`) VALUES ('{$_GET['url']}', '{$_GET['domain']}', 1)";
			$db->exec($sql) or die(print_r($db->errorInfo(), true));
			$row = [
				'url' => $_GET['url'],
				'domain' => $_GET['domain'],
				'count' => 1,
			];
		}
		unset($row['id']);
		return json_encode($row);
	}
}

$result = parse();
echo "{$_GET['callback']}($result);";
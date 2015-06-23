<?php
require_once('help/dbConnection.php');

function parse() {
	if($_GET['type'] === 'get') {
		$pages = json_decode($_REQUEST['pages']);
		if (!is_array($pages)) {
			header("HTTP/1.1 400 Bad Request");
			return '';
		}
		foreach ($pages as $index => $page) {
			if (isset($page->url) && isset($page->domain)) {
				$sql = "SELECT * FROM page WHERE url = '{$page->url}' AND `domain` = '{$page->domain}'";
				$rs = mysql_query($sql) or die(mysql_error());
				$row = mysql_fetch_assoc($rs);
				if ($row) {
					$page->id = $row['id'];
				}
			} else {
				unset($pages[$index]);
			}
		}
		return json_encode($pages);
	} else if($_GET['type'] === 'post') {
		$sql = "SELECT * FROM page WHERE url = '{$_REQUEST['url']}' AND `domain` = '{$_REQUEST['domain']}'";
		$rs = mysql_query($sql) or die(mysql_error());
		$row = mysql_fetch_assoc($rs);
		if ($row) {
			$count = ++$row['count'];
			$sql = "UPDATE page SET `count` = $count WHERE id = {$row['id']}";
			mysql_query($sql) or die(mysql_error());
		} else {
			$sql = "INSERT INTO page (url, `domain`, `count`) VALUES ('{$_REQUEST['url']}', '{$_REQUEST['domain']}', 1)";
			mysql_query($sql) or die(mysql_error());
			$row = [
				'url' => $_REQUEST['url'],
				'domain' => $_REQUEST['domain'],
				'count' => 1,
			];
		}
		unset($row['id']);
		return json_encode($row);
	}
}

$result = parse();
echo "{$_REQUEST['callback']}($result);";
<?php
require_once('../help/dbConnection.php');

$db = dbConnection();
$sql = $db->prepare("DELETE FROM page WHERE `domain` = '{$_GET['current']}'");
$sql->execute() or die (print_r($sql->errorInfo(), true));
echo $_GET['callback'] . '()';
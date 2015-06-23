<?php
if (!defined(SAE_MYSQL_HOST_M)) {
	mysql_connect('127.0.0.1', 'root', '') or die(mysql_error());
	mysql_select_db('analytics') or die(mysql_error());
	mysql_query('set names utf8') or die(mysql_error());
} else {
	mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS) or die(mysql_error());
	mysql_select_db(SAE_MYSQL_DB, self::$connection) or die(mysql_error());
	mysql_query('set names utf8') or die(mysql_error());
}
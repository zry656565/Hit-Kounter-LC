<?php

/**
 * @author: Jerry Zou
 * @email: jerry.zry@outlook.com
 */

require_once(__DIR__ . '/../help/dbConnection.php');

class DatabaseHelper
{
    public $db = null;

    function __construct()
    {
        $this->db = dbConnection();
    }

    public function queryAll($table, $columns = [], $options = [ 'count' => -1 ]) {
        $sql = "SELECT * FROM {$table}";
        $where = " WHERE 1 ";
        foreach ($columns as $col => $val) {
            $where .= " AND `{$col}` = :{$col} ";
        }
        $sql .= $where;
        if (isset($options['orderBy'])) $sql .= " ORDER BY `{$options['orderBy']}` DESC ";
        if ($options['count'] != -1) $sql .= " LIMIT {$options['count']} ";

        $prepareStatement = $this->db->prepare($sql);
        $prepareStatement->execute($columns) or die(print_r($prepareStatement->errorInfo(), true));
        return $prepareStatement->fetchAll();
    }

    public function query($table, $columns, $options = [ 'count' => 1 ]) {
        $result = $this->queryAll($table, $columns, $options);
        if (count($result)) return $result[0];
        return null;
    }

    public function update($table, $setValues, $wheres) {
        $sql = "UPDATE {$table} SET ";
        $setStr = "";
        foreach ($setValues as $col => $val) {
            $setStr = " `{$col}` = :{$col}, ";
        }
        $setStr = substr($setStr, 0, strlen($setStr) - 2);
        $where = " WHERE 1 ";
        foreach ($wheres as $col => $val) {
            $where .= " AND `{$col}` = :{$col} ";
        }
        $sql .= $setStr . $where;

        $prepareStatement = $this->db->prepare($sql);
        return $prepareStatement->execute(array_merge($setValues, $wheres))
            or die(print_r($prepareStatement->errorInfo(), true));
    }

    public function insert($table, $columns) {
        $sql = "INSERT INTO {$table} (" . join(',', array_keys($columns)) . ")";
        $values = "";
        foreach ($columns as $col => $val) {
            $values .= " :{$col}, ";
        }
        $values = substr($values, 0, strlen($values) - 2);
        $sql .= " VALUES (" . $values . ")";

        $prepareStatement = $this->db->prepare($sql);
        return $prepareStatement->execute($columns) or die(print_r($prepareStatement->errorInfo(), true));
    }

}
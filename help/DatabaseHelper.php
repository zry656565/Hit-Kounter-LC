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
        if (isset($options['orderBy'])) {
            $sql .= " ORDER BY `{$options['orderBy']}` ";
        }
        if ($options['count'] != -1) {
            $sql .= " LIMIT {$options['count']} ";
        }

        $prepareStatement = $this->db->prepare($sql);
        if ($options['count'] == 1) {
            $prepareStatement->execute($columns) or die(print_r($prepareStatement->errorInfo(), true));
            if ($prepareStatement->rowCount()) {
                $row = $prepareStatement->fetch(PDO::FETCH_ASSOC);
                return $row;
            }
        } else {
            $prepareStatement->execute($columns) or die(print_r($prepareStatement->errorInfo(), true));
            return $prepareStatement->fetchAll();
        }
        return null;
    }

    public function query($table, $columns, $options = [ 'count' => 1 ]) {
        return $this->queryAll($table, $columns, $options);
    }

}
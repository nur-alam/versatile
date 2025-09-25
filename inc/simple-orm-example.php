<?php

/**
 * Simple ORM Example - Building from Scratch
 * This demonstrates the core concepts in the simplest possible way
 */
// Load WordPress if not already loaded

class QueryBuilder
{
    protected $table;
    protected $wheres = array();
    public function __construct($table)
    {
        $this->table = $table;
    }

    public function where($column, $value)
    {
        $this->wheres = "{$column} {$value}";
        return $this;
    }
}

class BaseModel
{
    protected static $table;
    protected static $query_builder;

    public function __construct()
    {
        self::$query_builder = new QueryBuilder(self::$table);
    }

    public function __get($key)
    {
        return $this->table;
    }

    public static function where($column, $value)
    {
        return self::$query_builder->where($column, $value);
    }
}

class TempLoginModel extends BaseModel
{
    public function __construct()
    {
        self::$table = 'juicy';
    }
}
$baseModel = new BaseModel();
$loginModel = new TempLoginModel();
$yo = $loginModel::where('id', 1)->where('name', 'nur');
var_dump($yo->$table);
// var_dump($loginModel::where('id', 1)->where('name', 'nur'));

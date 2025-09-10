<?php

/**
 * Query Builder Class - Laravel Eloquent-style query builder
 *
 * @package Versatile\Models
 * @subpackage Versatile\Models\QueryBuilder
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Models;

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Query Builder Class
 */
class QueryBuilder
{
	protected $table;

	protected $wheres = [];

	/**
	 * Constructor
	 *
	 * @param string $table Table name.
	 */
	public function __construct($table)
	{
		$this->table = $table;
	}

	public function where($column, $operator, $value)
	{
		if (null === $value) {
			$value = $operator;
			$operator = '=';
		}
		$this->wheres[] = array(
			'type' => 'basic',
			'column' => $column,
			'operator' => $operator,
			'value' => $value,
			'boolean' => 'and',
		);
		return $this;
	}

	public function get()
	{
		global $wpdb;
		$sql = $this->to_sql();
		return $wpdb->get_results($sql);
	}

	public function to_sql()
	{
		$sql = "SELECT * FROM {$this->table}";
		if (! empty($this->wheres)) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}
		return $sql;
	}

	public function compile_wheres()
	{
		global $wpdb;
		$compile_wheres_string = '';
		foreach ($this->wheres as $index => $where) {
			$column = $where['column'];
			$operator = $where['operator'];
			$value = $where['value'];
			$boolean = $where['boolean'];

			if (0 !== $index) {
				$compile_wheres_string .= " {$boolean} ";
			}

			if (strtoupper($operator) === 'LIKE') {
				$compile_wheres_string .= "{$column} LIKE '{$value}'";
			} else {
				switch ($operator) {
					case '=':
					case '!=':
					case '<>':
					case '>':
					case '>=':
					case '<':
					case '<=':
						$compile_wheres_string .= "{$column} {$operator} '{$value}'";
						break;
					default:
						$compile_wheres_string .= "{$column} = '{$value}'";
				}
			}
		}
		return $compile_wheres_string;
	}
}

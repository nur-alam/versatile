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

	protected $orders = [];

	protected $limit;

	protected $offset;

	/**
	 * Constructor
	 *
	 * @param string $table Table name.
	 */
	public function __construct($table)
	{
		$this->table = $table;
	}

	public function get()
	{
		global $wpdb;
		$sql = $this->to_sql();
		return $wpdb->get_results($sql);
	}

	public function first()
	{
		$this->limit = 1;
		$result = $this->get();
		return ! empty($result) ? $result[0] : null;
	}

	public function where($column, $operator = null, $value = null)
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
			'combine' => 'and',
		);
		return $this;
	}

	public function orWhere($column, $operator, $value)
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
			'combine' => 'or'
		);
		return $this;
	}

	public function orderBy($column, $direction = 'asc')
	{
		$this->orders[] = array(
			'column' => $column,
			'direction' => strtolower($direction) === 'desc' ? 'desc' : 'asc'
		);
		return $this;
	}

	public function limit($value)
	{
		$this->limit = max(0, (int) $value);

		return $this;
	}

	public function offset($value)
	{
		$this->offset = max(0, (int) $value);

		return $this;
	}

	public function to_sql()
	{
		$sql = "SELECT * FROM {$this->table}";
		if (! empty($this->wheres)) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}

		if (! empty($this->orders)) {
			$sql .= ' ORDER BY ' . $this->compile_orders();
		}

		if (! empty($this->limit)) {
			$sql .= ' LIMIT ' . $this->limit;
		}

		if (! empty($this->offset)) {
			$sql .= ' OFFSET ' . $this->offset;
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
			$combine_operator = $where['combine'];

			if (0 !== $index) {
				$compile_wheres_string .= " {$combine_operator} ";
			}

			if (strtoupper($operator) === 'LIKE') {
				// $compile_wheres_string .= "{$column} LIKE '{$value}'";
				$compile_wheres_string .= $wpdb->prepare("{$column} LIKE %s", $value);
			} else {
				switch ($operator) {
					case '=':
					case '!=':
					case '<>':
					case '>':
					case '>=':
					case '<':
					case '<=':
						// $compile_wheres_string .= "{$column} {$operator} '{$value}'";
						if (is_numeric($value)) {
							$yo = $wpdb->prepare("{$column} {$operator} %d", $value);
							$condition = $wpdb->prepare("{$column} {$operator} %d", $value);
							$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %d", $value);
						} else {
							$yo = $wpdb->prepare("{$column} {$operator} %d", $value);
							$condition = $wpdb->prepare("{$column} {$operator} %d", $value);
							$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %s", $value);
						}
						break;
					default:
						// $compile_wheres_string .= "{$column} = '{$value}'";
						if (is_numeric($value)) {
							$yo = $wpdb->prepare("{$column} {$operator} %d", $value);
							$condition = $wpdb->prepare("{$column} {$operator} %d", $value);
							$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %d", $value);
						} else {
							$yo = $wpdb->prepare("{$column} {$operator} %d", $value);
							$condition = $wpdb->prepare("{$column} {$operator} %d", $value);
							$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %s", $value);
						}
						break;
				}
			}
		}
		return $compile_wheres_string;
	}

	public function compile_orders()
	{
		$compiled = array();
		foreach ($this->orders as $index => $order) {
			$compiled[] = $order['column'] . ' ' . strtoupper($order['direction']);
		}
		return implode(', ', $compiled);
	}
}

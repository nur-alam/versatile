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

	protected $columns = ['*'];

	/**
	 * Constructor
	 *
	 * @param string $table Table name.
	 */
	public function __construct($table)
	{
		$this->table = $table;
	}

	public function select($columns)
	{
		$this->columns = is_array($columns) ? $columns : func_get_args();
		return $this;
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

	public function count()
	{
		global $wpdb;
		$sql = $this->to_count_sql();
		return (int) $wpdb->get_var( $sql );
	}

	/**
	 * Delete records from the table
	 *
	 * @return int|bool Number of rows affected, or false on error
	 */
	public function delete()
	{
		global $wpdb;
		$sql = $this->to_delete_sql();
		return $wpdb->query($sql);
	}

	/**
	 * Destroy records by their IDs
	 *
	 * @param array $ids Array of record IDs to delete
	 * @return int|bool Number of rows affected, or false on error
	 */
	public function destroy(array $ids, $column)
	{
		$this->wheres[] = array(
			'type' => 'basic',
			'column' => $column,
			'operator' => 'IN',
			'value' => $ids,
			'combine' => 'and',
		);
		return $this->delete();
	}

	public function where($column, $operator = null, $value = null)
	{
		if(is_callable($column)) {
			return $this->where_nested($column, 'and');
		}

		if(is_array($column)) {
			foreach($column as $col => $val) {
				if(count($val) === 3) {
					$col = $val[0];
					$operator = $val[1];
					$value = $val[2];
				} else if (count($val) === 2) {
					$col = $val;
					$operator = '=';
					$value = $val;
				} else {
					continue;
				}

				$this->wheres[] = array(
					'type' => 'basic',
					'column' => $col,
					'operator' => $operator,
					'value' => $value,
					'combine' => 'and',
				);
			}
		} else {
			if (null === $value) {
				$value = $operator;
				$operator = '=';
			}
			if('' === $value) {
				return $this;
			}
			$this->wheres[] = array(
				'type' => 'basic',
				'column' => $column,
				'operator' => $operator,
				'value' => $value,
				'combine' => 'and',
			);
		}
		return $this;
	}

	public function orWhere($column, $operator = null, $value = null)
	{
		if(is_callable($column)) {
			return $this->where_nested($column, 'or');
		}

		if(is_array($column)) {
			foreach($column as $col => $val) {
				if(count($val) === 3) {
					$col = $val[0];
					$operator = $val[1];
					$value = $val[2];
				} else if (count($val) === 2) {
					$col = $val;
					$operator = '=';
					$value = $val;
				} else {
					continue;
				}

				$this->wheres[] = array(
					'type' => 'basic',
					'column' => $col,
					'operator' => $operator,
					'value' => $value,
					'combine' => 'or',
				);
			}
		} else {
			if (null === $value) {
				$value = $operator;
				$operator = '=';
			}
			if('' === $value) {
				return $this;
			}
			$this->wheres[] = array(
				'type' => 'basic',
				'column' => $column,
				'operator' => $operator,
				'value' => $value,
				'combine' => 'or'
			);
		}
		return $this;
	}

	/**
	 * Add a raw where clause to the query
	 *
	 * @param string $sql Raw SQL condition
	 * @param string $combine 'and' or 'or'
	 * @return $this
	 */
	public function whereRaw($sql, $combine = 'and')
	{
		$this->wheres[] = array(
			'type' => 'raw',
			'sql' => $sql,
			'combine' => $combine
		);
		return $this;
	}

	/**
	 * Add a raw OR where clause to the query
	 *
	 * @param string $sql Raw SQL condition
	 * @return $this
	 */
	public function orWhereRaw($sql)
	{
		return $this->whereRaw($sql, 'or');
	}

	protected function where_nested($callback, $operator)
	{
		$query = new static($this->table);
		call_user_func($callback, $query);
		$this->wheres[] = array(
			'type' => 'nested',
			'query' => $query,
			'operator' => $operator
		);

		return $this;
	}

	public function orderBy($column, $direction = 'asc')
	{
		// If $column is an array, handle multiple order by clauses
		if (is_array($column)) {
			foreach ($column as $col => $dir) {
				$this->orders[] = array(
					'column' => $col,
					'direction' => strtolower($dir) === 'desc' ? 'desc' : 'asc'
				);
			}
		} else {
			// Handle single column ordering
			$this->orders[] = array(
				'column' => $column,
				'direction' => strtolower($direction) === 'desc' ? 'desc' : 'asc'
			);
		}
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
		$columns = implode(', ', $this->columns);
		$sql = "SELECT {$columns} FROM {$this->table}";
		if (! empty($this->wheres)) {
			$compiled_wheres = $this->compile_wheres();
			if(!empty($compiled_wheres)) {
				$sql .= ' WHERE ' . $this->compile_wheres();
			}
		}

		if (! empty($this->orders)) {
			$compiled_orders = $this->compile_orders();
			if(!empty($compiled_orders)) {
				$sql .= ' ORDER BY ' . $this->compile_orders();
			}
		}

		if (! empty($this->limit)) {
			$compiled_limit = $this->limit;
			if(!empty($compiled_limit)) {
				$sql .= ' LIMIT ' . $this->limit;
			}
		}

		if (! empty($this->offset)) {
			$compiled_offset = $this->offset;
			if(!empty($compiled_offset)) {
				$sql .= ' OFFSET ' . $this->offset;
			}
		}

		return $sql;
	}

	public function to_count_sql()
	{
		$sql = "SELECT COUNT(*) FROM {$this->table}";
		// Add WHERE clauses
		if(! empty($this->wheres)) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}
		return $sql;
	}

	public function to_delete_sql()
	{
		$sql = "DELETE FROM {$this->table}";
		// Add WHERE clauses
		if(! empty($this->wheres)) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}
		return $sql;
	}

	public function compile_wheres()
	{
		global $wpdb;
		$compile_wheres_string = '';
		foreach ($this->wheres as $index => $where) {
			$combine_operator = isset($where['combine']) ? $where['combine'] : 'and';
			if (0 !== $index) {
				$compile_wheres_string .= " {$combine_operator} ";
			}
			if('nested' === $where['type']) {
				// Handle nested conditions
				$nested_wheres = $where['query']->compile_wheres();
				if(!empty($nested_wheres)) {
					if(count($where['query']->wheres) > 1) {
						$compile_wheres_string .= '(' . $nested_wheres . ')';
					} else {
						$compile_wheres_string .= $nested_wheres;
					}
				}
			} elseif('raw' === $where['type']) {
				// Handle raw SQL conditions
				$compile_wheres_string .= $where['sql'];
			} else {
				$column = $where['column'];
				$operator = $where['operator'];
				$value = $where['value'];
				
				// Check if value is a MySQL function (contains parentheses and common function names)
				$is_mysql_function = $this->is_mysql_function($value);
				
				if (strtoupper($operator) === 'LIKE') {
					if ($is_mysql_function) {
						$compile_wheres_string .= "{$column} LIKE {$value}";
					} else {
						$compile_wheres_string .= $wpdb->prepare("{$column} LIKE %s", $value);
					}
				} else if (strtoupper($operator) === 'IN') {
					if(is_array($value)) {
						$placeholders = implode(',', array_fill(0, count($value), '%d'));
						$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} ({$placeholders})", ...$value);
					} else {
						$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %d", $value);
					}
				} else {
					switch ($operator) {
						case '=':
						case '!=':
						case '<>':
						case '>':
						case '>=':
						case '<':
						case '<=':
							if ($is_mysql_function) {
								$compile_wheres_string .= "{$column} {$operator} {$value}";
							} elseif (is_numeric($value)) {
								$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %d", $value);
							} else {
								$compile_wheres_string .= $wpdb->prepare("{$column} {$operator} %s", $value);
							}
							break;
						default:
							if ($is_mysql_function) {
								$compile_wheres_string .= "{$column} = {$value}";
							} elseif (is_numeric($value)) {
								$compile_wheres_string .= $wpdb->prepare("{$column} = %d", $value);
							} else {
								$compile_wheres_string .= $wpdb->prepare("{$column} = %s", $value);
							}
							break;
					}
				}
			}
		}
		return $compile_wheres_string;
	}

	/**
	 * Check if a value is a MySQL function
	 *
	 * @param mixed $value The value to check
	 * @return bool
	 */
	protected function is_mysql_function($value)
	{
		if (!is_string($value)) {
			return false;
		}
		
		// List of common MySQL functions
		$mysql_functions = [
			'NOW()', 'CURDATE()', 'CURTIME()', 'UTC_TIMESTAMP()', 'CURRENT_TIMESTAMP()',
			'CURRENT_DATE()', 'CURRENT_TIME()', 'UNIX_TIMESTAMP()', 'DATE()', 'TIME()',
			'YEAR()', 'MONTH()', 'DAY()', 'HOUR()', 'MINUTE()', 'SECOND()',
			'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'CONCAT()', 'LENGTH()',
			'UPPER()', 'LOWER()', 'TRIM()', 'SUBSTRING()', 'REPLACE()', 'NULL'
		];
		
		// Check for exact matches with common functions
		if (in_array(strtoupper($value), $mysql_functions)) {
			return true;
		}
		
		// Check for function patterns (word followed by parentheses)
		if (preg_match('/^[A-Z_][A-Z0-9_]*\s*\(/i', $value)) {
			return true;
		}
		
		return false;
	}

	// protected function compile_wheres() {
	// 	global $wpdb;

	// 	$compiled = array();

	// 	foreach ( $this->wheres as $index => $where ) {
	// 		$boolean   = $where['boolean'];
	// 		$condition = '';

	// 		if ( 'nested' === $where['type'] ) {
	// 			// Handle nested conditions
	// 			$nested_wheres = $where['query']->compile_wheres();
	// 			if ( ! empty( $nested_wheres ) ) {
	// 				$condition = '(' . $nested_wheres . ')';
	// 			}
	// 		} else {
	// 			// Handle basic conditions
	// 			$column   = $where['column'];
	// 			$operator = $where['operator'];
	// 			$value    = $where['value'];

	// 			// Handle LIKE operator
	// 			if ( strtoupper( $operator ) === 'LIKE' ) {
	// 				$condition = $wpdb->prepare( "{$column} LIKE %s", $value );
	// 			} else {
	// 				// Handle other operators
	// 				switch ( $operator ) {
	// 					case '=':
	// 					case '!=':
	// 					case '<>':
	// 					case '>':
	// 					case '>=':
	// 					case '<':
	// 					case '<=':
	// 						if ( is_numeric( $value ) ) {
	// 							$condition = $wpdb->prepare( "{$column} {$operator} %d", $value );
	// 						} else {
	// 							$condition = $wpdb->prepare( "{$column} {$operator} %s", $value );
	// 						}
	// 						break;
	// 					default:
	// 						if ( is_numeric( $value ) ) {
	// 							$condition = $wpdb->prepare( "{$column} = %d", $value );
	// 						} else {
	// 							$condition = $wpdb->prepare( "{$column} = %s", $value );
	// 						}
	// 						break;
	// 				}
	// 			}
	// 		}

	// 		// Add boolean operator (AND/OR) except for the first condition
	// 		if ( 0 === $index ) {
	// 			$compiled[] = $condition;
	// 		} else {
	// 			$compiled[] = strtoupper( $boolean ) . ' ' . $condition;
	// 		}
	// 	}

	// 	return implode( ' ', $compiled );
	// }

	public function compile_orders()
	{
		$compiled = array();
		foreach ($this->orders as $order) {
			$compiled[] = $order['column'] . ' ' . strtoupper($order['direction']);
		}
		return implode(', ', $compiled);
	}
}

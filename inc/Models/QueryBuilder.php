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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Query Builder Class
 */
class QueryBuilder {

	/**
	 * Table name
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $table;

	/**
	 * Model class name for hydrating results
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $model_class;

	/**
	 * Array of where clause conditions
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	protected $wheres = array();

	/**
	 * Array of order by clause conditions
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	protected $orders = array();

	/**
	 * Limit for pagination
	 *
	 * @since 1.0.0
	 *
	 * @var int
	 */
	protected $limit;

	/**
	 * Offset for pagination
	 *
	 * @since 1.0.0
	 *
	 * @var int
	 */
	protected $offset;

	/**
	 * Array of columns to select
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	protected $columns = array( '*' );

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 *
	 * @param string $table Table name.
	 * @param string $model_class Model class name for hydrating results.
	 */
	public function __construct( $table, $model_class = null ) {
		$this->table       = $table;
		$this->model_class = $model_class;
	}

	/**
	 * Set columns to select
	 *
	 * @since 1.0.0
	 *
	 * @param array|string $columns Columns to select.
	 * @return $this
	 */
	public function select( $columns ) {
		$this->columns = is_array( $columns ) ? $columns : func_get_args();
		return $this;
	}

	/**
	 * Get results from the query
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of model instances or raw results.
	 */
	public function get() {
		global $wpdb;
		$sql     = $this->to_sql();
		$results = $wpdb->get_results( $sql ); // phpcs:ignore

		// If model class is set, hydrate results into model instances
		if ( $this->model_class && ! empty( $results ) ) {
			$models = array();
			foreach ( $results as $result ) {
				$model = new $this->model_class();
				// Use reflection to directly set the protected attributes property
				$reflection          = new \ReflectionClass( $model );
				$attributes_property = $reflection->getProperty( 'attributes' );
				$attributes_property->setAccessible( true );
				$attributes_property->setValue( $model, (array) $result );

				$exists_property = $reflection->getProperty( 'exists' );
				$exists_property->setAccessible( true );
				$exists_property->setValue( $model, true );

				$models[] = $model;
			}
			return $models;
		}

		return $results;
	}

	/**
	 * Get the first record from the query
	 *
	 * @since 1.0.0
	 *
	 * @return object|array|null Model instance or raw result, or null if no results.
	 */
	public function first() {
		$this->limit = 1;
		$result      = $this->get();
		return ! empty( $result ) ? $result[0] : null;
	}

	/**
	 * Get the count of records from the query
	 *
	 * @since 1.0.0
	 *
	 * @return int Number of records.
	 */
	public function count() {
		global $wpdb;
		$sql = $this->to_count_sql();
		return (int) $wpdb->get_var( $sql ); // phpcs:ignore
	}

	/**
	 * Update records in the table
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Array of column => value pairs to update.
	 * @return int|bool Number of rows affected, or false on error.
	 */
	public function update( array $data ) {
		global $wpdb;
		$sql = $this->to_update_sql( $data );
		return $wpdb->query( $sql ); // phpcs:ignore
	}

	/**
	 * Delete records from the table
	 *
	 * @since 1.0.0
	 *
	 * @return int|bool Number of rows affected, or false on error
	 */
	public function delete() {
		global $wpdb;
		$sql = $this->to_delete_sql();
		return $wpdb->query( $sql ); //phpcs:ignore
	}

	/**
	 * Destroy records by their IDs
	 *
	 * @since 1.0.0
	 *
	 * @param array  $ids Array of record IDs to delete.
	 * @param string $column Column name to match IDs against.
	 * @return int|bool Number of rows affected, or false on error
	 */
	public function destroy( array $ids, $column ) {
		$this->wheres[] = array(
			'type'     => 'basic',
			'column'   => $column,
			'operator' => 'IN',
			'value'    => $ids,
			'combine'  => 'and',
		);
		return $this->delete();
	}

	/**
	 * Add a basic where clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string|array $column Column name or array of column => value pairs.
	 * @param string|null  $operator Comparison operator (e.g., '=', '>', '<', 'LIKE').
	 * @param mixed|null   $value Value to compare against.
	 * @return $this
	 */
	public function where( $column, $operator = null, $value = null ) {
		if ( is_callable( $column ) ) {
			return $this->where_nested( $column, 'and' );
		}

		if ( is_array( $column ) ) {
			foreach ( $column as $key => $val ) {
				if ( count( $val ) === 3 ) {
					$col      = $val[0];
					$operator = $val[1];
					$value    = $val[2];
				} elseif ( count( $val ) === 2 ) {
					$col      = $val[0];
					$operator = '=';
					$value    = $val[1];
				} else {
					continue;
				}

				$this->wheres[] = array(
					'type'     => 'basic',
					'column'   => $col,
					'operator' => $operator,
					'value'    => $value,
					'combine'  => 'and',
				);
			}
		} else {
			if ( null === $value ) {
				$value    = $operator;
				$operator = '=';
			}
			if ( '' === $value ) {
				return $this;
			}
			$this->wheres[] = array(
				'type'     => 'basic',
				'column'   => $column,
				'operator' => $operator,
				'value'    => $value,
				'combine'  => 'and',
			);
		}
		return $this;
	}

	/**
	 * Add an OR where clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string|array $column Column name or array of column => value pairs.
	 * @param string|null  $operator Comparison operator (e.g., '=', '>', '<', 'LIKE').
	 * @param mixed|null   $value Value to compare against.
	 * @return $this
	 */
	public function or_where( $column, $operator = null, $value = null ) { // phpcs:ignore
		if ( is_callable( $column ) ) {
			return $this->where_nested( $column, 'or' );
		}

		if ( is_array( $column ) ) {
			foreach ( $column as $col => $val ) {
				if ( count( $val ) === 3 ) {
					$col      = $val[0];
					$operator = $val[1];
					$value    = $val[2];
				} elseif ( count( $val ) === 2 ) {
					$col      = $val;
					$operator = '=';
					$value    = $val;
				} else {
					continue;
				}

				$this->wheres[] = array(
					'type'     => 'basic',
					'column'   => $col,
					'operator' => $operator,
					'value'    => $value,
					'combine'  => 'or',
				);
			}
		} else {
			if ( null === $value ) {
				$value    = $operator;
				$operator = '=';
			}
			if ( '' === $value ) {
				return $this;
			}
			$this->wheres[] = array(
				'type'     => 'basic',
				'column'   => $column,
				'operator' => $operator,
				'value'    => $value,
				'combine'  => 'or',
			);
		}
		return $this;
	}

	/**
	 * Add a raw where clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string $sql Raw SQL condition.
	 * @param string $combine 'and' or 'or'.
	 * @return $this
	 */
	public function where_raw( $sql, $combine = 'and' ) { // phpcs:ignore
		$this->wheres[] = array(
			'type'    => 'raw',
			'sql'     => $sql,
			'combine' => $combine,
		);
		return $this;
	}

	/**
	 * Add a raw OR where clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string $sql Raw SQL condition.
	 * @return $this
	 */
	public function or_where_raw( $sql ) { // phpcs:ignore
		return $this->where_raw( $sql, 'or' );
	}

	/**
	 * Add a nested where clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param callable $callback Callback function to build the nested query.
	 * @param string   $operator 'and' or 'or'.
	 * @return $this
	 */
	protected function where_nested( $callback, $operator ) {
		$query = new static( $this->table );
		call_user_func( $callback, $query );
		if ( count( $query->wheres ) > 0 ) {
			$this->wheres[] = array(
				'type'     => 'nested',
				'query'    => $query,
				'operator' => $operator,
			);
		}

		return $this;
	}

	/**
	 * Add an ORDER BY clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string|array $column Column name or array of column => direction pairs.
	 * @param string       $direction 'asc' or 'desc'.
	 * @return $this
	 */
	public function order_by( $column, $direction = 'asc' ) { // phpcs:ignore
		// If $column is an array, handle multiple order by clauses
		if ( is_array( $column ) ) {
			foreach ( $column as $col => $dir ) {
				$this->orders[] = array(
					'column'    => $col,
					'direction' => strtolower( $dir ) === 'desc' ? 'desc' : 'asc',
				);
			}
		} else {
			// Handle single column ordering
			$this->orders[] = array(
				'column'    => $column,
				'direction' => strtolower( $direction ) === 'desc' ? 'desc' : 'asc',
			);
		}
		return $this;
	}

	/**
	 * Add a LIMIT clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param int $value Number of rows to limit the result to.
	 * @return $this
	 */
	public function limit( $value ) {
		$this->limit = max( 0, (int) $value );

		return $this;
	}

	/**
	 * Add an OFFSET clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param int $value Number of rows to offset the result by.
	 * @return $this
	 */
	public function offset( $value ) {
		$this->offset = max( 0, (int) $value );

		return $this;
	}

	/**
	 * Generate the SQL query string for the current query
	 *
	 * @since 1.0.0
	 *
	 * @return string SQL query string.
	 */
	public function to_sql() {
		$columns = implode( ', ', $this->columns );
		$sql     = "SELECT {$columns} FROM {$this->table}";
		if ( ! empty( $this->wheres ) ) {
			$compiled_wheres = $this->compile_wheres();
			if ( ! empty( $compiled_wheres ) ) {
				$sql .= ' WHERE ' . $compiled_wheres;
			}
		}

		if ( ! empty( $this->orders ) ) {
			$compiled_orders = $this->compile_orders();
			if ( ! empty( $compiled_orders ) ) {
				$sql .= ' ORDER BY ' . $compiled_orders;
			}
		}

		if ( ! empty( $this->limit ) ) {
			$compiled_limit = $this->limit;
			if ( ! empty( $compiled_limit ) ) {
				$sql .= ' LIMIT ' . $compiled_limit;
			}
		}

		if ( ! empty( $this->offset ) ) {
			$compiled_offset = $this->offset;
			if ( ! empty( $compiled_offset ) ) {
				$sql .= ' OFFSET ' . $compiled_offset;
			}
		}

		return $sql;
	}

	/**
	 * Generate the SQL query string for a COUNT(*) query
	 *
	 * @since 1.0.0
	 *
	 * @return string SQL query string.
	 */
	public function to_count_sql() {
		$sql = "SELECT COUNT(*) FROM {$this->table}";
		// Add WHERE clauses
		if ( ! empty( $this->wheres ) ) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}
		return $sql;
	}

	/**
	 * Generate the SQL query string for an UPDATE query
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Array of column => value pairs to update.
	 * @return string SQL query string.
	 */
	public function to_update_sql( array $data ) {
		global $wpdb;

		$set_clauses = array();
		foreach ( $data as $column => $value ) {
			if ( is_numeric( $value ) ) {
				$set_clauses[] = $wpdb->prepare( "{$column} = %d", $value );
			} else {
				$set_clauses[] = $wpdb->prepare( "{$column} = %s", $value );
			}
		}

		$sql = "UPDATE {$this->table} SET " . implode( ', ', $set_clauses );

		// Add WHERE clauses
		if ( ! empty( $this->wheres ) ) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}

		return $sql;
	}

	/**
	 * Generate the SQL query string for a DELETE query
	 *
	 * @since 1.0.0
	 *
	 * @return string SQL query string.
	 */
	public function to_delete_sql() {
		$sql = "DELETE FROM {$this->table}";
		// Add WHERE clauses
		if ( ! empty( $this->wheres ) ) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}
		return $sql;
	}

	/**
	 * Compile the WHERE clauses for the query
	 *
	 * @since 1.0.0
	 *
	 * @return string Compiled WHERE clause string.
	 */
	public function compile_wheres() {
		global $wpdb;
		$compile_wheres_string = '';
		foreach ( $this->wheres as $index => $where ) {
			$combine_operator = isset( $where['combine'] ) ? $where['combine'] : 'and';
			if ( 0 !== $index ) {
				$compile_wheres_string .= " {$combine_operator} ";
			}
			if ( 'nested' === $where['type'] ) {
				// Handle nested conditions
				$nested_wheres = $where['query']->compile_wheres();
				if ( ! empty( $nested_wheres ) ) {
					if ( count( $where['query']->wheres ) > 1 ) {
						$compile_wheres_string .= '(' . $nested_wheres . ')';
					} else {
						$compile_wheres_string .= $nested_wheres;
					}
				}
			} elseif ( 'raw' === $where['type'] ) {
				// Handle raw SQL conditions
				$compile_wheres_string .= $where['sql'];
			} else {
				$column   = $where['column'];
				$operator = $where['operator'];
				$value    = $where['value'];

				// Check if value is a MySQL function (contains parentheses and common function names)
				$is_mysql_function = $this->is_mysql_function( $value );

				if ( strtoupper( $operator ) === 'LIKE' ) {
					if ( $is_mysql_function ) {
						$compile_wheres_string .= "{$column} LIKE {$value}";
					} else {
						$compile_wheres_string .= $wpdb->prepare( "{$column} LIKE %s", $value );
					}
				} elseif ( strtoupper( $operator ) === 'IN' ) {
					if ( is_array( $value ) ) {
						$placeholders           = implode( ',', array_fill( 0, count( $value ), '%d' ) );
						$compile_wheres_string .= $wpdb->prepare( "{$column} {$operator} ({$placeholders})", ...$value );
					}
				} else {
					switch ( $operator ) {
						case '=':
						case '!=':
						case '<>':
						case '>':
						case '>=':
						case '<':
						case '<=':
							if ( $is_mysql_function ) {
								$compile_wheres_string .= "{$column} {$operator} {$value}";
							} elseif ( is_numeric( $value ) ) {
								$compile_wheres_string .= $wpdb->prepare( "{$column} {$operator} %d", $value );
							} else {
								$compile_wheres_string .= $wpdb->prepare( "{$column} {$operator} %s", $value );
							}
							break;
						default:
							if ( $is_mysql_function ) {
								$compile_wheres_string .= "{$column} = {$value}";
							} elseif ( is_numeric( $value ) ) {
								$compile_wheres_string .= $wpdb->prepare( "{$column} = %d", $value );
							} else {
								$compile_wheres_string .= $wpdb->prepare( "{$column} = %s", $value );
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
	 * @since 1.0.0
	 *
	 * @param mixed $value The value to check.
	 * @return bool
	 */
	protected function is_mysql_function( $value ) {
		if ( ! is_string( $value ) ) {
			return false;
		}

		// List of common MySQL functions
		$mysql_functions = array(
			'NOW()',
			'CURDATE()',
			'CURTIME()',
			'UTC_TIMESTAMP()',
			'CURRENT_TIMESTAMP()',
			'CURRENT_DATE()',
			'CURRENT_TIME()',
			'UNIX_TIMESTAMP()',
			'DATE()',
			'TIME()',
			'YEAR()',
			'MONTH()',
			'DAY()',
			'HOUR()',
			'MINUTE()',
			'SECOND()',
			'COUNT()',
			'SUM()',
			'AVG()',
			'MIN()',
			'MAX()',
			'CONCAT()',
			'LENGTH()',
			'UPPER()',
			'LOWER()',
			'TRIM()',
			'SUBSTRING()',
			'REPLACE()',
			'NULL',
		);

		// Check for exact matches with common functions
		if ( in_array( strtoupper( $value ), $mysql_functions ) ) {
			return true;
		}

		// Check for function patterns (word followed by parentheses)
		if ( preg_match( '/^[A-Z_][A-Z0-9_]*\s*\(/i', $value ) ) {
			return true;
		}

		return false;
	}

	// protected function compile_wheres() {
	// global $wpdb;

	// $compiled = array();

	// foreach ( $this->wheres as $index => $where ) {
	// $boolean   = $where['boolean'];
	// $condition = '';

	// if ( 'nested' === $where['type'] ) {
	// Handle nested conditions
	// $nested_wheres = $where['query']->compile_wheres();
	// if ( ! empty( $nested_wheres ) ) {
	// $condition = '(' . $nested_wheres . ')';
	// }
	// } else {
	// Handle basic conditions
	// $column   = $where['column'];
	// $operator = $where['operator'];
	// $value    = $where['value'];

	// Handle LIKE operator
	// if ( strtoupper( $operator ) === 'LIKE' ) {
	// $condition = $wpdb->prepare( "{$column} LIKE %s", $value );
	// } else {
	// Handle other operators
	// switch ( $operator ) {
	// case '=':
	// case '!=':
	// case '<>':
	// case '>':
	// case '>=':
	// case '<':
	// case '<=':
	// if ( is_numeric( $value ) ) {
	// $condition = $wpdb->prepare( "{$column} {$operator} %d", $value );
	// } else {
	// $condition = $wpdb->prepare( "{$column} {$operator} %s", $value );
	// }
	// break;
	// default:
	// if ( is_numeric( $value ) ) {
	// $condition = $wpdb->prepare( "{$column} = %d", $value );
	// } else {
	// $condition = $wpdb->prepare( "{$column} = %s", $value );
	// }
	// break;
	// }
	// }
	// }

	// Add boolean operator (AND/OR) except for the first condition
	// if ( 0 === $index ) {
	// $compiled[] = $condition;
	// } else {
	// $compiled[] = strtoupper( $boolean ) . ' ' . $condition;
	// }
	// }

	// return implode( ' ', $compiled );
	// }

	/**
	 * Compile the ORDER BY clauses for the query
	 *
	 * @since 1.0.0
	 *
	 * @return string Compiled ORDER BY clause string.
	 */
	public function compile_orders() {
		$compiled = array();
		foreach ( $this->orders as $order ) {
			$compiled[] = $order['column'] . ' ' . strtoupper( $order['direction'] );
		}
		return implode( ', ', $compiled );
	}
}

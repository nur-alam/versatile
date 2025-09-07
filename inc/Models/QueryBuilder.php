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
	 * The table name
	 *
	 * @var string
	 */
	protected $table;

	/**
	 * The where constraints for the query
	 *
	 * @var array
	 */
	protected $wheres = array();

	/**
	 * The orderings for the query
	 *
	 * @var array
	 */
	protected $orders = array();

	/**
	 * The maximum number of records to return
	 *
	 * @var int
	 */
	protected $limit;

	/**
	 * The number of records to skip
	 *
	 * @var int
	 */
	protected $offset;

	/**
	 * Constructor
	 *
	 * @param string $table Table name.
	 */
	public function __construct( $table ) {
		$this->table = $table;
	}

	/**
	 * Add a basic where clause to the query
	 *
	 * @param string $column   Column name.
	 * @param mixed  $operator Operator or value.
	 * @param mixed  $value    Value (if operator is provided).
	 * @return $this
	 */
	public function where( $column, $operator = null, $value = null ) {
		// If only two arguments, assume equals operator
		if ( func_num_args() === 2 ) {
			$value    = $operator;
			$operator = '=';
		}

		$this->wheres[] = array(
			'type'     => 'basic',
			'column'   => $column,
			'operator' => $operator,
			'value'    => $value,
			'boolean'  => 'and',
		);

		return $this;
	}

	/**
	 * Add an "or where" clause to the query
	 *
	 * @param string $column   Column name.
	 * @param mixed  $operator Operator or value.
	 * @param mixed  $value    Value (if operator is provided).
	 * @return $this
	 */
	public function orWhere( $column, $operator = null, $value = null ) {
		// If only two arguments, assume equals operator
		if ( func_num_args() === 2 ) {
			$value    = $operator;
			$operator = '=';
		}

		$this->wheres[] = array(
			'type'     => 'basic',
			'column'   => $column,
			'operator' => $operator,
			'value'    => $value,
			'boolean'  => 'or',
		);

		return $this;
	}

	/**
	 * Add an "order by" clause to the query
	 *
	 * @param string $column    Column name.
	 * @param string $direction Direction (asc or desc).
	 * @return $this
	 */
	public function orderBy( $column, $direction = 'asc' ) {
		$this->orders[] = array(
			'column'    => $column,
			'direction' => strtolower( $direction ) === 'desc' ? 'desc' : 'asc',
		);

		return $this;
	}

	/**
	 * Alias for orderBy
	 *
	 * @param string $column    Column name.
	 * @param string $direction Direction (asc or desc).
	 * @return $this
	 */
	public function orderby( $column, $direction = 'asc' ) {
		return $this->orderBy( $column, $direction );
	}

	/**
	 * Set the "limit" value of the query
	 *
	 * @param int $value Limit value.
	 * @return $this
	 */
	public function limit( $value ) {
		$this->limit = max( 0, (int) $value );
		return $this;
	}

	/**
	 * Set the "offset" value of the query
	 *
	 * @param int $value Offset value.
	 * @return $this
	 */
	public function offset( $value ) {
		$this->offset = max( 0, (int) $value );
		return $this;
	}

	/**
	 * Execute the query and get all results
	 *
	 * @return array
	 */
	public function get() {
		global $wpdb;

		$sql = $this->to_sql();
		return $wpdb->get_results( $sql ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	/**
	 * Execute the query and get the first result
	 *
	 * @return object|null
	 */
	public function first() {
		$this->limit( 1 );
		$results = $this->get();
		return ! empty( $results ) ? $results[0] : null;
	}

	/**
	 * Get the count of records
	 *
	 * @return int
	 */
	public function count() {
		global $wpdb;

		$sql = $this->to_count_sql();
		return (int) $wpdb->get_var( $sql ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	}

	/**
	 * Convert the query to SQL
	 *
	 * @return string
	 */
	public function to_sql() {
		$sql = "SELECT * FROM {$this->table}";

		// Add WHERE clauses
		if ( ! empty( $this->wheres ) ) {
			$sql .= ' WHERE ' . $this->compile_wheres();
		}

		// Add ORDER BY clauses
		if ( ! empty( $this->orders ) ) {
			$sql .= ' ORDER BY ' . $this->compile_orders();
		}

		// Add LIMIT clause
		if ( isset( $this->limit ) ) {
			$sql .= ' LIMIT ' . $this->limit;
		}

		// Add OFFSET clause
		if ( isset( $this->offset ) ) {
			$sql .= ' OFFSET ' . $this->offset;
		}

		return $sql;
	}

	/**
	 * Convert the query to count SQL
	 *
	 * @return string
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
	 * Compile the where clauses
	 *
	 * @return string
	 */
	protected function compile_wheres() {
		global $wpdb;

		$compiled = array();

		foreach ( $this->wheres as $index => $where ) {
			$column   = $where['column'];
			$operator = $where['operator'];
			$value    = $where['value'];
			$boolean  = $where['boolean'];

			$condition = '';

			// Handle LIKE operator
			if ( strtoupper( $operator ) === 'LIKE' ) {
				$condition = $wpdb->prepare( "{$column} LIKE %s", $value );
			} else {
				// Handle other operators
				switch ( $operator ) {
					case '=':
					case '!=':
					case '<>':
					case '>':
					case '>=':
					case '<':
					case '<=':
						if ( is_numeric( $value ) ) {
							$condition = $wpdb->prepare( "{$column} {$operator} %d", $value );
						} else {
							$condition = $wpdb->prepare( "{$column} {$operator} %s", $value );
						}
						break;
					default:
						if ( is_numeric( $value ) ) {
							$condition = $wpdb->prepare( "{$column} = %d", $value );
						} else {
							$condition = $wpdb->prepare( "{$column} = %s", $value );
						}
						break;
				}
			}

			// Add boolean operator (AND/OR) except for the first condition
			if ( $index === 0 ) {
				$compiled[] = $condition;
			} else {
				$compiled[] = strtoupper( $boolean ) . ' ' . $condition;
			}
		}

		return implode( ' ', $compiled );
	}

	/**
	 * Compile the order clauses
	 *
	 * @return string
	 */
	protected function compile_orders() {
		$compiled = array();

		foreach ( $this->orders as $order ) {
			$compiled[] = $order['column'] . ' ' . strtoupper( $order['direction'] );
		}

		return implode( ', ', $compiled );
	}
}

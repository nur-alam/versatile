<?php
/**
 * Base Model Class - Laravel Eloquent-style ORM for WordPress
 *
 * @package Versatile\Models
 * @subpackage Versatile\Models\BaseModel
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Models;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Base Model Class
 */
abstract class BaseModel {

	/**
	 * The table associated with the model
	 *
	 * @var string
	 */
	protected $table;

	/**
	 * The primary key for the model
	 *
	 * @var string
	 */
	protected $primary_key = 'id';

	/**
	 * The attributes that are mass assignable
	 *
	 * @var array
	 */
	protected $fillable = array();

	/**
	 * The model's attributes
	 *
	 * @var array
	 */
	protected $attributes = array();

	/**
	 * Query builder instance
	 *
	 * @var QueryBuilder
	 */
	protected $query_builder;

	/**
	 * Indicates if the model exists
	 *
	 * @var bool
	 */
	public $exists = false;

	/**
	 * Constructor
	 *
	 * @param array $attributes Initial attributes.
	 */
	public function __construct( array $attributes = array() ) {
		$this->fill( $attributes );
		$this->query_builder = new QueryBuilder( $this->get_table() );
	}

	/**
	 * Get the table name
	 *
	 * @return string
	 */
	public function get_table() {
		return $this->table;
	}

	/**
	 * Fill the model with an array of attributes
	 *
	 * @param array $attributes Attributes to fill.
	 * @return $this
	 */
	public function fill( array $attributes ) {
		foreach ( $attributes as $key => $value ) {
			if ( $this->is_fillable( $key ) ) {
				$this->attributes[ $key ] = $value;
			}
		}
		return $this;
	}

	/**
	 * Check if an attribute is fillable
	 *
	 * @param string $key Attribute key.
	 * @return bool
	 */
	protected function is_fillable( $key ) {
		return empty( $this->fillable ) || in_array( $key, $this->fillable, true );
	}

	/**
	 * Get an attribute value
	 *
	 * @param string $key Attribute key.
	 * @return mixed
	 */
	public function __get( $key ) {
		return $this->attributes[ $key ] ?? null;
	}

	/**
	 * Set an attribute value
	 *
	 * @param string $key   Attribute key.
	 * @param mixed  $value Attribute value.
	 */
	public function __set( $key, $value ) {
		$this->attributes[ $key ] = $value;
	}

	/**
	 * Create a new model instance
	 *
	 * @param array $attributes Attributes.
	 * @return static
	 */
	public static function create( array $attributes = array() ) {
		$instance = new static( $attributes );
		$instance->save();
		return $instance;
	}

	/**
	 * Find a model by its primary key
	 *
	 * @param mixed $id Primary key value.
	 * @return static|null
	 */
	public static function find( $id ) {
		$instance = new static();
		$result   = $instance->query_builder->where( $instance->primary_key, $id )->first();
		
		if ( $result ) {
			$model         = new static( (array) $result );
			$model->exists = true;
			return $model;
		}
		
		return null;
	}

	/**
	 * Begin a fluent query against the model's table
	 *
	 * @param string $column Column name.
	 * @param mixed  $operator Operator or value.
	 * @param mixed  $value Value (if operator is provided).
	 * @return QueryBuilder
	 */
	public static function where( $column, $operator = null, $value = null ) {
		$instance = new static();
		return $instance->query_builder->where( $column, $operator, $value );
	}

	/**
	 * Save the model to the database
	 *
	 * @return bool
	 */
	public function save() {
		if ( $this->exists ) {
			return $this->perform_update();
		} else {
			return $this->perform_insert();
		}
	}

	/**
	 * Update the model in the database
	 *
	 * @param array $attributes Attributes to update.
	 * @return bool
	 */
	public function update( array $attributes = array() ) {
		if ( ! empty( $attributes ) ) {
			$this->fill( $attributes );
		}
		return $this->perform_update();
	}

	/**
	 * Delete the model from the database
	 *
	 * @return bool
	 */
	public function delete() {
		if ( ! $this->exists ) {
			return false;
		}

		global $wpdb;
		$result = $wpdb->delete(
			$this->get_table(),
			array( $this->primary_key => $this->attributes[ $this->primary_key ] ),
			array( '%d' )
		);

		return $result !== false;
	}

	/**
	 * Perform the actual insert operation
	 *
	 * @return bool
	 */
	protected function perform_insert() {
		global $wpdb;

		$result = $wpdb->insert(
			$this->get_table(),
			$this->attributes,
			$this->get_insert_format()
		);

		if ( $result ) {
			$this->attributes[ $this->primary_key ] = $wpdb->insert_id;
			$this->exists = true;
			return true;
		}

		return false;
	}

	/**
	 * Perform the actual update operation
	 *
	 * @return bool
	 */
	protected function perform_update() {
		if ( ! $this->exists ) {
			return false;
		}

		global $wpdb;

		$result = $wpdb->update(
			$this->get_table(),
			$this->attributes,
			array( $this->primary_key => $this->attributes[ $this->primary_key ] ),
			$this->get_update_format(),
			array( '%d' )
		);

		return $result !== false;
	}

	/**
	 * Get the format array for insert operations
	 *
	 * @return array
	 */
	protected function get_insert_format() {
		$format = array();
		foreach ( $this->attributes as $key => $value ) {
			$format[] = $this->get_column_format( $key, $value );
		}
		return $format;
	}

	/**
	 * Get the format array for update operations
	 *
	 * @return array
	 */
	protected function get_update_format() {
		return $this->get_insert_format();
	}

	/**
	 * Get the format for a specific column
	 *
	 * @param string $key   Column name.
	 * @param mixed  $value Column value.
	 * @return string
	 */
	protected function get_column_format( $key, $value ) {
		if ( is_int( $value ) ) {
			return '%d';
		} elseif ( is_float( $value ) ) {
			return '%f';
		} else {
			return '%s';
		}
	}

	/**
	 * Convert the model to an array
	 *
	 * @return array
	 */
	public function to_array() {
		return $this->attributes;
	}
}
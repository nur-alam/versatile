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

use Versatile\Models\QueryBuilder;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Base Model Class
 */
abstract class BaseModel {

	/**
	 * The table name
	 *
	 * @var string
	 */
	protected $table;

	/**
	 * The primary key
	 *
	 * @var string
	 */
	protected $primary_key = 'id';
	/**
	 * The fillable attributes
	 *
	 * @var array
	 */
	protected $fillable = array();

	/**
	 * The attributes
	 *
	 * @var array
	 */
	protected $attributes = array();
	/**
	 * The set attributes
	 *
	 * @var array
	 */
	protected $set_attributes = array();
	/**
	 * The query builder
	 *
	 * @var QueryBuilder
	 */
	protected $query_builder;

	/**
	 * Whether the model exists
	 *
	 * @var bool
	 */
	protected $exists = false;

	/**
	 * Constructor
	 *
	 * @param array $attributes Initial attributes.
	 */
	public function __construct( array $attributes = array() ) {
		$this->fill( $attributes );
		$this->query_builder = new QueryBuilder( $this->table, static::class );
	}

	/**
	 * Get an attribute
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Attribute key.
	 * @return mixed Attribute value.
	 */
	public function __get( $key ) {
		return $this->attributes[ $key ] ?? null;
	}

	/**
	 * Set an attribute
	 *
	 * @since 1.0.0
	 *
	 * @param string $key   Attribute key.
	 * @param mixed  $value Attribute value.
	 */
	public function __set( $key, $value ) {
		$this->attributes[ $key ] = $value;
		if ( $key !== $this->primary_key ) {
			$this->set_attributes[ $key ] = $value;
		}
	}

	/**
	 * Fill the model with attributes
	 *
	 * @since 1.0.0
	 *
	 * @param array $attribute Array of attributes to fill.
	 * @return $this
	 */
	public function fill( array $attribute ) {
		foreach ( $attribute as $key => $value ) {
			if ( $this->is_fillable( $key ) ) {
				$this->attributes[ $key ] = $value;
			}
		}
		return $this;
	}

	/**
	 * Check if an attribute is fillable
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Attribute key.
	 * @return bool Whether the attribute is fillable.
	 */
	protected function is_fillable( $key ) {
		return empty( $this->fillable ) || in_array( $key, $this->fillable, true );
	}

	/**
	 * Get the query builder
	 *
	 * @since 1.0.0
	 *
	 * @return QueryBuilder
	 */
	public function query() {
		return $this->query_builder;
	}

	/**
	 * Get a model by ID
	 *
	 * @since 1.0.0
	 *
	 * @param int $id Model ID.
	 * @return BaseModel|null Model instance or null if not found.
	 */
	public static function find( $id ) {
		$instance = new static();
		$result   = $instance->query_builder->where( $instance->primary_key, $id )->first();
		if ( ! $result ) {
			return null;
		}
		return $result;
	}

	/**
	 * Add a WHERE condition to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string $column Column name.
	 * @param string $operator Operator.
	 * @param mixed  $value Column value.
	 * @return QueryBuilder
	 */
	public static function where( $column, $operator = null, $value = null ) {
		$instance = new static();
		return $instance->query_builder->where( $column, $operator, $value );
	}

	/**
	 * Add an OR condition to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string $column Column name.
	 * @param string $operator Operator.
	 * @param mixed  $value Column value.
	 * @return QueryBuilder
	 */
	public static function or_where( $column, $operator = null, $value = null ) {
		$instance = new static();
		return $instance->query_builder->or_where( $column, $operator, $value );
	}

	/**
	 * Get the count of models
	 *
	 * @since 1.0.0
	 *
	 * @return int Number of models.
	 */
	public static function count() {
		$instance = new static();
		return $instance->query_builder->count();
	}

	/**
	 * Add an ORDER BY clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string $column Column name.
	 * @param string $direction Sort direction.
	 * @return QueryBuilder
	 */
	public static function order_by( $column, $direction = 'asc' ) {
		$instance = new static();
		return $instance->query_builder->order_by( $column, $direction );
	}

	/**
	 * Add a LIMIT clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param int $value Limit value.
	 * @return QueryBuilder
	 */
	public static function limit( $value ) {
		$instance = new static();
		return $instance->query_builder->limit( $value );
	}

	/**
	 * Get all models
	 *
	 * @since 1.0.0
	 *
	 * @return BaseModel[] Array of model instances.
	 */
	public static function all() {
		$instance = new static();
		$results  = $instance->query_builder->get();

		$models = array();
		foreach ( $results as $result ) {
			$model             = new static();
			$model->attributes = (array) $result;
			$model->exists     = true;
			$models[]          = $model;
		}

		return $models;
	}

	/**
	 * Add a SELECT clause to the query
	 *
	 * @since 1.0.0
	 *
	 * @param string ...$columns Column names.
	 * @return QueryBuilder
	 */
	public static function select( ...$columns ) {
		$instance = new static();
		return $instance->query_builder->select( $columns );
	}

	/**
	 * Create a new model instance
	 *
	 * @since 1.0.0
	 *
	 * @param array $attributes Initial attributes.
	 * @return static | false
	 */
	public static function create( array $attributes = array() ) {
		$instance = new static( $attributes );
		if ( $instance->save() ) {
			return $instance;
		}
		return false;
	}
	/**
	 * Save the model to the database
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether the model was saved.
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
	 * @since 1.0.0
	 *
	 * @param array $data Array of column => value pairs to update.
	 * @return bool Whether the model was updated.
	 */
	public function update( array $data = array() ) {
		if ( ! empty( $data ) ) {
			$this->fill( $data );
			$this->set_attributes = array_merge( $this->set_attributes, $data );
		}
		return $this->perform_update();
	}
	/**
	 * Delete the model from the database
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether the model was deleted.
	 */
	public function delete() {
		if ( ! $this->exists ) {
			return false;
		}
		global $wpdb;
		$is_deleted = $wpdb->delete(
			$this->get_table(),
			array( $this->primary_key => $this->attributes[ $this->primary_key ] ),
			array( '%d' )
		);
		return false !== $is_deleted;
	}

	/**
	 * Delete models by their IDs
	 *
	 * @since 1.0.0
	 *
	 * @param array|int $ids Model IDs.
	 * @param string    $column Column name.
	 * @return bool Whether the models were deleted.
	 */
	public static function destroy( $ids, $column = null ) {
		if ( empty( $ids ) ) {
			return false;
		}
		$instance = new static();
		$column   = $column ?? $instance->primary_key;
		return $instance->query_builder->destroy( (array) $ids, $column );
	}

	/**
	 * Perform the insert operation
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether the model was inserted.
	 */
	protected function perform_insert() {
		global $wpdb;

		// Remove only null, empty string, or zero primary key before insert
		// Allow valid IDs to be inserted (for data migration, imports, etc.)
		$insert_data = $this->attributes;
		if ( isset( $insert_data[ $this->primary_key ] ) && $this->should_remove_primary_key( $insert_data[ $this->primary_key ] ) ) {
			unset( $insert_data[ $this->primary_key ] );
		}

		$result = $wpdb->insert(
			$this->get_table(),
			$insert_data,
			$this->get_insert_format_for_data( $insert_data )
		);

		if ( $result ) {
			// Only set insert_id if we didn't provide our own primary key
			if ( ! isset( $insert_data[ $this->primary_key ] ) ) {
				$this->attributes[ $this->primary_key ] = $wpdb->insert_id;
			}
			$this->exists = true;
			// Clear seted_attributes since we've saved
			$this->set_attributes = array();
			return true;
		}
		return false;
	}

	/**
	 * Update the model in the database
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether the model was updated.
	 */
	protected function perform_update() {
		if ( ! $this->exists ) {
			return false;
		}

		global $wpdb;

		$update_data = $this->set_attributes;

		unset( $update_data[ $this->primary_key ] );

		$result = $wpdb->update(
			$this->get_table(),
			$update_data,
			array( $this->primary_key => (int) $this->attributes[ $this->primary_key ] ),
			$this->get_update_format( $update_data ),
			array( '%d' )
		);

		return false !== $result;
	}

	/**
	 * Get the insert format for the model attributes
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	protected function get_insert_format() {
		return $this->get_insert_format_for_data( $this->attributes );
	}

	/**
	 * Get the insert format for the given data
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Data to get insert format for.
	 * @return array
	 */
	protected function get_insert_format_for_data( array $data ) {
		$format = array();
		foreach ( $data as $key => $value ) {
			$format[] = $this->get_column_format( $key, $value );
		}
		return $format;
	}
	/**
	 * Get the update format for the model attributes
	 *
	 * @since 1.0.0
	 *
	 * @param array|null $attributes Data to get update format for.
	 * @return array
	 */
	protected function get_update_format( ?array $attributes = null ) {
		if ( empty( $attributes ) ) {
			$attributes = $this->attributes;
		}
		$format = array();
		foreach ( $attributes as $key => $value ) {
			$format[] = $this->get_column_format( $key, $value );
		}
		return $format;
	}

	/**
	 * Get the column format for the given value
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Column name.
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
	 * Determine if primary key should be removed before insert
	 * Only removes null, empty string, or integer zero
	 * Keeps string '0' and other valid values
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value The primary key value.
	 * @return bool Whether the primary key value should be removed.
	 */
	protected function should_remove_primary_key( $value ) {
		return null === $value || '' === $value || 0 === $value;
	}

	/**
	 * Get the table name
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_table() {
		return $this->table;
	}

	/**
	 * Get the model as an array
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function to_array() {
		return $this->attributes;
	}

	/**
	 * Get the model as a stdClass object
	 *
	 * @return stdClass
	 */
	public function to_object() {
		return (object) $this->to_array();
	}
}

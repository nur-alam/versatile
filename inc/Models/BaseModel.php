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

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Base Model Class
 */
abstract class BaseModel
{

	protected $table;

	protected $primary_key = 'id';

	protected $fillable = array();

	protected $attributes = array();

	protected $setted_attributes = array();

	protected $query_builder;

	protected $exists = false;

	/**
	 * Constructor
	 *
	 * @param array $attributes Initial attributes.
	 */
	public function __construct(array $attributes = array())
	{
		$this->fill($attributes);
		$this->query_builder = new QueryBuilder($this->table);
	}

	public function __get($key)
	{
		return $this->attributes[$key] ?? null;
	}

	public function __set($key, $value)
	{
		$this->attributes[$key] = $value;
		if($key !== $this->primary_key) {
			$this->setted_attributes[$key] = $value;
		}
	}

	public function fill(array $attribute)
	{
		foreach ($attribute as $key => $value) {
			if ($this->is_fillable($key)) {
				$this->attributes[$key] = $value;
			}
		}
		return $this;
	}

	protected function is_fillable($key)
	{
		return empty($this->fillable) || in_array($key, $this->fillable, true);
	}

	public static function where($column, $operator = null, $value = null)
	{
		$instance = new static();
		return $instance->query_builder->where($column, $operator, $value);
	}

	public static function orWhere($column, $operator = null, $value = null)
	{
		$instance = new static();
		return $instance->query_builder->orWhere($column, $operator, $value);
	}

	public static function all()
	{
		$instance = new static();
		$results = $instance->query_builder->get();
		
		$models = array();
		foreach ($results as $result) {
			$model = new static();
			$model->attributes = (array) $result;
			$model->exists = true;
			$models[] = $model;
		}
		
		return $models;
	}

	public static function select(...$columns)
	{
		$instance = new static();
		return $instance->query_builder->select($columns);
	}

	public static function find($id)
	{
		$instance = new static();
		$result = $instance->query_builder->where($instance->primary_key, $id)->first();
		if ($result) {
			$model = new static();
			// Set all attributes directly, bypassing fillable restrictions for database results
			$model->attributes = (array) $result;
			$model->exists = true;
			return $model;
		}
		return null;
	}

	public static function create(array $attributes = array())
	{
		$instance = new static($attributes);
		$instance->save();
		return $instance;
	}

	public function save()
	{
		if ($this->exists) {
			return $this->perform_update();
		} else {
			return $this->perform_insert();
		}
	}

	public function update(array $attribute = array())
	{
		if (! empty($this->attributes)) {
			$this->fill($attribute);
		}
		return $this->perform_update();
	}

	public function delete()
	{
		if (! $this->exists) {
			return false;
		}
		global $wpdb;
		$result = $wpdb->delete(
			$this->get_table(),
			array($this->primary_key => $this->attributes[$this->primary_key]),
			array('%d')
		);
		return false !== $result;
	}

	protected function perform_insert()
	{
		global $wpdb;
		$result = $wpdb->insert(
			$this->get_table(),
			$this->attributes,
			$this->get_insert_format()
		);
		if ($result) {
			$this->attributes[$this->primary_key] = $wpdb->insert_id;
			$this->exists = true;
			return true;
		}
		return false;
	}

	protected function perform_update()
	{
		if (! $this->exists) {
			return false;
		}

		global $wpdb;

		$update_data = $this->setted_attributes;

		unset($update_data[$this->primary_key]);

		$result = $wpdb->update(
			$this->get_table(),
			$update_data,
			array($this->primary_key => (int) $this->attributes[$this->primary_key]),
			$this->get_update_format($update_data),
			array('%d')
		);

		return false !== $result;
	}

	protected function get_insert_format()
	{
		$format = array();
		foreach ($this->attributes as $key => $value) {
			$format[] = $this->get_column_format($key, $value);
		}
		return $format;
	}

	protected function get_update_format( ?array $attributes = null )
	{
		if(empty($attributes)) {
			$attributes = $this->attributes;
		}
		$format = array();
		foreach ($attributes as $key => $value) {
			$format[] = $this->get_column_format($key, $value);
		}
		return $format;
	}

	protected function get_column_format($key, $value)
	{
		if (is_int($value)) {
			return '%d';
		} elseif (is_float($value)) {
			return '%f';
		} else {
			return '%s';
		}
	}

	/**
	 * Get the table name
	 *
	 * @return string
	 */
	public function get_table()
	{
		return $this->table;
	}

	public function to_array()
	{
		return $this->attributes;
	}
}

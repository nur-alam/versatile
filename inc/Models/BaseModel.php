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

	protected $query_builder;

	/**
	 * Constructor
	 *
	 * @param array $attributes Initial attributes.
	 */
	public function __construct(array $attributes = array())
	{
		$this->query_builder = new QueryBuilder($this->table);
	}

	public static function where($column, $operator, $value)
	{
		$instance = new static();
		return $instance->query_builder->where($column, $operator, $value);
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
}

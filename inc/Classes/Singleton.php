<?php
/**
 * Singleton Class
 *
 * @package Versatile
 * @subpackage Versatile\Classes
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Classes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Singleton Class
 */
abstract class Singleton {
	/**
	 * Instance
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $instance = array();

	/**
	 * Constructor (protected) prevent new instance.
	 *
	 * @since 1.0.0
	 */
	protected function __construct() {
	}

	/**
	 * Magic method clone (prevent clone instance)
	 *
	 * @since 1.0.0
	 */
	final protected function __clone() {
	}

	/**
	 * Magic method wakeup (prevent unserialize instance)
	 *
	 * @since 1.0.0
	 */
	final protected function __wakeup() {
	}

	/**
	 * Get instance
	 *
	 * @since 1.0.0
	 *
	 * @return self
	 */
	public static function get_instance() {
		$class = static::class;
		if ( ! isset( self::$instance[ $class ] ) ) {
			self::$instance[ $class ] = new static();
		}
		return self::$instance[ $class ];
	}

	/**
	 * Reset instance
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function reset_instance() {
		$class = static::class;
		if ( isset( self::$instance[ $class ] ) ) {
			unset( self::$instance[ $class ] );
		}
	}
}

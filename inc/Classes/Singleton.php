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
final class Singleton {
	/**
	 * Instance
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $instance = array();

	/**
	 * Constructor (private) prevent new instance.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {}

	/**
	 * Magic method clone (prevent clone instance)
	 *
	 * @since 1.0.0
	 */
	private function __clone() {}

	/**
	 * Magic method wakeup (prevent unserialize instance)
	 *
	 * @since 1.0.0
	 */
	private function __wakeup() {}

	/**
	 * Get instance
	 *
	 * @since 1.0.0
	 *
	 * @return self
	 */
	public static function get_instance() {
		$class = self::class;
		if ( ! isset( self::$instance[ $class ] ) ) {
			self::$instance[ $class ] = new self();
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
		$class = self::class;
		if ( isset( self::$instance[ $class ] ) ) {
			unset( self::$instance[ $class ] );
		}
	}
}

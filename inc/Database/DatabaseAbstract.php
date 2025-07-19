<?php
/**
 * The Database abstract class
 *
 * Perform table create & drop execution
 *
 * @package Versatile\Database
 * @subpackage Versatile\Database\DatabaseAbstract
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class DatabaseAbstract
 */
abstract class DatabaseAbstract {

	/**
	 * Prefix for the versatile tables
	 *
	 * @var string
	 */
	const PREFIX = 'versatile_';

	/**
	 * Abstract function to get table name
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_table_name(): string;

	/**
	 * Abstract function to get table schema
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_table_schema(): string;

	/**
	 * Create the table
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function create_table() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();
		$sql             = $this->get_table_schema() . $charset_collate;

		if ( ! file_exists( 'dbDelta' ) ) {
			require_once ABSPATH . 'wp-admin/includes/upgrade.php';

			dbDelta( $sql );
		}
	}

	/**
	 * Drop the table
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function drop_table() {
		global $wpdb;

		$wpdb->query( 'DROP TABLE IF EXISTS ' . $this->get_table_name() ); //phpcs:ignore
	}
}

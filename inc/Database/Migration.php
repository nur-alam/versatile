<?php
/**
 * Database Migration
 *
 * @package Versatile\Database
 * @subpackage Versatile\Database\Migration
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Migration description
 */
class Migration {

	/**
	 * Get tables
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public static function tables() {
		$tables = array(
			new TempLoginTable(),
		);
		return $tables;
	}

	/**
	 * Run migration
	 *
	 * @since 1.0.0
	 *
	 * @return void | Throwable
	 * @throws \Throwable When table creation fails.
	 */
	public static function migrate() {
		$tables = self::tables();
		foreach ( $tables as $table ) {
			try {
				$table->create_table();
			} catch ( \Throwable $th ) {
				throw $th;
			}
		}
	}

	/**
	 * Drop all tables
	 *
	 * @since 1.0.0
	 *
	 * @return void | Throwable
	 * @throws \Throwable When table creation fails.
	 */
	public static function drop_tables() {
		// Command: Versatile\Database\Migration::drop_tables();
		global $wpdb;
		$wpdb->query( 'SET foreign_key_checks = 0' );
		$tables = self::tables();
		foreach ( $tables as $table ) {
			try {
				$table->drop_table();
			} catch ( \Throwable $th ) {
				throw $th;
			}
		}
		$wpdb->query( 'SET foreign_key_checks = 1' );
	}

	/**
	 * Clear all data
	 *
	 * @since 1.0.0
	 *
	 * @return void | Throwable
	 * @throws \Throwable When table creation fails.
	 */
	public function clear_data() {
		// Command: Versatile\Database\Migration::clear_data();
		global $wpdb;
		$wpdb->query( 'SET foreign_key_checks = 0' );
		$tables = self::tables();
		foreach ( $tables as $table ) {
			$wpdb->query( 'DELETE FROM %s', $table->get_table_name() );
		}
		$wpdb->query( 'SET foreign_key_checks = 1' );
	}
}

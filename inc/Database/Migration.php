<?php
/**
 * The Migration class creates and drops tables of products
 *
 * @package Versatile\Database
 * @subpackage Versatile\Database\Migration
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The Migrate class creates and drops tables for a database
 */
class Migration {

	/**
	 * The function returns an array of tables
	 *
	 * @since 1.0.0
	 *
	 * @return array of tables
	 */
	public static function tables() {
		$tables = array(
			// new EmailLogTable(),
		);

		return $tables;
	}

	/**
	 * Create all the tables
	 *
	 * @since 1.0.0
	 *
	 * @throws \Throwable If there is an error while creating the tables.
	 *
	 * @return void
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
	 * Drop all the tables
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function drop_tables() {
		// Command: Versatile\Database\Migration::drop_tables();
		global $wpdb;

		$wpdb->query( 'SET foreign_key_checks = 0' );

		// Reorganized tables to prevent parent child issue.
		$tables = self::tables();

		foreach ( $tables as $table ) {
			$table->drop_table();
		}

		$wpdb->query( 'SET foreign_key_checks = 1' );
	}

	/**
	 * Delete all data from database
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function clear_data() {
		global $wpdb;

		$wpdb->query( 'SET foreign_key_checks = 0' );

		// Reorganized tables to prevent parent child issue.
		$tables = self::tables();

		foreach ( $tables as $table ) {
			// $wpdb->query( "DELETE FROM {$table->get_table_name()}" );
			$wpdb->query( $wpdb->prepare( 'DELETE FROM %s', $table->get_table_name() ) );
		}

		$wpdb->query( 'SET foreign_key_checks = 1' );
	}
}

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
		// Only allow table creation during plugin activation or upgrade
		if ( ! $this->is_schema_change_allowed() ) {
			return;
		}

		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();
		$sql             = $this->get_table_schema() . $charset_collate;

		if ( ! function_exists( 'dbDelta' ) ) {
			require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		}

		dbDelta( $sql );
	}

	/**
	 * Drop the table
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function drop_table() {
		// Only allow table dropping during plugin deactivation or uninstall
		if ( ! $this->is_schema_change_allowed() ) {
			return;
		}

		global $wpdb;

		$table_name = $this->get_table_name();
		$wpdb->query( $wpdb->prepare( 'DROP TABLE IF EXISTS %i', $table_name ) );
	}

	/**
	 * Check if schema changes are allowed
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	private function is_schema_change_allowed(): bool {
		// Allow during plugin activation
		if ( did_action( 'activate_plugin' ) ) {
			return true;
		}

		// Allow during plugin deactivation
		if ( did_action( 'deactivate_plugin' ) ) {
			return true;
		}

		// Allow during WordPress upgrade/install
		if ( defined( 'WP_INSTALLING' ) && WP_INSTALLING ) {
			return true;
		}

		// Allow if explicitly called during admin context with proper capability
		if ( is_admin() && current_user_can( 'manage_options' ) ) {
			return true;
		}

		return false;
	}
}

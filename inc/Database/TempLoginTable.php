<?php
/**
 * Temp Login Table
 *
 * @package Versatile\Services
 * @subpackage Versatile\Services\Templogin
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Temp Login Table Class
 *
 * @since 1.0.0
 */
class TempLoginTable extends DatabaseAbstract {
	/**
	 * Table name
	 *
	 * @var string
	 */
	private $table_name = 'versatile_templogin';

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		global $wpdb;
		$this->table_name = $wpdb->prefix . self::PREFIX . $this->table_name;
	}

	/**
	 * Get table name
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_table_name(): string {
		return $this->table_name;
	}

	/**
	 * Get table schema
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_table_schema(): string {
		return "CREATE TABLE IF NOT EXISTS {$this->get_table_name()} (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			user_id mediumint(9) NOT NULL,
			ip_address varchar(255) NOT NULL,
			login_token varchar(255) NOT NULL,
			created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
			PRIMARY KEY  (id)
		)";
	}
}

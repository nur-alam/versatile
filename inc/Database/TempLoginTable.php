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
	private $table_name = 'templogin';

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
			id int(11) NOT NULL AUTO_INCREMENT,
			token varchar(255) NOT NULL UNIQUE,
			role varchar(50) NOT NULL DEFAULT 'subscriber',
			display_name varchar(255) NOT NULL,
			email varchar(255) DEFAULT NULL,
			expires_at datetime NOT NULL,
			redirect_url text DEFAULT NULL,
			ip_address varchar(45) DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			last_login datetime DEFAULT NULL,
			login_count int(11) DEFAULT 0,
			is_active tinyint(1) DEFAULT 1,
			PRIMARY KEY (id),
			KEY expires_at (expires_at),
			KEY is_active (is_active)
		)";
	}
}

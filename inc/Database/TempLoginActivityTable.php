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
 * Temp Login Activity Table Class
 *
 * @since 1.0.0
 */
class TempLoginActivityTable extends DatabaseAbstract {
	/**
	 * Table name
	 *
	 * @var string
	 */
	private $table_name = 'templogin_activity';

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
		$temp_login_table      = new TempLoginTable();
		$temp_login_table_name = $temp_login_table->get_table_name();

		return "CREATE TABLE IF NOT EXISTS {$this->get_table_name()} (
			id int(11) NOT NULL AUTO_INCREMENT,
			temp_login_id int(11) NOT NULL,
			action varchar(50) NOT NULL,
			description text DEFAULT NULL,
			ip_address varchar(45) DEFAULT NULL,
			user_agent text DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY temp_login_id (temp_login_id),
			KEY created_at (created_at),
			FOREIGN KEY (temp_login_id) REFERENCES {$temp_login_table_name}(id) ON DELETE CASCADE
		)";
	}
}

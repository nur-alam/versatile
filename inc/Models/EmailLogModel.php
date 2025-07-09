<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Tukitaki\Models
 * @subpackage Tukitaki\Models\EmailLogModel
 * @author  Tukitaki<tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Models;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Words database operation management
 */
class EmailLogModel {

	/**
	 * Table name
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Resolve dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// $this->table_name = ( new EmailLogTable() )->get_table_name();
	}
}

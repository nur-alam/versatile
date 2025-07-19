<?php
/**
 * Email Log Model
 *
 * @package Versatile\Models
 * @subpackage Versatile\Models\EmailLogModel
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Models;

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

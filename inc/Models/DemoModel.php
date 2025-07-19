<?php
/**
 * Demo Model
 *
 * @package Versatile\Models
 * @subpackage Versatile\Models\DemoModel
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Models;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Demo database model
 */
class DemoModel {

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
		// $this->table_name = ( new DemoModelTable() )->get_table_name();
	}
}

<?php
/**
 * Temp Login Model Class
 *
 * @package Versatile\Models
 * @subpackage Versatile\Models\TempLoginModel
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Models;

use Versatile\Database\TempLoginTable;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Temp Login Model Class
 */
class TempLoginModel {

	/**
	 * Table name
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $table_name;

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->table_name = ( new TempLoginTable() )->get_table_name();
	}
}

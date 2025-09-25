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
 *
 * @since 1.0.0
 */
class TempLoginModel extends BaseModel {


	/**
	 * The attributes that are mass assignable
	 *
	 * @var array
	 */
	protected $fillable = array(
		'token',
		'role',
		'display_name',
		'email',
		'expires_at',
		'redirect_url',
		'ip_address',
		'created_at',
		'last_login',
		'login_count',
		'is_active',
	);
	/**
	 * Constructor
	 *
	 * @param array $attributes Initial attributes.
	 */
	public function __construct( array $attributes = array() ) {
		$this->table = ( new TempLoginTable() )->get_table_name();
		parent::__construct( $attributes );
	}

	/**
	 * Generate a unique token
	 *
	 * @return string
	 */
	public static function generateToken() {
		return wp_generate_password( 32, false );
	}

	/**
	 * Get the model as an array
	 *
	 * @return array
	 */
	public function as_array() {
		$data              = $this->to_array();
		$data['is_active'] = isset( $data['is_active'] ) ? (bool) $data['is_active'] : (bool) true;
		$data['login_url'] = $this->getLoginUrl();
		return $data;
	}

	/**
	 * Get the login URL for this temp login
	 *
	 * @return string
	 */
	public function getLoginUrl() {
		return home_url( '?versatile_temp_login=' . $this->token );
	}
}

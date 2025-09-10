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

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Temp Login Model Class
 *
 * @since 1.0.0
 */
class TempLoginModel extends BaseModel
{
	protected $token = '';
	/**
	 * Constructor
	 *
	 * @param array $attributes Initial attributes.
	 */
	public function __construct()
	{
		$this->table = (new TempLoginTable)->get_table_name();
		parent::__construct();
	}

	/**
	 * Generate a unique token
	 *
	 * @return string
	 */
	public static function generateToken()
	{
		return wp_generate_password(32, false);
	}

	/**
	 * Get the login URL for this temp login
	 *
	 * @return string
	 */
	public function getLoginUrl()
	{
		return home_url('?versatile_temp_login=' . $this->token);
	}
}

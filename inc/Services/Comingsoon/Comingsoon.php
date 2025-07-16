<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Tukitaki\Core
 * @subpackage Tukitaki\Core\Enqueue
 * @author  Tukitaki<Tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Services\Comingsoon;

use Tukitaki\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comingsoon init
 */
class Comingsoon {
	use JsonResponse;

	/**
	 * Comingsoon constructor.
	 */
	public function __construct() {
		add_action( 'wp', array( $this, 'custom_comingsoon_mode' ) );
	}

	/**
	 * Custom_comingsoon_mode description
	 *
	 * @return void return description
	 */
	public function custom_comingsoon_mode() {
		$current_user = wp_get_current_user();
		// Allow only users with 'administrator' role to bypass comingsoon
		// if ( in_array( 'subscriber', (array) $current_user->roles, true ) ) {  // 'manage_options' is typically an admin capability
		// Load your custom comingsoon HTML
		// }
		include_once TUKITAKI_PLUGIN_DIR . 'inc/Services/Comingsoon/Comingsoon-template.php';
		die();
	}
}

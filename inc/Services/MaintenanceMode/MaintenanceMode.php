<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Tukitaki\Core
 * @subpackage Tukitaki\Core\Enqueue
 * @author  Tukitaki<Tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Services\MaintenanceMode;

use Tukitaki\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * MaintenanceMode init
 */
class MaintenanceMode {
	use JsonResponse;

	/**
	 * MaintenanceMode constructor.
	 */
	public function __construct() {
		add_action( 'wp', array( $this, 'custom_maintenance_mode' ) );
	}

	/**
	 * Custom_maintenance_mode description
	 *
	 * @return void return description
	 */
	public function custom_maintenance_mode() {
		$current_user = wp_get_current_user();
		// Allow only users with 'administrator' role to bypass maintenance
		if ( in_array( 'subscriber', (array) $current_user->roles, true ) ) {  // 'manage_options' is typically an admin capability
			// Load your custom maintenance HTML
			include_once TUKITAKI_PLUGIN_DIR . 'inc/Services/MaintenanceMode/template.php';
			die();
		}
	}
}

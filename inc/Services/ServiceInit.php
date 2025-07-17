<?php
/**
 * Initialize the plugin
 *
 * @package Tukitaki\Core
 * @subpackage Tukitaki\Init
 * @author  Tukitaki<tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Services;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Tukitaki\Services\MaintenanceMode\MaintenanceMode;
use Tukitaki\Services\Troubleshoot\TroubleshootInit;
use Tukitaki\Services\Comingsoon\ComingsoonMood;
use Tukitaki\Traits\JsonResponse;

/**
 * The Init class initializes plugin dependencies by creating instances
 * of the classes
 */
class ServiceInit {

	use JsonResponse;

	/**
	 * Initialize the plugin dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		$tukitaki_addon_list = get_option( TUKITAKI_ADDON_LIST, TUKITAKI_DEFAULT_ADDON_LIST );

		$tukitaki_mood_info = get_option( TUKITAKI_MOOD_LIST, TUKITAKI_DEFAULT_MOOD_LIST );

		// Troubleshoot enable_troubleshoot
		if ( $tukitaki_addon_list['troubleshoot']['enable'] ) {
			new TroubleshootInit();
		}

		// Mood services
		if ( $tukitaki_addon_list['maintenance']['enable'] ) {
			new MaintenanceMode();
		}
		if ( $tukitaki_addon_list['comingsoon']['enable'] ) {
			new ComingsoonMood();
		}

		add_action( 'wp_ajax_tukitaki_get_addon_list', array( $this, 'tukitaki_get_addon_list' ) );
	}

	/**
	 * Tukitaki_get_addon_list description
	 *
	 * @return array description
	 */
	public function tukitaki_get_addon_list() {
		try {
			$request_verify = tukitaki_verify_request();
			$params         = $request_verify['data'];
			$addon_list     = get_option( TUKITAKI_ADDON_LIST, TUKITAKI_DEFAULT_ADDON_LIST );
			return $this->json_response( 'Maintenance Mood info updated!', $addon_list, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}
}

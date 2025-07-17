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
		$tukitaki_mood_info = get_option( TUKITAKI_MOOD_KEY, TUKITAKI_DEFAULT_MOOD_INFO );
		if ( $tukitaki_mood_info['enable_maintenance'] && ! $tukitaki_mood_info['enable_comingsoon'] ) {
			if ( ! is_admin() ) {
				add_action( 'wp', array( $this, 'custom_maintenance_mode' ) );
			}
		}
		add_action( 'wp_ajax_tukitaki_update_maintenance_mood', array( $this, 'tukitaki_update_maintenance_mood' ) );
		add_action( 'wp_ajax_tukitaki_get_mood_info', array( $this, 'get_mood_info' ) );
	}

	/**
	 * Get mood info description.
	 *
	 * @return array description
	 */
	public function get_mood_info() {
		try {
			$request_verify    = tukitaki_verify_request();
			$params            = $request_verify['data'];
			$current_mood_info = get_option( TUKITAKI_MOOD_KEY, TUKITAKI_DEFAULT_MOOD_INFO );
			return $this->json_response( 'Maintenance Mood info updated!', $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}


	/**
	 * Update_maintenance_mood description.
	 *
	 * @return array description
	 */
	public function tukitaki_update_maintenance_mood() {
		try {
			$request_verify                          = tukitaki_verify_request();
			$params                                  = $request_verify['data'];
			$params['enable_maintenance']            = filter_var( $params['enable_maintenance'], FILTER_VALIDATE_BOOLEAN );
			$current_mood_info                       = get_option( TUKITAKI_MOOD_KEY, TUKITAKI_DEFAULT_MOOD_INFO );
			$current_mood_info['enable_maintenance'] = $params['enable_maintenance'] ?? false;
			if ( $current_mood_info['enable_maintenance'] ) {
				$current_mood_info['enable_comingsoon'] = false;
			}
			unset( $params['enable_maintenance'] );
			$current_mood_info['maintenance'] = array_merge(
				$current_mood_info['maintenance'],
				$params
			);
			$is_mood_info_updated             = update_option( TUKITAKI_MOOD_KEY, $current_mood_info );

			// update tukitaki addon info
			if ( $is_mood_info_updated ) {
				$tukitaki_addon_info                          = get_option( TUKITAKI_ADDON_INFO );
				$tukitaki_addon_info['maintenance']['enable'] = true;
				update_option( TUKITAKI_ADDON_INFO, $tukitaki_addon_info );
			}

			return $this->json_response( 'Maintenance Mood info updated!', $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}

	/**
	 * Custom_maintenance_mode description
	 *
	 * @return void return description
	 */
	public function custom_maintenance_mode() {
		$current_user = wp_get_current_user();
		// Allow only users with 'administrator' role to bypass maintenance
		// if ( in_array( 'subscriber', (array) $current_user->roles, true ) ) {  // 'manage_options' is typically an admin capability
		// Load your custom maintenance HTML
		// }
		include_once TUKITAKI_PLUGIN_DIR . 'inc/Services/MaintenanceMode/MaintenanceTemplate.php';
		die();
	}
}

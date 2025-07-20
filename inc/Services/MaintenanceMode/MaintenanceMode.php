<?php
/**
 * MaintenanceMode Service
 *
 * @package Versatile\Services\MaintenanceMode
 * @subpackage Versatile\Services\MaintenanceMode\MaintenanceMode
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\MaintenanceMode;

use Versatile\Traits\JsonResponse;

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
		$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
		if ( $versatile_mood_info['enable_maintenance'] && ! $versatile_mood_info['enable_comingsoon'] ) {
			if ( ! is_admin() ) {
				add_action( 'wp', array( $this, 'custom_maintenance_mode' ) );
				// add_action( 'wp', array( $this, 'handle_preview_mode' ) );
			}
		}

		// Handle preview mode
		add_action( 'wp', array( $this, 'handle_preview_mode' ) );

		add_action( 'wp_ajax_versatile_update_maintenance_mood', array( $this, 'versatile_update_maintenance_mood' ) );
		add_action( 'wp_ajax_versatile_get_mood_info', array( $this, 'get_mood_info' ) );
	}

	/**
	 * Get mood info description.
	 *
	 * @return array description
	 */
	public function get_mood_info() {
		try {
			$request_verify    = versatile_verify_request();
			$params            = $request_verify['data'];
			$current_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
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
	public function versatile_update_maintenance_mood() {
		try {
			$request_verify                          = versatile_verify_request();
			$params                                  = $request_verify['data'];
			$params['enable_maintenance']            = filter_var( $params['enable_maintenance'], FILTER_VALIDATE_BOOLEAN );
			$current_mood_info                       = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$current_mood_info['enable_maintenance'] = $params['enable_maintenance'] ?? false;
			if ( $current_mood_info['enable_maintenance'] ) {
				$current_mood_info['enable_comingsoon'] = false;
			}
			unset( $params['enable_maintenance'] );
			$current_mood_info['maintenance'] = array_merge(
				$current_mood_info['maintenance'],
				$params
			);
			$is_mood_info_updated             = update_option( VERSATILE_MOOD_LIST, $current_mood_info );

			return $this->json_response( 'Maintenance Mood info updated!', $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}

	/**
	 * Handle preview mode for maintenance page
	 *
	 * @return void
	 */
	public function handle_preview_mode() {
		// Check if preview parameter is set and user has permission
		if ( isset( $_GET['versatile_preview'] ) && 'maintenance' === $_GET['versatile_preview'] ) {
			// Verify nonce for security
			if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['nonce'] ) ), 'versatile' ) ) {
				wp_die( 'Security check failed' );
			}

			// Check if user has permission to preview
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_die( 'You do not have permission to preview this page' );
			}

			// Load maintenance template for preview
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/MaintenanceTemplate.php';
			die();
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
		include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/MaintenanceTemplate.php';
		die();
	}
}

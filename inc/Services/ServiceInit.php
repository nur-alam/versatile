<?php
/**
 * Initialize the plugin
 *
 * @package Versatile\Core
 * @subpackage Versatile\Init
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Versatile\Services\MaintenanceMode\MaintenanceMode;
use Versatile\Services\Troubleshoot\TroubleshootInit;
use Versatile\Services\Comingsoon\ComingsoonMood;
use Versatile\Services\TemplateDesigner\TemplateDesignerService;
use Versatile\Traits\JsonResponse;

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

		$versatile_service_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

		$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );

		// Troubleshoot enable_troubleshoot
		if ( $versatile_service_list['troubleshoot']['enable'] ) {
			new TroubleshootInit();
		}

		// Mood services
		if ( $versatile_service_list['maintenance']['enable'] ) {
			new MaintenanceMode();
		}
		if ( $versatile_service_list['comingsoon']['enable'] ) {
			new ComingsoonMood();
		}

		// Template Designer service - always initialize in admin area
		if ( is_admin() ) {
			add_action( 'init', array( $this, 'init_template_designer_service' ) );
		}

		add_action( 'wp_ajax_versatile_get_service_list', array( $this, 'versatile_get_service_list' ) );
		add_action( 'wp_ajax_versatile_get_enable_service_list', array( $this, 'versatile_get_enable_service_list' ) );
		add_action( 'wp_ajax_versatile_update_service_status', array( $this, 'versatile_update_service_status' ) );
	}

	/**
	 * Initialize Template Designer service when WordPress is fully loaded
	 *
	 * @return void
	 */
	public function init_template_designer_service() {
		// Log for debugging
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'Versatile: Initializing Template Designer Service' );
		}
		
		// Initialize the service - capability checks are handled within the service methods
		new TemplateDesignerService();
	}

	/**
	 * Versatile_get_service_list description
	 *
	 * @return array description
	 */
	public function versatile_get_service_list() {
		try {
			$request_verify = versatile_verify_request();
			$params         = $request_verify['data'];
			$addon_list     = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );
			return $this->json_response( 'Service list retrieved successfully!', $addon_list, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while retrieving service list', array(), 400 );
		}
	}

	/**
	 * Get only enabled services list
	 *
	 * @return array JSON response with enabled services only
	 */
	public function versatile_get_enable_service_list() {
		try {
			$request_verify = versatile_verify_request();
			$params         = $request_verify['data'];
			$addon_list     = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			// Filter only enabled services
			$enabled_services = array_filter(
				$addon_list,
				function ( $service ) {
					return isset( $service['enable'] ) && true === $service['enable'];
				}
			);
			// sleep( 5 );
			return $this->json_response( 'Enabled services retrieved successfully!', $enabled_services, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while retrieving enabled services', array(), 400 );
		}
	}



	/**
	 * Update service status (enable/disable)
	 *
	 * @return array JSON response
	 */
	public function versatile_update_service_status() {
		try {
			$request_verify = versatile_verify_request();
			$params         = $request_verify['data'];

			// Validate required parameters
			if ( ! isset( $params['service_key'] ) || ! isset( $params['enable'] ) ) {
				return $this->json_response( 'Error: Missing required parameters (service_key, enable)', array(), 400 );
			}

			$service_key = sanitize_text_field( $params['service_key'] );
			$enable      = filter_var( $params['enable'], FILTER_VALIDATE_BOOLEAN );

			// Get current service list
			$service_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			// Check if service exists
			if ( ! isset( $service_list[ $service_key ] ) ) {
				return $this->json_response( 'Error: Service not found', array(), 404 );
			}

			// Update the service status
			$service_list[ $service_key ]['enable'] = $enable;

			// Save updated service list
			$updated = update_option( VERSATILE_SERVICE_LIST, $service_list );

			if ( $updated ) {
				$status_text   = $enable ? 'enabled' : 'disabled';
				$service_label = $service_list[ $service_key ]['label'];

				return $this->json_response(
					sprintf( '%s has been %s successfully!', $service_label, $status_text ),
					$service_list,
					200
				);
			} else {
				return $this->json_response( 'Error: Failed to update service status', array(), 500 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}
}

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
use Versatile\Services\QuickPick\QuickPick;
use Versatile\Services\Templogin\Templogin;
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

		// Templogin service
		if ( $versatile_service_list['templogin']['enable'] ) {
			new Templogin();
		}

		add_action( 'wp_ajax_versatile_get_service_list', array( $this, 'versatile_get_service_list' ) );
		add_action( 'wp_ajax_versatile_get_enable_service_list', array( $this, 'versatile_get_enable_service_list' ) );
		add_action( 'wp_ajax_versatile_update_service_status', array( $this, 'versatile_update_service_status' ) );
		add_action( 'wp_ajax_versatile_get_mood_info', array( $this, 'get_mood_info' ) );
	}

	/**
	 * Versatile_get_service_list description
	 *
	 * @return array description
	 */
	public function versatile_get_service_list() {
		try {
			// action & nonce sanitization & validation by default don't have to pass
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$addon_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );
			return $this->json_response( __( 'Service list retrieved successfully!', 'versatile-toolkit' ), $addon_list, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while retrieving service list', 'versatile-toolkit' ), array(), 400 );
		}
	}

	/**
	 * Get only enabled services list
	 *
	 * @return array JSON response with enabled services only
	 */
	public function versatile_get_enable_service_list() {
		try {
			// action & nonce sanitization & validation by default, don't need to pass
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$addon_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			// Filter only enabled services
			$enabled_services = array_filter(
				$addon_list,
				function ( $service ) {
					return isset( $service['enable'] ) && true === $service['enable'];
				}
			);

			return $this->json_response( __( 'Enabled services retrieved successfully!', 'versatile-toolkit' ), $enabled_services, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while retrieving enabled services', 'versatile-toolkit' ), array(), 400 );
		}
	}

	/**
	 * Update service status (enable/disable)
	 *
	 * @return array JSON response
	 */
	public function versatile_update_service_status() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'service_key',
						'value'    => isset($_POST['service_key']) ? $_POST['service_key'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'enable',
						'value'    => isset($_POST['enable']) ? $_POST['enable'] : 'false', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'boolean',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			$service_key = $verified_data->service_key;
			$enable      = $verified_data->enable;

			// Get current service list
			$service_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			// Check if service exists
			if ( ! isset( $service_list[ $service_key ] ) ) {
				return $this->json_response( __( 'Error: Service not found', 'versatile-toolkit' ), array(), 404 );
			}

			// Update the service status
			$service_list[ $service_key ]['enable'] = filter_var( $enable, FILTER_VALIDATE_BOOLEAN );

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
				return $this->json_response( __( 'Error: Failed to update service status', 'versatile-toolkit' ), array(), 500 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Get mood info description.
	 *
	 * @return array description
	 */
	public function get_mood_info() {
		try {
			// action & nonce sanitization & validation by default, don't need to pass
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$current_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			return $this->json_response( __( 'Maintenance Mood info retrieved successfully!', 'versatile-toolkit' ), $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while retrieving maintenance mood info', 'versatile-toolkit' ), array(), 400 );
		}
	}
}

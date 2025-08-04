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
			}
		}

		add_action( 'wp_ajax_versatile_update_maintenance_mood', array( $this, 'versatile_update_maintenance_mood' ) );
		add_action( 'wp_ajax_versatile_preview_maintenance', array( $this, 'preview_maintenance_mode' ) );
	}

	/**
	 * Update_maintenance_mood description.
	 *
	 * @return array description
	 */
	public function versatile_update_maintenance_mood() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'enable_maintenance',
						'value'    => $_POST['enable_maintenance'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required',
					),
					array(
						'name'     => 'title',
						'value'    => $_POST['title'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'description',
						'value'    => $_POST['description'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'subtitle',
						'value'    => $_POST['subtitle'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'background_image',
						'value'    => $_POST['background_image'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'background_image_id',
						'value'    => $_POST['background_image_id'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|numeric',
					),
					array(
						'name'     => 'logo',
						'value'    => $_POST['logo'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'logo_id',
						'value'    => $_POST['logo_id'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|numeric',
					),
				)
			);

			if ( ! $sanitized_data->success ) {
				return $this->json_response( $sanitized_data->message, $sanitized_data->errors, 400 );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				return $this->json_response( $request_verify->message, array(), $request_verify->code );
			}

			$sanitized_data->enable_maintenance      = filter_var( $sanitized_data->enable_maintenance, FILTER_VALIDATE_BOOLEAN );
			$current_mood_info                       = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$current_mood_info['enable_maintenance'] = $sanitized_data->enable_maintenance ?? false;
			if ( $current_mood_info['enable_maintenance'] ) {
				$current_mood_info['enable_comingsoon'] = false;
			}
			unset( $sanitized_data->enable_maintenance );
			$current_mood_info['maintenance'] = array_merge(
				$current_mood_info['maintenance'],
				(array) $sanitized_data
			);
			update_option( VERSATILE_MOOD_LIST, $current_mood_info );

			return $this->json_response( 'Maintenance Mood info updated!', $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}

	/**
	 * Preview maintenance mode via AJAX
	 *
	 * @return void
	 */
	public function preview_maintenance_mode() {
		try {
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data->success ) {
				wp_die( esc_html( $sanitized_data->message ) );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				wp_die( esc_html( $request_verify->message ) );
			}

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// Load maintenance template for preview
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/MaintenanceTemplate.php';
			die();
		} catch ( \Throwable $th ) {
			wp_die( 'Error loading preview' );
		}
	}

	/**
	 * Custom_maintenance_mode description
	 *
	 * @return void return description
	 */
	public function custom_maintenance_mode() {
		$current_user = wp_get_current_user();
		include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/MaintenanceTemplate.php';
		die();
	}
}

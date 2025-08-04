<?php
/**
 * Comingsoon Service
 *
 * @package Versatile\Services\Comingsoon
 * @subpackage Versatile\Services\Comingsoon\ComingsoonMood
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Comingsoon;

use Versatile\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comingsoon init
 */
class ComingsoonMood {
	use JsonResponse;

	/**
	 * Comingsoon constructor.
	 */
	public function __construct() {
		$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
		if ( $versatile_mood_info['enable_comingsoon'] && ! $versatile_mood_info['enable_maintenance'] ) {
			if ( ! is_admin() ) {
				add_action( 'wp', array( $this, 'custom_comingsoon_mode' ) );
			}
		}

		add_action( 'wp_ajax_versatile_update_comingsoon_mood', array( $this, 'versatile_update_comingsoon_mood' ) );
		add_action( 'wp_ajax_versatile_preview_comingsoon', array( $this, 'preview_comingsoon_mode' ) );
	}

	/**
	 * Update comingsoon_mood description.
	 *
	 * @return array description
	 */
	public function versatile_update_comingsoon_mood() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'enable_maintenance',
						'value'    => $_POST['enable_maintenance'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'boolean',
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
						'rules'    => 'string',
					),
					array(
						'name'     => 'background_image_id',
						'value'    => $_POST['background_image_id'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'numeric',
					),
					array(
						'name'     => 'logo',
						'value'    => $_POST['logo'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'string',
					),
					array(
						'name'     => 'logo_id',
						'value'    => $_POST['logo_id'], //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'numeric',
					),
				)
			);

			if ( ! $sanitized_data->success ) {
				$error_message = versatile_grab_error_message( $sanitized_data->errors );
				return $this->json_response( $error_message ?? 'Error: Required fields missing!', $sanitized_data->errors, 400 );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				return $this->json_response( $request_verify->message ?? 'Error: while updating comingsoon mood info', array(), $request_verify->code );
			}

			$sanitized_data->enable_comingsoon      = filter_var( $sanitized_data->enable_comingsoon, FILTER_VALIDATE_BOOLEAN );
			$current_mood_info                      = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$current_mood_info['enable_comingsoon'] = $sanitized_data->enable_comingsoon ?? false;
			if ( $current_mood_info['enable_comingsoon'] ) {
				$current_mood_info['enable_maintenance'] = false;
			}
			unset( $sanitized_data->enable_comingsoon );
			$current_mood_info['comingsoon'] = array_merge(
				$current_mood_info['comingsoon'],
				(array) $sanitized_data
			);
			update_option( VERSATILE_MOOD_LIST, $current_mood_info );

			return $this->json_response( 'Maintenance Mood info updated!', $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}

	/**
	 * Preview coming soon mode via AJAX
	 *
	 * @return void
	 */
	public function preview_comingsoon_mode() {
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

			// Load coming soon template for preview
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/ComingsoonTemplate.php';
			die();
		} catch ( \Throwable $th ) {
			wp_die( 'Error loading preview' );
		}
	}

	/**
	 * Custom_comingsoon_mode description
	 *
	 * @return void return description
	 */
	public function custom_comingsoon_mode() {
		$current_user = wp_get_current_user();
		include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/ComingsoonTemplate.php';
		die();
	}
}

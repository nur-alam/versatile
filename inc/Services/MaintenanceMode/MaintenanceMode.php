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

use Versatile\Helpers\UtilityHelper;
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
		add_action( 'wp_ajax_versatile_get_mood_info', array( $this, 'get_mood_info' ) );
		add_action( 'wp_ajax_versatile_preview_maintenance', array( $this, 'preview_maintenance_mode' ) );
		add_action( 'wp_ajax_versatile_maintenance_template_preview', array( $this, 'maintenance_template_preview' ) );
	}

	/**
	 * Get mood info description.
	 *
	 * @return array description
	 */
	public function get_mood_info() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

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
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

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
	 * Preview maintenance mode via AJAX
	 *
	 * @return void
	 */
	public function preview_maintenance_mode() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				wp_die( esc_html( $request_verify['message'] ) );
			}

			$params = $request_verify['data'];

			// Get template ID from request
			$template_id  = UtilityHelper::sanitize_get_field( 'template_id' ) ?? 'classic';
			$type         = UtilityHelper::sanitize_get_field( 'type' ) ?? 'maintenance';
			$preview_mode = UtilityHelper::sanitize_get_field( 'preview_mode' ) ?? 'full';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $params['preview_data'] ) ) {
				$preview_data_raw = UtilityHelper::sanitize_get_field( 'preview_data' );
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			$template_id         = $preview_data['template'] ?? 'creative';
			$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$mood_info           = $versatile_mood_info[ $type ] ?? array();

			// Use preview data if available, otherwise use saved data
			if ( $preview_data ) {
				$template_title   = esc_html( $preview_data['title'] ?? 'We&rsquo;ll be back soon!' );
				$subtitle         = esc_html( $preview_data['subtitle'] ?? 'Our site is currently undergoing scheduled maintenance.' );
				$description      = esc_html( $preview_data['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );
				$background_image = esc_url( $preview_data['background_image'] ?? '' );
				$logo             = esc_url( $preview_data['logo'] ?? '' );
			} else {
				// Set up template variables with defaults for preview
				$template_title   = esc_html( $mood_info['title'] ?? 'We&rsquo;ll be back soon!' );
				$subtitle         = esc_html( $mood_info['subtitle'] ?? 'Our site is currently undergoing scheduled maintenance.' );
				$description      = esc_html( $mood_info['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );
				$background_image = esc_url( $mood_info['background_image'] ?? '' );
				$logo             = esc_url( $mood_info['logo'] ?? '' );
			}

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// Load the selected template
			$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/' . $template_id . '.php';
			if ( file_exists( $template_file ) ) {
				include $template_file;
			} else {
				// Fallback to classic template
				include VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/classic.php';
			}
			die();
		} catch ( \Throwable $th ) {
			wp_die( 'Error loading preview' );
		}
	}

	/**
	 * Preview specific template via AJAX
	 *
	 * @return void
	 */
	public function maintenance_template_preview() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				wp_die( esc_html( $request_verify['message'] ) );
			}

			$params = $request_verify['data'];

			// Get template ID from request
			$template_id  = UtilityHelper::sanitize_get_field( 'template_id' ) ?? 'classic';
			$type         = UtilityHelper::sanitize_get_field( 'type' ) ?? 'maintenance';
			$preview_mode = UtilityHelper::sanitize_get_field( 'preview_mode' ) ?? 'full';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $params['preview_data'] ) ) {
				$preview_data_raw = UtilityHelper::sanitize_get_field( 'preview_data' );
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// For maintenance, use maintenance templates
			$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$mood_info           = $versatile_mood_info[ $type ] ?? array();

			// Use preview data if available, otherwise use saved data
			if ( $preview_data ) {
				$template_title   = esc_html( $preview_data['title'] ?? 'We&rsquo;ll be back soon!' );
				$subtitle         = esc_html( $preview_data['subtitle'] ?? 'Our site is currently undergoing scheduled maintenance.' );
				$description      = esc_html( $preview_data['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );
				$background_image = esc_url( $preview_data['background_image'] ?? '' );
				$logo             = esc_url( $preview_data['logo'] ?? '' );
			} else {
				// Set up template variables with defaults for preview
				$template_title   = esc_html( $mood_info['title'] ?? 'We&rsquo;ll be back soon!' );
				$subtitle         = esc_html( $mood_info['subtitle'] ?? 'Our site is currently undergoing scheduled maintenance.' );
				$description      = esc_html( $mood_info['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );
				$background_image = esc_url( $mood_info['background_image'] ?? '' );
				$logo             = esc_url( $mood_info['logo'] ?? '' );
			}

			// Add thumbnail-specific styles if in thumbnail mode
			// if ( 'thumbnail' === $preview_mode ) {
			// echo '<style>
			// body {
			// margin: 0;
			// padding: 0;
			// overflow: hidden;
			// transform-origin: top left;
			// }
			// html, body {
			// width: 100vw;
			// height: 100vh;
			// }
			// </style>';
			// }

				// Load the selected template
				$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/' . $template_id . '.php';
			if ( file_exists( $template_file ) ) {
				include $template_file;
			} else {
				// Fallback to classic template
				include VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/classic.php';
			}
			die();
		} catch ( \Throwable $th ) {
			error_log( 'Versatile: Exception in preview_template: ' . $th->getMessage() );
			wp_die( esc_html__( 'Error loading template preview: ', 'versatile' ) . esc_html( $th->getMessage() ) );
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

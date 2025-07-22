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

use Versatile\Helpers\UtilityHelper;
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
		add_action( 'wp_ajax_versatile_comingsoon_template_preview', array( $this, 'comingsoon_template_preview' ) );
		add_action( 'wp_ajax_versatile_preview_template', array( $this, 'preview_template' ) );
	}

	/**
	 * Update comingsoon_mood description.
	 *
	 * @return array description
	 */
	public function versatile_update_comingsoon_mood() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}
			$params                                 = $request_verify['data'];
			$params['enable_comingsoon']            = filter_var( $params['enable_comingsoon'], FILTER_VALIDATE_BOOLEAN );
			$current_mood_info                      = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$current_mood_info['enable_comingsoon'] = $params['enable_comingsoon'] ?? false;
			if ( $current_mood_info['enable_comingsoon'] ) {
				$current_mood_info['enable_maintenance'] = false;
			}
			unset( $params['enable_comingsoon'] );
			$current_mood_info['comingsoon'] = array_merge(
				$current_mood_info['comingsoon'],
				$params
			);
			$is_mood_info_updated            = update_option( VERSATILE_MOOD_LIST, $current_mood_info );

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
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				wp_die( esc_html( $request_verify['message'] ) );
			}

			$params = $request_verify['data'];

			// Get template ID from request
			$template_id  = UtilityHelper::sanitize_get_field( 'template_id' ) ?? 'classic';
			$type         = UtilityHelper::sanitize_get_field( 'type' ) ?? 'comingsoon';
			$preview_mode = UtilityHelper::sanitize_get_field( 'preview_mode' ) ?? 'full';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $params['preview_data'] ) ) {
				$preview_data_raw = UtilityHelper::sanitize_get_field( 'preview_data' );
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			$template_id         = $preview_data['template'] ?? 'classic';
			$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$mood_info           = $versatile_mood_info[ $type ] ?? array();

			// Use preview data if available, otherwise use saved data
			if ( $preview_data ) {
				$template_title   = esc_html( $preview_data['title'] ?? 'Coming Soon!' );
				$subtitle         = esc_html( $preview_data['subtitle'] ?? 'We&rsquo;re working on something amazing.' );
				$description      = esc_html( $preview_data['description'] ?? 'Stay tuned for our exciting launch. Something great is coming your way!' );
				$background_image = esc_url( $preview_data['background_image'] ?? '' );
				$logo             = esc_url( $preview_data['logo'] ?? '' );
			} else {
				// Set up template variables with defaults for preview
				$template_title   = esc_html( $mood_info['title'] ?? 'Coming Soon!' );
				$subtitle         = esc_html( $mood_info['subtitle'] ?? 'We&rsquo;re working on something amazing.' );
				$description      = esc_html( $mood_info['description'] ?? 'Stay tuned for our exciting launch. Something great is coming your way!' );
				$background_image = esc_url( $mood_info['background_image'] ?? '' );
				$logo             = esc_url( $mood_info['logo'] ?? '' );
			}

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// Load the selected template
			$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/' . $template_id . '.php';
			if ( file_exists( $template_file ) ) {
				include $template_file;
			} else {
				// Fallback to classic template
				include VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/classic.php';
			}
			die();
		} catch ( \Throwable $th ) {
			wp_die( 'Error loading preview' );
		}
	}

	/**
	 * Preview specific coming soon template via AJAX
	 *
	 * @return void
	 */
	public function comingsoon_template_preview() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				wp_die( esc_html( $request_verify['message'] ) );
			}

			$params = $request_verify['data'];

			// Get template ID from request
			$template_id  = UtilityHelper::sanitize_get_field( 'template_id' ) ?? 'classic';
			$type         = UtilityHelper::sanitize_get_field( 'type' ) ?? 'comingsoon';
			$preview_mode = UtilityHelper::sanitize_get_field( 'preview_mode' ) ?? 'full';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $params['preview_data'] ) ) {
				$preview_data_raw = UtilityHelper::sanitize_get_field( 'preview_data' );
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// For coming soon, use coming soon templates
			$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$mood_info           = $versatile_mood_info[ $type ] ?? array();

			// Use preview data if available, otherwise use saved data
			if ( $preview_data ) {
				$template_title   = esc_html( $preview_data['title'] ?? 'Coming Soon!' );
				$subtitle         = esc_html( $preview_data['subtitle'] ?? 'We&rsquo;re working on something amazing.' );
				$description      = esc_html( $preview_data['description'] ?? 'Stay tuned for our exciting launch. Something great is coming your way!' );
				$background_image = esc_url( $preview_data['background_image'] ?? '' );
				$logo             = esc_url( $preview_data['logo'] ?? '' );
			} else {
				// Set up template variables with defaults for preview
				$template_title   = esc_html( $mood_info['title'] ?? 'Coming Soon!' );
				$subtitle         = esc_html( $mood_info['subtitle'] ?? 'We&rsquo;re working on something amazing.' );
				$description      = esc_html( $mood_info['description'] ?? 'Stay tuned for our exciting launch. Something great is coming your way!' );
				$background_image = esc_url( $mood_info['background_image'] ?? '' );
				$logo             = esc_url( $mood_info['logo'] ?? '' );
			}

			// Load the selected template
			$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/' . $template_id . '.php';
			if ( file_exists( $template_file ) ) {
				include $template_file;
			} else {
				// Fallback to classic template
				include VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/classic.php';
			}
			die();
		} catch ( \Throwable $th ) {
			error_log( 'Versatile: Exception in comingsoon_template_preview: ' . $th->getMessage() );
			wp_die( esc_html__( 'Error loading template preview: ', 'versatile' ) . esc_html( $th->getMessage() ) );
		}
	}



	/**
	 * Unified template preview method for both maintenance and coming soon
	 *
	 * @return void
	 */
	public function preview_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				wp_die( esc_html( $request_verify['message'] ) );
			}

			$params = $request_verify['data'];

			// Get template ID from request
			$template_id  = UtilityHelper::sanitize_get_field( 'template_id' ) ?? 'classic';
			$type         = UtilityHelper::sanitize_get_field( 'type' ) ?? 'comingsoon';
			$preview_mode = UtilityHelper::sanitize_get_field( 'preview_mode' ) ?? 'full';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $params['preview_data'] ) ) {
				$preview_data_raw = UtilityHelper::sanitize_get_field( 'preview_data' );
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$mood_info           = $versatile_mood_info[ $type ] ?? array();

			// Set default content based on type
			if ( $type === 'maintenance' ) {
				$default_title       = 'We&rsquo;ll be back soon!';
				$default_subtitle    = 'Our site is currently undergoing scheduled maintenance.';
				$default_description = 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.';
				$template_dir        = 'MaintenanceMode';
			} else {
				$default_title       = 'Coming Soon!';
				$default_subtitle    = 'We&rsquo;re working on something amazing.';
				$default_description = 'Stay tuned for our exciting launch. Something great is coming your way!';
				$template_dir        = 'Comingsoon';
			}

			// Use preview data if available, otherwise use saved data
			if ( $preview_data ) {
				$template_title   = esc_html( $preview_data['title'] ?? $default_title );
				$subtitle         = esc_html( $preview_data['subtitle'] ?? $default_subtitle );
				$description      = esc_html( $preview_data['description'] ?? $default_description );
				$background_image = esc_url( $preview_data['background_image'] ?? '' );
				$logo             = esc_url( $preview_data['logo'] ?? '' );
			} else {
				// Set up template variables with defaults for preview
				$template_title   = esc_html( $mood_info['title'] ?? $default_title );
				$subtitle         = esc_html( $mood_info['subtitle'] ?? $default_subtitle );
				$description      = esc_html( $mood_info['description'] ?? $default_description );
				$background_image = esc_url( $mood_info['background_image'] ?? '' );
				$logo             = esc_url( $mood_info['logo'] ?? '' );
			}

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// Load the selected template from the appropriate directory
			$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/' . $template_dir . '/Templates/' . $template_id . '.php';
			if ( file_exists( $template_file ) ) {
				include $template_file;
			} else {
				// Fallback to classic template in the appropriate directory
				include VERSATILE_PLUGIN_DIR . 'inc/Services/' . $template_dir . '/Templates/classic.php';
			}
			die();
		} catch ( \Throwable $th ) {
			error_log( 'Versatile: Exception in preview_template: ' . $th->getMessage() );
			wp_die( esc_html__( 'Error loading template preview: ', 'versatile' ) . esc_html( $th->getMessage() ) );
		}
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
		include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/ComingsoonTemplate.php';
		die();
	}
}

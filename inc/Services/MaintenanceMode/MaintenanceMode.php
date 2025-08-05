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
		add_action( 'wp_ajax_versatile_maintenance_template_preview', array( $this, 'maintenance_template_preview' ) );
		add_action( 'wp_ajax_versatile_preview_template', array( $this, 'preview_template' ) );
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
						'name'     => 'template',
						'value'    => isset($_POST['template']) ? $_POST['template'] : 'false', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'show_subscribers_only',
						'value'    => isset($_POST['show_subscribers_only']) ? $_POST['show_subscribers_only'] : 'false', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'boolean',
					),
					array(
						'name'     => 'enable_maintenance',
						'value'    => isset($_POST['enable_maintenance']) ? $_POST['enable_maintenance'] : 'false', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'boolean',
					),
					array(
						'name'     => 'title',
						'value'    => isset($_POST['title']) ? $_POST['title'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'description',
						'value'    => isset($_POST['description']) ? $_POST['description'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'subtitle',
						'value'    => isset($_POST['subtitle']) ? $_POST['subtitle'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'background_image',
						'value'    => isset($_POST['background_image']) ? $_POST['background_image'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'string',
					),
					array(
						'name'     => 'background_image_id',
						'value'    => isset($_POST['background_image_id']) ? $_POST['background_image_id'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'numeric',
					),
					array(
						'name'     => 'logo',
						'value'    => isset($_POST['logo']) ? $_POST['logo'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'string',
					),
					array(
						'name'     => 'logo_id',
						'value'    => isset($_POST['logo_id']) ? $_POST['logo_id'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'numeric',
					),
				)
			);

			if ( ! $sanitized_data->success ) {
				$error_message = versatile_grab_error_message( $sanitized_data->errors );
				return $this->json_response( $error_message ?? $sanitized_data->message, $sanitized_data->errors, 400 );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				return $this->json_response( $request_verify->message ?? 'Error: while updating maintenance mood info', array(), $request_verify->code );
			}

			$sanitized_data->enable_maintenance      = filter_var( $sanitized_data->enable_maintenance, FILTER_VALIDATE_BOOLEAN );
			$sanitized_data->show_subscribers_only   = filter_var( $sanitized_data->show_subscribers_only, FILTER_VALIDATE_BOOLEAN );
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
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'type',
						'value'    => isset($_GET['type']) ? $_GET['type'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'preview_data',
						'value'    => isset($_GET['preview_data']) ? $_GET['preview_data'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'string',
					),
				)
			);

			if ( ! $sanitized_data->success ) {
				wp_die( esc_html( $sanitized_data->message ) );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				wp_die( esc_html( $request_verify->message ) );
			}

			$type = $sanitized_data->type ?? 'maintenance';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $sanitized_data->preview_data ) ) {
				$preview_data_raw = $sanitized_data->preview_data;
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			$template_id         = $preview_data['template'] ?? VERSATILE_DEFAULT_MAINTENANCE_TEMPLATE;
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
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			if ( function_exists( 'wp_enqueue_emoji_styles' ) ) {
				add_action( 'wp_print_styles', 'wp_enqueue_emoji_styles' );
			}
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
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'template_id',
						'value'    => isset($_GET['template_id']) ? $_GET['template_id'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'type',
						'value'    => isset($_GET['type']) ? $_GET['type'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'preview_data',
						'value'    => isset($_GET['preview_data']) ? $_GET['preview_data'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'string',
					),
				)
			);

			if ( ! $sanitized_data->success ) {
				wp_die( esc_html( $sanitized_data->message ) );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				wp_die( esc_html( $request_verify->message ) );
			}

			// Get template ID from request
			$template_id  = $sanitized_data->template_id ?? VERSATILE_DEFAULT_MAINTENANCE_TEMPLATE;
			$type         = $sanitized_data->type ?? 'maintenance';
			$preview_mode = $sanitized_data->preview_mode ?? 'full';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $sanitized_data->preview_data ) ) {
				$preview_data_raw = $sanitized_data->preview_data;
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

			// Load the selected template
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
			if ( function_exists( 'wp_enqueue_emoji_styles' ) ) {
				add_action( 'wp_print_styles', 'wp_enqueue_emoji_styles' );
			}
			$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/' . $template_id . '.php';
			if ( file_exists( $template_file ) ) {
				include $template_file;
			} else {
				// Fallback to classic template
				include VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/classic.php';
			}
			die();
		} catch ( \Throwable $th ) {
			// error_log( 'Versatile: Exception in preview_template: ' . $th->getMessage() );
			wp_die( esc_html__( 'Error loading template preview: ', 'versatile-toolkit' ) . esc_html( $th->getMessage() ) );
		}
	}

	/**
	 * Custom_maintenance_mode description
	 *
	 * @return void return description
	 */
	public function custom_maintenance_mode() {
		$current_user          = wp_get_current_user();
		$versatile_mood_info   = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
		$show_subscribers_only = $versatile_mood_info['maintenance']['show_subscribers_only'] ?? false;
		$template              = $versatile_mood_info['maintenance']['template'] ?? VERSATILE_DEFAULT_MAINTENANCE_TEMPLATE;

		$template_title   = esc_html( $versatile_mood_info['maintenance']['title'] ?? '' );
		$subtitle         = esc_html( $versatile_mood_info['maintenance']['subtitle'] ?? '' );
		$description      = esc_html( $versatile_mood_info['maintenance']['description'] ?? '' );
		$background_image = esc_url( $versatile_mood_info['maintenance']['background_image'] ?? '' );
		$logo             = esc_url( $versatile_mood_info['maintenance']['logo'] ?? '' );

		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		if ( function_exists( 'wp_enqueue_emoji_styles' ) ) {
			add_action( 'wp_print_styles', 'wp_enqueue_emoji_styles' );
		}

		if ( empty( $current_user->roles ) ) {
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/' . $template . '.php';
			die();
		}

		// If show_subscribers_only is enabled, only show coming soon mode to subscribers
		if ( $show_subscribers_only ) {
			if ( in_array( 'subscriber', (array) $current_user->roles, true ) ) {
				include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/' . $template . '.php';
				die();
			}
		} else {
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/MaintenanceMode/Templates/' . $template . '.php';
			die();
		}
	}
}

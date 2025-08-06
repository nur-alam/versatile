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

use Versatile\Helpers\MoodHelper;
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
		// add_action( 'wp_ajax_versatile_preview_template', array( $this, 'preview_template' ) );
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
						'name'     => 'enable_comingsoon',
						'value'    => isset($_POST['enable_comingsoon']) ? $_POST['enable_comingsoon'] : 'false', //phpcs:ignore
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
				return $this->json_response( $error_message ?? 'Error: Required fields missing!', $sanitized_data->errors, 400 );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				return $this->json_response( $request_verify->message ?? 'Error: while updating comingsoon mood info', array(), $request_verify->code );
			}

			$sanitized_data->enable_comingsoon      = filter_var( $sanitized_data->enable_comingsoon, FILTER_VALIDATE_BOOLEAN );
			$sanitized_data->show_subscribers_only  = filter_var( $sanitized_data->show_subscribers_only, FILTER_VALIDATE_BOOLEAN );
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

			return $this->json_response( __( 'Comingsoon Mood info updated!', 'versatile-toolkit' ), $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while updating comingsoon mood info', 'versatile-toolkit' ), array(), 400 );
		}
	}

	/**
	 * Preview coming soon mode via AJAX FULL PREVIEW
	 *
	 * @return void
	 */
	public function preview_comingsoon_mode() {
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

			$type = $sanitized_data->type ?? 'comingsoon';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $sanitized_data->preview_data ) ) {
				$preview_data_raw = $sanitized_data->preview_data;
				$preview_data     = json_decode( $preview_data_raw, true );
			}
			$template_id = $preview_data['template'] ?? VERSATILE_DEFAULT_COMINGSOON_TEMPLATE;

			$mood_helper = new MoodHelper();
			$mood_helper->render_template( $template_id, $type, $preview_data );
			die();
		} catch ( \Throwable $th ) {
			wp_die( 'Error loading preview' );
		}
	}

	/**
	 * Preview specific coming soon template via AJAX single template &.
	 *
	 * @return void
	 */
	public function comingsoon_template_preview() {
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
			$template_id = $sanitized_data->template_id;
			$type        = $sanitized_data->type ?? 'comingsoon';

			// Handle preview data if provided (for live preview with user's current form data)
			$preview_data = null;
			if ( isset( $sanitized_data->preview_data ) ) {
				$preview_data_raw = $sanitized_data->preview_data;
				$preview_data     = json_decode( $preview_data_raw, true );
			}

			if ( empty( $sanitized_data->template_id ) ) {
				$template_id = $preview_data['template'] ?? VERSATILE_DEFAULT_COMINGSOON_TEMPLATE;
			}

			$mood_helper = new MoodHelper();
			$mood_helper->render_template( $template_id, $type, $preview_data );
			die();
		} catch ( \Throwable $th ) {
			wp_die( esc_html__( 'Error loading template preview: ', 'versatile-toolkit' ) . esc_html( $th->getMessage() ) );
		}
	}

	/**
	 * Custom_comingsoon_mode description
	 *
	 * @return void return description
	 */
	public function custom_comingsoon_mode() {
		$current_user          = wp_get_current_user();
		$versatile_mood_info   = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
		$show_subscribers_only = $versatile_mood_info['comingsoon']['show_subscribers_only'] ?? false;
		$template              = $versatile_mood_info['comingsoon']['template'] ?? VERSATILE_DEFAULT_COMINGSOON_TEMPLATE;

		$template_title   = esc_html( $versatile_mood_info['comingsoon']['title'] ?? '' );
		$subtitle         = esc_html( $versatile_mood_info['comingsoon']['subtitle'] ?? '' );
		$description      = esc_html( $versatile_mood_info['comingsoon']['description'] ?? '' );
		$background_image = esc_url( $versatile_mood_info['comingsoon']['background_image'] ?? '' );
		$logo             = esc_url( $versatile_mood_info['comingsoon']['logo'] ?? '' );

		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		if ( function_exists( 'wp_enqueue_emoji_styles' ) ) {
			add_action( 'wp_print_styles', 'wp_enqueue_emoji_styles' );
		}

		if ( empty( $current_user->roles ) ) {
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/' . $template . '.php';
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/ComingsoonTemplate.php';
			die();
		}

		// If show_subscribers_only is enabled, only show coming soon mode to subscribers
		if ( $show_subscribers_only ) {
			if ( in_array( 'subscriber', (array) $current_user->roles, true ) ) {
				include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/' . $template . '.php';
				die();
			}
		} else {
			include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/' . $template . '.php';
			die();
		}
	}
}

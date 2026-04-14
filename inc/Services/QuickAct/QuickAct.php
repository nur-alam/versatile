<?php
/**
 * Admin bar Quick Act UI and AJAX handlers.
 *
 * @package Versatile\Services
 * @subpackage Versatile\Services\QuickAct
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.6
 */

namespace Versatile\Services\QuickAct;

defined( 'ABSPATH' ) || exit;

use Versatile\Traits\JsonResponse;

/**
 * Quick Act: admin-bar tools for plugins, themes, and quick settings.
 */
class QuickAct {

	use JsonResponse;

	/**
	 * Initialize hooks.
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_bar_menu', array( $this, 'add_parent_and_child_links' ), 100 );

		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_permalink_reset_script' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_permalink_reset_script' ) );

		add_action( 'wp_ajax_versatile_quickact_plugins_list', array( $this, 'versatile_get_plugins_list' ) );
		add_action( 'wp_ajax_versatile_quickact_plugin_activate', array( $this, 'versatile_activate_plugin' ) );
		add_action( 'wp_ajax_versatile_quickact_plugin_deactivate', array( $this, 'versatile_deactivate_plugin' ) );
		add_action( 'wp_ajax_versatile_quickact_themes_list', array( $this, 'versatile_get_themes_list' ) );
		add_action( 'wp_ajax_versatile_quickact_theme_activate', array( $this, 'versatile_activate_theme' ) );
		add_action( 'wp_ajax_versatile_quickact_theme_deactivate', array( $this, 'versatile_deactivate_theme' ) );
		add_action( 'wp_ajax_versatile_reset_permalinks', array( $this, 'versatile_reset_permalinks' ) );
	}

	/**
	 * Add admin bar node that mounts the React app.
	 *
	 * @param \WP_Admin_Bar $admin_bar WordPress admin bar.
	 * @return void
	 */
	public function add_parent_and_child_links( $admin_bar ) {
		$admin_bar->add_node(
			array(
				'id'    => 'versatile-quickact-tools',
				'title' => '<div id="versatile-quickact-container"></div>',
				'href'  => false,
			)
		);
	}

	/**
	 * Enqueue Quick Act assets for the admin bar.
	 *
	 * @param string $page Current admin page (admin only).
	 * @return void
	 */
	public function enqueue_permalink_reset_script( $page ) {
		if ( ! is_admin_bar_showing() ) {
			return;
		}

		$quickact_style = VERSATILE_PLUGIN_URL . 'assets/dist/css/quickact.min.css';

		wp_register_style(
			'versatile-quickact-style',
			$quickact_style,
			array(),
			VERSATILE_VERSION,
			'all'
		);

		wp_enqueue_style( 'versatile-quickact-style' );

		wp_enqueue_script(
			'versatile-quickact',
			VERSATILE_PLUGIN_URL . 'assets/dist/js/versatile-quickact.min.js',
			array( 'wp-element', 'wp-i18n' ),
			'1.0.0',
			true
		);

		$plugin_data    = versatile_get_plugin_data();
		$user_id        = get_current_user_id();
		$versatile_data = array(
			'user_id'       => $user_id,
			'site_url'      => home_url(),
			'admin_url'     => admin_url(),
			'ajax_url'      => admin_url( 'admin-ajax.php' ),
			'nonce_key'     => $plugin_data['nonce_key'],
			'nonce_value'   => wp_create_nonce( $plugin_data['nonce_action'] ),
			'wp_rest_nonce' => wp_create_nonce( 'wp_rest' ),
		);

		if ( 'toplevel_page_versatile' !== $page ) {
			wp_add_inline_script(
				'versatile-quickact',
				'const _versatileObject = ' . wp_json_encode( $versatile_data ) . ';window._versatileObject=_versatileObject;',
				'before'
			);
		}
	}

	/**
	 * Flush rewrite rules.
	 *
	 * @return void
	 */
	public function versatile_reset_permalinks() {
		try {
			$sanitized_data = versatile_sanitization_validation();
			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], null, $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], null, $verify_request['code'] ?? 403 );
			}

			flush_rewrite_rules();

			$this->json_response( 'Permalinks have been reset successfully!', null, 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), null, 500 );
		}
	}

	/**
	 * List plugins.
	 *
	 * @return void
	 */
	public function versatile_get_plugins_list() {
		try {
			$sanitized_data = versatile_sanitization_validation();
			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], array(), $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], array(), $verify_request['code'] ?? 403 );
			}

			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$plugins_data = get_plugins();
			$items        = array();

			foreach ( $plugins_data as $plugin_file => $plugin_info ) {
				$items[] = array(
					'file'      => $plugin_file,
					'name'      => $plugin_info['Name'] ?? $plugin_file,
					'version'   => $plugin_info['Version'] ?? '',
					'is_active' => is_plugin_active( $plugin_file ),
				);
			}

			$this->json_response( __( 'Plugins retrieved successfully!', 'versatile-toolkit' ), $items, 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), array(), 500 );
		}
	}

	/**
	 * Activate plugin.
	 *
	 * @return void
	 */
	public function versatile_activate_plugin() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'plugin_file',
						'value'    => $_REQUEST['plugin_file'] ?? '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], array(), $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], array(), $verify_request['code'] ?? 403 );
			}

			if ( ! function_exists( 'activate_plugin' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$plugin_file = $sanitized_data['plugin_file'];
			$result      = activate_plugin( $plugin_file );

			if ( is_wp_error( $result ) ) {
				$this->json_response( $result->get_error_message(), array(), 400 );
			}

			$this->json_response( __( 'Plugin activated successfully!', 'versatile-toolkit' ), array( 'plugin_file' => $plugin_file ), 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), array(), 500 );
		}
	}

	/**
	 * Deactivate plugin.
	 *
	 * @return void
	 */
	public function versatile_deactivate_plugin() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'plugin_file',
						'value'    => $_REQUEST['plugin_file'] ?? '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], array(), $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], array(), $verify_request['code'] ?? 403 );
			}

			if ( ! function_exists( 'deactivate_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$plugin_file = $sanitized_data['plugin_file'];
			deactivate_plugins( $plugin_file, false, false );

			$this->json_response( __( 'Plugin deactivated successfully!', 'versatile-toolkit' ), array( 'plugin_file' => $plugin_file ), 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), array(), 500 );
		}
	}

	/**
	 * List themes.
	 *
	 * @return void
	 */
	public function versatile_get_themes_list() {
		try {
			$sanitized_data = versatile_sanitization_validation();
			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], array(), $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], array(), $verify_request['code'] ?? 403 );
			}

			$active_theme = wp_get_theme()->get_stylesheet();
			$themes       = wp_get_themes();
			$items        = array();

			foreach ( $themes as $stylesheet => $theme ) {
				$items[] = array(
					'stylesheet' => $stylesheet,
					'name'       => $theme->get( 'Name' ),
					'version'    => $theme->get( 'Version' ),
					'is_active'  => $stylesheet === $active_theme,
				);
			}

			$this->json_response( __( 'Themes retrieved successfully!', 'versatile-toolkit' ), $items, 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), array(), 500 );
		}
	}

	/**
	 * Activate theme.
	 *
	 * @return void
	 */
	public function versatile_activate_theme() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'stylesheet',
						'value'    => $_REQUEST['stylesheet'] ?? '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], array(), $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], array(), $verify_request['code'] ?? 403 );
			}

			$stylesheet = $sanitized_data['stylesheet'];
			$theme      = wp_get_theme( $stylesheet );

			if ( ! $theme->exists() ) {
				$this->json_response( __( 'Theme does not exist.', 'versatile-toolkit' ), array(), 400 );
			}

			switch_theme( $stylesheet );
			$this->json_response( __( 'Theme activated successfully!', 'versatile-toolkit' ), array( 'stylesheet' => $stylesheet ), 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), array(), 500 );
		}
	}

	/**
	 * Deactivate active theme via fallback switch.
	 *
	 * @return void
	 */
	public function versatile_deactivate_theme() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'stylesheet',
						'value'    => $_REQUEST['stylesheet'] ?? '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], array(), $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], array(), $verify_request['code'] ?? 403 );
			}

			$stylesheet = $sanitized_data['stylesheet'];
			$active     = wp_get_theme()->get_stylesheet();

			if ( $stylesheet !== $active ) {
				$this->json_response( __( 'Theme is already inactive.', 'versatile-toolkit' ), array( 'stylesheet' => $stylesheet ), 200 );
			}

			$fallback_stylesheet = WP_DEFAULT_THEME;
			$fallback_theme      = wp_get_theme( $fallback_stylesheet );

			if ( ! $fallback_theme->exists() || $fallback_stylesheet === $active ) {
				$all_themes = wp_get_themes();
				foreach ( $all_themes as $theme_stylesheet => $theme ) {
					if ( $theme_stylesheet !== $active ) {
						$fallback_stylesheet = $theme_stylesheet;
						break;
					}
				}
			}

			if ( empty( $fallback_stylesheet ) || $fallback_stylesheet === $active ) {
				$this->json_response( __( 'No fallback theme available to activate.', 'versatile-toolkit' ), array(), 400 );
			}

			switch_theme( $fallback_stylesheet );
			$this->json_response(
				__( 'Theme deactivated by switching to fallback theme.', 'versatile-toolkit' ),
				array(
					'deactivated' => $stylesheet,
					'activated'   => $fallback_stylesheet,
				),
				200
			);
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), array(), 500 );
		}
	}
}

<?php
/**
 * Initialize the plugin
 *
 * @package Versatile\Services
 * @subpackage Versatile\Services\QuickPick
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\QuickPick;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Versatile\Traits\JsonResponse;

/**
 * The Init class initializes plugin dependencies by creating instances
 * of the classes
 */
class QuickPick {

	use JsonResponse;

	/**
	 * Initialize the plugin
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_bar_menu', array( $this, 'add_parent_and_child_links' ), 100 );

		// Enqueue AJAX script for admin bar
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_permalink_reset_script' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_permalink_reset_script' ) );

		// Handle AJAX quickpick requests.
		add_action( 'wp_ajax_versatile_quickpick_plugins_list', array( $this, 'versatile_get_plugins_list' ) );
		add_action( 'wp_ajax_versatile_quickpick_plugin_activate', array( $this, 'versatile_activate_plugin' ) );
		add_action( 'wp_ajax_versatile_quickpick_plugin_deactivate', array( $this, 'versatile_deactivate_plugin' ) );
		add_action( 'wp_ajax_versatile_quickpick_themes_list', array( $this, 'versatile_get_themes_list' ) );
		add_action( 'wp_ajax_versatile_quickpick_theme_activate', array( $this, 'versatile_activate_theme' ) );
		add_action( 'wp_ajax_versatile_quickpick_theme_deactivate', array( $this, 'versatile_deactivate_theme' ) );
		add_action( 'wp_ajax_versatile_reset_permalinks', array( $this, 'versatile_reset_permalinks' ) );
	}

	/**
	 * Add parent and child links to admin bar
	 *
	 * @param   WP_Admin_Bar $admin_bar  WordPress admin bar object to add nodes to.
	 *
	 * @return  void
	 */
	public function add_parent_and_child_links( $admin_bar ) {
		// Parent node
		$admin_bar->add_node(
			array(
				'id'    => 'versatile-quickpick-tools',
				'title' => '<div id="versatile-quickpick-container"></div>',
				'href'  => false,
			)
		);
	}

	/**
	 * Enqueue JavaScript for AJAX permalink reset
	 *
	 * @param string $page Current page.
	 *
	 * @return void
	 */
	public function enqueue_permalink_reset_script( $page ) {
		// Only load if admin bar is showing
		if ( ! is_admin_bar_showing() ) {
			return;
		}

		$quickpick_style = VERSATILE_PLUGIN_URL . 'assets/dist/css/quickpick.min.css';

		wp_register_style(
			'versatile-quickpick-style',
			$quickpick_style,
			array(),
			VERSATILE_VERSION,
			'all'
		);

		wp_enqueue_style( 'versatile-quickpick-style' );

		// Enqueue your built React bundle
		wp_enqueue_script(
			'versatile-quickpick',
			VERSATILE_PLUGIN_URL . 'assets/dist/js/versatile-quickpick.min.js',
			array( 'wp-element', 'wp-i18n' ),
			'1.0.0',
			true
		);

		// Add the versatile object data for AJAX requests
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

		// Add inline script with data
		if ( 'toplevel_page_versatile' !== $page ) {
			wp_add_inline_script(
				'versatile-quickpick',
				'const _versatileObject = ' . wp_json_encode( $versatile_data ) . ';window._versatileObject=_versatileObject;',
				'before'
			);
		}
	}

	/**
	 * Handle AJAX quickpick request
	 *
	 * @return void
	 */
	public function versatile_reset_permalinks() {
		try {
			// Verify nonce for security
			$sanitized_data = versatile_sanitization_validation();
			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], null, $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], null, $verify_request['code'] ?? 403 );
			}

			// Reset permalinks
			flush_rewrite_rules();

			// Send success response
			$this->json_response( 'Permalinks have been reset successfully!', null, 200 );
		} catch ( \Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), null, 500 );
		}
	}

	/**
	 * Fetch installed plugins with active status.
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
	 * Activate a plugin by plugin file.
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
	 * Deactivate a plugin by plugin file.
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
	 * Fetch installed themes with active status.
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
	 * Activate a theme.
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
	 * Deactivate an active theme by switching to default/fallback.
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

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

		// Handle AJAX request for permalink reset
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
				'title' => '<div id="versatile-quickpick-container" style="background: #2c3338;"></div>',
				'href'  => admin_url( 'admin.php?page=versatile' ),
			)
		);
	}

	/**
	 * Enqueue JavaScript for AJAX permalink reset
	 *
	 * @return void
	 */
	public function enqueue_permalink_reset_script() {
		// Only load if admin bar is showing
		if ( ! is_admin_bar_showing() ) {
			return;
		}

		$versatile_style_bundle = VERSATILE_PLUGIN_URL . 'assets/dist/css/style.min.css';

		// Register styles and scripts first
		wp_register_style(
			'versatile-style',
			$versatile_style_bundle,
			array(),
			VERSATILE_VERSION,
			'all'
		);

		wp_enqueue_style( 'versatile-style' );

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
		wp_add_inline_script(
			'versatile-quickpick',
			'const _versatileObject = ' . wp_json_encode( $versatile_data ) . ';window._versatileObject=_versatileObject;',
			'before'
		);
	}

	/**
	 * Handle AJAX quickpick request
	 *
	 * @return void
	 */
	public function versatile_reset_permalinks() {
		try {
			// Verify nonce for security
			$response = versatile_verify_request( true );
			if ( ! $response['success'] ) {
				$this->json_response( $response['message'], null, $response['status_code'] );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				$this->json_response( 'You do not have sufficient permissions to perform this action.', null, 403 );
			}

			// Reset permalinks
			flush_rewrite_rules();

			sleep( 1 );

			// Send success response
			$this->json_response( 'Permalinks have been reset successfully!', null, 200 );
		} catch ( Exception $e ) {
			$this->json_response( 'An error occurred: ' . $e->getMessage(), null, 500 );
		}
	}
}

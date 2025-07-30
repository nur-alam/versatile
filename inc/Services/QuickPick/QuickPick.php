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
				'title' => '<div id="versatile-quickpick-container"></div>',
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

		// Enqueue your built React bundle
		wp_enqueue_script(
			'versatile-quickpick',
			VERSATILE_PLUGIN_URL . 'assets/dist/js/versatile-quickpick.min.js',
			array( 'wp-element', 'wp-i18n' ),
			'1.0.0',
			true
		);

		// Add inline script to mount React component
		// $script = "
		// document.addEventListener('DOMContentLoaded', function() {
		// const container = document.getElementById('quickpick-container');
		// if (container && window.VersatileQuickPick) {
		// window.VersatileQuickPick.render(container);
		// }
		// });
		// ";

		// wp_add_inline_script( 'versatile-quickpick', $script );
	}

	/**
	 * Handle AJAX quickpick request
	 *
	 * @return void
	 */
	public function versatile_reset_permalinks() {
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

		// Send success response
		$this->json_response( 'Permalinks have been reset successfully!', null, 200 );
	}
}

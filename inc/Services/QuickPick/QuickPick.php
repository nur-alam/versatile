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

use Versatile\Services\MaintenanceMode\MaintenanceMode;
use Versatile\Services\Troubleshoot\TroubleshootInit;
use Versatile\Services\Comingsoon\ComingsoonMood;
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
		add_action( 'wp_ajax_reset_permalinks_ajax', array( $this, 'handle_permalink_reset_ajax' ) );
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
				'id'    => 'my-tools',
				'title' => 'My Tools',
				'href'  => admin_url( 'admin.php?page=versatile' ),
			)
		);

		// Child node - now with AJAX permalink reset functionality
		$admin_bar->add_node(
			array(
				'id'     => 'my-tools-settings',
				'parent' => 'my-tools',
				'title'  => 'Reset Permalink',
				'href'   => '#',
				'meta'   => array(
					'onclick' => 'resetPermalinks(event); return false;',
				),
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

		wp_enqueue_script( 'jquery' );

		// Add inline script for AJAX functionality
		$script = "
			function resetPermalinks(event) {
				event.preventDefault();
				
				// Show loading state
				var linkElement = jQuery('#wp-admin-bar-my-tools-settings .ab-item');
				var originalText = linkElement.text();
				linkElement.text('Resetting...');
				
				jQuery.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {
						action: 'reset_permalinks_ajax',
						nonce: '" . wp_create_nonce( 'reset_permalinks_nonce' ) . "'
					},
					success: function(response) {
						if (response.success) {
							linkElement.text('✓ Reset Complete');
							linkElement.css('color', '#46b450');
							
							// Show temporary success notification
							showNotification(response.data.message, 'success');
							
							setTimeout(function() {
								linkElement.text(originalText);
								linkElement.css('color', '');
							}, 3000);
						} else {
							linkElement.text('✗ Failed');
							linkElement.css('color', '#dc3232');
							
							// Show error notification
							showNotification('Error: ' + response.data.message, 'error');
							
							setTimeout(function() {
								linkElement.text(originalText);
								linkElement.css('color', '');
							}, 3000);
						}
					},
					error: function() {
						linkElement.text('✗ Failed');
						linkElement.css('color', '#dc3232');
						
						// Show error notification
						showNotification('An error occurred while resetting permalinks.', 'error');
						
						setTimeout(function() {
							linkElement.text(originalText);
							linkElement.css('color', '');
						}, 3000);
					}
				});
			}
			
			function showNotification(message, type) {
				// Remove any existing notifications
				jQuery('.versatile-notification').remove();
				
				// Create notification element
				var notificationClass = type === 'success' ? 'versatile-notification-success' : 'versatile-notification-error';
				var backgroundColor = type === 'success' ? '#46b450' : '#dc3232';
				
				var notification = jQuery('<div class=\"versatile-notification ' + notificationClass + '\" style=\"' +
					'position: fixed; ' +
					'top: 32px; ' +
					'right: 20px; ' +
					'background: ' + backgroundColor + '; ' +
					'color: white; ' +
					'padding: 12px 20px; ' +
					'border-radius: 4px; ' +
					'box-shadow: 0 2px 8px rgba(0,0,0,0.2); ' +
					'z-index: 999999; ' +
					'font-size: 14px; ' +
					'max-width: 300px; ' +
					'opacity: 0; ' +
					'transform: translateX(100%); ' +
					'transition: all 0.3s ease;' +
				'\">' + message + '</div>');
				
				// Add to body
				jQuery('body').append(notification);
				
				// Animate in
				setTimeout(function() {
					notification.css({
						'opacity': '1',
						'transform': 'translateX(0)'
					});
				}, 10);
				
				// Auto remove after 4 seconds
				setTimeout(function() {
					notification.css({
						'opacity': '0',
						'transform': 'translateX(100%)'
					});
					setTimeout(function() {
						notification.remove();
					}, 300);
				}, 4000);
				
				// Allow manual dismissal by clicking
				notification.click(function() {
					jQuery(this).css({
						'opacity': '0',
						'transform': 'translateX(100%)'
					});
					setTimeout(function() {
						notification.remove();
					}, 300);
				});
			}
		";
		wp_add_inline_script( 'jquery', $script );
	}

	/**
	 * Handle AJAX permalink reset request
	 *
	 * @return void
	 */
	public function handle_permalink_reset_ajax() {
		// Verify nonce for security
		if ( ! wp_verify_nonce( $_POST['nonce'], 'reset_permalinks_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Security check failed' ) );
		}

		// Check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => 'You do not have sufficient permissions to perform this action.' ) );
		}

		// Reset permalinks
		flush_rewrite_rules();

		// Send success response
		wp_send_json_success( array( 'message' => 'Permalinks have been reset successfully!' ) );
	}
}

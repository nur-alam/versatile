<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Tukitaki\Core
 * @subpackage Tukitaki\Core\Enqueue
 * @author  Tukitaki<Tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Services\DisablePlugin;

use Tukitaki\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * DisablePlugin init
 */
class DisablePluginInit {

	use JsonResponse;

	/**
	 * DisablePlugin constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_tukitaki_plugin_list', array( $this, 'get_plugin_list' ) );
		add_action( 'wp_ajax_tukitaki_get_disable_plugin_list', array( $this, 'get_disable_plugin_list' ) );
		add_action( 'wp_ajax_tukitaki_save_disable_plugin_list', array( $this, 'save_disable_plugin_list' ) );
		// add_filter( 'option_active_plugins', array( $this, 'disable_plugins' ), 1 );
		add_action( 'init', array( $this, 'tukitaki_create_mu_plugin' ) );
	}

	/**
	 * Disable_plugins description
	 *
	 * @param array $plugins $plugins description.
	 *
	 * @return array  return description
	 */
	public function disable_plugins( $plugins ) {
		$current_ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';

		if ( '::1' === $current_ip ) {
			$current_ip = '127.0.0.1';
		}

		$ip_plugin_list   = get_option( 'tukitaki_disable_plugin_list' );
		$disabled_plugins = $ip_plugin_list['chosenPlugins'];
		$target_ips       = $ip_plugin_list['ipTags'];

		if ( empty( $disabled_plugins ) || ! $disabled_plugins || empty( $target_ips ) || ! $target_ips ) {
			return $plugins;
		}

		if ( ! in_array( $current_ip, $target_ips, true ) ) {
			return $plugins;
		}

		$plugins = array_diff( $plugins, $disabled_plugins );

		return $plugins;
	}

	/**
	 * Disable_plugin description
	 *
	 * @return array
	 */
	public function save_disable_plugin_list() {
		$request_verify = tukitaki_verify_request();
		$params         = $request_verify['data'];

		// Remove keys that should not be saved
		unset( $params['action'], $params['tukitaki_nonce'] );

		// Save to options table
		update_option( 'tukitaki_disable_plugin_list', $params );

		return $this->json_response( 'Disable plugin list saved', array(), 200 );
	}

	/**
	 * Get_disable_plugin_list description
	 *
	 * @return  [type]  [return description]
	 */
	public function get_disable_plugin_list() {
		// sleep( 1 );
		$disable_plugin_list = get_option( 'tukitaki_disable_plugin_list' );
		return $this->json_response( 'Disable plugin list saved', $disable_plugin_list, 200 );
	}

	/**
	 * Get plugin list
	 */
	public function get_plugin_list() {
		// $plugin_list = get_option( 'active_plugins' );
		$all_plugins = get_plugins();

		// Create array of plugin names only
		$plugin_list = array();

		foreach ( $all_plugins as $plugin_file => $plugin ) {
			if ( isset( $plugin['Name'] ) ) {
				// Format value (slug-like key)
				// $value = str_replace( ' ', '-', $plugin['Name'] );
				// $value = preg_replace( '/[^A-Za-z0-9\-_]/', '', $value );
				// $value = strtolower( $value );

				$plugin_list[] = array(
					'slug'  => $plugin_file,
					'label' => $plugin['Name'],
				);
			}
		}
		// delete_option( 'tukitaki_disable_plugin_list' );

		return $this->json_response( '', $plugin_list, 200 );
	}

	/**
	 * Tukitaki_create_mu_plugin description.
	 *
	 * @return void
	 */
	public function tukitaki_create_mu_plugin() {
		// if ( file_exists( WP_CONTENT_DIR . '/mu-plugins/mu-tukitaki.php' ) ) {
		// return;
		// }
		$template_file  = TUKITAKI_PLUGIN_DIR . 'inc/DisablePlugin/mu-template.php';
		$mu_plugin_dir  = WP_CONTENT_DIR . '/mu-plugins';
		$mu_plugin_file = $mu_plugin_dir . '/mu-tukitaki.php';

		if ( ! file_exists( $mu_plugin_dir ) ) {
			wp_mkdir_p( $mu_plugin_dir );
		}

		if ( file_exists( $template_file ) ) {
			copy( $template_file, $mu_plugin_file );
		}
	}
}

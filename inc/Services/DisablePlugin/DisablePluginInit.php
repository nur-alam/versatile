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
		// add_action( 'init', array( $this, 'tukitaki_create_mu_plugin' ) );
	}

	/**
	 * Disable_plugin description
	 *
	 * @return array
	 */
	public function save_disable_plugin_list() {
		$this->tukitaki_create_mu_plugin();
		try {
			$request_verify = tukitaki_verify_request();
			$params         = $request_verify['data'];

			// Remove keys that should not be saved
			unset( $params['action'], $params['tukitaki_nonce'] );

			if ( in_array( 'tukitaki/tukitaki.php', $params['chosenPlugins'], true ) ) {
				$filter_chosen_plugins   = array_filter(
					$params['chosenPlugins'],
					function ( $item ) {
						return 'tukitaki/tukitaki.php' !== $item;
					}
				);
				$params['chosenPlugins'] = array_values( $filter_chosen_plugins );
			}

			// Save to options table
			update_option( 'tukitaki_disable_plugin_list', $params );

			return $this->json_response( 'Disable plugin list saved', array(), 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while saving list', array(), 400 );
		}
	}

	/**
	 * Get_disable_plugin_list description
	 *
	 * @return  [type]  [return description]
	 */
	public function get_disable_plugin_list() {
		sleep( 1 );
		$disable_plugin_list = get_option( 'tukitaki_disable_plugin_list' );
		return $this->json_response( 'Disable plugin list saved', $disable_plugin_list, 200 );
	}

	/**
	 * Get plugin list
	 */
	public function get_plugin_list() {
		try {
			$all_plugins = get_plugins();

			// Create array of plugin names only
			$plugin_list = array();

			foreach ( $all_plugins as $plugin_file => $plugin ) {
				if ( isset( $plugin['Name'] ) ) {
					if ( 'tukitaki/tukitaki.php' === $plugin_file ) {
						continue;
					}

					$plugin_list[] = array(
						'slug'  => $plugin_file,
						'label' => $plugin['Name'],
					);
				}
			}

			return $this->json_response( '', $plugin_list, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while fetching plugin list', $plugin_list, 400 );
		}
	}

	/**
	 * Tukitaki_create_mu_plugin description.
	 *
	 * @return void
	 */
	public function tukitaki_create_mu_plugin() {
		try {
			// if ( file_exists( WP_CONTENT_DIR . '/mu-plugins/mu-tukitaki.php' ) ) {
			// return;
			// }
			$template_file  = TUKITAKI_PLUGIN_DIR . 'inc/Services/DisablePlugin/mu-template.php';
			$mu_plugin_dir  = WP_CONTENT_DIR . '/mu-plugins';
			$mu_plugin_file = $mu_plugin_dir . '/mu-tukitaki.php';

			if ( ! file_exists( $mu_plugin_dir ) ) {
				wp_mkdir_p( $mu_plugin_dir );
			}

			if ( file_exists( $template_file ) ) {
				copy( $template_file, $mu_plugin_file );
			}
		} catch ( \Throwable $th ) {
			// throw $th;
			return;
		}
	}
}

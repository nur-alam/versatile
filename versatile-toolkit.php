<?php
/**
 * Plugin Name: Versatile Toolkit
 * Version: 1.0.0
 * Requires at least: 5.3
 * Requires PHP: 7.4
 * Plugin URI: https://wptriggermail.com/
 * Description: Versatile plugin allows you to selectively disable plugins by IP address, enable maintenance mode, set up coming soon pages, and implement various troubleshooting features.
 * Author: nurwp
 * License: GPLv3 or later
 * Text Domain: versatile-toolkit
 * Domain Path: /languages
 *
 * @package versatile-toolkit
 */

use Versatile\Init;
use Versatile\Database\Migration;

if ( ! class_exists( 'Versatile' ) ) {

	/**
	 * Versatile main class that
	 */
	final class Versatile {

		/**
		 * Plugin meta data
		 *
		 * @since v1.0.0
		 *
		 * @var $plugin_data
		 */
		private static $plugin_data = array();

		/**
		 * Plugin instance
		 *
		 * @since 1.0.0
		 *
		 * @var $instance
		 */
		public static $instance = null;

		/**
		 * Register hooks and load dependent files
		 *
		 * @since v1.0.0
		 *
		 * @return void
		 */
		public function __construct() {
			require_once 'constants.php';

			if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
				include_once __DIR__ . '/vendor/autoload.php';
			}

			// for rest api basic auth for tools like postman, set password from application password under user edit.
			add_filter( 'wp_is_application_passwords_available', '__return_true' );

			register_activation_hook( __FILE__, array( __CLASS__, 'register_activation' ) );
			register_deactivation_hook( __FILE__, array( __CLASS__, 'register_deactivation' ) );
			new Init();
			// Initialize plugin.
			// add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
		}

		/**
		 * Initialize plugin after init hook
		 *
		 * @return void
		 */
		public function init_plugin() {
			// Initialize plugin.
			new Init();
		}

		/**
		 * Plugin meta data
		 *
		 * @since v1.0.0
		 *
		 * @return array  contains plugin meta data
		 */
		public static function plugin_data() {
			if ( empty( self::$plugin_data ) ) {
				if ( ! function_exists( 'get_plugin_data' ) ) {
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
				}
				self::$plugin_data                 = get_plugin_data( __FILE__, false, false );
				self::$plugin_data['plugin_url']   = plugin_dir_url( __FILE__ );
				self::$plugin_data['plugin_path']  = plugin_dir_path( __FILE__ );
				self::$plugin_data['base_name']    = plugin_basename( __FILE__ );
				self::$plugin_data['templates']    = trailingslashit( plugin_dir_path( __FILE__ ) . 'templates' );
				self::$plugin_data['views']        = trailingslashit( plugin_dir_path( __FILE__ ) . 'views' );
				self::$plugin_data['assets']       = trailingslashit( plugin_dir_url( __FILE__ ) . 'assets' );
				self::$plugin_data['env']          = 'DEV';
				self::$plugin_data['nonce_key']    = 'versatile_nonce';
				self::$plugin_data['nonce_action'] = 'versatile';
			}
			return self::$plugin_data;
		}

		/**
		 * Create and return instance of this plugin
		 *
		 * @return self  instance of plugin
		 */
		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Do some stuff after activate plugin
		 *
		 * @return void
		 */
		public static function register_activation() {
			update_option( 'versatile_install_time', time() );

			// Migrate DB.
			Migration::migrate();

			// Create dynamic pages .
			// PageManager::create_dynamic_pages();
			// Flush rewrite rules.
			flush_rewrite_rules();
		}

		/**
		 * Do some stuff after deactivate plugin
		 *
		 * @return void
		 */
		public static function register_deactivation() {
			// Delete mu-plugin file if it exists
			self::delete_mu_plugin();

			flush_rewrite_rules();
		}

		/**
		 * Delete mu-versatile.php file from mu-plugins directory
		 *
		 * @return void
		 */
		private static function delete_mu_plugin() {
			$mu_plugin_file = WP_CONTENT_DIR . '/mu-plugins/MuVersatileToolkit.php';

			if ( file_exists( $mu_plugin_file ) ) {
				wp_delete_file( $mu_plugin_file );
			}
		}
	}

	// start versatile
	Versatile::instance();
}

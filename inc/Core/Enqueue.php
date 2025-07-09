<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Tukitaki\Core
 * @subpackage Tukitaki\Core\Enqueue
 * @author  Tukitaki<Tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Core;

use Tukitaki;
use Tukitaki\Frontend\CustomTemplate;
use Tukitaki\Helpers\UtilityHelper;
use Tukitaki\RestAPI\Routes;

/**
 * Enqueue styles & scripts
 */
class Enqueue {

	/**
	 * Register hooks
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'load_admin_scripts' ) );
		// add_action( 'wp_enqueue_scripts', array( __CLASS__, 'load_front_end_scripts' ) );
	}

	/**
	 * Load admin styles & scripts
	 *
	 * @since 1.0.0
	 *
	 * @param string $page The current admin page.
	 *
	 * @return void
	 */
	public static function load_admin_scripts( $page ): void {
		$plugin_data           = Tukitaki::plugin_data();
		$tukitaki_style_bundle = $plugin_data['plugin_url'] . 'assets/dist/css/style.min.css';
		$tukitaki_admin_bundle = $plugin_data['plugin_url'] . 'assets/dist/js/backend-bundle.min.js';

		if ( 'toplevel_page_tukitaki' === $page ) {
			wp_enqueue_style(
				'tukitaki-style',
				$tukitaki_style_bundle,
				array(),
				TUKITAKI_VERSION,
				'all'
			);
			wp_enqueue_script(
				'tukitaki-admin',
				$tukitaki_admin_bundle,
				array( 'wp-element', 'wp-i18n' ),
				TUKITAKI_VERSION,
				true
			);
			wp_add_inline_script(
				'tukitaki-admin',
				'const _tukitakiObject = ' . wp_json_encode( self::scripts_data() ) . ';window._tukitakiObject=_tukitakiObject',
				'before'
			);
		}
	}

	/**
	 * Load front end scripts
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function load_front_end_scripts(): void {
		// $plugin_data             = Tukitaki::plugin_data();
		// $Tukitaki_frontend_bundle = Tukitaki::plugin_data()['plugin_url'] . 'assets/dist/js/Tukitaki-frontend.min.js';
		// wp_enqueue_script(
		// 'Tukitaki-frontend',
		// $Tukitaki_frontend_bundle,
		// array(),
		// TUKITAKI_VERSION,
		// true
		// );
		// wp_add_inline_script(
		// 'Tukitaki-frontend',
		// 'const _tukitakiObject = ' . wp_json_encode( self::scripts_data() ) . ';window._tukitakiObject=_tukitakiObject',
		// 'before'
		// );
	}

	/**
	 * Add inline data in scripts
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public static function scripts_data() {
		$plugin_data = Tukitaki::plugin_data();
		$user_id     = get_current_user_id();
		$data        = array(
			'user_id'       => $user_id,
			'site_url'      => home_url(),
			'admin_url'     => admin_url(),
			'ajax_url'      => admin_url( 'admin-ajax.php' ),
			'rest_url'      => get_rest_url( null, Routes::$route_namespace ),
			'nonce_key'     => $plugin_data['nonce_key'],
			'nonce_value'   => wp_create_nonce( $plugin_data['nonce_action'] ),
			'wp_rest_nonce' => wp_create_nonce( 'wp_rest' ),
		);
		return $data;
	}

	/**
	 * Script text domain mapping to make JS script
	 * translate-able
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function script_text_domain() {
		$plugin_data = Tukitaki::plugin_data();
		wp_set_script_translations( 'Tukitaki-backend', $plugin_data['plugin_url'] . 'assets/languages/' );
	}
}

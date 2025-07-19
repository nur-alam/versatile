<?php
/**
 * Enqueue Assets, styles & scripts
 *
 * @package Versatile\Core
 * @subpackage Versatile\Core\Enqueue
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Core;

use Versatile;
use Versatile\Frontend\CustomTemplate;
use Versatile\Helpers\UtilityHelper;
use Versatile\RestAPI\Routes;

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
		$plugin_data             = Versatile::plugin_data();
		$versatile_style_bundle  = $plugin_data['plugin_url'] . 'assets/dist/css/style.min.css';
		$versatile_admin_bundle  = $plugin_data['plugin_url'] . 'assets/dist/js/backend-bundle.min.js';

		if ( 'toplevel_page_versatile' === $page ) {
			wp_enqueue_style(
				'versatile-style',
				$versatile_style_bundle,
				array(),
				VERSATILE_VERSION,
				'all'
			);
			wp_enqueue_script(
				'versatile-admin',
				$versatile_admin_bundle,
				array( 'wp-element', 'wp-i18n' ),
				VERSATILE_VERSION,
				true
			);
			wp_add_inline_script(
				'versatile-admin',
				'const _versatileObject = ' . wp_json_encode( self::scripts_data() ) . ';window._versatileObject=_versatileObject',
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
		// $plugin_data             = Versatile::plugin_data();
		// $Versatile_frontend_bundle = Versatile::plugin_data()['plugin_url'] . 'assets/dist/js/Versatile-frontend.min.js';
		// wp_enqueue_script(
		// 'Versatile-frontend',
		// $Versatile_frontend_bundle,
		// array(),
		// VERSATILE_VERSION,
		// true
		// );
		// wp_add_inline_script(
		// 'Versatile-frontend',
		// 'const _versatileObject = ' . wp_json_encode( self::scripts_data() ) . ';window._versatileObject=_versatileObject',
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
		$plugin_data = Versatile::plugin_data();
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
		$plugin_data = Versatile::plugin_data();
		wp_set_script_translations( 'Versatile-backend', $plugin_data['plugin_url'] . 'assets/languages/' );
	}
}

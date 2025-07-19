<?php
/**
 * Comingsoon Service
 *
 * @package Versatile\Services\Comingsoon
 * @subpackage Versatile\Services\Comingsoon\ComingsoonMood
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Comingsoon;

use Versatile\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comingsoon init
 */
class ComingsoonMood {
	use JsonResponse;

	/**
	 * Comingsoon constructor.
	 */
	public function __construct() {
		$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
		if ( $versatile_mood_info['enable_comingsoon'] && ! $versatile_mood_info['enable_maintenance'] ) {
			if ( ! is_admin() ) {
				add_action( 'wp', array( $this, 'custom_comingsoon_mode' ) );
			}
		}
		add_action( 'wp_ajax_versatile_update_comingsoon_mood', array( $this, 'versatile_update_comingsoon_mood' ) );
	}

	/**
	 * Update comingsoon_mood description.
	 *
	 * @return array description
	 */
	public function versatile_update_comingsoon_mood() {
		try {
			$request_verify                         = versatile_verify_request();
			$params                                 = $request_verify['data'];
			$params['enable_comingsoon']            = filter_var( $params['enable_comingsoon'], FILTER_VALIDATE_BOOLEAN );
			$current_mood_info                      = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			$current_mood_info['enable_comingsoon'] = $params['enable_comingsoon'] ?? false;
			if ( $current_mood_info['enable_comingsoon'] ) {
				$current_mood_info['enable_maintenance'] = false;
			}
			unset( $params['enable_comingsoon'] );
			$current_mood_info['comingsoon'] = array_merge(
				$current_mood_info['comingsoon'],
				$params
			);
			$is_mood_info_updated            = update_option( VERSATILE_MOOD_LIST, $current_mood_info );
			// $versatile_service_list                         = get_option( VERSATILE_SERVICE_LIST );
			// $versatile_service_list['comingsoon']['enable'] = $current_mood_info['enable_comingsoon'];
			// update_option( VERSATILE_SERVICE_LIST, $versatile_service_list );
			// if ( $current_mood_info['enable_comingsoon'] ) {
			// }
			return $this->json_response( 'Maintenance Mood info updated!', $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while updating maintenance mood info', array(), 400 );
		}
	}

	/**
	 * Custom_comingsoon_mode description
	 *
	 * @return void return description
	 */
	public function custom_comingsoon_mode() {
		$current_user = wp_get_current_user();
		// Allow only users with 'administrator' role to bypass comingsoon
		// if ( in_array( 'subscriber', (array) $current_user->roles, true ) ) {  // 'manage_options' is typically an admin capability
		// Load your custom comingsoon HTML
		// }
		include_once VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/ComingsoonTemplate.php';
		die();
	}
}

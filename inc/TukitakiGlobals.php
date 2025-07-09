<?php
/**
 * Global constants
 *
 * @package Tukitaki
 * @subpackage Tukitaki\Globals
 * @since 1.0.0
 */

use Tukitaki\Helpers\UtilityHelper;

/**
 * Authentication checking.
 *
 * @return  boolean
 */
function tukitaki_auth_check() {
	if ( ! is_user_logged_in() ) {
		return false;
	}
	return true;
}

/**
 * Get plugin data
 *
 * @return array
 */
function tukitaki_get_plugin_data() {
	if ( ! defined( 'TUKITAKI_PLUGIN_INFO' ) ) {
		define( 'TUKITAKI_PLUGIN_INFO', Tukitaki::plugin_data() );
	}
	return Tukitaki::plugin_data();
}

/**
 * Verify nonce and authentication.
 *
 * @param bool $check_auth Whether to check user authentication (default: true).
 * @return array{success: bool, message: string, code: int, data?: array} Returns array with verification result and sanitized data.
 */
function tukitaki_verify_request( $check_auth = true ) {
	// Check authentication if required
	if ( $check_auth && ! is_user_logged_in() ) {
		return array(
			'success' => false,
			'message' => __( 'Access denied! Please login to access this feature.', 'tukitaki' ),
			'code'    => 403,
		);
	}

	$plugin_info  = tukitaki_get_plugin_data();
	$nonce_key    = $plugin_info['nonce_key'];
	$nonce_action = $plugin_info['nonce_action'];

	// Verify nonce
	if ( $check_auth && ( ! isset( $_REQUEST[ $nonce_key ] )
		|| ! wp_verify_nonce(
			sanitize_text_field( wp_unslash( $_REQUEST[ $nonce_key ] ) ),
			$nonce_action
		) )
	) {
		return array(
			'success' => false,
			'message' => __( 'Invalid security token!', 'tukitaki' ),
			'code'    => 400,
		);
	}

	// Return success with sanitized POST data
	return array(
		'success' => true,
		'message' => __( 'Verification successful.', 'tukitaki' ),
		'code'    => 200,
		'data'    => UtilityHelper::sanitize_array( $_REQUEST ),
	);
}

<?php
/**
 * Global constants
 *
 * @package Versatile
 * @subpackage Versatile\Globals
 * @since 1.0.0
 */

use Versatile\Helpers\UtilityHelper;

/**
 * Authentication checking.
 *
 * @return  boolean
 */
function versatile_auth_check() {
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
function versatile_get_plugin_data() {
	if ( ! defined( 'VERSATILE_PLUGIN_INFO' ) ) {
		define( 'VERSATILE_PLUGIN_INFO', Versatile::plugin_data() );
	}
	return Versatile::plugin_data();
}

/**
 * Verify nonce and authentication.
 *
 * @param bool $check_auth Whether to check user authentication (default: true).
 * @return array{success: bool, message: string, code: int, data?: array} Returns array with verification result and sanitized data.
 */
function versatile_verify_request( $check_auth = true ) {
	// Check authentication if required
	if ( $check_auth && ! is_user_logged_in() ) {
		return array(
			'success' => false,
			'message' => __( 'Access denied! Please login to access this feature.', 'versatile' ),
			'code'    => 403,
		);
	}

	$plugin_info  = versatile_get_plugin_data();
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
			'message' => __( 'Invalid security token!', 'versatile' ),
			'code'    => 400,
		);
	}

	// Remove keys that should not be saved
	unset( $_REQUEST['action'], $_REQUEST['versatile_nonce'] );

	// Return success with sanitized POST data
	return array(
		'success' => true,
		'message' => __( 'Verification successful.', 'versatile' ),
		'code'    => 200,
		'data'    => UtilityHelper::sanitize_array( $_REQUEST ),
	);
}

/**
 * Get client IP address
 *
 * @return string Client IP address.
 */
function versatile_get_client_ip() {
	// Check for IP from various headers in order of preference
	$ip_headers = array(
		'HTTP_CF_CONNECTING_IP',     // Cloudflare
		'HTTP_X_FORWARDED_FOR',      // Load balancer/proxy
		'HTTP_X_FORWARDED',          // Proxy
		'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
		'HTTP_CLIENT_IP',            // Proxy
		'HTTP_FORWARDED_FOR',        // Proxy
		'HTTP_FORWARDED',            // Proxy
		'REMOTE_ADDR',                // Standard
	);

	foreach ( $ip_headers as $header ) {
		if ( ! empty( $_SERVER[ $header ] ) ) {
			$ip = sanitize_text_field( wp_unslash( $_SERVER[ $header ] ) );

			// Handle comma-separated IPs (X-Forwarded-For can contain multiple IPs)
			if ( strpos( $ip, ',' ) !== false ) {
				$ip = trim( explode( ',', $ip )[0] );
			}

			// Validate IP address
			if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) {
				return $ip;
			}
		}
	}

	$server_ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';

	if ( '::1' === $server_ip ) {
		return '127.0.0.1';
	}

	// Fallback to REMOTE_ADDR even if it's private (for local development)
	return $server_ip ?? '127.0.0.1';
}

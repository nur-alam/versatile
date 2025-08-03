<?php
/**
 * Global constants
 *
 * @package Versatile
 * @subpackage Versatile\Globals
 * @since 1.0.0
 */

use Versatile\Helpers\UtilityHelper;
use Versatile\Helpers\ValidationHelper;
use Versatile\Helpers\VersatileInput;

use Tutor\Traits\JsonResponse;

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
 * @param array $inputs Array of input data to verify.
 * @param bool  $check_auth Whether to check user authentication (default: true).
 * @param array $permissions Array of user permission strings to check (default: empty array).
 *
 * @return object{success: bool, message: string, code: int, data?: array} Returns array with verification result and sanitized data.
 */
function versatile_verify_request( $inputs, $check_auth = true, $permissions = array( 'manage_options' ) ) {
	// Check authentication if required
	if ( $check_auth && ! is_user_logged_in() ) {
		return (object) array(
			'success' => false,
			'message' => __( 'Access denied! Please login to access this feature.', 'versatile-toolkit' ),
			'code'    => 403,
		);
	}

	// Check user permissions
	if ( ! empty( $permissions ) ) {
		$user = wp_get_current_user();
		foreach ( $permissions as $permission ) {
			if ( ! user_can( $user, $permission ) ) {
				return (object) array(
					'success' => false,
					'message' => __( 'You do not have permission to access this feature.', 'versatile-toolkit' ),
					'code'    => 403,
				);
			}
		}
	}

	$plugin_info  = versatile_get_plugin_data();
	$nonce_key    = $plugin_info['nonce_key'];
	$nonce_action = $plugin_info['nonce_action'];

	// Verify nonce
	if ( ! isset( $inputs[ $nonce_key ] ) || ! wp_verify_nonce(
		sanitize_text_field( wp_unslash( $inputs[ $nonce_key ] ) ),
		$nonce_action
	) ) {
		return (object) array(
			'success' => false,
			'message' => __( 'Invalid security token!', 'versatile-toolkit' ),
			'code'    => 400,
		);
	}

	// Remove keys that should not be saved
	unset( $inputs['action'], $inputs['versatile_nonce'] );

	// Return success with sanitized POST data
	return (object) array(
		'success' => true,
		'message' => __( 'Verification successful.', 'versatile-toolkit' ),
		'code'    => 200,
	);
}

/**
 * Sanitization and validation of inputs.
 *
 * @param array $inputs Array of input data to sanitize and validate.
 *
 * @return object Sanitized and validated input data.
 */
function versatile_sanitization_validation( $inputs ) {
	$default_inputs   = array(
		array(
			'name'     => 'action',
			'value'    => $_POST['action'], //phpcs:ignore
			'sanitize' => 'sanitize_text_field',
			'rules'    => 'required|string',
		),
		array(
			'name'     => 'versatile_nonce',
			'value'    => $_POST['versatile_nonce'], //phpcs:ignore
			'sanitize' => 'sanitize_text_field',
			'rules'    => 'required|numeric',
		),
	);
	$merged_inputs    = array_merge( $default_inputs, $inputs );
	$input_data       = array();
	$sanitize_mapping = array();

	foreach ( $merged_inputs as $value ) {
		array_push( $input_data, $value['value'] );
		$sanitize_mapping[ $value['name'] ] = $value['sanitize'];
	}

	$sanitized_data = VersatileInput::sanitize_array( $input_data, $sanitize_mapping );

	$rules = array();
	foreach ( $merged_inputs as $value ) {
		$rules[ $value['name'] ] = $value['rules'];
	}

	$validation = ValidationHelper::validate( $sanitized_data, $rules );

	if ( ! $validation->success ) {
		return (object) array(
			'success' => false,
			'message' => __( 'Error: data validation failed!!', 'versatile-toolkit' ),
			'code'    => 400,
			'errors'  => $validation->errors,
		);
	}

	$mapped_sanitized_data = array();

	foreach ( $merged_inputs as $key => $value ) {
		$mapped_sanitized_data[ $value['name'] ] = $sanitized_data[ $key ];
	}

	$mapped_sanitized_data['success'] = true;

	return (object) $mapped_sanitized_data;
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

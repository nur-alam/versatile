<?php
/**
 * Plugin Name: VersatileMu
 * Description: Conditionally disabled themes or plugins on your site for a given session, used to rule out conflicts during troubleshooting.
 * Version: 1.0.0
 *
 * @package VersatileMu
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'We\'re sorry, but you can not directly access this file.' );
}

/**
 * VersatileMu description
 */
class VersatileMu {
	/**
	 * VersatileMu constructor.
	 */
	public function __construct() {
		add_filter( 'option_active_plugins', array( $this, 'disable_plugins' ) );
	}

	/**
	 * Disable_plugins description
	 *
	 * @param array $plugins $plugins description.
	 *
	 * @return array  return description
	 */
	public function disable_plugins( $plugins ) {
		$current_ip = $this->get_client_ip();

		$ip_plugin_list   = get_option( 'versatile_disable_plugin_list' );
		$disabled_plugins = $ip_plugin_list['chosenPlugins'] ?? [];
		$target_ips       = $ip_plugin_list['ipTags'] ?? [];

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
	 * Get client IP address
	 *
	 * @return string Client IP address.
	 */
	private function get_client_ip() {
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
}

new VersatileMu();

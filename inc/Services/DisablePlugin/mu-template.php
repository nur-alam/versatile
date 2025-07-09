<?php
/**
 * Plugin Name: TukitakiMu
 * Description: Conditionally disabled themes or plugins on your site for a given session, used to rule out conflicts during troubleshooting.
 * Version: 1.0.0
 *
 * @package TukitakiMu
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( 'We\'re sorry, but you can not directly access this file.' );
}

/**
 * TukitakiMu description
 */
class TukitakiMu {
	/**
	 * TukitakiMu constructor.
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
}

new TukitakiMu();

<?php
/**
 * Contains Plugin's utilities functions
 * Initialize the plugin
 *
 * @package Versatile\Helpers
 * @subpackage Versatile\Helpers\UtilityHelper
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Helpers;

use Versatile;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Plugin's utilities
 */
class UtilityHelper {

	/**
	 * Load template file
	 *
	 * @param string $template  required template relative file path with .php ext.
	 * @param mixed  $data  data that will be available on the file.
	 * @param bool   $once  if true file will be included once.
	 *
	 * @return void
	 */
	public static function load_template( string $template, $data = array(), $once = false ) {
		$plugin_data   = Versatile::plugin_data();
		$template_path = $plugin_data['templates'] . $template;
		if ( file_exists( $template_path ) ) {
			if ( $once ) {
				include_once $template_path;
			} else {
				include $template_path;
			}
		} else {
			esc_html( "{$template_path} file not exists" );
		}
	}

	/**
	 * Sanitize get value through callable function
	 *
	 * @param string   $key required $_GET key.
	 * @param callable|null $callback callable WP sanitize/esc func.
	 *
	 * @return string
	 */
	public static function sanitize_get_field( string $key, ?callable $callback = null ) {
		$data = $_GET; //phpcs:ignore
		if ( is_null( $callback ) ) {
			$callback = 'sanitize_text_field';
		}
		 //phpcs:ignore
		if ( isset( $_GET[ $key ] ) ) {
			return call_user_func( $callback, wp_unslash( $_GET[ $key ] ) ); //phpcs:ignore
		}
		return '';
	}

	/**
	 * Sanitize post value through callable function
	 *
	 * @param string   $key required $_POST key.
	 * @param callable|null $callback callable WP sanitize/esc func.
	 *
	 * @return string
	 */
	public static function sanitize_post_field( string $key, ?callable $callback = null ) {
		if ( is_null( $callback ) ) {
			$callback = 'sanitize_text_field';
		}
		 //phpcs:ignore
		if ( isset( $_POST[ $key ] ) ) {
			return call_user_func( $callback, wp_unslash( $_POST[ $key ] ) ); //phpcs:ignore
		}
		return '';
	}

	/**
	 * Verify nonce not it verified then die
	 *
	 * @since 1.0.0
	 *
	 * @return bool if die false otherwise it will die
	 */
	public static function verify_nonce() {
		$plugin_data = Versatile::plugin_data();
		return isset( $_POST[ $plugin_data['nonce_key'] ] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ $plugin_data['nonce_key'] ] ) ), $plugin_data['nonce_action'] ); //phpcs:ignore
	}

	/**
	 * Sanitize array, single or multi dimensional array
	 * Explicitly setup how should a value sanitize by the
	 * sanitize function.
	 *
	 * @since 1.1.0
	 *
	 * @see available sanitize func
	 * https://developer.wordpress.org/themes/theme-security/data-sanitization-escaping/
	 *
	 * @param array $input array to sanitize.
	 * @param array $sanitize_mapping single dimensional map key value
	 * pair to set up sanitization process. Key name should by inside
	 * input array and the value will be callable func.
	 * For ex: [key1 => sanitize_email, key2 => wp_kses_post ]
	 *
	 * If key not passed then default sanitize_text_field will be used.
	 *
	 * @return array
	 */
	public static function sanitize_array( array $input, array $sanitize_mapping = array() ): array {
		$array = array();

		if ( is_array( $input ) && count( $input ) ) {
			foreach ( $input as $key => $value ) {
				if ( is_array( $value ) ) {
					$array[ $key ] = self::sanitize_array( $value, $sanitize_mapping );
				} else {
					$key = sanitize_text_field( $key );

					// If mapping exists then use callback.
					if ( isset( $sanitize_mapping[ $key ] ) ) {
						$callback = $sanitize_mapping[ $key ];
						$value    = call_user_func( $callback, wp_unslash( $value ) );
					} else {
						$value = sanitize_text_field( wp_unslash( $value ) );
					}
					$array[ $key ] = $value;
				}
			}
		}
		return is_array( $array ) && count( $array ) ? $array : array();
	}

	/**
	 * Send email wrapper of wp_mail function
	 *
	 * @since 1.0.0
	 *
	 * @param string|string[] $to Array or comma-separated lists.
	 * @param string          $subject mail subject.
	 * @param string          $message body body.
	 * @param array           $custom_headers mail headers default text/html.
	 * @param string|string[] $attachments mail attachments.
	 *
	 * @return bool
	 */
	public static function send_mail( $to, $subject, $message, $custom_headers = array(), $attachments = array() ) {
		$headers[] = 'Content-Type: text/html; charset=UTF-8';
		if ( ! empty( $custom_headers ) ) {
			$headers = wp_parse_args( $headers, $custom_headers );
		}
		$success = true;
		try {
			$success = \wp_mail( $to, $subject, $message, $headers, $attachments );
		} catch ( \Throwable $th ) {
			$success = false;
		}

		return $success;
	}
}

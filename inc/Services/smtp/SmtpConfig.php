<?php
/**
 * SMTP configuration class
 *
 * @package Versatile\Services\Smtp
 * @subpackage Versatile\Services\Smtp\SmtpConfig
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Smtp;

use Versatile\Traits\JsonResponse;

/**
 * SmtpConfig class
 */
class SmtpConfig {
	use JsonResponse;

	/**
	 * Register hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_update_email_config', array( $this, 'update_email_config' ) );
		add_action( 'wp_ajax_delete_email_config', array( $this, 'delete_email_config' ) );
		add_action( 'wp_ajax_get_email_connections', array( $this, 'get_email_connections' ) );
		add_action( 'wp_ajax_get_default_email_connection', array( $this, 'get_default_email_connection' ) );
		add_action( 'wp_ajax_update_default_connection', array( $this, 'update_default_connection' ) );
	}

	/**
	 * Update email configuration
	 *
	 * @return object
	 */
	public function update_email_config() {
		$sanitized_data = versatile_sanitization_validation();
		if ( ! $sanitized_data['success'] ) {
			$this->json_response( $sanitized_data['message'], null, $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
		}
		$verify_request = versatile_verify_request( $sanitized_data );
		if ( ! $verify_request['success'] ) {
			$this->json_response( $verify_request['message'], null, $verify_request['code'] ?? 400, $verify_request['errors'] ?? null );
		}
	}
}

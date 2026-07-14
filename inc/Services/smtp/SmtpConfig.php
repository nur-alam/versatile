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
		add_action( 'wp_ajax_update_smtp_config', array( $this, 'update_smtp_config' ) );
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
	public function update_smtp_config() {
		sleep( 10 );
		try {
			$provider = isset( $_POST['provider'] ) ? sanitize_text_field( wp_unslash( $_POST['provider'] ) ) : ''; // phpcs:ignore
			$inputs   = array(
				array(
					'name'     => 'provider',
					'value'    => $_POST['provider'] ?? '', // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => 'required|string',
				),
				array(
					'name'     => 'fromName',
					'value'    => $_POST['fromName'] ?? '', // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => 'required|string',
				),
				array(
					'name'     => 'fromEmail',
					'value'    => $_POST['fromEmail'] ?? '', // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => 'required|string|email',
				),
				// array(
				// 'name'     => 'selectedProvider',
				// 'value'    => $_POST['selectedProvider'] ?? '', // phpcs:ignore
				// 'sanitize' => 'sanitize_text_field',
				// 'rules'    => 'required|string',
				// ),
			);

			if ( 'smtp' === $provider ) {
				$inputs = array_merge(
					$inputs,
					array(
						array(
							'name'     => 'smtpHost',
							'value'    => $_POST['smtpHost'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
						array(
							'name'     => 'smtpPort',
							'value'    => $_POST['smtpPort'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string|numeric',
						),
						array(
							'name'     => 'smtpSecurity',
							'value'    => $_POST['smtpSecurity'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
						array(
							'name'     => 'smtpUsername',
							'value'    => $_POST['smtpUsername'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
						array(
							'name'     => 'smtpPassword',
							'value'    => $_POST['smtpPassword'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
					)
				);
			} elseif ( 'ses' === $provider || 'aws' === $provider ) {
				$inputs = array_merge(
					$inputs,
					array(
						array(
							'name'     => 'accessKeyId',
							'value'    => $_POST['accessKeyId'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
						array(
							'name'     => 'secretAccessKey',
							'value'    => $_POST['secretAccessKey'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
						array(
							'name'     => 'region',
							'value'    => $_POST['region'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
					)
				);
			} elseif ( 'gmail' === $provider ) {
				$inputs = array_merge(
					$inputs,
					array(
						array(
							'name'     => 'clientId',
							'value'    => $_POST['clientId'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
						array(
							'name'     => 'clientSecret',
							'value'    => $_POST['clientSecret'] ?? '', // phpcs:ignore
							'sanitize' => 'sanitize_text_field',
							'rules'    => 'required|string',
						),
					)
				);
			} else {
				$this->json_response( __( 'Invalid email provider', 'versatile-toolkit' ), null, 400, null );
			}

			$sanitized_data = versatile_sanitization_validation( $inputs );
			if ( ! $sanitized_data['success'] ) {
				$this->json_response( $sanitized_data['message'], null, $sanitized_data['code'] ?? 400, $sanitized_data['errors'] ?? null );
			}
			$verify_request = versatile_verify_request( $sanitized_data );
			if ( ! $verify_request['success'] ) {
				$this->json_response( $verify_request['message'], null, $verify_request['code'] ?? 400, $verify_request['errors'] ?? null );
			}
			$data = $verify_request['data'];
			// unset success key
			unset( $data['success'] );
			// Get existing config.
			$existing_config = get_option( VERSATILE_EMAIL_CONFIG, array() );
			$config          = $existing_config;

			if ( 'smtp' === $data['provider'] ) {
				$config['smtp'] = $data;
			} elseif ( 'ses' === $data['provider'] || 'aws' === $data['provider'] ) {
				$data['provider'] = 'ses';
				$config['ses']    = $data;
			} elseif ( 'gmail' === $data['provider'] ) {
				$config['gmail'] = $data;
			} else {
				$this->json_response( __( 'Invalid email provider', 'versatile-toolkit' ), null, 400, null );
			}

			// Update config.
			update_option( VERSATILE_EMAIL_CONFIG, $config );

			return $this->json_response( __( 'Email configuration updated successfully', 'versatile-toolkit' ) );
		} catch ( \Exception $e ) {
			$this->json_response( $e->getMessage(), null, 500, null );
		}
	}
}

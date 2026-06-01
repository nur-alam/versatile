<?php
/**
 * PhpMailer configuration class
 *
 * @package Versatile\Services\Smtp
 * @subpackage Versatile\Services\Smtp\PhpMailerConfig
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Smtp;

/**
 * Set SMTP configuration class
 */
class PhpMailerConfig {
	/**
	 * Email configuration settings
	 *
	 * @var array
	 */
	private $config;

	/**
	 * Constructor
	 */
	public function __construct() {
		// $this->config = get_option( VERSATILE_DEFAULT_EMAIL_PROVIDER, array() );
		// add_action( 'phpmailer_init', array( $this, 'configure_email' ), 10, 1 );
		// add_action( 'versatile_phpmailer_init', array( $this, 'config_smtp_for_test_mail' ), 10, 1 );
	}

	/**
	 * Configure email settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 */
	public function configure_email( PHPMailer $phpmailer ) {
		$default_provider = versatile_get_default_provider();
		if ( 'smtp' === $default_provider['provider'] ) {
			if ( empty( $this->config ) ) {
				return;
			}

			$provider   = $this->config['provider'] ?? 'smtp';
			$from_name  = $this->config['fromName'] ?? '';
			$from_email = $this->config['fromEmail'] ?? '';

			if ( '' !== $from_name ) {
				// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				$phpmailer->FromName = $from_name;
				// phpcs:enable
			}
			if ( '' !== $from_email ) {
				// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
				$phpmailer->From = $from_email;
				// phpcs:enable
			}

			$this->configure_smtp( $phpmailer );
		}
	}

	/**
	 * Configure SMTP settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 */
	private function configure_smtp( PHPMailer $phpmailer ) {
		$provider = $this->config ?? array();

		if ( empty( $provider ) ) {
			return;
		}

		$phpmailer->isSMTP();
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Host       = $provider['smtpHost'] ?? '';
		$phpmailer->Port       = $provider['smtpPort'] ?? '';
		$phpmailer->SMTPSecure = $provider['smtpSecurity'] ?? 'ssl';
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Username   = $provider['smtpUsername'];
		$phpmailer->Password   = $provider['smtpPassword'];
		// phpcs:enable
	}

	/**
	 * Configure Amazon SES settings
	 *
	 * @param PHPMailer $phpmailer PHPMailer instance.
	 * @return void
	 * @throws Exception If there's an error configuring SES.
	 */
	public function config_smtp_for_test_mail( PHPMailer $phpmailer ) {
		$provider = versatile_get_provider( 'smtp' );
		if ( empty( $provider ) ) {
			return;
		}

		$from_name  = $provider['fromName'] ?? '';
		$from_email = $provider['fromEmail'] ?? '';

		if ( '' !== $from_name ) {
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->FromName = $from_name;
			// phpcs:enable
		}
		if ( '' !== $from_email ) {
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			$phpmailer->From = $from_email;
			// phpcs:enable
		}

		$phpmailer->isSMTP();
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$phpmailer->Host       = $provider['smtpHost'] ?? '';
		$phpmailer->Port       = $provider['smtpPort'] ?? '';
		$phpmailer->SMTPSecure = $provider['smtpSecurity'] ?? 'ssl';
		$phpmailer->SMTPAuth   = true;
		$phpmailer->Username   = $provider['smtpUsername'];
		$phpmailer->Password   = $provider['smtpPassword'];
		// phpcs:enable
	}
}

<?php
/**
 * The SmtpController class handles SMTP-related actions.
 *
 * @package Versatile\Services\Smtp
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Smtp;

use Tutor\Traits\JsonResponse;

/**
 * SmtpController
 */
class SmtpController {
	use JsonResponse;

	/**
	 * Resolve dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// $this->email_log_model = new EmailLogModel();
		add_filter( 'wp_mail_succeeded', array( $this, 'create_email_log' ) );
		// add_filter( 'wp_mail_failed', array( $this, 'create_failed_email_log' ) );
		// add_action( 'wp_ajax_get_email_stats', array( $this, 'get_email_stats' ) );
		// add_action( 'wp_ajax_trigger_fetch_email_logs', array( $this, 'get_email_logs' ) );
		// add_action( 'wp_ajax_trigger_delete_email_log', array( $this, 'delete_email_log' ) );
		// add_action( 'wp_ajax_trigger_bulk_delete_email_logs', array( $this, 'bulk_delete_email_logs' ) );
		// add_action( 'wp_ajax_trigger_send_test_email', array( $this, 'send_test_email' ) );
		// add_action( 'wp_ajax_trigger_resend_email', array( $this, 'trigger_resend_email' ) );
		// // add_action( 'admin_init', array( $this, 'handle_google_oauth_callback' ) );
		// add_action( 'wp_ajax_handle_google_oauth_callback', array( $this, 'handle_google_oauth_callback' ) );
	}
}

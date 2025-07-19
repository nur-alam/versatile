<?php
/**
 * Register Routes
 *
 * @package Versatile\RestAPI
 * @subpackage Versatile\RestAPI\Routes
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\RestAPI;

use Versatile\Controllers\Provider\aws\AwsSesController;
use Versatile\Controllers\SmtpConfig;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Register supported routes
 */
class Routes {

	/**
	 * Route namespace
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $route_namespace = 'versatile/v1';
	/**
	 * Register hooks
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'rest_api_init', __CLASS__ . '::register_routes' );
	}

	/**
	 * Register the available routes
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function register_routes() {
		foreach ( self::endpoints() as $endpoint ) {
			register_rest_route(
				self::$route_namespace,
				$endpoint['endpoint'] . $endpoint['url_params'],
				array(
					'methods'             => $endpoint['method'],
					'callback'            => $endpoint['callback'],
					'permission_callback' => $endpoint['permission_callback'],
					// 'args'                => $endpoint['args'],
				)
			);
		}
	}

	/**
	 * Get available endpoints
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public static function endpoints() {

		// $smtp_controller = new SmtpConfig();
		// $aws_controller  = new AwsSesController();

		return array(
			// array(
			// 'endpoint'            => '/connections',
			// 'url_params'          => '',
			// 'method'              => WP_REST_Server::READABLE,
			// 'callback'            => array( $smtp_controller, 'get_email_connections' ),
			// 'permission_callback' => '',
			// ),
			// array(
			// 'endpoint'            => '/get-default-connections',
			// 'url_params'          => '',
			// 'method'              => WP_REST_Server::READABLE,
			// 'callback'            => array( $smtp_controller, 'get_default_email_connection' ),
			// 'permission_callback' => '',
			// ),
			// array(
			// 'endpoint'            => '/get-verified-ses-emails',
			// 'url_params'          => '',
			// 'method'              => WP_REST_Server::READABLE,
			// 'callback'            => array( $aws_controller, 'get_verified_ses_emails' ),
			// 'permission_callback' => '',
			// ),
		);
	}
}

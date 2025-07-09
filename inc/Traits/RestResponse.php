<?php
/**
 * Manage rest response
 *
 * Wrapper class of rest_ensure_response
 *
 * @package Tukitaki\Traits
 * @subpackage Tukitaki\Traits\RestResponse
 * @author  Tukitaki<tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Traits;

use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

trait RestResponse {

	/**
	 * Success status code
	 *
	 * @var integer
	 */
	public $success_code = 200;

	/**
	 * Failed status code
	 *
	 * @var integer
	 */
	public $failed_code = 400;

	/**
	 * Validate rest request before processing.
	 *
	 * @since 1.0.0
	 *
	 * @param string $message response message.
	 * @param mixed  $data response data.
	 * @param int    $status response status code.
	 *
	 * @return rest_ensure_response
	 */
	public function response( string $message, $data = '', int $status = 200 ) {
		$response = new WP_REST_Response(
			array(
				'status'        => $status,
				'response'      => $message,
				'body_response' => $data,
			),
			$status
		);
		return rest_ensure_response( $response );
	}
}

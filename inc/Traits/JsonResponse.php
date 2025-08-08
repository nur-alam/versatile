<?php
/**
 * Manage json response
 *
 * @package Versatile\Traits
 * @subpackage Versatile\Traits\JsonResponse
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Traits;

/**
 * JsonResponse trait
 *
 * @since 1.0.0
 */
trait JsonResponse {

	/**
	 * Send a success response
	 *
	 * @param string $message Success message.
	 * @param mixed  $data    Optional data to include in response.
	 * @return array
	 */
	protected function success( $message, $data = null ) {
		return array(
			'status_code' => 200,
			'message'     => $message,
			'data'        => $data,
		);
	}

	/**
	 * Send an error response
	 *
	 * @param string $message Error message.
	 * @param mixed  $data    Optional data to include in response.
	 * @param int    $code    HTTP status code.
	 * @return array
	 */
	protected function error( $message, $data = null, $code = 400 ) {
		return array(
			'status_code' => $code,
			'message'     => $message,
			'data'        => $data,
		);
	}

	/**
	 * Send a JSON response
	 *
	 * @param string $message Response message.
	 * @param mixed  $data    Optional data to include in response.
	 * @param int    $code    HTTP status code.
	 * @param array  $errors  Optional errors to include in response.
	 * @return void
	 */
	protected function json_response( $message, $data = null, $code = 200, $errors = null ) {
		wp_send_json(
			array(
				'status_code' => $code,
				'message'     => $message,
				'data'        => $data,
				'errors'      => $errors,
			),
			$code
		);
	}

	/**
	 * Response JSON success message.
	 *
	 * @param string $message success message.
	 * @param int    $status_code status code.
	 *
	 * @return void
	 */
	public function response_success( $message, $status_code = 200 ) {
		wp_send_json(
			array(
				'success' => true,
				'message' => $message,
			),
			$status_code
		);
	}

	/**
	 * Response JSON fail message.
	 *
	 * @param string $message fail message.
	 * @param int    $status_code status code.
	 *
	 * @return void
	 */
	public function response_fail( $message, $status_code = 400 ) {
		wp_send_json(
			array(
				'success' => false,
				'message' => $message,
			),
			$status_code
		);
	}


	/**
	 * Response JSON data.
	 *
	 * @param array $data data.
	 * @param int   $status_code status code.
	 *
	 * @return void
	 */
	public function response_data( $data, $status_code = 200 ) {
		wp_send_json(
			array(
				'success' => true,
				'data'    => $data,
			),
			$status_code
		);
	}
}

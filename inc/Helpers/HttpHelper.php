<?php 

/**
 * Helper class to manage HTTP request.
 * @package Versatile\Helpers
 * @subpackage Versatile\Helpers\HttpHelper
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Helpers;

/**
 * HttpHelper class
 *
 * @since 1.0.0
 */
class HttpHelper {
	/**
	 * HTTP methods constants
	 *
	 * @var string
	 */
	const METHOD_GET    = 'GET';
	const METHOD_POST   = 'POST';
	const METHOD_PUT    = 'PUT';
	const METHOD_PATCH  = 'PATCH';
	const METHOD_DELETE = 'DELETE';

	/**
	 * 200 serial HTTP status code constants
	 */
	const STATUS_OK       = 200;
	const STATUS_CREATED  = 201;
	const STATUS_ACCEPTED = 202;

	/**
	 * 400 serial HTTP status code constants
	 */
	const STATUS_BAD_REQUEST          = 400;
	const STATUS_UNAUTHORIZED         = 401;
	const STATUS_FORBIDDEN            = 403;
	const STATUS_NOT_FOUND            = 404;
	const STATUS_METHOD_NOT_ALLOWED   = 405;
	const STATUS_TOO_MANY_REQUESTS    = 429;
	const STATUS_UNPROCESSABLE_ENTITY = 422;

	/**
	 * 500 serial HTTP status code constants
	 */
	const STATUS_INTERNAL_SERVER_ERROR = 500;
	const STATUS_SERVICE_UNAVAILABLE   = 503;
	const STATUS_BAD_GATEWAY           = 502;
	const STATUS_GATEWAY_TIMEOUT       = 504;
	
}
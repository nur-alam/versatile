<?php
/**
 * Initialize the plugin
 *
 * @package Versatile\Core
 * @subpackage Versatile\Init
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Versatile\Admin\Init as AdminInit;
use Versatile\Core\Enqueue;
use Versatile\RestAPI\Routes;
use Versatile\Services\ServiceInit;

/**
 * The Init class initializes plugin dependencies by creating instances
 * of the classes
 */
class Init {
	/**
	 * Initialize the plugin dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		new Enqueue();
		new AdminInit();
		new Routes();
		new ServiceInit();
	}
}

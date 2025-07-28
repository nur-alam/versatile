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
		add_action( 'admin_head', array( $this, 'custom_admin_css' ) );
	}

	/**
	 * Add custom CSS for admin menu icon
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function custom_admin_css() {
		echo '<style>
			.toplevel_page_versatile a div {
				background-size: 14px auto !important;
			}
		</style>';
	}
}

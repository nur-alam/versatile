<?php
/**
 * Initialize the plugin
 *
 * @package Tukitaki\Core
 * @subpackage Tukitaki\Init
 * @author  Tukitaki<tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Tukitaki\Admin\Init as AdminInit;
use Tukitaki\Core\Enqueue;
use Tukitaki\RestAPI\Routes;
use Tukitaki\Services\MaintenanceMode\MaintenanceMode;
use Tukitaki\Services\Troubleshoot\TroubleshootInit;
use Tukitaki\Services\Comingsoon\Comingsoon;

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
		new TroubleshootInit();
		new MaintenanceMode();
		// new Comingsoon();
	}
}

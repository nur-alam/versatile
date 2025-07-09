<?php
/**
 * Admin module loader
 *
 * @package Tukitaki\Admin
 * @subpackage Tukitaki\Admin\Init
 * @author  Tukitaki<Tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Admin;

use Tukitaki\Admin\Menu\MainMenu;

/**
 * Admin Package loader
 *
 * @since 1.0.0
 */
class Init {

	/**
	 * Load dependencies
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		new MainMenu();
	}
}

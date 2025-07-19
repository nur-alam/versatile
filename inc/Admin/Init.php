<?php
/**
 * Admin module loader
 *
 * @package Versatile\Admin
 * @subpackage Versatile\Admin\Init
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Admin;

use Versatile\Admin\Menu\MainMenu;

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

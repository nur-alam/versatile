<?php
/**
 * EmailLogs sub menu
 *
 * @package Tukitaki\Admin\Menu\SubMenu
 * @subpackage Tukitaki\Admin\Menu\SubMenu\EmailLogs
 * @author  Tukitaki<Tukitaki@gmail.com>
 * @since 1.0.0
 */

namespace Tukitaki\Admin\Menu\SubMenu;

/**
 * EmailLogs sub menu
 */
class EmailLogs implements SubMenuInterface {

	/**
	 * Page title
	 *
	 * @since 1.0.0
	 *
	 * @return string  page title
	 */
	public function page_title(): string {
		return __( 'Email Logs', 'tukitaki' );
	}

	/**
	 * Menu title
	 *
	 * @since 1.0.0
	 *
	 * @return string  menu title
	 */
	public function menu_title(): string {
		return __( 'Email Logs', 'tukitaki' );
	}

	/**
	 * Page title
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function page_view(): string {
		return __( 'email-logs-view', 'tukitaki' );
	}

	/**
	 * Capability to access this menu
	 *
	 * @since 1.0.0
	 *
	 * @return string  capability
	 */
	public function capability(): string {
		return 'manage_options';
	}

	/**
	 * Page URL slug
	 *
	 * @since 1.0.0
	 *
	 * @return string  slug
	 */
	public function slug(): string {
		return 'tukitaki-email-logs';
	}

	/**
	 * Render content for this sub-menu page
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function callback() {}
}

<?php
/**
 * Register admin main menu & sub-menu
 *
 * @package Versatile\Admin\Menu
 * @subpackage Versatile\Admin\Menu\MainMenu
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Admin\Menu;

use Versatile;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin main menu & sub-menu management
 */
class MainMenu {

	/**
	 * Capability
	 *
	 * @var string
	 */
	private $capability = 'manage_options';

	/**
	 * Slug for this page
	 *
	 * @var string $slug
	 */
	private $slug = 'versatile';

	/**
	 * Hold plugin meta data
	 *
	 * @var array
	 */
	public $plugin_data;

	/**
	 * Register hooks
	 *
	 * @param bool $run  to excecute contrustor method.
	 *
	 * @return void
	 */
	public function __construct( $run = true ) {
		if ( $run ) {
			add_action( 'admin_menu', array( $this, 'add_menu' ) );
		}
		$this->plugin_data = Versatile::plugin_data();
	}

	/**
	 * Page title
	 *
	 * @return string
	 */
	public function page_title(): string {
		return __( 'Versatile', 'versatile-toolkit' );
	}

	/**
	 * Menu title
	 *
	 * @return string
	 */
	public function menu_title(): string {
		return __( 'Versatile', 'versatile-toolkit' );
	}

	/**
	 * Capability
	 *
	 * @return string
	 */
	public function capability(): string {
		return $this->capability;
	}

	/**
	 * Slug
	 *
	 * @return string
	 */
	public function slug(): string {
		return $this->slug;
	}

	/**
	 * Position
	 *
	 * @return int
	 */
	public function position(): int {
		return 2;
	}

	/**
	 * Icon name that will used for page menu icon
	 *
	 * @return string
	 */
	public function icon_name(): string {
		// Versatile plugin icon - Stylized organic "V" letter
		// $icon_base64   = 'PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC45Ij4KPHBhdGggZD0iTTYuNSA0TDE2LjUgMjRIMTEuNUw0IDgiIGZpbGw9IiM0QTkwRTIiLz4KPHBhdGggZD0iTTYuNSA0TDE2LjUgMjRIMTEuNUw0IDgiIHN0cm9rZT0iIzRBOTBFMiIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9nPgo8ZyBvcGFjaXR5PSIwLjkiPgo8cGF0aCBkPSJNMjEuNSA0TDExLjUgMjRIMTYuNUwyNCA4IiBmaWxsPSIjNTBDODc4Ii8+CjxwYXRoIGQ9Ik0yMS41IDRMMTEuNSAyNEgxNi41TDI0IDgiIHN0cm9rZT0iIzUwQzg3OCIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9nPgo8L3N2Zz4K';
		$icon_base64 = 'PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC45Ij4KPHBhdGggZD0iTTYuMjUgNEwxNS4yNSAyMkgxMC43NUw0IDcuNiIgZmlsbD0iIzRBOTBFMiIvPgo8cGF0aCBkPSJNNi4yNSA0TDE1LjI1IDIySDEwLjc1TDQgNy42IiBzdHJva2U9IiM0QTkwRTIiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjwvZz4KPGcgb3BhY2l0eT0iMC45Ij4KPHBhdGggZD0iTTE5Ljc1IDRMMTAuNzUgMjJIMTUuMjVMMjIgNy42IiBmaWxsPSIjNTBDODc4Ii8+CjxwYXRoIGQ9Ik0xOS43NSA0TDEwLjc1IDIySDE1LjI1TDIyIDcuNiIgc3Ryb2tlPSIjNTBDODc4IiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+Cjwvc3ZnPgo=';
		// $icon_base64   = 'PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC45Ij4KPHBhdGggZD0iTTYgNEwxNCAyMEgxMEw0IDcuMiIgZmlsbD0iIzRBOTBFMiIvPgo8cGF0aCBkPSJNNiA0TDE0IDIwSDEwTDQgNy4yIiBzdHJva2U9IiM0QTkwRTIiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjwvZz4KPGcgb3BhY2l0eT0iMC45Ij4KPHBhdGggZD0iTTE4IDRMMTAgMjBIMTRMMjAgNy4yIiBmaWxsPSIjNTBDODc4Ii8+CjxwYXRoIGQ9Ik0xOCA0TDEwIDIwSDE0TDIwIDcuMiIgc3Ryb2tlPSIjNTBDODc4IiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+Cjwvc3ZnPgo=';
		// $icon_base64   = 'PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyMiAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC45Ij4KPHBhdGggZD0iTTUuNzUgNEwxMi43NSAxOEg5LjI1TDQgNi44IiBmaWxsPSIjNEE5MEUyIi8+CjxwYXRoIGQ9Ik01Ljc1IDRMMTIuNzUgMThIOS4yNUw0IDYuOCIgc3Ryb2tlPSIjNEE5MEUyIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+CjxnIG9wYWNpdHk9IjAuOSI+CjxwYXRoIGQ9Ik0xNi4yNSA0TDkuMjUgMThIMTIuNzVMMTggNi44IiBmaWxsPSIjNTBDODc4Ii8+CjxwYXRoIGQ9Ik0xNi4yNSA0TDkuMjUgMThIMTIuNzVMMTggNi44IiBzdHJva2U9IiM1MEM4NzgiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjwvZz4KPC9zdmc+Cg==';
		$icon_data_url = 'data:image/svg+xml;base64,' . $icon_base64;
		return $icon_data_url;
	}

	/**
	 * Main menu register
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_menu() {
		// Register main menu.
		add_menu_page(
			$this->slug(),
			$this->menu_title(),
			$this->capability(),
			$this->slug(),
			array( $this, 'view' ),
			$this->icon_name(),
			$this->position()
		);
	}

	/**
	 * Page view
	 *
	 * @return void
	 */
	public function view() {
		include trailingslashit( $this->plugin_data['views'] . 'pages' ) . 'versatile-view.php';
	}
}

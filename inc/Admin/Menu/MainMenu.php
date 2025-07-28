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
		return __( 'Versatile', 'verstaile-toolkit' );
	}

	/**
	 * Menu title
	 *
	 * @return string
	 */
	public function menu_title(): string {
		return __( 'Versatile', 'verstaile-toolkit' );
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
		$icon_base64   = 'PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuODM1OTQgOC4xODY1MUwzLjcyMzY5IDYuMjY5NDEiIHN0cm9rZT0iIzYzNzRCQiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTguMjU5NTYgMS45Njg4N0w2LjIxODc1IDMuNzMwNTMiIHN0cm9rZT0iIzYzNzRCQiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTguMjU5NTYgOC4xODY1MUw2LjIxODc1IDYuMjY5NDEiIHN0cm9rZT0iIzYzNzRCQiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTEuODM1OTQgMS45Njg4N0wzLjcyMzY5IDMuNzMwNTMiIHN0cm9rZT0iIzYzNzRCQiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTEuMjUwMDEgMi41QzEuOTQwMzggMi41IDIuNTAwMDMgMS45NDAzNiAyLjUwMDAzIDEuMjVDMi41MDAwMyAwLjU1OTY0NCAxLjk0MDM4IDAgMS4yNTAwMSAwQzAuNTU5NjUgMCAwIDAuNTU5NjQ0IDAgMS4yNUMwIDEuOTQwMzYgMC41NTk2NSAyLjUgMS4yNTAwMSAyLjVaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik04Ljc1MDAxIDIuNUM5LjQ0MDM4IDIuNSAxMCAxLjk0MDM2IDEwIDEuMjVDMTAgMC41NTk2NDQgOS40NDAzOCAwIDguNzUwMDEgMEM4LjA1OTY1IDAgNy41IDAuNTU5NjQ0IDcuNSAxLjI1QzcuNSAxLjk0MDM2IDguMDU5NjUgMi41IDguNzUwMDEgMi41WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMS4yNTAwMSAxMEMxLjk0MDM4IDEwIDIuNTAwMDMgOS40NDAzNiAyLjUwMDAzIDguNzVDMi41MDAwMyA4LjA1OTY0IDEuOTQwMzggNy41IDEuMjUwMDEgNy41QzAuNTU5NjUgNy41IDAgOC4wNTk2NCAwIDguNzVDMCA5LjQ0MDM2IDAuNTU5NjUgMTAgMS4yNTAwMSAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTguNzUwMDEgMTBDOS40NDAzOCAxMCAxMCA5LjQ0MDM2IDEwIDguNzVDMTAgOC4wNTk2NCA5LjQ0MDM4IDcuNSA4Ljc1MDAxIDcuNUM4LjA1OTY1IDcuNSA3LjUgOC4wNTk2NCA3LjUgOC43NUM3LjUgOS40NDAzNiA4LjA1OTY1IDEwIDguNzUwMDEgMTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik00Ljg3NTAyIDYuNzVDNS45MTA1NiA2Ljc1IDYuNzUwMDQgNS45MTA1MyA2Ljc1MDA0IDQuODc1QzYuNzUwMDQgMy44Mzk0NyA1LjkxMDU2IDMgNC44NzUwMiAzQzMuODM5NDcgMyAzIDMuODM5NDcgMyA0Ljg3NUMzIDUuOTEwNTMgMy44Mzk0NyA2Ljc1IDQuODc1MDIgNi43NVoiIGZpbGw9IiMzNzQxNTEiLz4KPHBhdGggZD0iTTYuMjIyMDMgNC4yNzI3M0w1LjIxMzUxIDdINC43ODczOEwzLjc3ODg1IDQuMjcyNzNINC4yMzM0TDQuOTg2MjQgNi40NDYwMkg1LjAxNDY1TDUuNzY3NDkgNC4yNzI3M0g2LjIyMjAzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';
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

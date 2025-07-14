<?php
/**
 * Initialize plugin constants
 *
 * @package Tukitaki\Core
 * @author  Tukitaki<tukitaki@gmail.com>
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

define( 'TUKITAKI_VERSION', '1.0.0' );
define( 'TUKITAKI_PLUGIN_NAME', 'tukitaki' );
define( 'TUKITAKI_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TUKITAKI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'TUKITAKI_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

define( 'TUKITAKI_REDIRECT_URI', admin_url( 'admin.php?page=tukitaki' ) );

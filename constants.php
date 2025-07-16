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

// Define default mood info structure
define(
	'TUKITAKI_DEFAULT_MOOD_INFO',
	array(
		'enable_maintenance' => false,
		'enable_coming_soon' => false,
		'maintenance'        => array(
			'title'       => '',
			'subtitle'    => '',
			'description' => '',
			'style'       => array(
				'bg_image' => '',
				'bg_color' => '#ffffff',
				'opacity'  => 1,
			),
		),
		'coming_soon'        => array(
			'title'       => '',
			'subtitle'    => '',
			'description' => '',
			'style'       => array(
				'bg_image' => '',
				'bg_color' => '#ffffff',
				'opacity'  => 1,
			),
		),
	)
);

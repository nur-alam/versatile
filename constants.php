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

define( 'TUKITAKI_DISABLE_PLUGIN_LIST_KEY', 'tukitaki_disable_plugin_list' );

define( 'TUKITAKI_MOOD_KEY', 'tukitaki_mood_info' );
// $_tukitaki_mood_info = array();
// Define default mood info structure
define(
	'TUKITAKI_DEFAULT_MOOD_INFO',
	array(
		'enable_troubleshoot' => false,
		'enable_maintenance'  => false,
		'enable_comingsoon'   => false,
		'maintenance'         => array(
			'title'       => '',
			'subtitle'    => '',
			'description' => '',
			'style'       => array(
				'bg_image' => '',
				'bg_color' => '#ffffff',
				'opacity'  => 1,
			),
		),
		'comingsoon'          => array(
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

define( 'TUKITAKI_ADDON_INFO', 'tukitaki_addon_info' );
define(
	'TUKITAKI_DEFAULT_ADDON_INFO',
	array(
		'troubleshoot' => array(
			'label'       => 'Troubleshoot',
			'enable'      => true,
			'path'        => 'troubleshoot',
			'description' => 'lorem ipsum',
		),
		'maintenance'  => array(
			'label'       => 'Maintenance Mood',
			'enable'      => true,
			'path'        => 'maintenance',
			'description' => 'lorem:1',
		),
		'comingsoon'   => array(
			'label'       => 'Comingsoon Mood',
			'enable'      => false,
			'path'        => 'comingsoon',
			'description' => 'lorem:1',
		),
	)
);

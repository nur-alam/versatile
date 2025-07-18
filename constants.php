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

define( 'TUKITAKI_DISABLE_PLUGIN_LIST', 'tukitaki_disable_plugin_list' );

define( 'TUKITAKI_MOOD_LIST', 'tukitaki_mood_list' );

// Define default mood info structure
define(
	'TUKITAKI_DEFAULT_MOOD_LIST',
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

define( 'TUKITAKI_SERVICE_LIST', 'tukitaki_service_list' );
define(
	'TUKITAKI_DEFAULT_SERVICE_LIST',
	array(
		'troubleshoot' => array(
			'label'       => 'Troubleshoot',
			'enable'      => true,
			'path'        => 'troubleshoot',
			'description' => 'Diagnose and fix common WordPress issues, plugin conflicts, and performance problems.',
			// 'description' => 'Diagnose and fix common WordPress issues, plugin conflicts, and performance problems.',
		),
		'maintenance'  => array(
			'label'       => 'Maintenance Mode',
			'enable'      => true,
			'path'        => 'maintenance',
			'description' => 'Display a custom maintenance page to visitors while you update your site.',
		),
		'comingsoon'   => array(
			'label'       => 'Coming Soon',
			'enable'      => true,
			'path'        => 'comingsoon',
			'description' => 'Show a beautiful coming soon page to build anticipation before your site launch.',
		),
	)
);

<?php
/**
 * Initialize plugin constants
 *
 * @package Versatile\Core
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

define( 'VERSATILE_VERSION', '1.0.0' );
define( 'VERSATILE_PLUGIN_NAME', 'versatile' );
define( 'VERSATILE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'VERSATILE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'VERSATILE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

define( 'VERSATILE_REDIRECT_URI', admin_url( 'admin.php?page=versatile' ) );

define( 'VERSATILE_DISABLE_PLUGIN_LIST', 'versatile_disable_plugin_list' );

define( 'VERSATILE_MOOD_LIST', 'versatile_mood_list' );

// Define default mood info structure
define(
	'VERSATILE_DEFAULT_MOOD_LIST',
	array(
		'enable_troubleshoot' => false,
		'enable_maintenance'  => false,
		'enable_comingsoon'   => false,
		'maintenance'         => array(
			'title'                 => '',
			'subtitle'              => '',
			'description'           => '',
			'template'              => 'default',
			'background_image'      => '',
			'background_image_id'   => 0,
			'logo'                  => '',
			'logo_id'               => 0,
			'show_subscribers_only' => false,
			'style'                 => array(
				'bg_image' => '',
				'bg_color' => '#ffffff',
				'opacity'  => 1,
			),
		),
		'comingsoon'          => array(
			'title'                 => '',
			'subtitle'              => '',
			'description'           => '',
			'template'              => 'default',
			'background_image'      => '',
			'background_image_id'   => 0,
			'logo'                  => '',
			'logo_id'               => 0,
			'show_subscribers_only' => false,
			'style'                 => array(
				'bg_image' => '',
				'bg_color' => '#ffffff',
				'opacity'  => 1,
			),
		),
	)
);

define( 'VERSATILE_SERVICE_LIST', 'versatile_service_list' );
define(
	'VERSATILE_DEFAULT_SERVICE_LIST',
	array(
		'troubleshoot'      => array(
			'label'       => 'Troubleshoot',
			'enable'      => true,
			'path'        => 'troubleshoot',
			'description' => 'Diagnose and fix common WordPress issues, plugin conflicts, and performance problems.',
			// 'description' => 'Diagnose and fix common WordPress issues, plugin conflicts, and performance problems.',
		),
		'maintenance'       => array(
			'label'       => 'Maintenance Mode',
			'enable'      => true,
			'path'        => 'maintenance',
			'description' => 'Display a custom maintenance page to visitors while you update your site.',
		),
		'comingsoon'        => array(
			'label'       => 'Coming Soon',
			'enable'      => true,
			'path'        => 'comingsoon',
			'description' => 'Show a beautiful coming soon page to build anticipation before your site launch.',
		),
		'template_designer' => array(
			'label'       => 'Template Designer',
			'enable'      => true,
			'path'        => 'template-designer',
			'description' => 'Create and customize maintenance and coming soon page templates with a visual drag-and-drop editor.',
		),
	)
);

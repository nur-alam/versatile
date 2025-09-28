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
define( 'VERSATILE_PLUGIN_NAME', 'versatile-toolkit' );
define( 'VERSATILE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'VERSATILE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'VERSATILE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Define mu-plugins directory path - compatible with all WordPress setups
if ( ! defined( 'VERSATILE_MU_PLUGIN_DIR' ) ) {
	$upload_dir  = wp_get_upload_dir();
	$content_dir = dirname( $upload_dir['basedir'] );
	define( 'VERSATILE_MU_PLUGIN_DIR', $content_dir . '/mu-plugins' );
}

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
			'title'                 => 'We&rsquo;ll be back soon!',
			'subtitle'              => 'Our site is currently undergoing scheduled maintenance.',
			'description'           => 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.',
			'template'              => 'classic',
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
			'title'                 => 'Coming Soon!',
			'subtitle'              => 'We&rsquo;re working on something amazing.',
			'description'           => 'Stay tuned for our exciting launch. Something great is coming your way!',
			'template'              => 'classic',
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
		'troubleshoot' => array(
			'label'       => 'Troubleshoot',
			'enable'      => true,
			'path'        => 'troubleshoot',
			'description' => 'Disable plugin by IP specific, plugin conflicts, and view debug logs.',
			'menus'       => array(
				'troubleshoot' => array(
					'slug'   => '',
					'label'  => 'Deactivate Plugins',
					'parent' => 'troubleshoot',
					'icon'   => 'dashicons-admin-tools',
				),
				'debug'        => array(
					'slug'   => 'debug-log',
					'label'  => 'Debug Log',
					'parent' => 'troubleshoot',
					'icon'   => 'dashicons-admin-tools',
				),
			),
			'icon'        => 'dashicons-admin-tools',
		),
		'templogin'    => array(
			'label'       => 'Temporary Login',
			'enable'      => true,
			'path'        => 'templogin',
			'description' => 'Create and manage temporary login access for users without sharing permanent credentials.',
			'icon'        => 'dashicons-admin-users',
		),
		'maintenance'  => array(
			'label'       => 'Maintenance Mode',
			'enable'      => true,
			'path'        => 'maintenance',
			'description' => 'Display a custom maintenance page to visitors while you update your site.',
			'icon'        => 'dashicons-admin-tools',
		),
		'comingsoon'   => array(
			'label'       => 'Coming Soon',
			'enable'      => true,
			'path'        => 'comingsoon',
			'description' => 'Show a beautiful coming soon page to build anticipation before your site launch.',
			'icon'        => 'dashicons-admin-tools',
		),
	)
);

define( 'VERSATILE_DEFAULT_COMINGSOON_TEMPLATE', 'classic' );
define( 'VERSATILE_DEFAULT_MAINTENANCE_TEMPLATE', 'classic' );

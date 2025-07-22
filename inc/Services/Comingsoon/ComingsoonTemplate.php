<?php
/**
 * Comingsoon Template
 *
 * @package Versatile
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );

if ( ! empty( $versatile_mood_info ) ) {
	$versatile_comingsoon_mood_info = $versatile_mood_info['comingsoon'];
}

$template_title   = esc_html( $versatile_comingsoon_mood_info['title'] ?? 'We&rsquo;ll be back soon!' );
$subtitle         = esc_html( $versatile_comingsoon_mood_info['subtitle'] ?? 'Our site is currently undergoing scheduled comingsoon.' );
$description      = esc_html( $versatile_comingsoon_mood_info['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );
$background_image = esc_url( $versatile_comingsoon_mood_info['background_image'] ?? '' );
$logo             = esc_url( $versatile_comingsoon_mood_info['logo'] ?? '' );
$template         = $versatile_comingsoon_mood_info['template'] ?? 'classic';

// Load the selected template
$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/' . $template . '.php';
if ( file_exists( $template_file ) ) {
	include $template_file;
} else {
	// Fallback to classic template
	include VERSATILE_PLUGIN_DIR . 'inc/Services/Comingsoon/Templates/classic.php';
}

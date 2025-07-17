<?php
/**
 * Maintenance Mode Template
 *
 * @package Tukitaki
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tukitaki_mood_info = get_option( TUKITAKI_MOOD_LIST, TUKITAKI_DEFAULT_MOOD_LIST );

if ( ! empty( $tukitaki_mood_info ) ) {
	$tukitaki_comingsoon_mood_info = $tukitaki_mood_info['comingsoon'];
}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Site Under comingsoon</title>
	<style>
		body { 
			font-family: Arial, sans-serif; 
			text-align: center; 
			padding: 50px; 
			background: #f1f1f1;
		}
		h1 { color: #e74c3c; }
	</style>
</head>
<body>
	<h2>🚧
		<?php echo esc_html( $tukitaki_comingsoon_mood_info['title'] ?? 'Juicy' ); ?>
	</h2>
	<p>
		<!-- We're performing scheduled comingsoon. Please check back later. -->
		<?php echo esc_html( $tukitaki_comingsoon_mood_info['title'] ?? '' ); ?>
	</p>
	<p><small>
		<!-- Expected completion: July 10, 2025, 12:00 PM UTC -->
		<?php echo esc_html( $tukitaki_comingsoon_mood_info['description'] ?? '' ); ?>
	</small></p>
</body>
</html>
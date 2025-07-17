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

$tukitaki_mood_info = get_option( TUKITAKI_MOOD_KEY, TUKITAKI_DEFAULT_MOOD_INFO );

if ( ! empty( $tukitaki_mood_info ) ) {
	$tukitaki_maintenance_mood_info = $tukitaki_mood_info['maintenance'];
}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Site Under Maintenance</title>
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
		<?php echo esc_html( $tukitaki_maintenance_mood_info['title'] ?? '' ); ?>
	</h2>
	<p>
		<!-- We're performing scheduled maintenance. Please check back later. -->
		<?php echo esc_html( $tukitaki_maintenance_mood_info['title'] ?? '' ); ?>
	</p>
	<p><small>
		<!-- Expected completion: July 10, 2025, 12:00 PM UTC -->
		<?php echo esc_html( $tukitaki_maintenance_mood_info['description'] ?? '' ); ?>
	</small></p>
</body>
</html>
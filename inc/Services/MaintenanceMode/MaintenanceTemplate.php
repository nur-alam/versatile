<?php
/**
 * Maintenance Mode Template
 *
 * @package Versatile
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );

if ( ! empty( $versatile_mood_info ) ) {
	$versatile_maintenance_mood_info = $versatile_mood_info['maintenance'];
}

$title = esc_html( $versatile_maintenance_mood_info['title'] ?? 'We&rsquo;ll be back soon!' );
$subtitle = esc_html( $versatile_maintenance_mood_info['subtitle'] ?? 'Our site is currently undergoing scheduled maintenance.' );
$description = esc_html( $versatile_maintenance_mood_info['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title; ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		:root {
			--primary-color: #4F46E5;
			--secondary-color: #6366F1;
			--text-color: #333;
			--bg-color: #f9fafb;
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			background-color: var(--bg-color);
			color: var(--text-color);
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
			padding: 20px;
		}

		.container {
			text-align: center;
			max-width: 600px;
			background: #fff;
			padding: 40px;
			border-radius: 12px;
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
		}

		.logo {
			margin-bottom: 30px;
		}

		svg {
			width: 80px;
			height: 80px;
		}

		h1 {
			font-size: 2rem;
			margin-bottom: 10px;
			color: var(--primary-color);
		}

		p {
			font-size: 1rem;
			margin-top: 10px;
			color: #555;
		}

		small {
			font-size: 0.875rem;
			color: #888;
		}

		@media (max-width: 480px) {
			h1 {
				font-size: 1.5rem;
			}
			p, small {
				font-size: 0.95rem;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<!-- <div class="logo">
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
				<path d="M10 20 L50 90 L90 20" stroke="#4F46E5" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div> -->
		<h2>🚧 <?php echo $title; ?></h2>
		<p><?php echo $subtitle; ?></p>
		<p><small><?php echo $description; ?></small></p>
	</div>
</body>
</html>
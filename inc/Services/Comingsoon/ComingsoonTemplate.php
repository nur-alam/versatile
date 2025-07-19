<?php
/**
 * Coming Soon Mode Template
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

$title = $versatile_comingsoon_mood_info['title'] ?? 'Coming Soon';
$subtitle = $versatile_comingsoon_mood_info['subtitle'] ?? 'We’re preparing something awesome';
$description = $versatile_comingsoon_mood_info['description'] ?? 'Our site is under construction. Stay tuned!';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo esc_html( $title ); ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<style>
		:root {
			--primary: #4f46e5;
			--bg: #f9fafb;
			--text: #111827;
			--subtext: #6b7280;
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			background: var(--bg);
			color: var(--text);
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			padding: 2rem;
		}

		.container {
			max-width: 600px;
			background: #fff;
			padding: 3rem;
			border-radius: 1rem;
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
		}

		svg {
			width: 80px;
			height: 80px;
			fill: var(--primary);
			margin-bottom: 1.5rem;
		}

		h1 {
			font-size: 2.25rem;
			margin-bottom: 0.75rem;
		}

		p.subtitle {
			color: var(--primary);
			font-size: 1.125rem;
			margin-bottom: 1rem;
		}

		p.description {
			color: var(--subtext);
			font-size: 1rem;
		}

		@media (max-width: 500px) {
			.container {
				padding: 2rem;
			}

			h1 {
				font-size: 1.75rem;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
			<path d="M32 0a32 32 0 1032 32A32.036 32.036 0 0032 0zm0 58A26 26 0 1158 32 26.029 26.029 0 0132 58z"/>
			<path d="M31 16h2v20h-2zM31 40h2v4h-2z"/>
		</svg> -->
		<h1><?php echo esc_html( $title ); ?></h1>
		<p class="subtitle"><?php echo esc_html( $subtitle ); ?></p>
		<p class="description"><?php echo esc_html( $description ); ?></p>
	</div>
</body>
</html>
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

$title = esc_html( $versatile_comingsoon_mood_info['title'] ?? 'Coming Soon' );
$subtitle = esc_html( $versatile_comingsoon_mood_info['subtitle'] ?? 'We\'re preparing something awesome' );
$description = esc_html( $versatile_comingsoon_mood_info['description'] ?? 'Our site is under construction. Stay tuned!' );
$background_image = esc_url( $versatile_comingsoon_mood_info['background_image'] ?? '' );
$logo = esc_url( $versatile_comingsoon_mood_info['logo'] ?? '' );
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title; ?></title>
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
			<?php if ( $background_image ) : ?>
			background-image: url('<?php echo $background_image; ?>');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			<?php endif; ?>
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
			background: <?php echo $background_image ? 'rgba(255, 255, 255, 0.95)' : '#fff'; ?>;
			padding: 3rem;
			border-radius: 1rem;
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
			backdrop-filter: <?php echo $background_image ? 'blur(10px)' : 'none'; ?>;
		}

		.logo {
			margin-bottom: 1.5rem;
		}

		.logo img {
			max-width: 200px;
			max-height: 80px;
			width: auto;
			height: auto;
		}

		svg {
			width: 80px;
			height: 80px;
			fill: var(--primary);
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
		<?php if ( $logo ) : ?>
		<div class="logo">
			<img src="<?php echo $logo; ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
		</div>
		<?php else : ?>
		<div class="logo">
			<svg width="116" height="116" viewBox="0 0 116 116" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.7984 29.1999C22.7513 29.1999 29.1984 22.7528 29.1984 14.7999C29.1984 6.847 22.7513 0.399902 14.7984 0.399902C6.84554 0.399902 0.398438 6.847 0.398438 14.7999C0.398438 22.7528 6.84554 29.1999 14.7984 29.1999Z" fill="#9CA3AF"/>
				<path d="M101.197 29.1999C109.15 29.1999 115.597 22.7528 115.597 14.7999C115.597 6.847 109.15 0.399902 101.197 0.399902C93.244 0.399902 86.7969 6.847 86.7969 14.7999C86.7969 22.7528 93.244 29.1999 101.197 29.1999Z" fill="#9CA3AF"/>
				<path d="M14.7984 115.6C22.7513 115.6 29.1984 109.153 29.1984 101.2C29.1984 93.2469 22.7513 86.7998 14.7984 86.7998C6.84554 86.7998 0.398438 93.2469 0.398438 101.2C0.398438 109.153 6.84554 115.6 14.7984 115.6Z" fill="#9CA3AF"/>
				<path d="M101.197 115.6C109.15 115.6 115.597 109.153 115.597 101.2C115.597 93.2469 109.15 86.7998 101.197 86.7998C93.244 86.7998 86.7969 93.2469 86.7969 101.2C86.7969 109.153 93.244 115.6 101.197 115.6Z" fill="#9CA3AF"/>
				<path d="M57.9984 79.5999C69.9278 79.5999 79.5984 69.9293 79.5984 57.9999C79.5984 46.0706 69.9278 36.3999 57.9984 36.3999C46.0691 36.3999 36.3984 46.0706 36.3984 57.9999C36.3984 69.9293 46.0691 79.5999 57.9984 79.5999Z" fill="#374151"/>
				<path d="M29.1953 29.2L43.5953 43.6" stroke="#6374BB" stroke-width="1.5"/>
				<path d="M86.7984 29.2L72.3984 43.6" stroke="#6374BB" stroke-width="1.5"/>
				<path d="M29.1953 86.7999L43.5953 72.3999" stroke="#6374BB" stroke-width="1.5"/>
				<path d="M86.7984 86.7999L72.3984 72.3999" stroke="#6374BB" stroke-width="1.5"/>
			</svg>
		</div>
		<?php endif; ?>
		<h1><?php echo $title; ?></h1>
		<p class="subtitle"><?php echo $subtitle; ?></p>
		<p class="description"><?php echo $description; ?></p>
	</div>
</body>
</html>
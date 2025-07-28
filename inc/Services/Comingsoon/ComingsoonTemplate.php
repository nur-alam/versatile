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

$template_title   = esc_html( $versatile_comingsoon_mood_info['title'] ?? 'We&rsquo;ll be back soon!' );
$subtitle         = esc_html( $versatile_comingsoon_mood_info['subtitle'] ?? 'We\'re preparing something awesome' );
$description      = esc_html( $versatile_comingsoon_mood_info['description'] ?? 'Our site is under construction. Stay tuned!' );
$background_image = esc_url( $versatile_comingsoon_mood_info['background_image'] ?? '' );
$logo             = esc_url( $versatile_comingsoon_mood_info['logo'] ?? '' );
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo esc_html( $template_title ); ?></title>
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
			background-image: url('<?php echo esc_url( $background_image ); ?>');
			background-size: contain;
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
			<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
		</div>
		<?php else : ?>
		<div class="logo">
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
				<path d="M10 20 L50 90 L90 20" stroke="#4F46E5" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		<?php endif; ?>
		<h2><?php echo esc_html( $template_title ); ?></h2>
		<p><?php echo esc_html( $subtitle ); ?></p>
		<p><small><?php echo esc_html( $description ); ?></small></p>
	</div>
</body>
</html>
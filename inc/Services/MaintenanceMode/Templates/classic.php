<?php
/**
 * Classic Maintenance Template
 *
 * @package Versatile
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo esc_html( $template_title ); ?></title>
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
			<?php if ( $background_image ) : ?>
			background-image: url('<?php echo esc_url( $background_image ); ?>');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			<?php endif; ?>
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
			padding: 20px;
		}

		.container {
			text-align: center;
			max-width: 600px;
			background: <?php echo $background_image ? 'rgba(255, 255, 255, 0.95)' : '#fff'; ?>;
			padding: 40px;
			border-radius: 12px;
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
			backdrop-filter: <?php echo $background_image ? 'blur(10px)' : 'none'; ?>;
		}

		.logo {
			margin-bottom: 30px;
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
		<h2><?php echo esc_html( $title ); ?></h2>
		<p><?php echo esc_html( $subtitle ); ?></p>
		<p><small><?php echo esc_html( $description ); ?></small></p>
	</div>
</body>
</html>
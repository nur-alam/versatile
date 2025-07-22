<?php
/**
 * Minimal Maintenance Template
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
		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: #ffffff;
			<?php if ( $background_image ) : ?>
			background-image: url('<?php echo esc_url( $background_image ); ?>');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			<?php endif; ?>
			color: #1a1a1a;
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
			padding: 40px 20px;
			line-height: 1.6;
		}

		.container {
			text-align: center;
			max-width: 500px;
			<?php if ( $background_image ) : ?>
			background: rgba(255, 255, 255, 0.95);
			padding: 60px 40px;
			border-radius: 8px;
			backdrop-filter: blur(10px);
			<?php endif; ?>
		}

		.logo {
			margin-bottom: 50px;
		}

		.logo img {
			max-width: 180px;
			max-height: 60px;
			width: auto;
			height: auto;
		}

		.icon {
			width: 60px;
			height: 60px;
			margin: 0 auto 50px;
			opacity: 0.6;
		}

		svg {
			width: 100%;
			height: 100%;
			stroke: #1a1a1a;
		}

		h1 {
			font-size: 2.5rem;
			margin-bottom: 20px;
			font-weight: 300;
			letter-spacing: -0.02em;
			color: #1a1a1a;
		}

		.subtitle {
			font-size: 1.1rem;
			margin-bottom: 30px;
			color: #666;
			font-weight: 400;
		}

		.description {
			font-size: 0.95rem;
			color: #888;
			font-weight: 300;
			max-width: 400px;
			margin: 0 auto;
		}

		.divider {
			width: 60px;
			height: 1px;
			background: #e0e0e0;
			margin: 40px auto 30px;
		}

		@media (max-width: 768px) {
			.container {
				<?php if ( $background_image ) : ?>
				padding: 40px 30px;
				<?php endif; ?>
			}
			
			h1 {
				font-size: 2rem;
			}
			
			.subtitle {
				font-size: 1rem;
			}
		}

		@media (max-width: 480px) {
			body {
				padding: 20px;
			}
			
			h1 {
				font-size: 1.75rem;
			}
			
			.subtitle {
				font-size: 0.95rem;
			}
			
			.description {
				font-size: 0.9rem;
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
		<div class="icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<circle cx="12" cy="12" r="10"/>
				<path d="M12 6v6l4 2"/>
			</svg>
		</div>
		<?php endif; ?>
		
		<h1><?php echo esc_html( $template_title ); ?></h1>
		<p class="subtitle"><?php echo esc_html( $subtitle ); ?></p>
		
		<div class="divider"></div>
		<p class="description"><?php echo wp_kses_post( $description ); ?></p>
	</div>
</body>
</html>
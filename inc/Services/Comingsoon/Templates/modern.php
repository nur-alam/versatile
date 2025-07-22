<?php
/**
 * Modern Maintenance Template
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
			font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			<?php if ( $background_image ) : ?>
			background-image: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url('<?php echo $background_image; ?>');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			<?php endif; ?>
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
			padding: 20px;
		}

		.container {
			text-align: center;
			max-width: 700px;
			background: rgba(255, 255, 255, 0.1);
			padding: 60px 40px;
			border-radius: 20px;
			backdrop-filter: blur(20px);
			border: 1px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		}

		.logo {
			margin-bottom: 40px;
		}

		.logo img {
			max-width: 250px;
			max-height: 100px;
			width: auto;
			height: auto;
			filter: brightness(0) invert(1);
		}

		.icon {
			width: 100px;
			height: 100px;
			margin: 0 auto 40px;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			animation: pulse 2s infinite;
		}

		@keyframes pulse {
			0% { transform: scale(1); }
			50% { transform: scale(1.05); }
			100% { transform: scale(1); }
		}

		svg {
			width: 50px;
			height: 50px;
			stroke: white;
		}

		h1 {
			font-size: 3rem;
			margin-bottom: 20px;
			font-weight: 700;
			background: linear-gradient(45deg, #fff, #f0f0f0);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		.subtitle {
			font-size: 1.25rem;
			margin-bottom: 20px;
			opacity: 0.9;
			font-weight: 500;
		}

		.description {
			font-size: 1rem;
			opacity: 0.8;
			line-height: 1.6;
			max-width: 500px;
			margin: 0 auto;
		}

		.progress-bar {
			width: 100%;
			height: 4px;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 2px;
			margin-top: 40px;
			overflow: hidden;
		}

		.progress-fill {
			height: 100%;
			background: linear-gradient(90deg, #fff, #f0f0f0);
			border-radius: 2px;
			animation: loading 3s ease-in-out infinite;
		}

		@keyframes loading {
			0% { width: 0%; }
			50% { width: 70%; }
			100% { width: 100%; }
		}

		@media (max-width: 768px) {
			.container {
				padding: 40px 30px;
			}
			
			h1 {
				font-size: 2.5rem;
			}
			
			.subtitle {
				font-size: 1.1rem;
			}
		}

		@media (max-width: 480px) {
			h1 {
				font-size: 2rem;
			}
			
			.subtitle {
				font-size: 1rem;
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
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 2L2 7l10 5 10-5-10-5z"/>
				<path d="M2 17l10 5 10-5"/>
				<path d="M2 12l10 5 10-5"/>
			</svg>
		</div>
		<?php endif; ?>
		
		<h1><?php echo esc_html( $template_title ); ?></h1>
		<p class="subtitle"><?php echo esc_html( $subtitle ); ?></p>
		<p class="description"><?php echo esc_html( $description ); ?></p>
		
		<div class="progress-bar">
			<div class="progress-fill"></div>
		</div>
	</div>
</body>
</html>
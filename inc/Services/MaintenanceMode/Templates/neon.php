<?php
/**
 * Neon Maintenance Template
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
	<!-- <?php wp_enqueue_style( 'versatile-maintenance-style' ); ?>
	<?php wp_head(); ?> -->
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family: 'Orbitron', monospace;
			background: #0a0a0a;
			color: #00ffff;
			<?php if ( $background_image ) : ?>
			background-image: linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.8)), url('<?php echo esc_url( $background_image ); ?>');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			<?php endif; ?>
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
			padding: 20px;
			overflow: hidden;
			position: relative;
		}

		/* Animated grid background */
		.grid-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: 
				linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
				linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
			background-size: 50px 50px;
			animation: grid-move 20s linear infinite;
			z-index: 1;
		}

		@keyframes grid-move {
			0% { transform: translate(0, 0); }
			100% { transform: translate(50px, 50px); }
		}

		/* Neon scanlines */
		.scanlines {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(
				transparent 50%, 
				rgba(0, 255, 255, 0.03) 50%
			);
			background-size: 100% 4px;
			animation: scanlines 0.1s linear infinite;
			z-index: 2;
		}

		@keyframes scanlines {
			0% { background-position: 0 0; }
			100% { background-position: 0 4px; }
		}

		.container {
			text-align: center;
			max-width: 900px;
			position: relative;
			z-index: 3;
			background: rgba(0, 0, 0, 0.8);
			padding: 80px 60px;
			border: 2px solid #00ffff;
			border-radius: 10px;
			box-shadow: 
				0 0 20px #00ffff,
				inset 0 0 20px rgba(0, 255, 255, 0.1);
		}

		.logo {
			margin-bottom: 50px;
		}

		.logo img {
			max-width: 300px;
			max-height: 120px;
			width: auto;
			height: auto;
			filter: brightness(0) invert(1);
			filter: hue-rotate(180deg) saturate(2) brightness(1.5);
		}

		.neon-icon {
			width: 120px;
			height: 120px;
			margin: 0 auto 50px;
			border: 3px solid #00ffff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 
				0 0 30px #00ffff,
				inset 0 0 30px rgba(0, 255, 255, 0.2);
			animation: neon-pulse 2s ease-in-out infinite alternate;
		}

		@keyframes neon-pulse {
			from { 
				box-shadow: 
					0 0 30px #00ffff,
					inset 0 0 30px rgba(0, 255, 255, 0.2);
			}
			to { 
				box-shadow: 
					0 0 50px #00ffff,
					0 0 80px #00ffff,
					inset 0 0 50px rgba(0, 255, 255, 0.4);
			}
		}

		svg {
			width: 60px;
			height: 60px;
			stroke: #00ffff;
			filter: drop-shadow(0 0 10px #00ffff);
		}

		h1 {
			font-size: 4rem;
			margin-bottom: 30px;
			font-weight: 900;
			color: #00ffff;
			text-shadow: 
				0 0 10px #00ffff,
				0 0 20px #00ffff,
				0 0 40px #00ffff;
			animation: text-flicker 3s ease-in-out infinite alternate;
			letter-spacing: 3px;
		}

		@keyframes text-flicker {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.8; }
		}

		.subtitle {
			font-size: 1.4rem;
			margin-bottom: 40px;
			color: #ff00ff;
			font-weight: 400;
			text-shadow: 
				0 0 10px #ff00ff,
				0 0 20px #ff00ff;
			letter-spacing: 2px;
		}

		.description {
			font-size: 1.1rem;
			color: #ffffff;
			line-height: 1.8;
			max-width: 700px;
			margin: 0 auto 50px;
			text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
		}

		.status-bar {
			margin-top: 50px;
			padding: 20px;
			background: rgba(0, 255, 255, 0.1);
			border: 1px solid #00ffff;
			border-radius: 5px;
			font-family: 'Courier New', monospace;
		}

		.status-text {
			color: #00ff00;
			font-size: 0.9rem;
			text-shadow: 0 0 5px #00ff00;
		}

		.loading-bar {
			width: 100%;
			height: 6px;
			background: rgba(0, 255, 255, 0.2);
			border-radius: 3px;
			margin-top: 15px;
			overflow: hidden;
		}

		.loading-progress {
			height: 100%;
			background: linear-gradient(90deg, #00ffff, #ff00ff, #00ffff);
			border-radius: 3px;
			animation: loading-scan 2s ease-in-out infinite;
			box-shadow: 0 0 10px #00ffff;
		}

		@keyframes loading-scan {
			0% { width: 0%; }
			50% { width: 100%; }
			100% { width: 0%; }
		}

		@media (max-width: 768px) {
			.container {
				padding: 60px 40px;
				margin: 20px;
			}
			
			h1 {
				font-size: 3rem;
				letter-spacing: 2px;
			}
			
			.subtitle {
				font-size: 1.2rem;
				letter-spacing: 1px;
			}
		}

		@media (max-width: 480px) {
			.container {
				padding: 40px 30px;
			}
			
			h1 {
				font-size: 2.5rem;
				letter-spacing: 1px;
			}
			
			.subtitle {
				font-size: 1.1rem;
			}
			
			.description {
				font-size: 1rem;
			}
		}
	</style>
</head>
<body>
	<div class="grid-bg"></div>
	<div class="scanlines"></div>

	<div class="container">
		<?php if ( $logo ) : ?>
		<div class="logo">
			<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
		</div>
		<?php else : ?>
		<div class="neon-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
			</svg>
		</div>
		<?php endif; ?>
		
		<h1><?php echo esc_html( $template_title ); ?></h1>
		<p class="subtitle"><?php echo esc_html( $subtitle ); ?></p>
		<p class="description"><?php echo esc_html( $description ); ?></p>
		
		<div class="status-bar">
			<div class="status-text">SYSTEM STATUS: MAINTENANCE MODE ACTIVE</div>
			<div class="loading-bar">
				<div class="loading-progress"></div>
			</div>
		</div>
	</div>
</body>
</html>
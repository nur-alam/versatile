<?php
/**
 * Creative Maintenance Template
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
	<!-- <?php wp_enqueue_style( 'versatile-comingsoon-style' ); ?>
	<?php wp_head(); ?> -->
	<style>
		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		body {
			font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
			background: #0f0f23;
			<?php if ( $background_image ) : ?>
			background-image: linear-gradient(rgba(15, 15, 35, 0.8), rgba(15, 15, 35, 0.8)), url('<?php echo esc_url( $background_image ); ?>');
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
			overflow: hidden;
			position: relative;
		}

		/* Animated background particles */
		.particles {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			z-index: 1;
		}

		.particle {
			position: absolute;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 50%;
			animation: float 6s ease-in-out infinite;
		}

		.particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
		.particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 1s; }
		.particle:nth-child(3) { width: 3px; height: 3px; left: 30%; animation-delay: 2s; }
		.particle:nth-child(4) { width: 5px; height: 5px; left: 40%; animation-delay: 3s; }
		.particle:nth-child(5) { width: 4px; height: 4px; left: 50%; animation-delay: 4s; }
		.particle:nth-child(6) { width: 6px; height: 6px; left: 60%; animation-delay: 5s; }
		.particle:nth-child(7) { width: 3px; height: 3px; left: 70%; animation-delay: 0.5s; }
		.particle:nth-child(8) { width: 5px; height: 5px; left: 80%; animation-delay: 1.5s; }
		.particle:nth-child(9) { width: 4px; height: 4px; left: 90%; animation-delay: 2.5s; }

		@keyframes float {
			0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
			10% { opacity: 1; }
			90% { opacity: 1; }
			100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
		}

		.container {
			text-align: center;
			max-width: 800px;
			position: relative;
			z-index: 2;
			background: rgba(255, 255, 255, 0.05);
			padding: 80px 60px;
			border-radius: 30px;
			backdrop-filter: blur(20px);
			border: 1px solid rgba(255, 255, 255, 0.1);
			box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
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
		}

		.icon-container {
			margin-bottom: 50px;
			position: relative;
		}

		.rotating-border {
			width: 120px;
			height: 120px;
			margin: 0 auto;
			border: 2px solid transparent;
			border-radius: 50%;
			background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7) border-box;
			animation: rotate 4s linear infinite;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.icon {
			width: 100px;
			height: 100px;
			background: #0f0f23;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		@keyframes rotate {
			from { transform: rotate(0deg); }
			to { transform: rotate(360deg); }
		}

		svg {
			width: 50px;
			height: 50px;
			stroke: #4ecdc4;
		}

		h1 {
			font-size: 3.5rem;
			margin-bottom: 25px;
			font-weight: 700;
			background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			animation: glow 2s ease-in-out infinite alternate;
		}

		@keyframes glow {
			from { filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.3)); }
			to { filter: drop-shadow(0 0 30px rgba(78, 205, 196, 0.6)); }
		}

		.subtitle {
			font-size: 1.4rem;
			margin-bottom: 30px;
			color: #4ecdc4;
			font-weight: 500;
			opacity: 0.9;
		}

		.description {
			font-size: 1.1rem;
			color: rgba(255, 255, 255, 0.8);
			line-height: 1.8;
			max-width: 600px;
			margin: 0 auto 40px;
		}

		.status-indicator {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			margin-top: 40px;
		}

		.status-dot {
			width: 12px;
			height: 12px;
			background: #4ecdc4;
			border-radius: 50%;
			animation: pulse-dot 1.5s ease-in-out infinite;
		}

		@keyframes pulse-dot {
			0%, 100% { opacity: 1; transform: scale(1); }
			50% { opacity: 0.5; transform: scale(0.8); }
		}

		.status-text {
			color: #4ecdc4;
			font-size: 0.9rem;
			font-weight: 500;
		}

		@media (max-width: 768px) {
			.container {
				padding: 60px 40px;
				border-radius: 20px;
			}
			
			h1 {
				font-size: 2.8rem;
			}
			
			.subtitle {
				font-size: 1.2rem;
			}
			
			.rotating-border {
				width: 100px;
				height: 100px;
			}
			
			.icon {
				width: 80px;
				height: 80px;
			}
		}

		@media (max-width: 480px) {
			.container {
				padding: 40px 30px;
			}
			
			h1 {
				font-size: 2.2rem;
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
	<div class="particles">
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
	</div>

	<div class="container">
		<?php if ( $logo ) : ?>
		<div class="logo">
			<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
		</div>
		<?php else : ?>
		<div class="icon-container">
			<div class="rotating-border">
				<div class="icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 2L2 7l10 5 10-5-10-5z"/>
						<path d="M2 17l10 5 10-5"/>
						<path d="M2 12l10 5 10-5"/>
					</svg>
				</div>
			</div>
		</div>
		<?php endif; ?>
		
		<h1><?php echo esc_html( $template_title ); ?></h1>
		<p class="subtitle"><?php echo esc_html( $subtitle ); ?></p>
		<p class="description"><?php echo esc_html( $description ); ?></p>
		
		<div class="status-indicator">
			<div class="status-dot"></div>
			<span class="status-text">Working on something amazing...</span>
		</div>
	</div>
</body>
</html>
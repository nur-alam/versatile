<?php
/**
 * Corporate Maintenance Template
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
			font-family: 'Georgia', 'Times New Roman', serif;
			background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
			<?php if ( $background_image ) : ?>
			background-image: linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.9) 100%), url('<?php echo esc_url( $background_image ); ?>');
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			<?php endif; ?>
			color: #ffffff;
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 100vh;
			padding: 40px 20px;
		}

		.container {
			text-align: center;
			max-width: 800px;
			background: rgba(255, 255, 255, 0.1);
			padding: 80px 60px;
			border-radius: 15px;
			backdrop-filter: blur(15px);
			border: 2px solid rgba(255, 255, 255, 0.2);
			box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
			position: relative;
		}

		.container::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 4px;
			background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
			border-radius: 15px 15px 0 0;
		}

		.logo {
			margin-bottom: 50px;
		}

		.logo img {
			max-width: 280px;
			max-height: 100px;
			width: auto;
			height: auto;
			filter: brightness(0) invert(1);
		}

		.company-icon {
			width: 100px;
			height: 100px;
			margin: 0 auto 50px;
			background: rgba(255, 215, 0, 0.2);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 3px solid rgba(255, 215, 0, 0.3);
		}

		svg {
			width: 50px;
			height: 50px;
			stroke: #ffd700;
		}

		h1 {
			font-size: 3.2rem;
			margin-bottom: 25px;
			font-weight: 400;
			letter-spacing: 2px;
			color: #ffffff;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
		}

		.subtitle {
			font-size: 1.3rem;
			margin-bottom: 35px;
			color: #ffd700;
			font-weight: 300;
			font-style: italic;
			letter-spacing: 1px;
		}

		.description {
			font-size: 1.1rem;
			color: rgba(255, 255, 255, 0.9);
			line-height: 1.8;
			max-width: 600px;
			margin: 0 auto 50px;
			font-weight: 300;
		}

		.divider {
			width: 100px;
			height: 2px;
			background: linear-gradient(90deg, transparent, #ffd700, transparent);
			margin: 40px auto;
		}

		.contact-info {
			margin-top: 50px;
			padding-top: 30px;
			border-top: 1px solid rgba(255, 255, 255, 0.2);
		}

		.contact-text {
			font-size: 0.95rem;
			color: rgba(255, 255, 255, 0.8);
			font-style: italic;
		}

		.professional-badge {
			position: absolute;
			top: 20px;
			right: 20px;
			background: rgba(255, 215, 0, 0.2);
			padding: 8px 16px;
			border-radius: 20px;
			font-size: 0.8rem;
			color: #ffd700;
			border: 1px solid rgba(255, 215, 0, 0.3);
		}

		@media (max-width: 768px) {
			.container {
				padding: 60px 40px;
				margin: 20px;
			}
			
			h1 {
				font-size: 2.5rem;
				letter-spacing: 1px;
			}
			
			.subtitle {
				font-size: 1.1rem;
			}
			
			.professional-badge {
				position: static;
				margin-bottom: 30px;
				display: inline-block;
			}
		}

		@media (max-width: 480px) {
			.container {
				padding: 40px 30px;
			}
			
			h1 {
				font-size: 2rem;
			}
			
			.subtitle {
				font-size: 1rem;
			}
			
			.description {
				font-size: 1rem;
			}
		}
	</style>
</head>
<body style="background-image: url('<?php echo esc_url( $background_image ); ?>');">
	<div class="container">
		<!-- <div class="professional-badge">Professional Service</div> -->
		
		<?php if ( $logo ) : ?>
		<div class="logo">
			<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" />
		</div>
		<?php else : ?>
		<div class="company-icon">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 21h18"/>
				<path d="M5 21V7l8-4v18"/>
				<path d="M19 21V11l-6-4"/>
			</svg>
		</div>
		<?php endif; ?>
		
		<h1><?php echo esc_html( $template_title ); ?></h1>
		<p class="subtitle"><?php echo esc_html( $subtitle ); ?></p>
		
		<div class="divider"></div>
		<p class="description"><?php echo esc_html( $description ); ?></p>
		
		<!-- <div class="contact-info">
			<p class="contact-text">We appreciate your patience during this maintenance period.</p>
		</div> -->
	</div>
</body>
</html>
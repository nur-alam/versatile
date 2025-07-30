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

$template_title   = esc_html( $versatile_maintenance_mood_info['title'] ?? 'We&rsquo;ll be back soon!' );
$subtitle         = esc_html( $versatile_maintenance_mood_info['subtitle'] ?? 'Our site is currently undergoing scheduled maintenance.' );
$description      = esc_html( $versatile_maintenance_mood_info['description'] ?? 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.' );
$background_image = esc_url( $versatile_maintenance_mood_info['background_image'] ?? '' );
$logo             = esc_url( $versatile_maintenance_mood_info['logo'] ?? '' );

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo esc_html( $template_title ); ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_enqueue_style( 'versatile-maintenance-style' ); ?>
	<?php wp_head(); ?>
</head>
<body style="background-image: url('<?php echo esc_url( $background_image ); ?>');">
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
<?php
/**
 * Helper class for handling cookies.
 *
 * @package Versatile\Helpers
 * @subpackage Versatile\Helpers\MoodHelper
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Mood Helper class.
 */
class MoodHelper {
	/**
	 * Get default content based on type.
	 *
	 * @param string $type The type (maintenance or comingsoon).
	 * @return array Array containing default title, subtitle, description, and template directory.
	 */
	private function get_default_content( $type ) {
		if ( 'maintenance' === $type ) {
			return array(
				'title'        => 'We&rsquo;ll be back soon!',
				'subtitle'     => 'Our site is currently undergoing scheduled maintenance.',
				'description'  => 'Thank you for your patience. We&rsquo;re working hard to bring everything back online better than ever.',
				'template_dir' => 'MaintenanceMode',
			);
		} else {
			return array(
				'title'        => 'Coming Soon!',
				'subtitle'     => 'We&rsquo;re working on something amazing.',
				'description'  => 'Stay tuned for our exciting launch. Something great is coming your way!',
				'template_dir' => 'Comingsoon',
			);
		}
	}

	/**
	 * Prepare template variables from preview data or saved data.
	 *
	 * @param array|null $preview_data Preview data from form submission.
	 * @param array      $mood_info    Saved mood info from database.
	 * @param array      $defaults     Default content array.
	 * @return array Array of template variables.
	 */
	private function prepare_template_variables( $preview_data, $mood_info, $defaults ) {
		if ( $preview_data ) {
			return array(
				'template_title'   => esc_html( $preview_data['title'] ?? $defaults['title'] ),
				'subtitle'         => esc_html( $preview_data['subtitle'] ?? $defaults['subtitle'] ),
				'description'      => esc_html( $preview_data['description'] ?? $defaults['description'] ),
				'background_image' => esc_url( $preview_data['background_image'] ?? '' ),
				'logo'             => esc_url( $preview_data['logo'] ?? '' ),
			);
		} else {
			return array(
				'template_title'   => esc_html( $mood_info['title'] ?? $defaults['title'] ),
				'subtitle'         => esc_html( $mood_info['subtitle'] ?? $defaults['subtitle'] ),
				'description'      => esc_html( $mood_info['description'] ?? $defaults['description'] ),
				'background_image' => esc_url( $mood_info['background_image'] ?? '' ),
				'logo'             => esc_url( $mood_info['logo'] ?? '' ),
			);
		}
	}

	/**
	 * Setup headers and emoji styles for template rendering
	 *
	 * @return void
	 */
	private function setup_template_headers() {
		// Set headers for HTML response
		header( 'Content-Type: text/html; charset=utf-8' );

		// Fix deprecated emoji styles function for WordPress 6.4+
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		if ( function_exists( 'wp_enqueue_emoji_styles' ) ) {
			add_action( 'wp_print_styles', 'wp_enqueue_emoji_styles' );
		}
	}

	/**
	 * Load template with fallback
	 *
	 * @param string $template_id Template ID to load.
	 * @param string $template_dir Template directory (Comingsoon or MaintenanceMode).
	 * @param array  $template_vars Template variables.
	 * @return void
	 */
	private function load_template_with_fallback( $template_id, $template_dir, $template_vars ) {

		// these variable will be available in the template file located in inc/Services/Comingsoon/Templates/* & inc/Services/MaintenanceMode/Templates/*
		// you can use them in the template file
		$template_title   = $template_vars['template_title'];
		$subtitle         = $template_vars['subtitle'];
		$description      = $template_vars['description'];
		$background_image = $template_vars['background_image'];
		$logo             = $template_vars['logo'];

		$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/' . $template_dir . '/Templates/' . $template_id . '.php';
		if ( file_exists( $template_file ) ) {
			include $template_file;
		} else {
			// Fallback to classic template in the appropriate directory
			include VERSATILE_PLUGIN_DIR . 'inc/Services/' . $template_dir . '/Templates/classic.php';
		}
	}

	/**
	 * Render template with all setup and variables
	 *
	 * @param string     $template_id Template ID.
	 * @param string     $type        Type (maintenance or comingsoon).
	 * @param array|null $preview_data Preview data.
	 * @return void
	 */
	public function render_template( $template_id, $type, $preview_data ) {

		$versatile_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
		$mood_info           = $versatile_mood_info[ $type ] ?? array();

		// Get default content based on type
		$defaults = $this->get_default_content( $type );

		// Prepare template variables
		$template_vars = $this->prepare_template_variables( $preview_data, $mood_info, $defaults );

		// Setup headers and emoji styles
		$this->setup_template_headers();

		// Load template with fallback
		$this->load_template_with_fallback( $template_id, $defaults['template_dir'], $template_vars );
	}
}

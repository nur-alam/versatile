<?php
/**
 * Preview Controller
 *
 * @package Versatile\Services\TemplateDesigner\Controllers
 * @subpackage Versatile\Services\TemplateDesigner\Controllers\PreviewController
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Controllers;

use Versatile\Services\TemplateDesigner\Models\CustomTemplate;
use Versatile\Services\TemplateDesigner\Models\TemplateElement;
use Versatile\Services\TemplateDesigner\Assets\TemplateRenderer;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * PreviewController handles template preview functionality
 */
class PreviewController {

	/**
	 * Supported preview modes
	 *
	 * @var array
	 */
	private $preview_modes = array(
		'desktop' => array( 'width' => 1200, 'height' => 800 ),
		'tablet'  => array( 'width' => 768, 'height' => 1024 ),
		'mobile'  => array( 'width' => 375, 'height' => 667 ),
	);

	/**
	 * Generate template preview
	 *
	 * @param array  $template_data Template data.
	 * @param string $mode Preview mode (maintenance/comingsoon).
	 * @param string $device_mode Device mode (desktop/tablet/mobile).
	 * @return string Generated HTML preview
	 */
	public function generate_preview( $template_data, $mode = 'maintenance', $device_mode = 'desktop' ) {
		try {
			// Validate input data
			if ( empty( $template_data ) || ! is_array( $template_data ) ) {
				return $this->generate_error_preview( 'Invalid template data provided' );
			}

			// Validate device mode
			if ( ! isset( $this->preview_modes[ $device_mode ] ) ) {
				$device_mode = 'desktop';
			}

			// Create template instance for validation
			$template = new CustomTemplate( $template_data );
			$validation = $template->validate();

			if ( ! $validation['valid'] ) {
				return $this->generate_error_preview( 'Template validation failed: ' . implode( ', ', $validation['errors'] ) );
			}

			// Get device dimensions
			$device_config = $this->preview_modes[ $device_mode ];

			// Generate preview HTML
			$html = $this->build_preview_html( $template, $mode, $device_mode, $device_config );

			return $html;

		} catch ( Exception $e ) {
			return $this->generate_error_preview( 'Preview generation failed: ' . $e->getMessage() );
		}
	}

	/**
	 * Handle live preview updates
	 *
	 * @param array $template_data Template data.
	 * @return array Preview update result
	 */
	public function handle_live_preview( $template_data ) {
		try {
			// Validate template data
			if ( empty( $template_data ) || ! is_array( $template_data ) ) {
				return array(
					'success' => false,
					'message' => 'Invalid template data provided',
					'data'    => null,
				);
			}

			// Create template instance
			$template = new CustomTemplate( $template_data );
			$validation = $template->validate();

			if ( ! $validation['valid'] ) {
				return array(
					'success' => false,
					'message' => 'Template validation failed',
					'errors'  => $validation['errors'],
					'data'    => null,
				);
			}

			// Generate preview for all device modes
			$previews = array();
			foreach ( $this->preview_modes as $device_mode => $config ) {
				$previews[ $device_mode ] = array(
					'html'   => $this->generate_preview( $template_data, 'maintenance', $device_mode ),
					'width'  => $config['width'],
					'height' => $config['height'],
				);
			}

			return array(
				'success'  => true,
				'message'  => 'Preview updated successfully',
				'data'     => array(
					'previews' => $previews,
					'timestamp' => current_time( 'timestamp' ),
				),
			);

		} catch ( Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Live preview update failed: ' . $e->getMessage(),
				'data'    => null,
			);
		}
	}

	/**
	 * Get preview modes configuration
	 *
	 * @return array Preview modes
	 */
	public function get_preview_modes() {
		return $this->preview_modes;
	}

	/**
	 * Build preview HTML structure
	 *
	 * @param CustomTemplate $template Template instance.
	 * @param string         $mode Page mode.
	 * @param string         $device_mode Device mode.
	 * @param array          $device_config Device configuration.
	 * @return string Generated HTML
	 */
	private function build_preview_html( $template, $mode, $device_mode, $device_config ) {
		$elements_html = $this->render_template_elements( $template->elements, $device_mode );
		$custom_css = $this->generate_template_css( $template, $device_mode );
		$base_css = $this->get_base_preview_css( $device_config );

		$site_title = get_bloginfo( 'name' );
		$site_description = get_bloginfo( 'description' );

		$html = '<!DOCTYPE html>
<html lang="' . get_locale() . '">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>' . esc_html( $site_title ) . ' - ' . ucfirst( $mode ) . ' Mode</title>
	<style>' . $base_css . $custom_css . '</style>
</head>
<body class="versatile-preview versatile-' . esc_attr( $mode ) . ' versatile-' . esc_attr( $device_mode ) . '">
	<div class="versatile-container">
		' . $elements_html . '
	</div>
	<script>
		// Initialize countdown timers and other dynamic elements
		document.addEventListener("DOMContentLoaded", function() {
			' . $this->get_preview_javascript() . '
		});
	</script>
</body>
</html>';

		return $html;
	}

	/**
	 * Render template elements to HTML
	 *
	 * @param array  $elements Template elements.
	 * @param string $device_mode Device mode.
	 * @return string Rendered elements HTML
	 */
	private function render_template_elements( $elements, $device_mode ) {
		if ( empty( $elements ) || ! is_array( $elements ) ) {
			return '<div class="versatile-placeholder">No elements to display</div>';
		}

		$html = '';
		foreach ( $elements as $element_data ) {
			$element = new TemplateElement( $element_data );
			$validation = $element->validate();

			if ( $validation['valid'] ) {
				$html .= $this->render_single_element( $element, $device_mode );
			} else {
				$html .= '<div class="versatile-element-error">Element validation failed: ' . implode( ', ', $validation['errors'] ) . '</div>';
			}
		}

		return $html;
	}

	/**
	 * Render single template element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param string          $device_mode Device mode.
	 * @return string Rendered element HTML
	 */
	private function render_single_element( $element, $device_mode ) {
		$element_id = 'element-' . esc_attr( $element->id );
		$element_class = 'versatile-element versatile-element-' . esc_attr( $element->type );
		
		// Apply responsive positioning and sizing
		$responsive_styles = $this->get_responsive_element_styles( $element, $device_mode );
		$element_styles = $this->convert_styles_to_css( $element->styles );
		$combined_styles = $responsive_styles . $element_styles;

		$html = '<div id="' . $element_id . '" class="' . $element_class . '" style="' . esc_attr( $combined_styles ) . '">';

		// Render element content based on type
		switch ( $element->type ) {
			case 'text':
				$html .= $this->render_text_element( $element );
				break;
			case 'heading':
				$html .= $this->render_heading_element( $element );
				break;
			case 'image':
				$html .= $this->render_image_element( $element );
				break;
			case 'button':
				$html .= $this->render_button_element( $element );
				break;
			case 'countdown':
				$html .= $this->render_countdown_element( $element );
				break;
			case 'social':
				$html .= $this->render_social_element( $element );
				break;
			case 'form':
				$html .= $this->render_form_element( $element );
				break;
			case 'progress':
				$html .= $this->render_progress_element( $element );
				break;
			case 'spacer':
				$html .= $this->render_spacer_element( $element );
				break;
			case 'divider':
				$html .= $this->render_divider_element( $element );
				break;
			default:
				$html .= '<div class="versatile-unknown-element">Unknown element type: ' . esc_html( $element->type ) . '</div>';
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * Render text element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_text_element( $element ) {
		$content = isset( $element->properties['content'] ) ? $element->properties['content'] : '';
		$styles = array();

		if ( isset( $element->properties['fontSize'] ) ) {
			$styles[] = 'font-size: ' . esc_attr( $element->properties['fontSize'] );
		}
		if ( isset( $element->properties['fontFamily'] ) ) {
			$styles[] = 'font-family: ' . esc_attr( $element->properties['fontFamily'] );
		}
		if ( isset( $element->properties['fontWeight'] ) ) {
			$styles[] = 'font-weight: ' . esc_attr( $element->properties['fontWeight'] );
		}
		if ( isset( $element->properties['color'] ) ) {
			$styles[] = 'color: ' . esc_attr( $element->properties['color'] );
		}
		if ( isset( $element->properties['textAlign'] ) ) {
			$styles[] = 'text-align: ' . esc_attr( $element->properties['textAlign'] );
		}
		if ( isset( $element->properties['lineHeight'] ) ) {
			$styles[] = 'line-height: ' . esc_attr( $element->properties['lineHeight'] );
		}

		$style_attr = ! empty( $styles ) ? ' style="' . implode( '; ', $styles ) . '"' : '';

		return '<div class="versatile-text"' . $style_attr . '>' . wp_kses_post( $content ) . '</div>';
	}

	/**
	 * Render heading element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_heading_element( $element ) {
		$content = isset( $element->properties['content'] ) ? $element->properties['content'] : '';
		$level = isset( $element->properties['level'] ) ? max( 1, min( 6, (int) $element->properties['level'] ) ) : 1;
		$tag = 'h' . $level;

		$styles = array();
		if ( isset( $element->properties['fontSize'] ) ) {
			$styles[] = 'font-size: ' . esc_attr( $element->properties['fontSize'] );
		}
		if ( isset( $element->properties['fontFamily'] ) ) {
			$styles[] = 'font-family: ' . esc_attr( $element->properties['fontFamily'] );
		}
		if ( isset( $element->properties['fontWeight'] ) ) {
			$styles[] = 'font-weight: ' . esc_attr( $element->properties['fontWeight'] );
		}
		if ( isset( $element->properties['color'] ) ) {
			$styles[] = 'color: ' . esc_attr( $element->properties['color'] );
		}
		if ( isset( $element->properties['textAlign'] ) ) {
			$styles[] = 'text-align: ' . esc_attr( $element->properties['textAlign'] );
		}

		$style_attr = ! empty( $styles ) ? ' style="' . implode( '; ', $styles ) . '"' : '';

		return '<' . $tag . ' class="versatile-heading"' . $style_attr . '>' . wp_kses_post( $content ) . '</' . $tag . '>';
	}

	/**
	 * Render image element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_image_element( $element ) {
		$src = isset( $element->properties['src'] ) ? $element->properties['src'] : '';
		$alt = isset( $element->properties['alt'] ) ? $element->properties['alt'] : '';
		$fit = isset( $element->properties['fit'] ) ? $element->properties['fit'] : 'cover';
		$radius = isset( $element->properties['radius'] ) ? $element->properties['radius'] : '0px';

		if ( empty( $src ) ) {
			return '<div class="versatile-image-placeholder">No image source provided</div>';
		}

		$styles = array(
			'object-fit: ' . esc_attr( $fit ),
			'border-radius: ' . esc_attr( $radius ),
			'width: 100%',
			'height: 100%',
		);

		return '<img class="versatile-image" src="' . esc_url( $src ) . '" alt="' . esc_attr( $alt ) . '" style="' . implode( '; ', $styles ) . '">';
	}

	/**
	 * Render button element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_button_element( $element ) {
		$text = isset( $element->properties['text'] ) ? $element->properties['text'] : 'Button';
		$url = isset( $element->properties['url'] ) ? $element->properties['url'] : '#';
		$target = isset( $element->properties['target'] ) ? $element->properties['target'] : '_self';

		$styles = array();
		if ( isset( $element->properties['backgroundColor'] ) ) {
			$styles[] = 'background-color: ' . esc_attr( $element->properties['backgroundColor'] );
		}
		if ( isset( $element->properties['textColor'] ) ) {
			$styles[] = 'color: ' . esc_attr( $element->properties['textColor'] );
		}
		if ( isset( $element->properties['fontSize'] ) ) {
			$styles[] = 'font-size: ' . esc_attr( $element->properties['fontSize'] );
		}
		if ( isset( $element->properties['padding'] ) ) {
			$styles[] = 'padding: ' . esc_attr( $element->properties['padding'] );
		}
		if ( isset( $element->properties['borderRadius'] ) ) {
			$styles[] = 'border-radius: ' . esc_attr( $element->properties['borderRadius'] );
		}
		if ( isset( $element->properties['border'] ) ) {
			$styles[] = 'border: ' . esc_attr( $element->properties['border'] );
		}

		$styles[] = 'text-decoration: none';
		$styles[] = 'display: inline-block';
		$styles[] = 'cursor: pointer';

		return '<a class="versatile-button" href="' . esc_url( $url ) . '" target="' . esc_attr( $target ) . '" style="' . implode( '; ', $styles ) . '">' . esc_html( $text ) . '</a>';
	}

	/**
	 * Render countdown element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_countdown_element( $element ) {
		$target_date = isset( $element->properties['targetDate'] ) ? $element->properties['targetDate'] : '';
		$format = isset( $element->properties['format'] ) ? $element->properties['format'] : 'days:hours:minutes:seconds';
		$show_labels = isset( $element->properties['showLabels'] ) ? $element->properties['showLabels'] : true;
		$separator = isset( $element->properties['separator'] ) ? $element->properties['separator'] : ':';

		if ( empty( $target_date ) ) {
			return '<div class="versatile-countdown-error">No target date provided</div>';
		}

		$styles = array();
		if ( isset( $element->properties['fontSize'] ) ) {
			$styles[] = 'font-size: ' . esc_attr( $element->properties['fontSize'] );
		}
		if ( isset( $element->properties['fontFamily'] ) ) {
			$styles[] = 'font-family: ' . esc_attr( $element->properties['fontFamily'] );
		}
		if ( isset( $element->properties['color'] ) ) {
			$styles[] = 'color: ' . esc_attr( $element->properties['color'] );
		}
		if ( isset( $element->properties['backgroundColor'] ) ) {
			$styles[] = 'background-color: ' . esc_attr( $element->properties['backgroundColor'] );
		}

		$style_attr = ! empty( $styles ) ? ' style="' . implode( '; ', $styles ) . '"' : '';

		return '<div class="versatile-countdown" data-target="' . esc_attr( $target_date ) . '" data-format="' . esc_attr( $format ) . '" data-separator="' . esc_attr( $separator ) . '" data-labels="' . ( $show_labels ? 'true' : 'false' ) . '"' . $style_attr . '>
			<span class="countdown-placeholder">Loading countdown...</span>
		</div>';
	}

	/**
	 * Render social element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_social_element( $element ) {
		$links = isset( $element->properties['links'] ) && is_array( $element->properties['links'] ) ? $element->properties['links'] : array();
		$icon_size = isset( $element->properties['iconSize'] ) ? $element->properties['iconSize'] : '24px';
		$icon_color = isset( $element->properties['iconColor'] ) ? $element->properties['iconColor'] : '#000000';
		$spacing = isset( $element->properties['spacing'] ) ? $element->properties['spacing'] : '10px';

		if ( empty( $links ) ) {
			return '<div class="versatile-social-placeholder">No social links provided</div>';
		}

		$html = '<div class="versatile-social" style="display: flex; gap: ' . esc_attr( $spacing ) . ';">';
		foreach ( $links as $link ) {
			if ( isset( $link['platform'] ) && isset( $link['url'] ) ) {
				$platform = esc_attr( $link['platform'] );
				$url = esc_url( $link['url'] );
				$html .= '<a href="' . $url . '" target="_blank" class="social-link social-' . $platform . '" style="color: ' . esc_attr( $icon_color ) . '; font-size: ' . esc_attr( $icon_size ) . ';">
					<span class="social-icon">' . $this->get_social_icon( $platform ) . '</span>
				</a>';
			}
		}
		$html .= '</div>';

		return $html;
	}

	/**
	 * Render form element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_form_element( $element ) {
		$fields = isset( $element->properties['fields'] ) && is_array( $element->properties['fields'] ) ? $element->properties['fields'] : array();
		$submit_text = isset( $element->properties['submitText'] ) ? $element->properties['submitText'] : 'Submit';

		if ( empty( $fields ) ) {
			return '<div class="versatile-form-placeholder">No form fields configured</div>';
		}

		$html = '<form class="versatile-form" style="display: block;">';
		foreach ( $fields as $field ) {
			if ( isset( $field['type'] ) && isset( $field['name'] ) ) {
				$html .= $this->render_form_field( $field );
			}
		}
		$html .= '<button type="submit" class="form-submit">' . esc_html( $submit_text ) . '</button>';
		$html .= '</form>';

		return $html;
	}

	/**
	 * Render progress element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_progress_element( $element ) {
		$percentage = isset( $element->properties['percentage'] ) ? max( 0, min( 100, (int) $element->properties['percentage'] ) ) : 0;
		$show_percentage = isset( $element->properties['showPercentage'] ) ? $element->properties['showPercentage'] : true;
		$bg_color = isset( $element->properties['backgroundColor'] ) ? $element->properties['backgroundColor'] : '#f0f0f0';
		$fill_color = isset( $element->properties['fillColor'] ) ? $element->properties['fillColor'] : '#007cba';
		$height = isset( $element->properties['height'] ) ? $element->properties['height'] : '20px';
		$border_radius = isset( $element->properties['borderRadius'] ) ? $element->properties['borderRadius'] : '10px';

		$html = '<div class="versatile-progress" style="background-color: ' . esc_attr( $bg_color ) . '; height: ' . esc_attr( $height ) . '; border-radius: ' . esc_attr( $border_radius ) . '; position: relative; overflow: hidden;">
			<div class="progress-fill" style="background-color: ' . esc_attr( $fill_color ) . '; height: 100%; width: ' . $percentage . '%; border-radius: ' . esc_attr( $border_radius ) . '; transition: width 0.3s ease;"></div>';

		if ( $show_percentage ) {
			$html .= '<div class="progress-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; color: #333;">' . $percentage . '%</div>';
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * Render spacer element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_spacer_element( $element ) {
		$height = isset( $element->properties['height'] ) ? $element->properties['height'] : '20px';
		return '<div class="versatile-spacer" style="height: ' . esc_attr( $height ) . ';"></div>';
	}

	/**
	 * Render divider element
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string Rendered HTML
	 */
	private function render_divider_element( $element ) {
		$style = isset( $element->properties['style'] ) ? $element->properties['style'] : 'solid';
		$color = isset( $element->properties['color'] ) ? $element->properties['color'] : '#cccccc';
		$thickness = isset( $element->properties['thickness'] ) ? $element->properties['thickness'] : '1px';
		$width = isset( $element->properties['width'] ) ? $element->properties['width'] : '100%';

		return '<hr class="versatile-divider" style="border: none; border-top: ' . esc_attr( $thickness ) . ' ' . esc_attr( $style ) . ' ' . esc_attr( $color ) . '; width: ' . esc_attr( $width ) . '; margin: 10px 0;">';
	}

	/**
	 * Get responsive element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @param string          $device_mode Device mode.
	 * @return string CSS styles
	 */
	private function get_responsive_element_styles( $element, $device_mode ) {
		$styles = array();

		// Base positioning and sizing
		$styles[] = 'position: absolute';
		$styles[] = 'left: ' . (int) $element->position['x'] . 'px';
		$styles[] = 'top: ' . (int) $element->position['y'] . 'px';
		$styles[] = 'width: ' . (int) $element->size['width'] . 'px';
		$styles[] = 'height: ' . (int) $element->size['height'] . 'px';

		// Apply responsive scaling for smaller devices
		if ( $device_mode === 'tablet' ) {
			$scale = 0.8;
			$styles[] = 'transform: scale(' . $scale . ')';
			$styles[] = 'transform-origin: top left';
		} elseif ( $device_mode === 'mobile' ) {
			$scale = 0.6;
			$styles[] = 'transform: scale(' . $scale . ')';
			$styles[] = 'transform-origin: top left';
		}

		return implode( '; ', $styles ) . ';';
	}

	/**
	 * Convert styles array to CSS string
	 *
	 * @param array $styles Styles array.
	 * @return string CSS string
	 */
	private function convert_styles_to_css( $styles ) {
		if ( empty( $styles ) || ! is_array( $styles ) ) {
			return '';
		}

		$css_rules = array();
		foreach ( $styles as $property => $value ) {
			$css_rules[] = esc_attr( $property ) . ': ' . esc_attr( $value );
		}

		return implode( '; ', $css_rules ) . ';';
	}

	/**
	 * Generate template CSS
	 *
	 * @param CustomTemplate $template Template instance.
	 * @param string         $device_mode Device mode.
	 * @return string Generated CSS
	 */
	private function generate_template_css( $template, $device_mode ) {
		$css = '';

		// Add custom template styles
		if ( ! empty( $template->styles ) ) {
			$css .= $template->styles;
		}

		// Add device-specific styles
		if ( $device_mode === 'mobile' ) {
			$css .= '
				.versatile-container { font-size: 14px; }
				.versatile-button { padding: 8px 16px !important; font-size: 14px !important; }
				.versatile-heading { font-size: 18px !important; }
			';
		} elseif ( $device_mode === 'tablet' ) {
			$css .= '
				.versatile-container { font-size: 15px; }
				.versatile-button { padding: 10px 20px !important; font-size: 15px !important; }
			';
		}

		return $css;
	}

	/**
	 * Get base preview CSS
	 *
	 * @param array $device_config Device configuration.
	 * @return string Base CSS
	 */
	private function get_base_preview_css( $device_config ) {
		return '
			* { box-sizing: border-box; }
			body {
				margin: 0;
				padding: 0;
				font-family: Arial, sans-serif;
				background: #f0f0f0;
				overflow-x: hidden;
			}
			.versatile-container {
				position: relative;
				width: ' . $device_config['width'] . 'px;
				height: ' . $device_config['height'] . 'px;
				margin: 0 auto;
				background: #ffffff;
				overflow: hidden;
			}
			.versatile-element {
				box-sizing: border-box;
			}
			.versatile-element-error {
				background: #ffebee;
				color: #c62828;
				padding: 10px;
				border: 1px solid #ef5350;
				border-radius: 4px;
				margin: 5px;
			}
			.versatile-placeholder {
				text-align: center;
				color: #666;
				padding: 50px;
				font-style: italic;
			}
			.versatile-button:hover {
				opacity: 0.8;
				transition: opacity 0.3s ease;
			}
			.versatile-countdown {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 10px;
			}
			.versatile-social a {
				text-decoration: none;
			}
			.versatile-social a:hover {
				opacity: 0.7;
				transition: opacity 0.3s ease;
			}
			.versatile-form {
				padding: 20px;
			}
			.versatile-form input,
			.versatile-form textarea {
				width: 100%;
				padding: 10px;
				margin: 5px 0;
				border: 1px solid #ddd;
				border-radius: 4px;
			}
			.versatile-form button {
				background: #007cba;
				color: white;
				padding: 12px 24px;
				border: none;
				border-radius: 4px;
				cursor: pointer;
			}
			.versatile-form button:hover {
				background: #005a87;
			}
		';
	}

	/**
	 * Get preview JavaScript
	 *
	 * @return string JavaScript code
	 */
	private function get_preview_javascript() {
		return '
			// Initialize countdown timers
			var countdowns = document.querySelectorAll(".versatile-countdown");
			countdowns.forEach(function(countdown) {
				var targetDate = countdown.getAttribute("data-target");
				var format = countdown.getAttribute("data-format");
				var separator = countdown.getAttribute("data-separator");
				var showLabels = countdown.getAttribute("data-labels") === "true";
				
				if (targetDate) {
					updateCountdown(countdown, targetDate, format, separator, showLabels);
					setInterval(function() {
						updateCountdown(countdown, targetDate, format, separator, showLabels);
					}, 1000);
				}
			});
			
			function updateCountdown(element, targetDate, format, separator, showLabels) {
				var target = new Date(targetDate).getTime();
				var now = new Date().getTime();
				var distance = target - now;
				
				if (distance < 0) {
					element.innerHTML = "Time expired";
					return;
				}
				
				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);
				
				var parts = [];
				if (format.includes("days")) parts.push((showLabels ? days + "d" : days));
				if (format.includes("hours")) parts.push((showLabels ? hours + "h" : hours));
				if (format.includes("minutes")) parts.push((showLabels ? minutes + "m" : minutes));
				if (format.includes("seconds")) parts.push((showLabels ? seconds + "s" : seconds));
				
				element.innerHTML = parts.join(separator);
			}
		';
	}

	/**
	 * Get social media icon
	 *
	 * @param string $platform Social media platform.
	 * @return string Icon HTML
	 */
	private function get_social_icon( $platform ) {
		$icons = array(
			'facebook'  => '📘',
			'twitter'   => '🐦',
			'instagram' => '📷',
			'linkedin'  => '💼',
			'youtube'   => '📺',
			'github'    => '🐙',
		);

		return isset( $icons[ $platform ] ) ? $icons[ $platform ] : '🔗';
	}

	/**
	 * Render form field
	 *
	 * @param array $field Field configuration.
	 * @return string Field HTML
	 */
	private function render_form_field( $field ) {
		$type = $field['type'];
		$name = esc_attr( $field['name'] );
		$label = isset( $field['label'] ) ? esc_html( $field['label'] ) : ucfirst( $name );
		$required = isset( $field['required'] ) && $field['required'] ? ' required' : '';

		$html = '<div class="form-field">';
		$html .= '<label for="' . $name . '">' . $label . '</label>';

		switch ( $type ) {
			case 'text':
			case 'email':
				$html .= '<input type="' . esc_attr( $type ) . '" id="' . $name . '" name="' . $name . '"' . $required . '>';
				break;
			case 'textarea':
				$html .= '<textarea id="' . $name . '" name="' . $name . '"' . $required . '></textarea>';
				break;
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * Generate error preview HTML
	 *
	 * @param string $message Error message.
	 * @return string Error HTML
	 */
	private function generate_error_preview( $message ) {
		return '<!DOCTYPE html>
<html>
<head>
	<title>Preview Error</title>
	<style>
		body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
		.error { background: #ffebee; color: #c62828; padding: 20px; border: 1px solid #ef5350; border-radius: 4px; }
	</style>
</head>
<body>
	<div class="error">
		<h3>Preview Generation Error</h3>
		<p>' . esc_html( $message ) . '</p>
	</div>
</body>
</html>';
	}

	/**
	 * Render template with context data
	 *
	 * @param array $template Template configuration.
	 * @param array $context Context data for rendering.
	 * @return string Rendered HTML
	 */
	public function render_template( $template, $context = array() ) {
		try {
			// Create template instance if array is provided
			if ( is_array( $template ) ) {
				$template_instance = new CustomTemplate( $template );
			} elseif ( $template instanceof CustomTemplate ) {
				$template_instance = $template;
			} else {
				return $this->generate_error_preview( 'Invalid template data provided' );
			}

			// Use TemplateRenderer for server-side rendering
			$renderer = new TemplateRenderer();
			return $renderer->render( $template_instance, $context );

		} catch ( Exception $e ) {
			return $this->generate_error_preview( 'Template rendering failed: ' . $e->getMessage() );
		}
	}
}
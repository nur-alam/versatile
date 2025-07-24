<?php
/**
 * Template Renderer
 *
 * @package Versatile\Services\TemplateDesigner\Assets
 * @subpackage Versatile\Services\TemplateDesigner\Assets\TemplateRenderer
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Assets;

use Versatile\Services\TemplateDesigner\Models\CustomTemplate;
use Versatile\Services\TemplateDesigner\Models\TemplateElement;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TemplateRenderer handles server-side template rendering functionality
 */
class TemplateRenderer {

	/**
	 * Render template to HTML
	 *
	 * @param CustomTemplate $template Template instance.
	 * @param array          $context Context data for rendering.
	 * @return string Rendered HTML
	 */
	public function render( $template, $context = array() ) {
		try {
			// Validate template
			$validation = $template->validate();
			if ( ! $validation['valid'] ) {
				return $this->render_error( 'Template validation failed: ' . implode( ', ', $validation['errors'] ) );
			}

			// Prepare context data
			$context = $this->prepare_context( $context );

			// Generate HTML structure
			$html = $this->build_template_html( $template, $context );

			return $html;

		} catch ( Exception $e ) {
			return $this->render_error( 'Template rendering failed: ' . $e->getMessage() );
		}
	}

	/**
	 * Convert template elements to HTML
	 *
	 * @param array $elements Template elements.
	 * @param array $context Context data.
	 * @return string Generated HTML
	 */
	public function elements_to_html( $elements, $context = array() ) {
		if ( empty( $elements ) || ! is_array( $elements ) ) {
			return '';
		}

		$html = '';
		foreach ( $elements as $element_data ) {
			$element = new TemplateElement( $element_data );
			$validation = $element->validate();

			if ( $validation['valid'] ) {
				$html .= $this->render_element( $element, $context );
			}
		}

		return $html;
	}

	/**
	 * Generate CSS from template styles
	 *
	 * @param CustomTemplate $template Template instance.
	 * @param array          $context Context data.
	 * @return string Generated CSS
	 */
	public function generate_css( $template, $context = array() ) {
		$css = '';

		// Add base template styles
		$css .= $this->get_base_css();

		// Add custom template styles
		if ( ! empty( $template->styles ) ) {
			$css .= "\n/* Custom Template Styles */\n";
			$css .= $template->styles;
		}

		// Generate element-specific CSS
		if ( ! empty( $template->elements ) ) {
			$css .= "\n/* Element Styles */\n";
			$css .= $this->generate_element_css( $template->elements );
		}

		// Add responsive CSS
		$css .= "\n/* Responsive Styles */\n";
		$css .= $this->generate_responsive_css( $template );

		return $css;
	}

	/**
	 * Build complete template HTML structure
	 *
	 * @param CustomTemplate $template Template instance.
	 * @param array          $context Context data.
	 * @return string Complete HTML
	 */
	private function build_template_html( $template, $context ) {
		$site_title = get_bloginfo( 'name' );
		$site_description = get_bloginfo( 'description' );
		$mode = isset( $context['mode'] ) ? $context['mode'] : 'maintenance';

		// Generate elements HTML
		$elements_html = $this->elements_to_html( $template->elements, $context );

		// Generate CSS
		$css = $this->generate_css( $template, $context );

		// Build complete HTML
		$html = '<!DOCTYPE html>
<html lang="' . get_locale() . '">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">
	<title>' . esc_html( $site_title ) . ' - ' . ucfirst( $mode ) . ' Mode</title>
	<style>' . $css . '</style>
</head>
<body class="versatile-template versatile-' . esc_attr( $mode ) . '">
	<div class="versatile-container">
		' . $elements_html . '
	</div>
	<script>
		' . $this->get_template_javascript( $template, $context ) . '
	</script>
</body>
</html>';

		return $html;
	}

	/**
	 * Render individual template element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered element HTML
	 */
	private function render_element( $element, $context ) {
		$element_id = 'element-' . esc_attr( $element->id );
		$element_class = 'versatile-element versatile-element-' . esc_attr( $element->type );
		
		// Generate element styles
		$element_styles = $this->get_element_styles( $element );

		$html = '<div id="' . $element_id . '" class="' . $element_class . '" style="' . esc_attr( $element_styles ) . '">';

		// Render element content based on type
		switch ( $element->type ) {
			case 'text':
				$html .= $this->render_text_element( $element, $context );
				break;
			case 'heading':
				$html .= $this->render_heading_element( $element, $context );
				break;
			case 'image':
				$html .= $this->render_image_element( $element, $context );
				break;
			case 'button':
				$html .= $this->render_button_element( $element, $context );
				break;
			case 'countdown':
				$html .= $this->render_countdown_element( $element, $context );
				break;
			case 'social':
				$html .= $this->render_social_element( $element, $context );
				break;
			case 'form':
				$html .= $this->render_form_element( $element, $context );
				break;
			case 'progress':
				$html .= $this->render_progress_element( $element, $context );
				break;
			case 'spacer':
				$html .= $this->render_spacer_element( $element, $context );
				break;
			case 'divider':
				$html .= $this->render_divider_element( $element, $context );
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
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_text_element( $element, $context ) {
		$content = isset( $element->properties['content'] ) ? $element->properties['content'] : '';
		
		// Process dynamic content placeholders
		$content = $this->process_dynamic_content( $content, $context );

		$styles = $this->get_text_element_styles( $element );
		$style_attr = ! empty( $styles ) ? ' style="' . implode( '; ', $styles ) . '"' : '';

		return '<div class="versatile-text"' . $style_attr . '>' . wp_kses_post( $content ) . '</div>';
	}

	/**
	 * Render heading element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_heading_element( $element, $context ) {
		$content = isset( $element->properties['content'] ) ? $element->properties['content'] : '';
		$level = isset( $element->properties['level'] ) ? max( 1, min( 6, (int) $element->properties['level'] ) ) : 1;
		$tag = 'h' . $level;

		// Process dynamic content placeholders
		$content = $this->process_dynamic_content( $content, $context );

		$styles = $this->get_heading_element_styles( $element );
		$style_attr = ! empty( $styles ) ? ' style="' . implode( '; ', $styles ) . '"' : '';

		return '<' . $tag . ' class="versatile-heading"' . $style_attr . '>' . wp_kses_post( $content ) . '</' . $tag . '>';
	}

	/**
	 * Render image element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_image_element( $element, $context ) {
		$src = isset( $element->properties['src'] ) ? $element->properties['src'] : '';
		$alt = isset( $element->properties['alt'] ) ? $element->properties['alt'] : '';

		if ( empty( $src ) ) {
			return '<div class="versatile-image-placeholder">No image source provided</div>';
		}

		$styles = $this->get_image_element_styles( $element );

		return '<img class="versatile-image" src="' . esc_url( $src ) . '" alt="' . esc_attr( $alt ) . '" style="' . implode( '; ', $styles ) . '">';
	}

	/**
	 * Render button element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_button_element( $element, $context ) {
		$text = isset( $element->properties['text'] ) ? $element->properties['text'] : 'Button';
		$url = isset( $element->properties['url'] ) ? $element->properties['url'] : '#';
		$target = isset( $element->properties['target'] ) ? $element->properties['target'] : '_self';

		// Process dynamic content placeholders
		$text = $this->process_dynamic_content( $text, $context );
		$url = $this->process_dynamic_content( $url, $context );

		$styles = $this->get_button_element_styles( $element );

		return '<a class="versatile-button" href="' . esc_url( $url ) . '" target="' . esc_attr( $target ) . '" style="' . implode( '; ', $styles ) . '">' . esc_html( $text ) . '</a>';
	}

	/**
	 * Render countdown element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_countdown_element( $element, $context ) {
		$target_date = isset( $element->properties['targetDate'] ) ? $element->properties['targetDate'] : '';
		$format = isset( $element->properties['format'] ) ? $element->properties['format'] : 'days:hours:minutes:seconds';
		$show_labels = isset( $element->properties['showLabels'] ) ? $element->properties['showLabels'] : true;
		$separator = isset( $element->properties['separator'] ) ? $element->properties['separator'] : ':';

		if ( empty( $target_date ) ) {
			return '<div class="versatile-countdown-error">No target date provided</div>';
		}

		$styles = $this->get_countdown_element_styles( $element );
		$style_attr = ! empty( $styles ) ? ' style="' . implode( '; ', $styles ) . '"' : '';

		return '<div class="versatile-countdown" data-target="' . esc_attr( $target_date ) . '" data-format="' . esc_attr( $format ) . '" data-separator="' . esc_attr( $separator ) . '" data-labels="' . ( $show_labels ? 'true' : 'false' ) . '"' . $style_attr . '>
			<span class="countdown-loading">Loading countdown...</span>
		</div>';
	}

	/**
	 * Render social element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_social_element( $element, $context ) {
		$links = isset( $element->properties['links'] ) && is_array( $element->properties['links'] ) ? $element->properties['links'] : array();
		$icon_size = isset( $element->properties['iconSize'] ) ? $element->properties['iconSize'] : '24px';
		$icon_color = isset( $element->properties['iconColor'] ) ? $element->properties['iconColor'] : '#000000';
		$spacing = isset( $element->properties['spacing'] ) ? $element->properties['spacing'] : '10px';

		if ( empty( $links ) ) {
			return '<div class="versatile-social-placeholder">No social links provided</div>';
		}

		$html = '<div class="versatile-social" style="display: flex; gap: ' . esc_attr( $spacing ) . '; align-items: center;">';
		foreach ( $links as $link ) {
			if ( isset( $link['platform'] ) && isset( $link['url'] ) ) {
				$platform = esc_attr( $link['platform'] );
				$url = esc_url( $link['url'] );
				$icon = $this->get_social_icon_svg( $platform );
				
				$html .= '<a href="' . $url . '" target="_blank" rel="noopener noreferrer" class="social-link social-' . $platform . '" style="color: ' . esc_attr( $icon_color ) . '; font-size: ' . esc_attr( $icon_size ) . '; text-decoration: none;">
					<span class="social-icon" style="display: inline-block; width: ' . esc_attr( $icon_size ) . '; height: ' . esc_attr( $icon_size ) . ';">' . $icon . '</span>
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
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_form_element( $element, $context ) {
		$fields = isset( $element->properties['fields'] ) && is_array( $element->properties['fields'] ) ? $element->properties['fields'] : array();
		$submit_text = isset( $element->properties['submitText'] ) ? $element->properties['submitText'] : 'Submit';
		$action = isset( $context['form_action'] ) ? $context['form_action'] : '#';

		if ( empty( $fields ) ) {
			return '<div class="versatile-form-placeholder">No form fields configured</div>';
		}

		$form_styles = $this->get_form_element_styles( $element );
		$style_attr = ! empty( $form_styles ) ? ' style="' . implode( '; ', $form_styles ) . '"' : '';

		$html = '<form class="versatile-form" method="post" action="' . esc_url( $action ) . '"' . $style_attr . '>';
		$html .= wp_nonce_field( 'versatile_form_submit', 'versatile_form_nonce', true, false );
		
		foreach ( $fields as $field ) {
			if ( isset( $field['type'] ) && isset( $field['name'] ) ) {
				$html .= $this->render_form_field( $field );
			}
		}
		
		$button_styles = $this->get_form_button_styles( $element );
		$button_style_attr = ! empty( $button_styles ) ? ' style="' . implode( '; ', $button_styles ) . '"' : '';
		
		$html .= '<button type="submit" class="form-submit"' . $button_style_attr . '>' . esc_html( $submit_text ) . '</button>';
		$html .= '</form>';

		return $html;
	}

	/**
	 * Render progress element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_progress_element( $element, $context ) {
		$percentage = isset( $element->properties['percentage'] ) ? max( 0, min( 100, (int) $element->properties['percentage'] ) ) : 0;
		$show_percentage = isset( $element->properties['showPercentage'] ) ? $element->properties['showPercentage'] : true;
		
		$styles = $this->get_progress_element_styles( $element );
		$container_styles = $styles['container'];
		$fill_styles = $styles['fill'];
		$text_styles = $styles['text'];

		$html = '<div class="versatile-progress" style="' . implode( '; ', $container_styles ) . '">
			<div class="progress-fill" style="' . implode( '; ', $fill_styles ) . '; width: ' . $percentage . '%;"></div>';

		if ( $show_percentage ) {
			$html .= '<div class="progress-text" style="' . implode( '; ', $text_styles ) . '">' . $percentage . '%</div>';
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * Render spacer element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_spacer_element( $element, $context ) {
		$height = isset( $element->properties['height'] ) ? $element->properties['height'] : '20px';
		return '<div class="versatile-spacer" style="height: ' . esc_attr( $height ) . '; display: block;"></div>';
	}

	/**
	 * Render divider element
	 *
	 * @param TemplateElement $element Element instance.
	 * @param array           $context Context data.
	 * @return string Rendered HTML
	 */
	private function render_divider_element( $element, $context ) {
		$styles = $this->get_divider_element_styles( $element );
		return '<hr class="versatile-divider" style="' . implode( '; ', $styles ) . '">';
	}

	/**
	 * Get element positioning and sizing styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return string CSS styles
	 */
	private function get_element_styles( $element ) {
		$styles = array();

		// Base positioning and sizing
		$styles[] = 'position: absolute';
		$styles[] = 'left: ' . (int) $element->position['x'] . 'px';
		$styles[] = 'top: ' . (int) $element->position['y'] . 'px';
		$styles[] = 'width: ' . (int) $element->size['width'] . 'px';
		$styles[] = 'height: ' . (int) $element->size['height'] . 'px';
		$styles[] = 'box-sizing: border-box';

		// Add custom element styles
		if ( ! empty( $element->styles ) && is_array( $element->styles ) ) {
			foreach ( $element->styles as $property => $value ) {
				$styles[] = esc_attr( $property ) . ': ' . esc_attr( $value );
			}
		}

		return implode( '; ', $styles );
	}

	/**
	 * Get text element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_text_element_styles( $element ) {
		$styles = array();

		$style_properties = array( 'fontSize', 'fontFamily', 'fontWeight', 'color', 'textAlign', 'lineHeight' );
		foreach ( $style_properties as $property ) {
			if ( isset( $element->properties[ $property ] ) ) {
				$css_property = $this->camel_to_kebab( $property );
				$styles[] = $css_property . ': ' . esc_attr( $element->properties[ $property ] );
			}
		}

		return $styles;
	}

	/**
	 * Get heading element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_heading_element_styles( $element ) {
		$styles = array();

		$style_properties = array( 'fontSize', 'fontFamily', 'fontWeight', 'color', 'textAlign' );
		foreach ( $style_properties as $property ) {
			if ( isset( $element->properties[ $property ] ) ) {
				$css_property = $this->camel_to_kebab( $property );
				$styles[] = $css_property . ': ' . esc_attr( $element->properties[ $property ] );
			}
		}

		// Default heading styles
		$styles[] = 'margin: 0';
		$styles[] = 'padding: 0';

		return $styles;
	}

	/**
	 * Get image element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_image_element_styles( $element ) {
		$styles = array(
			'width: 100%',
			'height: 100%',
			'display: block',
		);

		if ( isset( $element->properties['fit'] ) ) {
			$styles[] = 'object-fit: ' . esc_attr( $element->properties['fit'] );
		}

		if ( isset( $element->properties['radius'] ) ) {
			$styles[] = 'border-radius: ' . esc_attr( $element->properties['radius'] );
		}

		return $styles;
	}

	/**
	 * Get button element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_button_element_styles( $element ) {
		$styles = array(
			'text-decoration: none',
			'display: inline-block',
			'cursor: pointer',
			'border: none',
			'text-align: center',
		);

		$style_properties = array(
			'backgroundColor' => 'background-color',
			'textColor' => 'color',
			'fontSize' => 'font-size',
			'padding' => 'padding',
			'borderRadius' => 'border-radius',
			'border' => 'border',
		);

		foreach ( $style_properties as $property => $css_property ) {
			if ( isset( $element->properties[ $property ] ) ) {
				$styles[] = $css_property . ': ' . esc_attr( $element->properties[ $property ] );
			}
		}

		return $styles;
	}

	/**
	 * Get countdown element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_countdown_element_styles( $element ) {
		$styles = array(
			'display: flex',
			'align-items: center',
			'justify-content: center',
			'gap: 10px',
		);

		$style_properties = array( 'fontSize', 'fontFamily', 'color', 'backgroundColor' );
		foreach ( $style_properties as $property ) {
			if ( isset( $element->properties[ $property ] ) ) {
				$css_property = $this->camel_to_kebab( $property );
				$styles[] = $css_property . ': ' . esc_attr( $element->properties[ $property ] );
			}
		}

		return $styles;
	}

	/**
	 * Get form element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_form_element_styles( $element ) {
		$styles = array( 'padding: 20px' );

		if ( isset( $element->properties['backgroundColor'] ) ) {
			$styles[] = 'background-color: ' . esc_attr( $element->properties['backgroundColor'] );
		}

		if ( isset( $element->properties['borderColor'] ) ) {
			$styles[] = 'border: 1px solid ' . esc_attr( $element->properties['borderColor'] );
		}

		return $styles;
	}

	/**
	 * Get form button styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_form_button_styles( $element ) {
		$styles = array(
			'padding: 12px 24px',
			'border: none',
			'border-radius: 4px',
			'cursor: pointer',
			'font-size: 16px',
		);

		if ( isset( $element->properties['buttonColor'] ) ) {
			$styles[] = 'background-color: ' . esc_attr( $element->properties['buttonColor'] );
			$styles[] = 'color: white';
		}

		return $styles;
	}

	/**
	 * Get progress element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array Styles array with container, fill, and text styles
	 */
	private function get_progress_element_styles( $element ) {
		$bg_color = isset( $element->properties['backgroundColor'] ) ? $element->properties['backgroundColor'] : '#f0f0f0';
		$fill_color = isset( $element->properties['fillColor'] ) ? $element->properties['fillColor'] : '#007cba';
		$height = isset( $element->properties['height'] ) ? $element->properties['height'] : '20px';
		$border_radius = isset( $element->properties['borderRadius'] ) ? $element->properties['borderRadius'] : '10px';

		return array(
			'container' => array(
				'background-color: ' . esc_attr( $bg_color ),
				'height: ' . esc_attr( $height ),
				'border-radius: ' . esc_attr( $border_radius ),
				'position: relative',
				'overflow: hidden',
			),
			'fill' => array(
				'background-color: ' . esc_attr( $fill_color ),
				'height: 100%',
				'border-radius: ' . esc_attr( $border_radius ),
				'transition: width 0.3s ease',
			),
			'text' => array(
				'position: absolute',
				'top: 50%',
				'left: 50%',
				'transform: translate(-50%, -50%)',
				'font-weight: bold',
				'color: #333',
				'font-size: 12px',
			),
		);
	}

	/**
	 * Get divider element styles
	 *
	 * @param TemplateElement $element Element instance.
	 * @return array CSS styles
	 */
	private function get_divider_element_styles( $element ) {
		$style = isset( $element->properties['style'] ) ? $element->properties['style'] : 'solid';
		$color = isset( $element->properties['color'] ) ? $element->properties['color'] : '#cccccc';
		$thickness = isset( $element->properties['thickness'] ) ? $element->properties['thickness'] : '1px';
		$width = isset( $element->properties['width'] ) ? $element->properties['width'] : '100%';

		return array(
			'border: none',
			'border-top: ' . esc_attr( $thickness ) . ' ' . esc_attr( $style ) . ' ' . esc_attr( $color ),
			'width: ' . esc_attr( $width ),
			'margin: 10px 0',
		);
	}

	/**
	 * Generate CSS for all elements
	 *
	 * @param array $elements Template elements.
	 * @return string Generated CSS
	 */
	private function generate_element_css( $elements ) {
		$css = '';

		foreach ( $elements as $element_data ) {
			$element = new TemplateElement( $element_data );
			$element_id = '#element-' . esc_attr( $element->id );
			
			$css .= $element_id . ' {' . "\n";
			$css .= '  /* Element: ' . esc_attr( $element->type ) . ' */' . "\n";
			
			// Add element-specific CSS rules
			switch ( $element->type ) {
				case 'button':
					$css .= '  transition: opacity 0.3s ease;' . "\n";
					$css .= '}' . "\n";
					$css .= $element_id . ':hover {' . "\n";
					$css .= '  opacity: 0.8;' . "\n";
					break;
				case 'social':
					$css .= '}' . "\n";
					$css .= $element_id . ' .social-link:hover {' . "\n";
					$css .= '  opacity: 0.7;' . "\n";
					$css .= '  transition: opacity 0.3s ease;' . "\n";
					break;
			}
			
			$css .= '}' . "\n\n";
		}

		return $css;
	}

	/**
	 * Generate responsive CSS
	 *
	 * @param CustomTemplate $template Template instance.
	 * @return string Responsive CSS
	 */
	private function generate_responsive_css( $template ) {
		$css = '';

		// Tablet styles
		$css .= '@media (max-width: 1024px) {' . "\n";
		$css .= '  .versatile-container { max-width: 768px; }' . "\n";
		$css .= '  .versatile-element { transform: scale(0.9); transform-origin: top left; }' . "\n";
		$css .= '  .versatile-button { padding: 10px 20px !important; font-size: 15px !important; }' . "\n";
		$css .= '}' . "\n\n";

		// Mobile styles
		$css .= '@media (max-width: 768px) {' . "\n";
		$css .= '  .versatile-container { max-width: 375px; font-size: 14px; }' . "\n";
		$css .= '  .versatile-element { transform: scale(0.7); transform-origin: top left; }' . "\n";
		$css .= '  .versatile-button { padding: 8px 16px !important; font-size: 14px !important; }' . "\n";
		$css .= '  .versatile-heading { font-size: 18px !important; }' . "\n";
		$css .= '  .versatile-form { padding: 15px !important; }' . "\n";
		$css .= '  .versatile-social { flex-wrap: wrap; }' . "\n";
		$css .= '}' . "\n\n";

		return $css;
	}

	/**
	 * Get base CSS styles
	 *
	 * @return string Base CSS
	 */
	private function get_base_css() {
		return '
			* { box-sizing: border-box; }
			html, body {
				margin: 0;
				padding: 0;
				font-family: Arial, sans-serif;
				background: #f0f0f0;
				height: 100%;
				overflow-x: hidden;
			}
			.versatile-container {
				position: relative;
				width: 100%;
				min-height: 100vh;
				background: #ffffff;
				overflow: hidden;
			}
			.versatile-element {
				box-sizing: border-box;
			}
			.versatile-button {
				transition: opacity 0.3s ease;
			}
			.versatile-button:hover {
				opacity: 0.8;
			}
			.versatile-countdown {
				font-family: monospace;
			}
			.versatile-social a {
				text-decoration: none;
			}
			.versatile-social a:hover {
				opacity: 0.7;
				transition: opacity 0.3s ease;
			}
			.versatile-form input,
			.versatile-form textarea {
				width: 100%;
				padding: 10px;
				margin: 5px 0;
				border: 1px solid #ddd;
				border-radius: 4px;
				font-size: 14px;
			}
			.versatile-form label {
				display: block;
				margin-bottom: 5px;
				font-weight: bold;
			}
			.versatile-form .form-field {
				margin-bottom: 15px;
			}
			.versatile-form button:hover {
				opacity: 0.9;
			}
			.versatile-image-placeholder,
			.versatile-social-placeholder,
			.versatile-form-placeholder {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #f9f9f9;
				border: 2px dashed #ddd;
				color: #666;
				font-style: italic;
				text-align: center;
				padding: 20px;
			}
			.versatile-countdown-error {
				background: #ffebee;
				color: #c62828;
				padding: 10px;
				border: 1px solid #ef5350;
				border-radius: 4px;
				text-align: center;
			}
		';
	}

	/**
	 * Get template JavaScript
	 *
	 * @param CustomTemplate $template Template instance.
	 * @param array          $context Context data.
	 * @return string JavaScript code
	 */
	private function get_template_javascript( $template, $context ) {
		$js = '
			// Initialize countdown timers
			document.addEventListener("DOMContentLoaded", function() {
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
				
				// Form submission handling
				var forms = document.querySelectorAll(".versatile-form");
				forms.forEach(function(form) {
					form.addEventListener("submit", function(e) {
						// Add any form validation or processing here
						console.log("Form submitted");
					});
				});
			});
			
			function updateCountdown(element, targetDate, format, separator, showLabels) {
				var target = new Date(targetDate).getTime();
				var now = new Date().getTime();
				var distance = target - now;
				
				if (distance < 0) {
					element.innerHTML = "<span style=\"color: #c62828;\">Time expired</span>";
					return;
				}
				
				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);
				
				var parts = [];
				if (format.includes("days")) {
					parts.push(showLabels ? days + " days" : String(days).padStart(2, "0"));
				}
				if (format.includes("hours")) {
					parts.push(showLabels ? hours + " hours" : String(hours).padStart(2, "0"));
				}
				if (format.includes("minutes")) {
					parts.push(showLabels ? minutes + " minutes" : String(minutes).padStart(2, "0"));
				}
				if (format.includes("seconds")) {
					parts.push(showLabels ? seconds + " seconds" : String(seconds).padStart(2, "0"));
				}
				
				element.innerHTML = parts.join(separator);
			}
		';

		return $js;
	}

	/**
	 * Process dynamic content placeholders
	 *
	 * @param string $content Content with placeholders.
	 * @param array  $context Context data.
	 * @return string Processed content
	 */
	private function process_dynamic_content( $content, $context ) {
		// Replace common placeholders
		$replacements = array(
			'{{site_title}}' => get_bloginfo( 'name' ),
			'{{site_description}}' => get_bloginfo( 'description' ),
			'{{site_url}}' => home_url(),
			'{{admin_email}}' => get_option( 'admin_email' ),
			'{{current_year}}' => date( 'Y' ),
			'{{current_date}}' => date( get_option( 'date_format' ) ),
		);

		// Add context-specific replacements
		if ( ! empty( $context ) ) {
			foreach ( $context as $key => $value ) {
				if ( is_string( $value ) || is_numeric( $value ) ) {
					$replacements[ '{{' . $key . '}}' ] = $value;
				}
			}
		}

		return str_replace( array_keys( $replacements ), array_values( $replacements ), $content );
	}

	/**
	 * Prepare context data
	 *
	 * @param array $context Raw context data.
	 * @return array Prepared context
	 */
	private function prepare_context( $context ) {
		$default_context = array(
			'mode' => 'maintenance',
			'site_title' => get_bloginfo( 'name' ),
			'site_description' => get_bloginfo( 'description' ),
			'site_url' => home_url(),
			'admin_email' => get_option( 'admin_email' ),
			'current_year' => date( 'Y' ),
			'current_date' => date( get_option( 'date_format' ) ),
		);

		return array_merge( $default_context, $context );
	}

	/**
	 * Get social media icon SVG
	 *
	 * @param string $platform Social media platform.
	 * @return string SVG icon
	 */
	private function get_social_icon_svg( $platform ) {
		$icons = array(
			'facebook' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
			'twitter' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
			'instagram' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
			'linkedin' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
			'youtube' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
			'github' => '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
		);

		return isset( $icons[ $platform ] ) ? $icons[ $platform ] : '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>';
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
		$placeholder = isset( $field['placeholder'] ) ? ' placeholder="' . esc_attr( $field['placeholder'] ) . '"' : '';

		$html = '<div class="form-field">';
		$html .= '<label for="' . $name . '">' . $label . ( $required ? ' *' : '' ) . '</label>';

		switch ( $type ) {
			case 'text':
			case 'email':
			case 'tel':
				$html .= '<input type="' . esc_attr( $type ) . '" id="' . $name . '" name="' . $name . '"' . $required . $placeholder . '>';
				break;
			case 'textarea':
				$rows = isset( $field['rows'] ) ? ' rows="' . (int) $field['rows'] . '"' : ' rows="4"';
				$html .= '<textarea id="' . $name . '" name="' . $name . '"' . $required . $placeholder . $rows . '></textarea>';
				break;
			case 'select':
				$html .= '<select id="' . $name . '" name="' . $name . '"' . $required . '>';
				if ( isset( $field['options'] ) && is_array( $field['options'] ) ) {
					foreach ( $field['options'] as $option_value => $option_label ) {
						$html .= '<option value="' . esc_attr( $option_value ) . '">' . esc_html( $option_label ) . '</option>';
					}
				}
				$html .= '</select>';
				break;
		}

		$html .= '</div>';

		return $html;
	}

	/**
	 * Convert camelCase to kebab-case
	 *
	 * @param string $string CamelCase string.
	 * @return string Kebab-case string
	 */
	private function camel_to_kebab( $string ) {
		return strtolower( preg_replace( '/([a-z])([A-Z])/', '$1-$2', $string ) );
	}

	/**
	 * Render error message
	 *
	 * @param string $message Error message.
	 * @return string Error HTML
	 */
	private function render_error( $message ) {
		return '<!DOCTYPE html>
<html>
<head>
	<title>Template Rendering Error</title>
	<style>
		body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
		.error { background: #ffebee; color: #c62828; padding: 20px; border: 1px solid #ef5350; border-radius: 4px; }
	</style>
</head>
<body>
	<div class="error">
		<h3>Template Rendering Error</h3>
		<p>' . esc_html( $message ) . '</p>
	</div>
</body>
</html>';
	}

	/**
	 * Prepare context data
	 *
	 * @param array $context Raw context data.
	 * @return array Prepared context
	 */
	private function prepare_context( $context ) {
		$default_context = array(
			'mode' => 'maintenance',
			'site_title' => get_bloginfo( 'name' ),
			'site_description' => get_bloginfo( 'description' ),
			'site_url' => home_url(),
			'admin_email' => get_option( 'admin_email' ),
			'current_year' => date( 'Y' ),
			'current_date' => date( get_option( 'date_format' ) ),
		);

		return array_merge( $default_context, $context );
	}
}
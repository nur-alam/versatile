<?php
/**
 * Custom Template Model
 *
 * @package Versatile\Services\TemplateDesigner\Models
 * @subpackage Versatile\Services\TemplateDesigner\Models\CustomTemplate
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Models;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * CustomTemplate model class for handling template data
 */
class CustomTemplate {

	/**
	 * Template ID
	 *
	 * @var int
	 */
	public $id;

	/**
	 * Template name
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Template description
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Template type (maintenance, comingsoon, both)
	 *
	 * @var string
	 */
	public $type;

	/**
	 * Template elements data
	 *
	 * @var array
	 */
	public $elements;

	/**
	 * Custom CSS styles
	 *
	 * @var string
	 */
	public $styles;

	/**
	 * Template settings
	 *
	 * @var array
	 */
	public $settings;

	/**
	 * Creation timestamp
	 *
	 * @var string
	 */
	public $created_at;

	/**
	 * Update timestamp
	 *
	 * @var string
	 */
	public $updated_at;

	/**
	 * Active status
	 *
	 * @var bool
	 */
	public $is_active;

	/**
	 * Constructor
	 *
	 * @param array $data Template data.
	 */
	public function __construct( $data = array() ) {
		$this->id          = isset( $data['id'] ) ? (int) $data['id'] : null;
		$this->name        = isset( $data['name'] ) ? sanitize_text_field( $data['name'] ) : '';
		$this->description = isset( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '';
		$this->type        = isset( $data['type'] ) ? $this->sanitize_type( $data['type'] ) : 'both';
		$this->elements    = isset( $data['elements'] ) ? $this->sanitize_elements( $data['elements'] ) : array();
		$this->styles      = isset( $data['styles'] ) ? $this->sanitize_css( $data['styles'] ) : '';
		$this->settings    = isset( $data['settings'] ) ? $this->sanitize_settings( $data['settings'] ) : array();
		$this->created_at  = isset( $data['created_at'] ) ? sanitize_text_field( $data['created_at'] ) : '';
		$this->updated_at  = isset( $data['updated_at'] ) ? sanitize_text_field( $data['updated_at'] ) : '';
		$this->is_active   = isset( $data['is_active'] ) ? (bool) $data['is_active'] : false;
	}

	/**
	 * Validate template data
	 *
	 * @return array Validation result
	 */
	public function validate() {
		$errors = array();

		// Validate name
		if ( empty( $this->name ) ) {
			$errors[] = 'Template name is required';
		} elseif ( strlen( $this->name ) > 255 ) {
			$errors[] = 'Template name must be 255 characters or less';
		}

		// Validate type
		$valid_types = array( 'maintenance', 'comingsoon', 'both' );
		if ( ! in_array( $this->type, $valid_types, true ) ) {
			$errors[] = 'Template type must be one of: ' . implode( ', ', $valid_types );
		}

		// Validate elements structure
		if ( ! is_array( $this->elements ) ) {
			$errors[] = 'Template elements must be an array';
		} else {
			$element_errors = $this->validate_elements( $this->elements );
			$errors         = array_merge( $errors, $element_errors );
		}

		// Validate settings
		if ( ! is_array( $this->settings ) ) {
			$errors[] = 'Template settings must be an array';
		}

		// Validate CSS if provided
		if ( ! empty( $this->styles ) ) {
			$css_errors = $this->validate_css( $this->styles );
			$errors     = array_merge( $errors, $css_errors );
		}

		return array(
			'valid'  => empty( $errors ),
			'errors' => $errors,
		);
	}

	/**
	 * Serialize template data for storage
	 *
	 * @return array Serialized data
	 */
	public function serialize() {
		return array(
			'id'          => $this->id,
			'name'        => $this->name,
			'description' => $this->description,
			'type'        => $this->type,
			'elements'    => wp_json_encode( $this->elements ),
			'styles'      => $this->styles,
			'settings'    => wp_json_encode( $this->settings ),
			'created_at'  => $this->created_at,
			'updated_at'  => $this->updated_at,
			'is_active'   => $this->is_active ? 1 : 0,
		);
	}

	/**
	 * Deserialize template data from storage
	 *
	 * @param array $data Stored data.
	 * @return void
	 */
	public function deserialize( $data ) {
		$this->id          = isset( $data['id'] ) ? (int) $data['id'] : null;
		$this->name        = isset( $data['name'] ) ? sanitize_text_field( $data['name'] ) : '';
		$this->description = isset( $data['description'] ) ? sanitize_textarea_field( $data['description'] ) : '';
		$this->type        = isset( $data['type'] ) ? $this->sanitize_type( $data['type'] ) : 'both';
		$this->styles      = isset( $data['styles'] ) ? $this->sanitize_css( $data['styles'] ) : '';
		$this->created_at  = isset( $data['created_at'] ) ? sanitize_text_field( $data['created_at'] ) : '';
		$this->updated_at  = isset( $data['updated_at'] ) ? sanitize_text_field( $data['updated_at'] ) : '';
		$this->is_active   = isset( $data['is_active'] ) ? (bool) $data['is_active'] : false;

		// Decode JSON fields
		$this->elements = isset( $data['elements'] ) ? $this->decode_json_field( $data['elements'], array() ) : array();
		$this->settings = isset( $data['settings'] ) ? $this->decode_json_field( $data['settings'], array() ) : array();

		// Sanitize decoded data
		$this->elements = $this->sanitize_elements( $this->elements );
		$this->settings = $this->sanitize_settings( $this->settings );
	}

	/**
	 * Sanitize template type
	 *
	 * @param string $type Template type.
	 * @return string Sanitized type
	 */
	private function sanitize_type( $type ) {
		$valid_types = array( 'maintenance', 'comingsoon', 'both' );
		return in_array( $type, $valid_types, true ) ? $type : 'both';
	}

	/**
	 * Sanitize template elements
	 *
	 * @param mixed $elements Elements data.
	 * @return array Sanitized elements
	 */
	private function sanitize_elements( $elements ) {
		if ( ! is_array( $elements ) ) {
			return array();
		}

		$sanitized = array();
		foreach ( $elements as $element ) {
			if ( is_array( $element ) ) {
				$sanitized[] = array(
					'id'         => isset( $element['id'] ) ? sanitize_text_field( $element['id'] ) : '',
					'type'       => isset( $element['type'] ) ? sanitize_text_field( $element['type'] ) : '',
					'position'   => isset( $element['position'] ) ? $this->sanitize_position( $element['position'] ) : array( 'x' => 0, 'y' => 0 ),
					'size'       => isset( $element['size'] ) ? $this->sanitize_size( $element['size'] ) : array( 'width' => 100, 'height' => 50 ),
					'properties' => isset( $element['properties'] ) ? $this->sanitize_element_properties( $element['properties'] ) : array(),
					'styles'     => isset( $element['styles'] ) ? $this->sanitize_element_styles( $element['styles'] ) : array(),
					'content'    => isset( $element['content'] ) ? wp_kses_post( $element['content'] ) : '',
				);
			}
		}

		return $sanitized;
	}

	/**
	 * Sanitize element position
	 *
	 * @param mixed $position Position data.
	 * @return array Sanitized position
	 */
	private function sanitize_position( $position ) {
		if ( ! is_array( $position ) ) {
			return array( 'x' => 0, 'y' => 0 );
		}

		return array(
			'x' => isset( $position['x'] ) ? (int) $position['x'] : 0,
			'y' => isset( $position['y'] ) ? (int) $position['y'] : 0,
		);
	}

	/**
	 * Sanitize element size
	 *
	 * @param mixed $size Size data.
	 * @return array Sanitized size
	 */
	private function sanitize_size( $size ) {
		if ( ! is_array( $size ) ) {
			return array( 'width' => 100, 'height' => 50 );
		}

		return array(
			'width'  => isset( $size['width'] ) ? max( 1, (int) $size['width'] ) : 100,
			'height' => isset( $size['height'] ) ? max( 1, (int) $size['height'] ) : 50,
		);
	}

	/**
	 * Sanitize element properties
	 *
	 * @param mixed $properties Properties data.
	 * @return array Sanitized properties
	 */
	private function sanitize_element_properties( $properties ) {
		if ( ! is_array( $properties ) ) {
			return array();
		}

		$sanitized = array();
		foreach ( $properties as $key => $value ) {
			$key = sanitize_key( $key );
			if ( is_string( $value ) ) {
				$sanitized[ $key ] = sanitize_text_field( $value );
			} elseif ( is_numeric( $value ) ) {
				$sanitized[ $key ] = $value;
			} elseif ( is_bool( $value ) ) {
				$sanitized[ $key ] = $value;
			} elseif ( is_array( $value ) ) {
				$sanitized[ $key ] = $this->sanitize_element_properties( $value );
			}
		}

		return $sanitized;
	}

	/**
	 * Sanitize element styles
	 *
	 * @param mixed $styles Styles data.
	 * @return array Sanitized styles
	 */
	private function sanitize_element_styles( $styles ) {
		if ( ! is_array( $styles ) ) {
			return array();
		}

		$sanitized = array();
		$allowed_properties = array(
			'color', 'background-color', 'font-size', 'font-family', 'font-weight',
			'text-align', 'margin', 'padding', 'border', 'border-radius',
			'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom',
			'z-index', 'opacity', 'transform', 'transition', 'box-shadow', 'text-shadow'
		);

		foreach ( $styles as $property => $value ) {
			$property = sanitize_key( str_replace( '_', '-', $property ) );
			if ( in_array( $property, $allowed_properties, true ) && is_string( $value ) ) {
				$sanitized[ $property ] = sanitize_text_field( $value );
			}
		}

		return $sanitized;
	}

	/**
	 * Sanitize CSS
	 *
	 * @param string $css CSS string.
	 * @return string Sanitized CSS
	 */
	private function sanitize_css( $css ) {
		if ( ! is_string( $css ) ) {
			return '';
		}

		// Remove potentially dangerous CSS
		$css = preg_replace( '/javascript\s*:/i', '', $css );
		$css = preg_replace( '/expression\s*\(/i', '', $css );
		$css = preg_replace( '/@import/i', '', $css );
		$css = preg_replace( '/behavior\s*:/i', '', $css );

		return wp_strip_all_tags( $css );
	}

	/**
	 * Sanitize template settings
	 *
	 * @param mixed $settings Settings data.
	 * @return array Sanitized settings
	 */
	private function sanitize_settings( $settings ) {
		if ( ! is_array( $settings ) ) {
			return array();
		}

		$sanitized = array();
		foreach ( $settings as $key => $value ) {
			$key = sanitize_key( $key );
			if ( is_string( $value ) ) {
				$sanitized[ $key ] = sanitize_text_field( $value );
			} elseif ( is_numeric( $value ) ) {
				$sanitized[ $key ] = $value;
			} elseif ( is_bool( $value ) ) {
				$sanitized[ $key ] = $value;
			} elseif ( is_array( $value ) ) {
				$sanitized[ $key ] = $this->sanitize_settings( $value );
			}
		}

		return $sanitized;
	}

	/**
	 * Validate template elements
	 *
	 * @param array $elements Elements to validate.
	 * @return array Validation errors
	 */
	private function validate_elements( $elements ) {
		$errors = array();

		foreach ( $elements as $index => $element ) {
			if ( ! is_array( $element ) ) {
				$errors[] = "Element at index {$index} must be an array";
				continue;
			}

			// Validate required fields
			if ( empty( $element['id'] ) ) {
				$errors[] = "Element at index {$index} must have an ID";
			}

			if ( empty( $element['type'] ) ) {
				$errors[] = "Element at index {$index} must have a type";
			}

			// Validate position
			if ( isset( $element['position'] ) && ! $this->is_valid_position( $element['position'] ) ) {
				$errors[] = "Element at index {$index} has invalid position data";
			}

			// Validate size
			if ( isset( $element['size'] ) && ! $this->is_valid_size( $element['size'] ) ) {
				$errors[] = "Element at index {$index} has invalid size data";
			}
		}

		return $errors;
	}

	/**
	 * Validate CSS
	 *
	 * @param string $css CSS to validate.
	 * @return array Validation errors
	 */
	private function validate_css( $css ) {
		$errors = array();

		// Check for dangerous patterns
		if ( preg_match( '/javascript\s*:/i', $css ) ) {
			$errors[] = 'CSS contains dangerous javascript: protocol';
		}

		if ( preg_match( '/expression\s*\(/i', $css ) ) {
			$errors[] = 'CSS contains dangerous expression() function';
		}

		if ( preg_match( '/@import/i', $css ) ) {
			$errors[] = 'CSS @import statements are not allowed';
		}

		if ( preg_match( '/behavior\s*:/i', $css ) ) {
			$errors[] = 'CSS behavior property is not allowed';
		}

		return $errors;
	}

	/**
	 * Check if position data is valid
	 *
	 * @param mixed $position Position data.
	 * @return bool
	 */
	private function is_valid_position( $position ) {
		return is_array( $position ) &&
			   isset( $position['x'] ) && is_numeric( $position['x'] ) &&
			   isset( $position['y'] ) && is_numeric( $position['y'] );
	}

	/**
	 * Check if size data is valid
	 *
	 * @param mixed $size Size data.
	 * @return bool
	 */
	private function is_valid_size( $size ) {
		return is_array( $size ) &&
			   isset( $size['width'] ) && is_numeric( $size['width'] ) && $size['width'] > 0 &&
			   isset( $size['height'] ) && is_numeric( $size['height'] ) && $size['height'] > 0;
	}

	/**
	 * Decode JSON field safely
	 *
	 * @param string $json JSON string.
	 * @param mixed  $default Default value if decode fails.
	 * @return mixed Decoded data or default
	 */
	private function decode_json_field( $json, $default = null ) {
		if ( is_string( $json ) ) {
			$decoded = json_decode( $json, true );
			return ( json_last_error() === JSON_ERROR_NONE ) ? $decoded : $default;
		}

		return is_array( $json ) ? $json : $default;
	}

	/**
	 * Convert template to array format
	 *
	 * @return array Template data as array
	 */
	public function to_array() {
		return array(
			'id'          => $this->id,
			'name'        => $this->name,
			'description' => $this->description,
			'type'        => $this->type,
			'elements'    => $this->elements,
			'styles'      => $this->styles,
			'settings'    => $this->settings,
			'created_at'  => $this->created_at,
			'updated_at'  => $this->updated_at,
			'is_active'   => $this->is_active,
		);
	}

	/**
	 * Create template from array data
	 *
	 * @param array $data Template data.
	 * @return CustomTemplate
	 */
	public static function from_array( $data ) {
		return new self( $data );
	}
}
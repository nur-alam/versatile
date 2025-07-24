<?php
/**
 * Template Element Model
 *
 * @package Versatile\Services\TemplateDesigner\Models
 * @subpackage Versatile\Services\TemplateDesigner\Models\TemplateElement
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Models;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TemplateElement model class for handling individual template elements
 */
class TemplateElement {

	/**
	 * Element ID
	 *
	 * @var string
	 */
	public $id;

	/**
	 * Element type (text, image, button, countdown, etc.)
	 *
	 * @var string
	 */
	public $type;

	/**
	 * Element properties
	 *
	 * @var array
	 */
	public $properties;

	/**
	 * Element position (x, y coordinates)
	 *
	 * @var array
	 */
	public $position;

	/**
	 * Element size (width, height)
	 *
	 * @var array
	 */
	public $size;

	/**
	 * Element CSS styles
	 *
	 * @var array
	 */
	public $styles;

	/**
	 * Element content
	 *
	 * @var mixed
	 */
	public $content;

	/**
	 * Constructor
	 *
	 * @param array $data Element data.
	 */
	public function __construct( $data = array() ) {
		$this->id         = isset( $data['id'] ) ? sanitize_text_field( $data['id'] ) : '';
		$this->type       = isset( $data['type'] ) ? $this->sanitize_type( $data['type'] ) : '';
		$this->properties = isset( $data['properties'] ) ? $this->sanitize_properties( $data['properties'] ) : array();
		$this->position   = isset( $data['position'] ) ? $this->sanitize_position( $data['position'] ) : array( 'x' => 0, 'y' => 0 );
		$this->size       = isset( $data['size'] ) ? $this->sanitize_size( $data['size'] ) : array( 'width' => 100, 'height' => 50 );
		$this->styles     = isset( $data['styles'] ) ? $this->sanitize_styles( $data['styles'] ) : array();
		$this->content    = isset( $data['content'] ) ? $this->sanitize_content( $data['content'] ) : '';
	}

	/**
	 * Validate element data
	 *
	 * @return array Validation result
	 */
	public function validate() {
		$errors = array();

		// Validate ID
		if ( empty( $this->id ) ) {
			$errors[] = 'Element ID is required';
		} elseif ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $this->id ) ) {
			$errors[] = 'Element ID must contain only alphanumeric characters, hyphens, and underscores';
		}

		// Validate type
		$valid_types = array_keys( self::get_element_types() );
		if ( empty( $this->type ) ) {
			$errors[] = 'Element type is required';
		} elseif ( ! in_array( $this->type, $valid_types, true ) ) {
			$errors[] = 'Element type must be one of: ' . implode( ', ', $valid_types );
		}

		// Validate position
		if ( ! $this->is_valid_position( $this->position ) ) {
			$errors[] = 'Element position must have valid x and y coordinates';
		}

		// Validate size
		if ( ! $this->is_valid_size( $this->size ) ) {
			$errors[] = 'Element size must have valid width and height values greater than 0';
		}

		// Validate properties based on element type
		$type_errors = $this->validate_type_specific_properties();
		$errors      = array_merge( $errors, $type_errors );

		return array(
			'valid'  => empty( $errors ),
			'errors' => $errors,
		);
	}

	/**
	 * Sanitize element properties
	 *
	 * @return void
	 */
	public function sanitize() {
		$this->id         = sanitize_text_field( $this->id );
		$this->type       = $this->sanitize_type( $this->type );
		$this->properties = $this->sanitize_properties( $this->properties );
		$this->position   = $this->sanitize_position( $this->position );
		$this->size       = $this->sanitize_size( $this->size );
		$this->styles     = $this->sanitize_styles( $this->styles );
		$this->content    = $this->sanitize_content( $this->content );
	}

	/**
	 * Get element type definitions
	 *
	 * @return array Element type definitions
	 */
	public static function get_element_types() {
		return array(
			'text'      => array(
				'name'        => 'Text',
				'description' => 'Text element with customizable content and styling',
				'properties'  => array(
					'content'    => array( 'type' => 'string', 'required' => true ),
					'fontSize'   => array( 'type' => 'string', 'default' => '16px' ),
					'fontFamily' => array( 'type' => 'string', 'default' => 'Arial' ),
					'fontWeight' => array( 'type' => 'string', 'default' => 'normal' ),
					'color'      => array( 'type' => 'string', 'default' => '#000000' ),
					'textAlign'  => array( 'type' => 'string', 'default' => 'left' ),
					'lineHeight' => array( 'type' => 'string', 'default' => '1.4' ),
				),
			),
			'heading'   => array(
				'name'        => 'Heading',
				'description' => 'Heading element with different levels (H1-H6)',
				'properties'  => array(
					'content'    => array( 'type' => 'string', 'required' => true ),
					'level'      => array( 'type' => 'integer', 'default' => 1, 'min' => 1, 'max' => 6 ),
					'fontSize'   => array( 'type' => 'string', 'default' => '24px' ),
					'fontFamily' => array( 'type' => 'string', 'default' => 'Arial' ),
					'fontWeight' => array( 'type' => 'string', 'default' => 'bold' ),
					'color'      => array( 'type' => 'string', 'default' => '#000000' ),
					'textAlign'  => array( 'type' => 'string', 'default' => 'left' ),
				),
			),
			'image'     => array(
				'name'        => 'Image',
				'description' => 'Image element with customizable source and styling',
				'properties'  => array(
					'src'    => array( 'type' => 'string', 'required' => true ),
					'alt'    => array( 'type' => 'string', 'default' => '' ),
					'fit'    => array( 'type' => 'string', 'default' => 'cover' ),
					'radius' => array( 'type' => 'string', 'default' => '0px' ),
				),
			),
			'button'    => array(
				'name'        => 'Button',
				'description' => 'Interactive button element',
				'properties'  => array(
					'text'            => array( 'type' => 'string', 'required' => true ),
					'url'             => array( 'type' => 'string', 'default' => '#' ),
					'target'          => array( 'type' => 'string', 'default' => '_self' ),
					'backgroundColor' => array( 'type' => 'string', 'default' => '#007cba' ),
					'textColor'       => array( 'type' => 'string', 'default' => '#ffffff' ),
					'fontSize'        => array( 'type' => 'string', 'default' => '16px' ),
					'padding'         => array( 'type' => 'string', 'default' => '12px 24px' ),
					'borderRadius'    => array( 'type' => 'string', 'default' => '4px' ),
					'border'          => array( 'type' => 'string', 'default' => 'none' ),
				),
			),
			'countdown' => array(
				'name'        => 'Countdown Timer',
				'description' => 'Dynamic countdown timer element',
				'properties'  => array(
					'targetDate'      => array( 'type' => 'string', 'required' => true ),
					'format'          => array( 'type' => 'string', 'default' => 'days:hours:minutes:seconds' ),
					'fontSize'        => array( 'type' => 'string', 'default' => '24px' ),
					'fontFamily'      => array( 'type' => 'string', 'default' => 'Arial' ),
					'color'           => array( 'type' => 'string', 'default' => '#000000' ),
					'backgroundColor' => array( 'type' => 'string', 'default' => 'transparent' ),
					'showLabels'      => array( 'type' => 'boolean', 'default' => true ),
					'separator'       => array( 'type' => 'string', 'default' => ':' ),
				),
			),
			'social'    => array(
				'name'        => 'Social Media Links',
				'description' => 'Social media links with icons',
				'properties'  => array(
					'links'     => array( 'type' => 'array', 'required' => true ),
					'iconSize'  => array( 'type' => 'string', 'default' => '24px' ),
					'iconColor' => array( 'type' => 'string', 'default' => '#000000' ),
					'spacing'   => array( 'type' => 'string', 'default' => '10px' ),
					'style'     => array( 'type' => 'string', 'default' => 'icons' ),
				),
			),
			'form'      => array(
				'name'        => 'Contact Form',
				'description' => 'Contact form element',
				'properties'  => array(
					'fields'          => array( 'type' => 'array', 'required' => true ),
					'submitText'      => array( 'type' => 'string', 'default' => 'Submit' ),
					'successMessage'  => array( 'type' => 'string', 'default' => 'Thank you for your message!' ),
					'errorMessage'    => array( 'type' => 'string', 'default' => 'Please fill in all required fields.' ),
					'backgroundColor' => array( 'type' => 'string', 'default' => '#ffffff' ),
					'borderColor'     => array( 'type' => 'string', 'default' => '#cccccc' ),
					'buttonColor'     => array( 'type' => 'string', 'default' => '#007cba' ),
				),
			),
			'progress'  => array(
				'name'        => 'Progress Bar',
				'description' => 'Progress bar element',
				'properties'  => array(
					'percentage'      => array( 'type' => 'integer', 'required' => true, 'min' => 0, 'max' => 100 ),
					'showPercentage'  => array( 'type' => 'boolean', 'default' => true ),
					'backgroundColor' => array( 'type' => 'string', 'default' => '#f0f0f0' ),
					'fillColor'       => array( 'type' => 'string', 'default' => '#007cba' ),
					'height'          => array( 'type' => 'string', 'default' => '20px' ),
					'borderRadius'    => array( 'type' => 'string', 'default' => '10px' ),
				),
			),
			'spacer'    => array(
				'name'        => 'Spacer',
				'description' => 'Empty space element for layout',
				'properties'  => array(
					'height' => array( 'type' => 'string', 'default' => '20px' ),
				),
			),
			'divider'   => array(
				'name'        => 'Divider',
				'description' => 'Horizontal divider line',
				'properties'  => array(
					'style'     => array( 'type' => 'string', 'default' => 'solid' ),
					'color'     => array( 'type' => 'string', 'default' => '#cccccc' ),
					'thickness' => array( 'type' => 'string', 'default' => '1px' ),
					'width'     => array( 'type' => 'string', 'default' => '100%' ),
				),
			),
		);
	}

	/**
	 * Sanitize element type
	 *
	 * @param string $type Element type.
	 * @return string Sanitized type
	 */
	private function sanitize_type( $type ) {
		$valid_types = array_keys( self::get_element_types() );
		return in_array( $type, $valid_types, true ) ? $type : '';
	}

	/**
	 * Sanitize element properties
	 *
	 * @param mixed $properties Properties data.
	 * @return array Sanitized properties
	 */
	private function sanitize_properties( $properties ) {
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
				$sanitized[ $key ] = $this->sanitize_properties( $value );
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
	 * Sanitize element styles
	 *
	 * @param mixed $styles Styles data.
	 * @return array Sanitized styles
	 */
	private function sanitize_styles( $styles ) {
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
	 * Sanitize element content
	 *
	 * @param mixed $content Content data.
	 * @return string Sanitized content
	 */
	private function sanitize_content( $content ) {
		if ( is_string( $content ) ) {
			return wp_kses_post( $content );
		}

		return '';
	}

	/**
	 * Validate type-specific properties
	 *
	 * @return array Validation errors
	 */
	private function validate_type_specific_properties() {
		$errors = array();
		$element_types = self::get_element_types();

		if ( ! isset( $element_types[ $this->type ] ) ) {
			return $errors;
		}

		$type_definition = $element_types[ $this->type ];
		$required_properties = array();

		// Check for required properties
		foreach ( $type_definition['properties'] as $prop_name => $prop_config ) {
			if ( isset( $prop_config['required'] ) && $prop_config['required'] ) {
				$required_properties[] = $prop_name;
			}
		}

		foreach ( $required_properties as $required_prop ) {
			if ( ! isset( $this->properties[ $required_prop ] ) || empty( $this->properties[ $required_prop ] ) ) {
				$errors[] = "Property '{$required_prop}' is required for element type '{$this->type}'";
			}
		}

		// Validate property types and constraints
		foreach ( $this->properties as $prop_name => $prop_value ) {
			if ( isset( $type_definition['properties'][ $prop_name ] ) ) {
				$prop_config = $type_definition['properties'][ $prop_name ];
				$validation_error = $this->validate_property_value( $prop_name, $prop_value, $prop_config );
				if ( $validation_error ) {
					$errors[] = $validation_error;
				}
			}
		}

		return $errors;
	}

	/**
	 * Validate individual property value
	 *
	 * @param string $prop_name Property name.
	 * @param mixed  $prop_value Property value.
	 * @param array  $prop_config Property configuration.
	 * @return string|null Validation error or null if valid
	 */
	private function validate_property_value( $prop_name, $prop_value, $prop_config ) {
		$expected_type = $prop_config['type'];

		switch ( $expected_type ) {
			case 'string':
				if ( ! is_string( $prop_value ) ) {
					return "Property '{$prop_name}' must be a string";
				}
				break;

			case 'integer':
				if ( ! is_numeric( $prop_value ) ) {
					return "Property '{$prop_name}' must be a number";
				}
				$int_value = (int) $prop_value;
				if ( isset( $prop_config['min'] ) && $int_value < $prop_config['min'] ) {
					return "Property '{$prop_name}' must be at least {$prop_config['min']}";
				}
				if ( isset( $prop_config['max'] ) && $int_value > $prop_config['max'] ) {
					return "Property '{$prop_name}' must be at most {$prop_config['max']}";
				}
				break;

			case 'boolean':
				if ( ! is_bool( $prop_value ) ) {
					return "Property '{$prop_name}' must be a boolean";
				}
				break;

			case 'array':
				if ( ! is_array( $prop_value ) ) {
					return "Property '{$prop_name}' must be an array";
				}
				break;
		}

		return null;
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
	 * Convert element to array format
	 *
	 * @return array Element data as array
	 */
	public function to_array() {
		return array(
			'id'         => $this->id,
			'type'       => $this->type,
			'properties' => $this->properties,
			'position'   => $this->position,
			'size'       => $this->size,
			'styles'     => $this->styles,
			'content'    => $this->content,
		);
	}

	/**
	 * Create element from array data
	 *
	 * @param array $data Element data.
	 * @return TemplateElement
	 */
	public static function from_array( $data ) {
		return new self( $data );
	}

	/**
	 * Get default properties for element type
	 *
	 * @param string $type Element type.
	 * @return array Default properties
	 */
	public static function get_default_properties( $type ) {
		$element_types = self::get_element_types();
		if ( ! isset( $element_types[ $type ] ) ) {
			return array();
		}

		$defaults = array();
		foreach ( $element_types[ $type ]['properties'] as $prop_name => $prop_config ) {
			if ( isset( $prop_config['default'] ) ) {
				$defaults[ $prop_name ] = $prop_config['default'];
			}
		}

		return $defaults;
	}
}
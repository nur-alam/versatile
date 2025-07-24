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
		// Implementation will be added in task 2.2
		$this->id         = $data['id'] ?? '';
		$this->type       = $data['type'] ?? '';
		$this->properties = $data['properties'] ?? array();
		$this->position   = $data['position'] ?? array( 'x' => 0, 'y' => 0 );
		$this->size       = $data['size'] ?? array( 'width' => 100, 'height' => 50 );
		$this->styles     = $data['styles'] ?? array();
		$this->content    = $data['content'] ?? '';
	}

	/**
	 * Validate element data
	 *
	 * @return array Validation result
	 */
	public function validate() {
		// Implementation will be added in task 2.2
		return array(
			'valid'  => false,
			'errors' => array( 'Element validation will be implemented in task 2.2' ),
		);
	}

	/**
	 * Sanitize element properties
	 *
	 * @return void
	 */
	public function sanitize() {
		// Implementation will be added in task 2.2
	}

	/**
	 * Get element type definitions
	 *
	 * @return array Element type definitions
	 */
	public static function get_element_types() {
		// Implementation will be added in task 2.2
		return array(
			'message' => 'Element type definitions will be implemented in task 2.2',
		);
	}
}
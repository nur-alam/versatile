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
		// Implementation will be added in task 2.1
		$this->id          = $data['id'] ?? null;
		$this->name        = $data['name'] ?? '';
		$this->description = $data['description'] ?? '';
		$this->type        = $data['type'] ?? 'both';
		$this->elements    = $data['elements'] ?? array();
		$this->styles      = $data['styles'] ?? '';
		$this->settings    = $data['settings'] ?? array();
		$this->created_at  = $data['created_at'] ?? '';
		$this->updated_at  = $data['updated_at'] ?? '';
		$this->is_active   = $data['is_active'] ?? false;
	}

	/**
	 * Validate template data
	 *
	 * @return array Validation result
	 */
	public function validate() {
		// Implementation will be added in task 2.1
		return array(
			'valid'  => false,
			'errors' => array( 'Template validation will be implemented in task 2.1' ),
		);
	}

	/**
	 * Serialize template data for storage
	 *
	 * @return array Serialized data
	 */
	public function serialize() {
		// Implementation will be added in task 2.1
		return array(
			'message' => 'Template serialization will be implemented in task 2.1',
		);
	}

	/**
	 * Deserialize template data from storage
	 *
	 * @param array $data Stored data.
	 * @return void
	 */
	public function deserialize( $data ) {
		// Implementation will be added in task 2.1
	}
}
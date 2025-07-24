<?php
/**
 * Template Controller
 *
 * @package Versatile\Services\TemplateDesigner\Controllers
 * @subpackage Versatile\Services\TemplateDesigner\Controllers\TemplateController
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Controllers;

use Versatile\Services\TemplateDesigner\Models\CustomTemplate;
use Versatile\Services\TemplateDesigner\Database\TemplateDatabase;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TemplateController handles CRUD operations for custom templates
 */
class TemplateController {

	/**
	 * Database operations instance
	 *
	 * @var TemplateDatabase
	 */
	private $database;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->database = new TemplateDatabase();
	}

	/**
	 * Create a new custom template
	 *
	 * @param array $data Template data.
	 * @return array Result with success/error status
	 */
	public function create_template( $data ) {
		try {
			// Validate input data
			$validation = $this->validate_template( $data );
			if ( ! $validation['success'] ) {
				return $validation;
			}

			// Create CustomTemplate instance
			$template = new CustomTemplate( $data );

			// Validate template model
			$model_validation = $template->validate();
			if ( ! $model_validation['valid'] ) {
				return array(
					'success' => false,
					'message' => 'Template validation failed',
					'errors'  => $model_validation['errors'],
				);
			}

			// Prepare data for database insertion
			$serialized_data = $template->serialize();
			unset( $serialized_data['id'] ); // Remove ID for new template
			$serialized_data['created_by'] = get_current_user_id();

			// Insert template into database using database class
			$db_result = $this->database->insert_template( array(
				'name'          => $serialized_data['name'],
				'description'   => $serialized_data['description'],
				'type'          => $serialized_data['type'],
				'template_data' => $serialized_data['elements'],
				'custom_css'    => $serialized_data['styles'],
				'settings'      => $serialized_data['settings'],
				'is_active'     => $serialized_data['is_active'],
				'created_by'    => $serialized_data['created_by'],
			) );

			if ( ! $db_result['success'] ) {
				return array(
					'success' => false,
					'message' => 'Failed to create template in database',
					'error'   => $db_result['message'],
				);
			}

			$template_id = $db_result['insert_id'];

			return array(
				'success' => true,
				'message' => 'Template created successfully',
				'data'    => array(
					'id' => $template_id,
				),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error creating template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Update an existing template
	 *
	 * @param int   $id Template ID.
	 * @param array $data Template data.
	 * @return array Result with success/error status
	 */
	public function update_template( $id, $data ) {
		try {
			// Validate ID
			if ( empty( $id ) || ! is_numeric( $id ) ) {
				return array(
					'success' => false,
					'message' => 'Invalid template ID',
				);
			}

			// Check if template exists
			$existing_template = $this->get_template( $id );
			if ( ! $existing_template['success'] ) {
				return $existing_template;
			}

			// Merge existing data with updates
			$merged_data = array_merge( $existing_template['data'], $data );

			// Validate merged data
			$validation = $this->validate_template( $merged_data );
			if ( ! $validation['success'] ) {
				return $validation;
			}

			// Create CustomTemplate instance
			$template = new CustomTemplate( $merged_data );
			$template->id = (int) $id;

			// Validate template model
			$model_validation = $template->validate();
			if ( ! $model_validation['valid'] ) {
				return array(
					'success' => false,
					'message' => 'Template validation failed',
					'errors'  => $model_validation['errors'],
				);
			}

			// Prepare update data
			$update_data   = array();
			$update_format = array();

			if ( isset( $data['name'] ) ) {
				$update_data['name'] = $template->name;
				$update_format[]     = '%s';
			}

			if ( isset( $data['description'] ) ) {
				$update_data['description'] = $template->description;
				$update_format[]            = '%s';
			}

			if ( isset( $data['type'] ) ) {
				$update_data['type'] = $template->type;
				$update_format[]     = '%s';
			}

			if ( isset( $data['elements'] ) ) {
				$update_data['template_data'] = wp_json_encode( $template->elements );
				$update_format[]              = '%s';
			}

			if ( isset( $data['styles'] ) ) {
				$update_data['custom_css'] = $template->styles;
				$update_format[]           = '%s';
			}

			if ( isset( $data['settings'] ) ) {
				$update_data['settings'] = wp_json_encode( $template->settings );
				$update_format[]         = '%s';
			}

			if ( isset( $data['is_active'] ) ) {
				$update_data['is_active'] = $template->is_active ? 1 : 0;
				$update_format[]          = '%d';
			}

			if ( empty( $update_data ) ) {
				return array(
					'success' => false,
					'message' => 'No data to update',
				);
			}

			// Update template in database using database class
			$db_result = $this->database->update_template( $id, $update_data, $update_format );

			if ( ! $db_result['success'] ) {
				return array(
					'success' => false,
					'message' => 'Failed to update template in database',
					'error'   => $db_result['message'],
				);
			}

			return array(
				'success' => true,
				'message' => 'Template updated successfully',
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error updating template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Delete a template
	 *
	 * @param int $id Template ID.
	 * @return array Result with success/error status
	 */
	public function delete_template( $id ) {
		try {
			// Validate ID
			if ( empty( $id ) || ! is_numeric( $id ) ) {
				return array(
					'success' => false,
					'message' => 'Invalid template ID',
				);
			}

			// Check if template exists
			$existing_template = $this->get_template( $id );
			if ( ! $existing_template['success'] ) {
				return array(
					'success' => false,
					'message' => 'Template not found',
				);
			}

			// Delete template from database using database class
			$db_result = $this->database->delete_template( $id );

			if ( ! $db_result['success'] ) {
				return array(
					'success' => false,
					'message' => 'Failed to delete template from database',
					'error'   => $db_result['message'],
				);
			}

			if ( 0 === $db_result['rows_deleted'] ) {
				return array(
					'success' => false,
					'message' => 'Template not found or already deleted',
				);
			}

			return array(
				'success' => true,
				'message' => 'Template deleted successfully',
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error deleting template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Retrieve a template by ID
	 *
	 * @param int $id Template ID.
	 * @return array Template data or error
	 */
	public function get_template( $id ) {
		try {
			// Validate ID
			if ( empty( $id ) || ! is_numeric( $id ) ) {
				return array(
					'success' => false,
					'message' => 'Invalid template ID',
				);
			}

			// Retrieve template from database using database class
			$template_data = $this->database->get_template_by_id( $id );

			if ( ! $template_data ) {
				return array(
					'success' => false,
					'message' => 'Template not found',
				);
			}

			// Create CustomTemplate instance and deserialize
			$template = new CustomTemplate();
			$template->deserialize( $template_data );

			return array(
				'success' => true,
				'message' => 'Template retrieved successfully',
				'data'    => $template->to_array(),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error retrieving template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * List templates with filtering and pagination
	 *
	 * @param array $filters Filtering options.
	 * @return array List of templates
	 */
	public function list_templates( $filters = array() ) {
		try {
			// Prepare database query arguments
			$db_args = array(
				'type'       => isset( $filters['type'] ) ? $filters['type'] : null,
				'is_active'  => isset( $filters['is_active'] ) ? $filters['is_active'] : null,
				'search'     => isset( $filters['search'] ) ? $filters['search'] : null,
				'created_by' => isset( $filters['created_by'] ) ? $filters['created_by'] : null,
				'order_by'   => isset( $filters['order_by'] ) ? $filters['order_by'] : 'updated_at',
				'order'      => isset( $filters['order'] ) ? $filters['order'] : 'DESC',
				'limit'      => isset( $filters['limit'] ) ? max( 1, (int) $filters['limit'] ) : 20,
				'offset'     => isset( $filters['offset'] ) ? max( 0, (int) $filters['offset'] ) : 0,
			);

			// Get templates from database using database class
			$templates_data = $this->database->get_templates( $db_args );

			// Convert to CustomTemplate objects
			$templates = array();
			foreach ( $templates_data as $template_data ) {
				$template = new CustomTemplate();
				$template->deserialize( $template_data );
				$templates[] = $template->to_array();
			}

			// Get total count for pagination
			$total_count = $this->database->get_templates_count( $db_args );

			return array(
				'success' => true,
				'message' => 'Templates retrieved successfully',
				'data'    => array(
					'templates' => $templates,
					'total'     => (int) $total_count,
					'limit'     => $limit,
					'offset'    => $offset,
					'has_more'  => ( $offset + $limit ) < (int) $total_count,
				),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error listing templates: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Validate template data
	 *
	 * @param array $data Template data to validate.
	 * @return array Validation result
	 */
	public function validate_template( $data ) {
		try {
			$errors = array();

			// Validate required fields
			if ( empty( $data['name'] ) ) {
				$errors[] = 'Template name is required';
			} elseif ( strlen( $data['name'] ) > 255 ) {
				$errors[] = 'Template name must be 255 characters or less';
			}

			// Validate type
			$valid_types = array( 'maintenance', 'comingsoon', 'both' );
			if ( isset( $data['type'] ) && ! in_array( $data['type'], $valid_types, true ) ) {
				$errors[] = 'Template type must be one of: ' . implode( ', ', $valid_types );
			}

			// Validate elements structure
			if ( isset( $data['elements'] ) ) {
				if ( ! is_array( $data['elements'] ) ) {
					$errors[] = 'Template elements must be an array';
				} else {
					$element_errors = $this->validate_elements( $data['elements'] );
					$errors = array_merge( $errors, $element_errors );
				}
			}

			// Validate settings
			if ( isset( $data['settings'] ) && ! is_array( $data['settings'] ) ) {
				$errors[] = 'Template settings must be an array';
			}

			// Validate CSS if provided
			if ( ! empty( $data['styles'] ) ) {
				$css_errors = $this->validate_css( $data['styles'] );
				$errors = array_merge( $errors, $css_errors );
			}

			// Check for duplicate names (excluding current template if updating)
			if ( ! empty( $data['name'] ) ) {
				$duplicate_check = $this->check_duplicate_name( $data['name'], isset( $data['id'] ) ? $data['id'] : null );
				if ( ! $duplicate_check['success'] ) {
					$errors[] = $duplicate_check['message'];
				}
			}

			if ( ! empty( $errors ) ) {
				return array(
					'success' => false,
					'message' => 'Template validation failed',
					'errors'  => $errors,
				);
			}

			return array(
				'success' => true,
				'message' => 'Template validation passed',
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error validating template: ' . $e->getMessage(),
			);
		}
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

		if ( ! is_string( $css ) ) {
			$errors[] = 'CSS must be a string';
			return $errors;
		}

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
	 * Check for duplicate template names
	 *
	 * @param string   $name Template name.
	 * @param int|null $exclude_id Template ID to exclude from check.
	 * @return array Check result
	 */
	private function check_duplicate_name( $name, $exclude_id = null ) {
		try {
			$exists = $this->database->template_name_exists( $name, $exclude_id );

			if ( $exists ) {
				return array(
					'success' => false,
					'message' => 'A template with this name already exists',
				);
			}

			return array(
				'success' => true,
				'message' => 'Template name is available',
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error checking duplicate name: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Get templates by type
	 *
	 * @param string $type Template type.
	 * @return array Templates of specified type
	 */
	public function get_templates_by_type( $type ) {
		return $this->list_templates( array( 'type' => $type ) );
	}

	/**
	 * Get active templates
	 *
	 * @return array Active templates
	 */
	public function get_active_templates() {
		return $this->list_templates( array( 'is_active' => 1 ) );
	}

	/**
	 * Activate a template
	 *
	 * @param int $id Template ID.
	 * @return array Result
	 */
	public function activate_template( $id ) {
		return $this->update_template( $id, array( 'is_active' => true ) );
	}

	/**
	 * Deactivate a template
	 *
	 * @param int $id Template ID.
	 * @return array Result
	 */
	public function deactivate_template( $id ) {
		return $this->update_template( $id, array( 'is_active' => false ) );
	}

	/**
	 * Duplicate a template
	 *
	 * @param int    $id Template ID to duplicate.
	 * @param string $new_name New template name.
	 * @return array Result
	 */
	public function duplicate_template( $id, $new_name = null ) {
		try {
			// Get original template
			$original = $this->get_template( $id );
			if ( ! $original['success'] ) {
				return $original;
			}

			$template_data = $original['data'];

			// Generate new name if not provided
			if ( empty( $new_name ) ) {
				$new_name = $template_data['name'] . ' (Copy)';
				$counter = 1;
				while ( ! $this->check_duplicate_name( $new_name )['success'] ) {
					$new_name = $template_data['name'] . ' (Copy ' . $counter . ')';
					$counter++;
				}
			}

			// Prepare data for new template
			$new_template_data = $template_data;
			$new_template_data['name'] = $new_name;
			$new_template_data['is_active'] = false; // New template should be inactive
			unset( $new_template_data['id'] ); // Remove ID for new template
			unset( $new_template_data['created_at'] );
			unset( $new_template_data['updated_at'] );

			// Create the duplicate
			return $this->create_template( $new_template_data );

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error duplicating template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Bulk update templates
	 *
	 * @param array $template_ids Template IDs.
	 * @param array $data Update data.
	 * @return array Result
	 */
	public function bulk_update_templates( $template_ids, $data ) {
		try {
			// Validate data first
			$validation = $this->validate_template( $data );
			if ( ! $validation['success'] ) {
				return $validation;
			}

			return $this->database->bulk_update_templates( $template_ids, $data );

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error in bulk update: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Bulk delete templates
	 *
	 * @param array $template_ids Template IDs.
	 * @return array Result
	 */
	public function bulk_delete_templates( $template_ids ) {
		try {
			return $this->database->bulk_delete_templates( $template_ids );

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error in bulk delete: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Search templates
	 *
	 * @param string $search_term Search term.
	 * @param array  $additional_filters Additional filters.
	 * @return array Search results
	 */
	public function search_templates( $search_term, $additional_filters = array() ) {
		$filters = array_merge( $additional_filters, array( 'search' => $search_term ) );
		return $this->list_templates( $filters );
	}

	/**
	 * Get templates by user
	 *
	 * @param int   $user_id User ID.
	 * @param array $additional_filters Additional filters.
	 * @return array User's templates
	 */
	public function get_templates_by_user( $user_id, $additional_filters = array() ) {
		$filters = array_merge( $additional_filters, array( 'created_by' => $user_id ) );
		return $this->list_templates( $filters );
	}

	/**
	 * Get database statistics
	 *
	 * @return array Database statistics
	 */
	public function get_statistics() {
		try {
			return array(
				'success' => true,
				'message' => 'Statistics retrieved successfully',
				'data'    => $this->database->get_statistics(),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error retrieving statistics: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Optimize database
	 *
	 * @return array Result
	 */
	public function optimize_database() {
		try {
			return $this->database->optimize_table();

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error optimizing database: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Check database health
	 *
	 * @return array Health check results
	 */
	public function check_database_health() {
		try {
			return $this->database->check_table_health();

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error checking database health: ' . $e->getMessage(),
			);
		}
	}
}
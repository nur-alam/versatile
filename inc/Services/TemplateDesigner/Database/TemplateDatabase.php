<?php
/**
 * Template Database Operations
 *
 * @package Versatile\Services\TemplateDesigner\Database
 * @subpackage Versatile\Services\TemplateDesigner\Database\TemplateDatabase
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Database;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TemplateDatabase handles low-level database operations for custom templates
 */
class TemplateDatabase {

	/**
	 * Database table name
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * WordPress database instance
	 *
	 * @var \wpdb
	 */
	private $wpdb;

	/**
	 * Constructor
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
		$this->table_name = $wpdb->prefix . 'versatile_custom_templates';
	}

	/**
	 * Create the custom templates table
	 *
	 * @return bool Success status
	 */
	public function create_table() {
		$charset_collate = $this->wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$this->table_name} (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			description text,
			type enum('maintenance', 'comingsoon', 'both') DEFAULT 'both',
			template_data longtext NOT NULL,
			custom_css longtext,
			settings longtext,
			is_active tinyint(1) DEFAULT 0,
			created_by bigint(20),
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY idx_type (type),
			KEY idx_active (is_active),
			KEY idx_created_by (created_by),
			KEY idx_name (name),
			KEY idx_created_at (created_at),
			KEY idx_updated_at (updated_at)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$result = dbDelta( $sql );

		return ! empty( $result );
	}

	/**
	 * Insert a new template
	 *
	 * @param array $data Template data.
	 * @return array Result with success status and insert ID
	 */
	public function insert_template( $data ) {
		try {
			// Start transaction
			$this->wpdb->query( 'START TRANSACTION' );

			$result = $this->wpdb->insert(
				$this->table_name,
				$data,
				array( '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%d' )
			);

			if ( false === $result ) {
				$this->wpdb->query( 'ROLLBACK' );
				return array(
					'success' => false,
					'message' => 'Failed to insert template',
					'error'   => $this->wpdb->last_error,
				);
			}

			$insert_id = $this->wpdb->insert_id;

			// Commit transaction
			$this->wpdb->query( 'COMMIT' );

			return array(
				'success'   => true,
				'message'   => 'Template inserted successfully',
				'insert_id' => $insert_id,
			);

		} catch ( \Exception $e ) {
			$this->wpdb->query( 'ROLLBACK' );
			return array(
				'success' => false,
				'message' => 'Error inserting template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Update an existing template
	 *
	 * @param int   $id Template ID.
	 * @param array $data Update data.
	 * @param array $format Data format.
	 * @return array Result with success status
	 */
	public function update_template( $id, $data, $format = null ) {
		try {
			// Start transaction
			$this->wpdb->query( 'START TRANSACTION' );

			// Default format if not provided
			if ( null === $format ) {
				$format = array_fill( 0, count( $data ), '%s' );
			}

			$result = $this->wpdb->update(
				$this->table_name,
				$data,
				array( 'id' => (int) $id ),
				$format,
				array( '%d' )
			);

			if ( false === $result ) {
				$this->wpdb->query( 'ROLLBACK' );
				return array(
					'success' => false,
					'message' => 'Failed to update template',
					'error'   => $this->wpdb->last_error,
				);
			}

			// Commit transaction
			$this->wpdb->query( 'COMMIT' );

			return array(
				'success'      => true,
				'message'      => 'Template updated successfully',
				'rows_updated' => $result,
			);

		} catch ( \Exception $e ) {
			$this->wpdb->query( 'ROLLBACK' );
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
	 * @return array Result with success status
	 */
	public function delete_template( $id ) {
		try {
			// Start transaction
			$this->wpdb->query( 'START TRANSACTION' );

			$result = $this->wpdb->delete(
				$this->table_name,
				array( 'id' => (int) $id ),
				array( '%d' )
			);

			if ( false === $result ) {
				$this->wpdb->query( 'ROLLBACK' );
				return array(
					'success' => false,
					'message' => 'Failed to delete template',
					'error'   => $this->wpdb->last_error,
				);
			}

			// Commit transaction
			$this->wpdb->query( 'COMMIT' );

			return array(
				'success'      => true,
				'message'      => 'Template deleted successfully',
				'rows_deleted' => $result,
			);

		} catch ( \Exception $e ) {
			$this->wpdb->query( 'ROLLBACK' );
			return array(
				'success' => false,
				'message' => 'Error deleting template: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Get a template by ID
	 *
	 * @param int $id Template ID.
	 * @return array|null Template data or null if not found
	 */
	public function get_template_by_id( $id ) {
		$result = $this->wpdb->get_row(
			$this->wpdb->prepare( "SELECT * FROM {$this->table_name} WHERE id = %d", (int) $id ),
			ARRAY_A
		);

		return $result ?: null;
	}

	/**
	 * Get templates with advanced filtering and search
	 *
	 * @param array $args Query arguments.
	 * @return array Query results
	 */
	public function get_templates( $args = array() ) {
		$defaults = array(
			'type'       => null,
			'is_active'  => null,
			'created_by' => null,
			'search'     => null,
			'order_by'   => 'updated_at',
			'order'      => 'DESC',
			'limit'      => 20,
			'offset'     => 0,
			'fields'     => '*',
		);

		$args = wp_parse_args( $args, $defaults );

		// Build WHERE clause
		$where_conditions = array( '1=1' );
		$where_values     = array();

		// Filter by type
		if ( ! empty( $args['type'] ) ) {
			$where_conditions[] = '(type = %s OR type = "both")';
			$where_values[]     = sanitize_text_field( $args['type'] );
		}

		// Filter by active status
		if ( null !== $args['is_active'] ) {
			$where_conditions[] = 'is_active = %d';
			$where_values[]     = (int) $args['is_active'];
		}

		// Filter by creator
		if ( ! empty( $args['created_by'] ) ) {
			$where_conditions[] = 'created_by = %d';
			$where_values[]     = (int) $args['created_by'];
		}

		// Search functionality
		if ( ! empty( $args['search'] ) ) {
			$search_term = '%' . $this->wpdb->esc_like( sanitize_text_field( $args['search'] ) ) . '%';
			$where_conditions[] = '(name LIKE %s OR description LIKE %s)';
			$where_values[] = $search_term;
			$where_values[] = $search_term;
		}

		$where_clause = implode( ' AND ', $where_conditions );

		// Validate and sanitize ORDER BY
		$allowed_order_fields = array( 'id', 'name', 'type', 'is_active', 'created_by', 'created_at', 'updated_at' );
		$order_by = in_array( $args['order_by'], $allowed_order_fields, true ) ? $args['order_by'] : 'updated_at';
		$order = strtoupper( $args['order'] ) === 'ASC' ? 'ASC' : 'DESC';

		// Validate fields
		$fields = $args['fields'] === '*' ? '*' : sanitize_sql_orderby( $args['fields'] );
		if ( ! $fields ) {
			$fields = '*';
		}

		// Build query
		$query = "SELECT {$fields} FROM {$this->table_name} WHERE {$where_clause} ORDER BY {$order_by} {$order}";

		// Add pagination
		if ( $args['limit'] > 0 ) {
			$query .= ' LIMIT %d OFFSET %d';
			$where_values[] = (int) $args['limit'];
			$where_values[] = (int) $args['offset'];
		}

		// Execute query
		if ( ! empty( $where_values ) ) {
			$results = $this->wpdb->get_results(
				$this->wpdb->prepare( $query, $where_values ),
				ARRAY_A
			);
		} else {
			$results = $this->wpdb->get_results( $query, ARRAY_A );
		}

		return $results ?: array();
	}

	/**
	 * Get total count of templates matching criteria
	 *
	 * @param array $args Query arguments.
	 * @return int Total count
	 */
	public function get_templates_count( $args = array() ) {
		$defaults = array(
			'type'       => null,
			'is_active'  => null,
			'created_by' => null,
			'search'     => null,
		);

		$args = wp_parse_args( $args, $defaults );

		// Build WHERE clause (same as get_templates)
		$where_conditions = array( '1=1' );
		$where_values     = array();

		if ( ! empty( $args['type'] ) ) {
			$where_conditions[] = '(type = %s OR type = "both")';
			$where_values[]     = sanitize_text_field( $args['type'] );
		}

		if ( null !== $args['is_active'] ) {
			$where_conditions[] = 'is_active = %d';
			$where_values[]     = (int) $args['is_active'];
		}

		if ( ! empty( $args['created_by'] ) ) {
			$where_conditions[] = 'created_by = %d';
			$where_values[]     = (int) $args['created_by'];
		}

		if ( ! empty( $args['search'] ) ) {
			$search_term = '%' . $this->wpdb->esc_like( sanitize_text_field( $args['search'] ) ) . '%';
			$where_conditions[] = '(name LIKE %s OR description LIKE %s)';
			$where_values[] = $search_term;
			$where_values[] = $search_term;
		}

		$where_clause = implode( ' AND ', $where_conditions );
		$query = "SELECT COUNT(*) FROM {$this->table_name} WHERE {$where_clause}";

		if ( ! empty( $where_values ) ) {
			$count = $this->wpdb->get_var(
				$this->wpdb->prepare( $query, $where_values )
			);
		} else {
			$count = $this->wpdb->get_var( $query );
		}

		return (int) $count;
	}

	/**
	 * Check if template name exists
	 *
	 * @param string   $name Template name.
	 * @param int|null $exclude_id Template ID to exclude.
	 * @return bool True if name exists
	 */
	public function template_name_exists( $name, $exclude_id = null ) {
		$query = "SELECT COUNT(*) FROM {$this->table_name} WHERE name = %s";
		$params = array( $name );

		if ( $exclude_id ) {
			$query .= ' AND id != %d';
			$params[] = (int) $exclude_id;
		}

		$count = $this->wpdb->get_var(
			$this->wpdb->prepare( $query, $params )
		);

		return (int) $count > 0;
	}

	/**
	 * Get templates by type
	 *
	 * @param string $type Template type.
	 * @param array  $additional_args Additional query arguments.
	 * @return array Templates
	 */
	public function get_templates_by_type( $type, $additional_args = array() ) {
		$args = array_merge( $additional_args, array( 'type' => $type ) );
		return $this->get_templates( $args );
	}

	/**
	 * Get active templates
	 *
	 * @param array $additional_args Additional query arguments.
	 * @return array Active templates
	 */
	public function get_active_templates( $additional_args = array() ) {
		$args = array_merge( $additional_args, array( 'is_active' => 1 ) );
		return $this->get_templates( $args );
	}

	/**
	 * Get templates by user
	 *
	 * @param int   $user_id User ID.
	 * @param array $additional_args Additional query arguments.
	 * @return array User's templates
	 */
	public function get_templates_by_user( $user_id, $additional_args = array() ) {
		$args = array_merge( $additional_args, array( 'created_by' => $user_id ) );
		return $this->get_templates( $args );
	}

	/**
	 * Search templates
	 *
	 * @param string $search_term Search term.
	 * @param array  $additional_args Additional query arguments.
	 * @return array Search results
	 */
	public function search_templates( $search_term, $additional_args = array() ) {
		$args = array_merge( $additional_args, array( 'search' => $search_term ) );
		return $this->get_templates( $args );
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
			if ( empty( $template_ids ) || ! is_array( $template_ids ) ) {
				return array(
					'success' => false,
					'message' => 'Invalid template IDs provided',
				);
			}

			// Start transaction
			$this->wpdb->query( 'START TRANSACTION' );

			$updated_count = 0;
			$errors = array();

			foreach ( $template_ids as $id ) {
				$result = $this->update_template( $id, $data );
				if ( $result['success'] ) {
					$updated_count++;
				} else {
					$errors[] = "Failed to update template ID {$id}: " . $result['message'];
				}
			}

			if ( ! empty( $errors ) ) {
				$this->wpdb->query( 'ROLLBACK' );
				return array(
					'success' => false,
					'message' => 'Bulk update failed',
					'errors'  => $errors,
				);
			}

			// Commit transaction
			$this->wpdb->query( 'COMMIT' );

			return array(
				'success' => true,
				'message' => "Successfully updated {$updated_count} templates",
				'updated_count' => $updated_count,
			);

		} catch ( \Exception $e ) {
			$this->wpdb->query( 'ROLLBACK' );
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
			if ( empty( $template_ids ) || ! is_array( $template_ids ) ) {
				return array(
					'success' => false,
					'message' => 'Invalid template IDs provided',
				);
			}

			// Start transaction
			$this->wpdb->query( 'START TRANSACTION' );

			// Sanitize IDs
			$sanitized_ids = array_map( 'intval', $template_ids );
			$placeholders = implode( ',', array_fill( 0, count( $sanitized_ids ), '%d' ) );

			$result = $this->wpdb->query(
				$this->wpdb->prepare(
					"DELETE FROM {$this->table_name} WHERE id IN ({$placeholders})",
					$sanitized_ids
				)
			);

			if ( false === $result ) {
				$this->wpdb->query( 'ROLLBACK' );
				return array(
					'success' => false,
					'message' => 'Failed to delete templates',
					'error'   => $this->wpdb->last_error,
				);
			}

			// Commit transaction
			$this->wpdb->query( 'COMMIT' );

			return array(
				'success' => true,
				'message' => "Successfully deleted {$result} templates",
				'deleted_count' => $result,
			);

		} catch ( \Exception $e ) {
			$this->wpdb->query( 'ROLLBACK' );
			return array(
				'success' => false,
				'message' => 'Error in bulk delete: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Get database statistics
	 *
	 * @return array Database statistics
	 */
	public function get_statistics() {
		$stats = array();

		// Total templates
		$stats['total_templates'] = (int) $this->wpdb->get_var(
			"SELECT COUNT(*) FROM {$this->table_name}"
		);

		// Active templates
		$stats['active_templates'] = (int) $this->wpdb->get_var(
			"SELECT COUNT(*) FROM {$this->table_name} WHERE is_active = 1"
		);

		// Templates by type
		$type_stats = $this->wpdb->get_results(
			"SELECT type, COUNT(*) as count FROM {$this->table_name} GROUP BY type",
			ARRAY_A
		);

		$stats['by_type'] = array();
		foreach ( $type_stats as $type_stat ) {
			$stats['by_type'][ $type_stat['type'] ] = (int) $type_stat['count'];
		}

		// Recent activity (templates created in last 30 days)
		$stats['recent_templates'] = (int) $this->wpdb->get_var(
			"SELECT COUNT(*) FROM {$this->table_name} WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
		);

		return $stats;
	}

	/**
	 * Optimize database table
	 *
	 * @return array Result
	 */
	public function optimize_table() {
		try {
			$result = $this->wpdb->query( "OPTIMIZE TABLE {$this->table_name}" );

			if ( false === $result ) {
				return array(
					'success' => false,
					'message' => 'Failed to optimize table',
					'error'   => $this->wpdb->last_error,
				);
			}

			return array(
				'success' => true,
				'message' => 'Table optimized successfully',
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error optimizing table: ' . $e->getMessage(),
			);
		}
	}

	/**
	 * Check table health
	 *
	 * @return array Health check results
	 */
	public function check_table_health() {
		try {
			// Check if table exists
			$table_exists = $this->wpdb->get_var(
				$this->wpdb->prepare( 'SHOW TABLES LIKE %s', $this->table_name )
			);

			if ( ! $table_exists ) {
				return array(
					'success' => false,
					'message' => 'Table does not exist',
				);
			}

			// Check table status
			$table_status = $this->wpdb->get_row(
				$this->wpdb->prepare( 'SHOW TABLE STATUS LIKE %s', $this->table_name ),
				ARRAY_A
			);

			return array(
				'success' => true,
				'message' => 'Table health check passed',
				'data'    => array(
					'table_exists' => true,
					'table_status' => $table_status,
				),
			);

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => 'Error checking table health: ' . $e->getMessage(),
			);
		}
	}
}
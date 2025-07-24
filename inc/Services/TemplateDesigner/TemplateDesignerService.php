<?php
/**
 * TemplateDesigner Service
 *
 * @package Versatile\Services\TemplateDesigner
 * @subpackage Versatile\Services\TemplateDesigner\TemplateDesignerService
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner;

use Versatile\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * TemplateDesigner Service initialization
 */
class TemplateDesignerService {
	use JsonResponse;

	/**
	 * TemplateDesignerService constructor.
	 */
	public function __construct() {
		$this->init();
	}

	/**
	 * Initialize the template designer service
	 *
	 * @return void
	 */
	public function init() {
		// Log for debugging
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'Versatile Template Designer: Service initialization started' );
		}
		
		// Create database tables immediately
		$this->create_database_tables();

		// Register admin menu and pages
		add_action( 'admin_menu', array( $this, 'register_admin_pages' ) );

		// Enqueue assets for template designer
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Register AJAX handlers
		$this->register_ajax_handlers();
	}

	/**
	 * Create database tables for custom templates
	 *
	 * @return void
	 */
	public function create_database_tables() {
		// Use the TemplateDatabase class for table creation
		$database = new \Versatile\Services\TemplateDesigner\Database\TemplateDatabase();
		
		// Check if table already exists
		$health_check = $database->check_table_health();
		
		if ( ! $health_check['success'] || ! $health_check['data']['table_exists'] ) {
			$result = $database->create_table();
			
			// Log the result for debugging
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( 'Versatile Template Designer: Database table creation result: ' . ( $result ? 'Success' : 'Failed' ) );
			}
		}
	}

	/**
	 * Register admin menu pages for template designer
	 *
	 * @return void
	 */
	public function register_admin_pages() {
		// Check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Add template designer submenu under Versatile main menu
		$page_hook = add_submenu_page(
			'versatile',
			__( 'Template Designer', 'versatile' ),
			__( 'Template Designer', 'versatile' ),
			'manage_options',
			'versatile-template-designer',
			array( $this, 'render_template_designer_page' )
		);
		
		// Log for debugging
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			error_log( 'Versatile Template Designer: Admin menu registered with hook: ' . $page_hook );
		}
	}

	/**
	 * Render the template designer admin page
	 *
	 * @return void
	 */
	public function render_template_designer_page() {
		// Check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( __( 'You do not have sufficient permissions to access this page.', 'versatile' ) );
		}

		// Get template ID from URL parameters if editing existing template
		$template_id = isset( $_GET['template_id'] ) ? sanitize_text_field( $_GET['template_id'] ) : '';
		$mode = isset( $_GET['mode'] ) ? sanitize_text_field( $_GET['mode'] ) : 'maintenance';

		// Validate mode
		if ( ! in_array( $mode, array( 'maintenance', 'comingsoon' ), true ) ) {
			$mode = 'maintenance';
		}

		?>
		<div class="wrap">
			<h1 class="wp-heading-inline"><?php esc_html_e( 'Template Designer', 'versatile' ); ?></h1>
			<?php if ( $template_id ) : ?>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=versatile-template-designer' ) ); ?>" class="page-title-action">
					<?php esc_html_e( 'Add New', 'versatile' ); ?>
				</a>
			<?php endif; ?>
			<hr class="wp-header-end">
			
			<div 
				id="versatile-template-designer-root" 
				data-template-id="<?php echo esc_attr( $template_id ); ?>"
				data-mode="<?php echo esc_attr( $mode ); ?>"
				style="margin-top: 20px;"
			>
				<!-- Loading state -->
				<div style="display: flex; align-items: center; justify-content: center; min-height: 400px; background: #f9f9f9; border-radius: 8px;">
					<div style="text-align: center;">
						<div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
						<p style="color: #6b7280; margin: 0;"><?php esc_html_e( 'Loading Template Designer...', 'versatile' ); ?></p>
					</div>
				</div>
			</div>
		</div>
		
		<style>
			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
		</style>
		<?php
	}

	/**
	 * Enqueue assets for template designer
	 *
	 * @param string $hook_suffix The current admin page hook suffix.
	 * @return void
	 */
	public function enqueue_assets( $hook_suffix ) {
		// Only load on template designer page
		if ( 'versatile_page_versatile-template-designer' !== $hook_suffix ) {
			return;
		}

		// Check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Enqueue WordPress media library
		wp_enqueue_media();

		// Enqueue template designer assets
		wp_enqueue_script(
			'versatile-template-designer',
			VERSATILE_PLUGIN_URL . 'assets/dist/js/template-designer.min.js',
			array( 'wp-element', 'wp-i18n', 'wp-api-fetch' ),
			VERSATILE_VERSION,
			true
		);

		// Enqueue Tailwind CSS for the template designer
		wp_enqueue_style(
			'versatile-template-designer',
			VERSATILE_PLUGIN_URL . 'assets/dist/css/backend-bundle.min.css',
			array(),
			VERSATILE_VERSION
		);

		// Add inline styles for the template designer container
		$custom_css = '
			#versatile-template-designer-root {
				min-height: calc(100vh - 160px);
				background: #f0f0f1;
				border-radius: 8px;
				overflow: hidden;
			}
			.wrap h1 {
				margin-bottom: 0;
			}
		';
		wp_add_inline_style( 'versatile-template-designer', $custom_css );

		// Localize script with necessary data
		wp_localize_script(
			'versatile-template-designer',
			'versatileTemplateDesigner',
			array(
				'apiUrl'       => rest_url( 'versatile/v1/' ),
				'nonce'        => wp_create_nonce( 'wp_rest' ),
				'adminUrl'     => admin_url(),
				'pluginUrl'    => VERSATILE_PLUGIN_URL,
				'assetsUrl'    => VERSATILE_PLUGIN_URL . 'assets/',
				'uploadsUrl'   => wp_upload_dir()['baseurl'],
				'currentUser'  => wp_get_current_user()->display_name,
				'capabilities' => array(
					'manage_options' => current_user_can( 'manage_options' ),
					'upload_files'   => current_user_can( 'upload_files' ),
				),
				'i18n'         => array(
					'save'           => __( 'Save', 'versatile' ),
					'preview'        => __( 'Preview', 'versatile' ),
					'undo'           => __( 'Undo', 'versatile' ),
					'redo'           => __( 'Redo', 'versatile' ),
					'delete'         => __( 'Delete', 'versatile' ),
					'duplicate'      => __( 'Duplicate', 'versatile' ),
					'loading'        => __( 'Loading...', 'versatile' ),
					'saving'         => __( 'Saving...', 'versatile' ),
					'saved'          => __( 'Saved!', 'versatile' ),
					'error'          => __( 'Error', 'versatile' ),
					'success'        => __( 'Success', 'versatile' ),
				),
			)
		);
	}

	/**
	 * Register AJAX handlers for template designer
	 *
	 * @return void
	 */
	private function register_ajax_handlers() {
		// Template CRUD operations
		add_action( 'wp_ajax_versatile_create_template', array( $this, 'handle_create_template' ) );
		add_action( 'wp_ajax_versatile_update_template', array( $this, 'handle_update_template' ) );
		add_action( 'wp_ajax_versatile_delete_template', array( $this, 'handle_delete_template' ) );
		add_action( 'wp_ajax_versatile_get_template', array( $this, 'handle_get_template' ) );
		add_action( 'wp_ajax_versatile_list_templates', array( $this, 'handle_list_templates' ) );

		// Template preview
		add_action( 'wp_ajax_versatile_preview_custom_template', array( $this, 'handle_preview_template' ) );

		// Template validation
		add_action( 'wp_ajax_versatile_validate_template', array( $this, 'handle_validate_template' ) );
	}

	/**
	 * Handle create template AJAX request
	 *
	 * @return void
	 */
	public function handle_create_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( 'Insufficient permissions', array(), 403 );
			}

			$params = $request_verify['data'];

			// Validate required fields
			if ( empty( $params['name'] ) || empty( $params['template_data'] ) ) {
				return $this->json_response( 'Missing required fields', array(), 400 );
			}

			global $wpdb;
			$table_name = $wpdb->prefix . 'versatile_custom_templates';

			$result = $wpdb->insert(
				$table_name,
				array(
					'name'          => sanitize_text_field( $params['name'] ),
					'description'   => sanitize_textarea_field( $params['description'] ?? '' ),
					'type'          => sanitize_text_field( $params['type'] ?? 'both' ),
					'template_data' => wp_json_encode( $params['template_data'] ),
					'custom_css'    => sanitize_textarea_field( $params['custom_css'] ?? '' ),
					'settings'      => wp_json_encode( $params['settings'] ?? array() ),
					'created_by'    => get_current_user_id(),
				),
				array( '%s', '%s', '%s', '%s', '%s', '%s', '%d' )
			);

			if ( false === $result ) {
				return $this->json_response( 'Failed to create template', array(), 500 );
			}

			$template_id = $wpdb->insert_id;
			return $this->json_response( 'Template created successfully', array( 'id' => $template_id ), 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Handle update template AJAX request
	 *
	 * @return void
	 */
	public function handle_update_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( 'Insufficient permissions', array(), 403 );
			}

			$params = $request_verify['data'];

			// Validate required fields
			if ( empty( $params['id'] ) ) {
				return $this->json_response( 'Template ID is required', array(), 400 );
			}

			global $wpdb;
			$table_name = $wpdb->prefix . 'versatile_custom_templates';

			$update_data   = array();
			$update_format = array();

			if ( isset( $params['name'] ) ) {
				$update_data['name'] = sanitize_text_field( $params['name'] );
				$update_format[]     = '%s';
			}

			if ( isset( $params['description'] ) ) {
				$update_data['description'] = sanitize_textarea_field( $params['description'] );
				$update_format[]            = '%s';
			}

			if ( isset( $params['type'] ) ) {
				$update_data['type'] = sanitize_text_field( $params['type'] );
				$update_format[]     = '%s';
			}

			if ( isset( $params['template_data'] ) ) {
				$update_data['template_data'] = wp_json_encode( $params['template_data'] );
				$update_format[]              = '%s';
			}

			if ( isset( $params['custom_css'] ) ) {
				$update_data['custom_css'] = sanitize_textarea_field( $params['custom_css'] );
				$update_format[]           = '%s';
			}

			if ( isset( $params['settings'] ) ) {
				$update_data['settings'] = wp_json_encode( $params['settings'] );
				$update_format[]         = '%s';
			}

			if ( isset( $params['is_active'] ) ) {
				$update_data['is_active'] = (int) $params['is_active'];
				$update_format[]          = '%d';
			}

			if ( empty( $update_data ) ) {
				return $this->json_response( 'No data to update', array(), 400 );
			}

			$result = $wpdb->update(
				$table_name,
				$update_data,
				array( 'id' => (int) $params['id'] ),
				$update_format,
				array( '%d' )
			);

			if ( false === $result ) {
				return $this->json_response( 'Failed to update template', array(), 500 );
			}

			return $this->json_response( 'Template updated successfully', array(), 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Handle delete template AJAX request
	 *
	 * @return void
	 */
	public function handle_delete_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( 'Insufficient permissions', array(), 403 );
			}

			$params = $request_verify['data'];

			// Validate required fields
			if ( empty( $params['id'] ) ) {
				return $this->json_response( 'Template ID is required', array(), 400 );
			}

			global $wpdb;
			$table_name = $wpdb->prefix . 'versatile_custom_templates';

			$result = $wpdb->delete(
				$table_name,
				array( 'id' => (int) $params['id'] ),
				array( '%d' )
			);

			if ( false === $result ) {
				return $this->json_response( 'Failed to delete template', array(), 500 );
			}

			return $this->json_response( 'Template deleted successfully', array(), 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Handle get template AJAX request
	 *
	 * @return void
	 */
	public function handle_get_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( 'Insufficient permissions', array(), 403 );
			}

			$params = $request_verify['data'];

			// Validate required fields
			if ( empty( $params['id'] ) ) {
				return $this->json_response( 'Template ID is required', array(), 400 );
			}

			global $wpdb;
			$table_name = $wpdb->prefix . 'versatile_custom_templates';

			$template = $wpdb->get_row(
				$wpdb->prepare( "SELECT * FROM $table_name WHERE id = %d", (int) $params['id'] ),
				ARRAY_A
			);

			if ( ! $template ) {
				return $this->json_response( 'Template not found', array(), 404 );
			}

			// Decode JSON fields
			$template['template_data'] = json_decode( $template['template_data'], true );
			$template['settings']      = json_decode( $template['settings'], true );

			return $this->json_response( 'Template retrieved successfully', $template, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Handle list templates AJAX request
	 *
	 * @return void
	 */
	public function handle_list_templates() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( 'Insufficient permissions', array(), 403 );
			}

			$params = $request_verify['data'];

			global $wpdb;
			$table_name = $wpdb->prefix . 'versatile_custom_templates';

			$where_clause = '1=1';
			$where_values = array();

			// Filter by type if specified
			if ( ! empty( $params['type'] ) ) {
				$where_clause  .= ' AND (type = %s OR type = "both")';
				$where_values[] = sanitize_text_field( $params['type'] );
			}

			// Filter by active status if specified
			if ( isset( $params['is_active'] ) ) {
				$where_clause  .= ' AND is_active = %d';
				$where_values[] = (int) $params['is_active'];
			}

			// Pagination
			$limit  = isset( $params['limit'] ) ? (int) $params['limit'] : 20;
			$offset = isset( $params['offset'] ) ? (int) $params['offset'] : 0;

			$query          = "SELECT * FROM $table_name WHERE $where_clause ORDER BY updated_at DESC LIMIT %d OFFSET %d";
			$where_values[] = $limit;
			$where_values[] = $offset;

			$templates = $wpdb->get_results(
				$wpdb->prepare( $query, $where_values ),
				ARRAY_A
			);

			// Decode JSON fields for each template
			foreach ( $templates as &$template ) {
				$template['template_data'] = json_decode( $template['template_data'], true );
				$template['settings']      = json_decode( $template['settings'], true );
			}

			// Get total count
			$count_query = "SELECT COUNT(*) FROM $table_name WHERE $where_clause";
			$total       = $wpdb->get_var(
				$wpdb->prepare( $count_query, array_slice( $where_values, 0, -2 ) )
			);

			return $this->json_response(
				'Templates retrieved successfully',
				array(
					'templates' => $templates,
					'total'     => (int) $total,
					'limit'     => $limit,
					'offset'    => $offset,
				),
				200
			);

		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Handle preview template AJAX request
	 *
	 * @return void
	 */
	public function handle_preview_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				wp_die( esc_html( $request_verify['message'] ) );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_die( __( 'Insufficient permissions', 'versatile' ) );
			}

			$params = $request_verify['data'];

			// Set headers for HTML response
			header( 'Content-Type: text/html; charset=utf-8' );

			// For now, return a placeholder preview
			// This will be implemented in later tasks
			echo '<html><head><title>Template Preview</title></head><body>';
			echo '<h1>Custom Template Preview</h1>';
			echo '<p>Template preview functionality will be implemented in upcoming tasks.</p>';
			echo '</body></html>';
			die();

		} catch ( \Throwable $th ) {
			wp_die( 'Error loading template preview: ' . esc_html( $th->getMessage() ) );
		}
	}

	/**
	 * Handle validate template AJAX request
	 *
	 * @return void
	 */
	public function handle_validate_template() {
		try {
			$request_verify = versatile_verify_request();
			if ( 200 !== $request_verify['code'] ) {
				return $this->json_response( 'Security check failed', array(), 403 );
			}

			// Check user capabilities
			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( 'Insufficient permissions', array(), 403 );
			}

			$params = $request_verify['data'];

			// Validate required fields
			if ( empty( $params['template_data'] ) ) {
				return $this->json_response( 'Template data is required', array(), 400 );
			}

			$template_data = $params['template_data'];
			$errors        = array();

			// Basic validation
			if ( ! isset( $template_data['version'] ) ) {
				$errors[] = 'Template version is required';
			}

			if ( ! isset( $template_data['canvas'] ) ) {
				$errors[] = 'Canvas configuration is required';
			}

			if ( ! isset( $template_data['elements'] ) || ! is_array( $template_data['elements'] ) ) {
				$errors[] = 'Elements array is required';
			}

			// Validate elements
			if ( isset( $template_data['elements'] ) && is_array( $template_data['elements'] ) ) {
				foreach ( $template_data['elements'] as $index => $element ) {
					if ( ! isset( $element['id'] ) ) {
						$errors[] = "Element at index $index is missing ID";
					}
					if ( ! isset( $element['type'] ) ) {
						$errors[] = "Element at index $index is missing type";
					}
				}
			}

			if ( ! empty( $errors ) ) {
				return $this->json_response( 'Template validation failed', array( 'errors' => $errors ), 400 );
			}

			return $this->json_response( 'Template validation passed', array(), 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}
}

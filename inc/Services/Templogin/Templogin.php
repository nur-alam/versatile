<?php
/**
 * Templogin Service
 *
 * @package Versatile\Services
 * @subpackage Versatile\Services\Templogin
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Templogin;

use Versatile\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Templogin Service Class
 */
class Templogin {
	use JsonResponse;

	/**
	 * Database table name for temporary logins
	 *
	 * @var string
	 */
	private $table_name;

	/**
	 * Database table name for temporary login activity
	 *
	 * @var string
	 */
	private $activity_table_name;

	/**
	 * Constructor
	 */
	public function __construct() {
		global $wpdb;
		$this->table_name          = $wpdb->prefix . 'versatile_temp_logins';
		$this->activity_table_name = $wpdb->prefix . 'versatile_temp_login_activity';

		// Create database tables
		$this->create_tables();

		// Register AJAX actions
		add_action( 'wp_ajax_versatile_get_temp_login_list', array( $this, 'get_temp_login_list' ) );
		add_action( 'wp_ajax_versatile_create_temp_login', array( $this, 'create_temp_login' ) );
		add_action( 'wp_ajax_versatile_update_temp_login', array( $this, 'update_temp_login' ) );
		add_action( 'wp_ajax_versatile_delete_temp_login', array( $this, 'delete_temp_login' ) );
		add_action( 'wp_ajax_versatile_toggle_temp_login_status', array( $this, 'toggle_temp_login_status' ) );
		add_action( 'wp_ajax_versatile_get_temp_login_activity', array( $this, 'get_temp_login_activity' ) );
		add_action( 'wp_ajax_versatile_get_available_roles', array( $this, 'get_available_roles' ) );
		add_action( 'wp_ajax_versatile_manual_cleanup_temp_logins', array( $this, 'manual_cleanup_temp_logins' ) );

		// Handle temporary login authentication
		add_action( 'init', array( $this, 'handle_temp_login' ) );

		// Clean up expired logins
		// add_action( 'versatile_cleanup_expired_temp_logins', array( $this, 'cleanup_expired_logins' ) );
		// if ( ! wp_next_scheduled( 'versatile_cleanup_expired_temp_logins' ) ) {
		// wp_schedule_event( time(), 'per_minute', 'versatile_cleanup_expired_temp_logins' );
		// }

		// Also trigger cleanup on admin pages and temp login attempts as fallback
		add_action( 'admin_init', array( $this, 'maybe_cleanup_expired_logins' ) );
		// add_action( 'init', array( $this, 'maybe_cleanup_expired_logins' ) );

		// add_filter(
		// 'cron_schedules',
		// function ( $schedules ) {
		// $schedules['per_minute'] = array(
		// 'interval' => 60, // 60 seconds = 1 minute
		// 'display'  => __( 'Once Per Minute' ),
		// );
		// return $schedules;
		// }
		// );
	}

	/**
	 * Create database tables for temporary logins
	 */
	private function create_tables() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		// Temporary logins table
		$sql1 = "CREATE TABLE IF NOT EXISTS {$this->table_name} (
			id int(11) NOT NULL AUTO_INCREMENT,
			token varchar(255) NOT NULL UNIQUE,
			role varchar(50) NOT NULL DEFAULT 'subscriber',
			display_name varchar(255) NOT NULL,
			email varchar(255) DEFAULT NULL,
			expires_at datetime NOT NULL,
			redirect_url text DEFAULT NULL,
			ip_address varchar(45) DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			last_login datetime DEFAULT NULL,
			login_count int(11) DEFAULT 0,
			is_active tinyint(1) DEFAULT 1,
			PRIMARY KEY (id),
			KEY expires_at (expires_at),
			KEY is_active (is_active)
		) $charset_collate;";

		// Activity log table
		$sql2 = "CREATE TABLE IF NOT EXISTS {$this->activity_table_name} (
			id int(11) NOT NULL AUTO_INCREMENT,
			temp_login_id int(11) NOT NULL,
			action varchar(50) NOT NULL,
			description text DEFAULT NULL,
			ip_address varchar(45) DEFAULT NULL,
			user_agent text DEFAULT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			KEY temp_login_id (temp_login_id),
			KEY created_at (created_at),
			FOREIGN KEY (temp_login_id) REFERENCES {$this->table_name}(id) ON DELETE CASCADE
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql1 );
		dbDelta( $sql2 );
	}

	/**
	 * Get temporary logins with pagination and filters
	 */
	public function get_temp_login_list() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'page',
						'value'    => isset( $_POST['page'] ) ? $_POST['page'] : '1', // @phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|numeric',
					),
					array(
						'name'     => 'per_page',
						'value'    => isset( $_POST['per_page'] ) ? $_POST['per_page'] : '10', // @phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|numeric',
					),
					array(
						'name'     => 'search',
						'value'    => isset( $_POST['search'] ) ? $_POST['search'] : '', // @phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input',
					),
					array(
						'name'     => 'role',
						'value'    => isset( $_POST['role'] ) ? $_POST['role'] : '', // @phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|in_array:all,administrator,subscriber,editor,author,contributor,author',
					),
					array(
						'name'     => 'status',
						'value'    => isset( $_POST['status'] ) ? $_POST['status'] : 'all', // @phpcs:ignore	
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|in_array:active,inactive,all',
					),
					array(
						'name'     => 'order',
						'value'    => isset( $_POST['order'] ) ? $_POST['order'] : '', // @phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|in_array:asc,desc',
					),
					array(
						'name'     => 'orderby',
						'value'    => isset( $_POST['orderby'] ) ? $_POST['orderby'] : '', // @phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|in_array:id,display_name,email,expires_at,created_at,login_count',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$error_message = versatile_grab_error_message( $sanitized_data['errors'] );
				return $this->json_response( $error_message ?? 'Error: Invalid parameters!', $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'] ?? 'Error: Request verification failed', array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			global $wpdb;

			$page     = max( 1, intval( $verified_data->page ) );
			$per_page = max( 1, min( 100, intval( $verified_data->per_page ) ) );
			$offset   = ( $page - 1 ) * $per_page;

			// Build WHERE clause
			$where_conditions = array( '1=1' );
			$where_values     = array();

			// Search filter
			if ( ! empty( $verified_data->search ) ) {
				$where_conditions[] = '(display_name LIKE %s OR email LIKE %s)';
				$search_term        = '%' . $wpdb->esc_like( $verified_data->search ) . '%';
				$where_values[]     = $search_term;
				$where_values[]     = $search_term;
			}

			// Role filter
			if ( ! empty( $verified_data->role ) ) {
				$where_conditions[] = 'role = %s';
				$where_values[]     = $verified_data->role;
			}

			// Status filter
			if ( 'all' !== $verified_data->status ) {
				if ( 'active' === $verified_data->status ) {
					$where_conditions[] = 'is_active = 1 AND expires_at > NOW()';
				} elseif ( 'expired' === $verified_data->status ) {
					$where_conditions[] = '(is_active = 0 OR expires_at <= NOW())';
				}
			}

			$where_clause = implode( ' AND ', $where_conditions );

			// Build ORDER BY clause
			$orderby = 'created_at DESC';
			if ( ! empty( $verified_data->orderby ) ) {
				$allowed_sort_keys = array( 'display_name', 'role', 'expires_at', 'created_at', 'last_login', 'login_count' );
				if ( in_array( $verified_data->orderby, $allowed_sort_keys, true ) ) {
					$order_direction = ( strtoupper( $verified_data->order ) === 'ASC' ) ? 'ASC' : 'DESC';
					$orderby         = $verified_data->orderby . ' ' . $order_direction;
				}
			}

			// Get total count
			$count_query = "SELECT COUNT(*) FROM {$this->table_name} WHERE {$where_clause}";
			if ( ! empty( $where_values ) ) {
				$total_entries = $wpdb->get_var( $wpdb->prepare( $count_query, $where_values ) ); //phpcs:ignore
			} else {
				$total_entries = $wpdb->get_var( $count_query ); //phpcs:ignore
			}

			// Get paginated results
			$results_query = "SELECT * FROM {$this->table_name} WHERE {$where_clause} ORDER BY {$orderby} LIMIT %d OFFSET %d";
			$query_values  = array_merge( $where_values, array( $per_page, $offset ) );
			$results       = $wpdb->get_results( $wpdb->prepare( $results_query, $query_values ) ); //phpcs:ignore

			// Format results
			$temp_logins = array();
			foreach ( $results as $result ) {
				$temp_logins[] = array(
					'id'           => intval( $result->id ),
					'token'        => $result->token,
					'role'         => $result->role,
					'display_name' => $result->display_name,
					'email'        => $result->email,
					'expires_at'   => $result->expires_at,
					'redirect_url' => $result->redirect_url,
					'created_at'   => $result->created_at,
					'last_login'   => $result->last_login,
					'login_count'  => intval( $result->login_count ),
					'is_active'    => (bool) $result->is_active,
					'login_url'    => home_url( '?versatile_temp_login=' . $result->token ),
				);
			}

			$response_data = array(
				'current_page'  => $page,
				'temp_logins'   => $temp_logins,
				'per_page'      => $per_page,
				'total_entries' => intval( $total_entries ),
				'total_pages'   => ceil( $total_entries / $per_page ),
			);

			return $this->json_response( __( 'Temporary logins retrieved successfully', 'versatile-toolkit' ), $response_data, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to retrieve temporary logins', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Create new temporary login
	 */
	public function create_temp_login() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'display_name',
						'value'    => isset( $_POST['display_name'] ) ? $_POST['display_name'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required',
					),
					array(
						'name'     => 'email',
						'value'    => isset( $_POST['email'] ) ? $_POST['email'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_email',
						'rules'    => 'if_input|email',
					),
					array(
						'name'     => 'role',
						'value'    => isset( $_POST['role'] ) ? $_POST['role'] : 'subscriber', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required',
					),
					array(
						'name'     => 'expires_at',
						'value'    => isset( $_POST['expires_at'] ) ? $_POST['expires_at'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required',
					),
					array(
						'name'     => 'redirect_url',
						'value'    => isset( $_POST['redirect_url'] ) ? $_POST['redirect_url'] : '', // phpcs:ignore
						'sanitize' => 'esc_url_raw',
						'rules'    => 'if_input',
					),
					array(
						'name'     => 'ip_address',
						'value'    => isset( $_POST['ip_address'] ) ? $_POST['ip_address'] : 'en', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|ip_address',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$error_message = versatile_grab_error_message( $sanitized_data['errors'] );
				return $this->json_response( $error_message ?? 'Error: Required fields missing!', $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'] ?? 'Error: Request verification failed', array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			global $wpdb;

			// Check if email already exists
			$existing_temp_login = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM {$this->table_name} WHERE email = %s",
					$verified_data->email
				)
			);
			if ( $existing_temp_login && $existing_temp_login->is_active ) {
				return $this->json_response( __( 'Error: Email already exists', 'versatile-toolkit' ), array(), 400 );
			}

			// Validate role exists
			$available_roles = get_editable_roles();
			if ( ! array_key_exists( $verified_data->role, $available_roles ) ) {
				return $this->json_response( __( 'Error: Invalid role specified', 'versatile-toolkit' ), array(), 400 );
			}

			// Generate unique token
			$token = wp_generate_password( 32, false );

			// Process expires_at datetime
			$expires_at_timestamp = $this->parse_datetime( $verified_data->expires_at );
			if ( ! $expires_at_timestamp ) {
				return $this->json_response( __( 'Error: Invalid expiration date format', 'versatile-toolkit' ), array(), 400 );
			}

			// Insert new temporary login
			$result = $wpdb->insert(
				$this->table_name,
				array(
					'token'        => $token,
					'role'         => $verified_data->role,
					'display_name' => $verified_data->display_name,
					'email'        => $verified_data->email,
					'expires_at'   => $expires_at_timestamp,
					'redirect_url' => $verified_data->redirect_url,
					'ip_address'   => $verified_data->ip_address,
					'created_at'   => current_time( 'mysql', true ),
				),
				array( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
			);

			if ( false === $result ) {
				return $this->json_response( __( 'Error: Failed to create temporary login', 'versatile-toolkit' ), array(), 500 );
			}

			$temp_login_id = $wpdb->insert_id;

			// Log activity
			$this->log_activity( $temp_login_id, 'created', 'Temporary login created' );

			// Get the created record
			$temp_login = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM {$this->table_name} WHERE id = %d",
					$temp_login_id
				)
			);

			$response_data = array(
				'id'           => intval( $temp_login->id ),
				'token'        => $temp_login->token,
				'role'         => $temp_login->role,
				'display_name' => $temp_login->display_name,
				'email'        => $temp_login->email,
				'expires_at'   => $temp_login->expires_at,
				'redirect_url' => $temp_login->redirect_url,
				'language'     => $temp_login->language,
				'created_at'   => $temp_login->created_at,
				'last_login'   => $temp_login->last_login,
				'login_count'  => intval( $temp_login->login_count ),
				'is_active'    => (bool) $temp_login->is_active,
				'login_url'    => home_url( '?versatile_temp_login=' . $temp_login->token ),
			);

			return $this->json_response( __( 'Temporary login created successfully', 'versatile-toolkit' ), $response_data, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to create temporary login', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Update temporary login
	 */
	public function update_temp_login() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'id',
						'value'    => isset( $_POST['id'] ) ? $_POST['id'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|numeric',
					),
					array(
						'name'     => 'display_name',
						'value'    => isset( $_POST['display_name'] ) ? $_POST['display_name'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input',
					),
					array(
						'name'     => 'email',
						'value'    => isset( $_POST['email'] ) ? $_POST['email'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_email',
						'rules'    => 'if_input|email',
					),
					array(
						'name'     => 'role',
						'value'    => isset( $_POST['role'] ) ? $_POST['role'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input',
					),
					array(
						'name'     => 'expires_at',
						'value'    => isset( $_POST['expires_at'] ) ? $_POST['expires_at'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input',
					),
					array(
						'name'     => 'redirect_url',
						'value'    => isset( $_POST['redirect_url'] ) ? $_POST['redirect_url'] : '', // phpcs:ignore
						'sanitize' => 'esc_url_raw',
						'rules'    => 'if_input',
					),
					array(
						'name'     => 'language',
						'value'    => isset( $_POST['language'] ) ? $_POST['language'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$error_message = versatile_grab_error_message( $sanitized_data['errors'] );
				return $this->json_response( $error_message ?? 'Error: Invalid parameters!', $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'] ?? 'Error: Request verification failed', array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			global $wpdb;

			// Check if temp login exists
			$temp_login = $wpdb->get_row(
				$wpdb->prepare(
					'SELECT * FROM %s WHERE id = %d',
					$this->table_name,
					$verified_data->id
				)
			);

			if ( ! $temp_login ) {
				return $this->json_response( __( 'Error: Temporary login not found', 'versatile-toolkit' ), array(), 404 );
			}

			// Prepare update data
			$update_data   = array();
			$update_format = array();

			if ( ! empty( $verified_data->display_name ) ) {
				$update_data['display_name'] = $verified_data->display_name;
				$update_format[]             = '%s';
			}

			if ( ! empty( $verified_data->email ) ) {
				$update_data['email'] = $verified_data->email;
				$update_format[]      = '%s';
			}

			if ( ! empty( $verified_data->role ) ) {
				// Validate role exists
				$available_roles = get_editable_roles();
				if ( ! array_key_exists( $verified_data->role, $available_roles ) ) {
					return $this->json_response( __( 'Error: Invalid role specified', 'versatile-toolkit' ), array(), 400 );
				}
				$update_data['role'] = $verified_data->role;
				$update_format[]     = '%s';
			}

			if ( ! empty( $verified_data->expires_at ) ) {
				$expires_at_timestamp = $this->parse_datetime( $verified_data->expires_at );
				if ( ! $expires_at_timestamp ) {
					return $this->json_response( __( 'Error: Invalid expiration date format', 'versatile-toolkit' ), array(), 400 );
				}
				$update_data['expires_at'] = $expires_at_timestamp;
				$update_format[]           = '%s';
			}

			if ( isset( $verified_data->redirect_url ) ) {
				$update_data['redirect_url'] = $verified_data->redirect_url;
				$update_format[]             = '%s';
			}

			if ( ! empty( $verified_data->language ) ) {
				$update_data['language'] = $verified_data->language;
				$update_format[]         = '%s';
			}

			// Update the temporary login
			if ( ! empty( $update_data ) ) {
				$result = $wpdb->update(
					$this->table_name,
					$update_data,
					array( 'id' => $verified_data->id ),
					$update_format,
					array( '%d' )
				);

				if ( ! $result ) {
					return $this->json_response( __( 'Error: Failed to update temporary login', 'versatile-toolkit' ), array(), 500 );
				}

				// Log activity
				$this->log_activity( $verified_data->id, 'updated', 'Temporary login updated' );
			}

			// Get updated record
			$updated_temp_login = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM {$this->table_name} WHERE id = %d",
					$verified_data->id
				)
			);

			$response_data = array(
				'id'           => intval( $updated_temp_login->id ),
				'token'        => $updated_temp_login->token,
				'role'         => $updated_temp_login->role,
				'display_name' => $updated_temp_login->display_name,
				'email'        => $updated_temp_login->email,
				'expires_at'   => $updated_temp_login->expires_at,
				'redirect_url' => $updated_temp_login->redirect_url,
				'language'     => $updated_temp_login->language,
				'created_at'   => $updated_temp_login->created_at,
				'last_login'   => $updated_temp_login->last_login,
				'login_count'  => intval( $updated_temp_login->login_count ),
				'is_active'    => (bool) $updated_temp_login->is_active,
				'login_url'    => home_url( '?versatile_temp_login=' . $updated_temp_login->token ),
			);

			return $this->json_response( __( 'Temporary login updated successfully', 'versatile-toolkit' ), $response_data, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to update temporary login', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Delete temporary login
	 */
	public function delete_temp_login() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'id',
						'value'    => isset( $_POST['id'] ) ? wp_unslash( $_POST['id'] ) : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|numeric',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$error_message = versatile_grab_error_message( $sanitized_data['errors'] );
				return $this->json_response( $error_message ?? 'Error: Invalid ID!', $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'] ?? 'Error: Request verification failed', array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			global $wpdb;

			// Check if temp login exists
			$temp_login = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM {$this->table_name} WHERE id = %d",
					$verified_data->id
				)
			);

			if ( ! $temp_login ) {
				return $this->json_response( __( 'Error: Temporary login not found', 'versatile-toolkit' ), array(), 404 );
			}

			// Delete the temporary login (activity logs will be deleted by foreign key constraint)
			$result = $wpdb->delete( $this->table_name, array( 'id' => $verified_data->id ), array( '%d' ) );

			if ( false === $result ) {
				return $this->json_response( __( 'Error: Failed to delete temporary login', 'versatile-toolkit' ), array(), 500 );
			}

			return $this->json_response( __( 'Temporary login deleted successfully', 'versatile-toolkit' ), array(), 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to delete temporary login', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Toggle temporary login status
	 */
	public function toggle_temp_login_status() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'id',
						'value'    => isset( $_POST['id'] ) ? $_POST['id'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|numeric',
					),
					array(
						'name'     => 'is_active',
						'value'    => isset( $_POST['is_active'] ) ? $_POST['is_active'] : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|boolean',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$error_message = versatile_grab_error_message( $sanitized_data['errors'] );
				return $this->json_response( $error_message ?? 'Error: Invalid parameters!', $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'] ?? 'Error: Request verification failed', array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			global $wpdb;

			$is_active = filter_var( $verified_data->is_active, FILTER_VALIDATE_BOOLEAN );

			// Update the temporary login status
			$result = $wpdb->update(
				$this->table_name,
				array( 'is_active' => $is_active ? 1 : 0 ),
				array( 'id' => $verified_data->id ),
				array( '%d' ),
				array( '%d' )
			);

			if ( false === $result ) {
				return $this->json_response( __( 'Error: Failed to update temporary login status', 'versatile-toolkit' ), array(), 500 );
			}

			// Log activity
			$action = $is_active ? 'activated' : 'deactivated';
			$this->log_activity( $verified_data->id, $action, "Temporary login {$action}" );

			// Get updated record
			$temp_login = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM {$this->table_name} WHERE id = %d",
					$verified_data->id
				)
			);

			$response_data = array(
				'id'           => intval( $temp_login->id ),
				'token'        => $temp_login->token,
				'role'         => $temp_login->role,
				'display_name' => $temp_login->display_name,
				'email'        => $temp_login->email,
				'expires_at'   => $temp_login->expires_at,
				'redirect_url' => $temp_login->redirect_url,
				'language'     => $temp_login->language,
				'created_at'   => $temp_login->created_at,
				'last_login'   => $temp_login->last_login,
				'login_count'  => intval( $temp_login->login_count ),
				'is_active'    => (bool) $temp_login->is_active,
				'login_url'    => home_url( '?versatile_temp_login=' . $temp_login->token ),
			);

			return $this->json_response( __( 'Temporary login status updated successfully', 'versatile-toolkit' ), $response_data, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to update temporary login status', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Get available WordPress roles
	 */
	public function get_available_roles() {
		try {
			// Simple nonce check without full validation since this is just returning static data
			if ( ! isset( $_REQUEST['versatile_nonce'] ) || ! wp_verify_nonce( $_REQUEST['versatile_nonce'], 'versatile' ) ) {  // phpcs:ignore
				return $this->json_response( __( 'Security check failed', 'versatile-toolkit' ), array(), 403 );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( __( 'You do not have permission to access this feature.', 'versatile-toolkit' ), array(), 403 );
			}

			$roles           = get_editable_roles();
			$formatted_roles = array();

			foreach ( $roles as $role_key => $role_data ) {
				$formatted_roles[ $role_key ] = translate_user_role( $role_data['name'] );
			}

			return $this->json_response( __( 'Available roles retrieved successfully', 'versatile-toolkit' ), $formatted_roles, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to retrieve available roles', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Handle temporary login authentication
	 */
	public function handle_temp_login() {
		if ( ! isset( $_GET['versatile_temp_login'] ) || is_user_logged_in() ) {
			return;
		}

		$token = sanitize_text_field( $_GET['versatile_temp_login'] ); // phpcs:ignore

		global $wpdb;

		// Get temporary login by token
		$temp_login = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$this->table_name} WHERE token = %s AND is_active = 1 AND expires_at > NOW()",
				$token
			)
		);

		if ( ! $temp_login ) {
			wp_die( esc_html__( 'Invalid or expired temporary login link.', 'versatile-toolkit' ) );
		}

		// Create temporary user
		$user_id = $this->create_temp_user( $temp_login );

		if ( is_wp_error( $user_id ) ) {
			wp_die( esc_html__( 'Failed to create temporary user session.', 'versatile-toolkit' ) );
		}

		// Log the user in
		wp_set_current_user( $user_id );
		wp_set_auth_cookie( $user_id, true );

		// Update login statistics
		$wpdb->update(
			"{$this->table_name}",
			array(
				'last_login'  => current_time( 'mysql', true ),
				'login_count' => $temp_login->login_count + 1,
			),
			array( 'id' => $temp_login->id ),
			array( '%s', '%d' ),
			array( '%d' )
		);

		// Log activity
		$this->log_activity( $temp_login->id, 'login', 'User logged in via temporary login' );

		// Redirect to specified URL or admin dashboard
		$redirect_url = ! empty( $temp_login->redirect_url ) ? $temp_login->redirect_url : admin_url();
		wp_safe_redirect( $redirect_url );
		exit;
	}

	/**
	 * Create temporary user for the session
	 *
	 * @param object $temp_login The temporary login object.
	 */
	private function create_temp_user( $temp_login ) {
		// Generate unique username
		$username = 'temp_' . $temp_login->token;

		// Check if user already exists
		$existing_user = get_user_by( 'login', $username );
		if ( $existing_user ) {
			// Update existing user
			wp_update_user(
				array(
					'ID'           => $existing_user->ID,
					'display_name' => $temp_login->display_name,
					'user_email'   => $temp_login->email,
					'role'         => $temp_login->role,
				)
			);
			return $existing_user->ID;
		}

		// Create new temporary user
		$user_data = array(
			'user_login'   => $username,
			'user_pass'    => wp_generate_password( 32, true, true ),
			'display_name' => $temp_login->display_name,
			'user_email'   => $temp_login->email,
			'role'         => $temp_login->role,
			'meta_input'   => array(
				'versatile_temp_user'     => true,
				'versatile_temp_login_id' => $temp_login->id,
			),
		);

		$user_id = wp_insert_user( $user_data );

		// Schedule user deletion after session ends
		wp_schedule_single_event( time() + DAY_IN_SECONDS, 'versatile_cleanup_temp_user', array( $user_id ) );

		return $user_id;
	}

	/**
	 * Log activity for temporary login
	 *
	 * @param int    $temp_login_id The temporary login ID.
	 * @param string $action        The action performed.
	 * @param string $description   The activity description.
	 */
	private function log_activity( $temp_login_id, $action, $description ) {
		global $wpdb;

		$wpdb->insert(
			$this->activity_table_name,
			array(
				'temp_login_id' => $temp_login_id,
				'action'        => $action,
				'description'   => $description,
				'ip_address'    => $this->get_client_ip(),
				'user_agent'    => isset( $_SERVER['HTTP_USER_AGENT'] ) ? wp_unslash( sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] ) ) : '', // phpcs:ignore
				'created_at'    => current_time( 'mysql', true ),
			),
			array( '%d', '%s', '%s', '%s', '%s', '%s' )
		);
	}

	/**
	 * Get client IP address
	 */
	private function get_client_ip() {
		$ip_keys = array( 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR' );

		foreach ( $ip_keys as $key ) {
			if ( array_key_exists( $key, $_SERVER ) === true ) {
				foreach ( explode( ',', wp_unslash( $_SERVER[ $key ] ) ) as $ip ) { // phpcs:ignore		
					$ip = trim( $ip );
					if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) !== false ) {
						return $ip;
					}
				}
			}
		}

		return isset( $_SERVER['REMOTE_ADDR'] ) ? wp_unslash( $_SERVER['REMOTE_ADDR'] ) : ''; // phpcs:ignore
	}

	/**
	 * Clean up expired temporary logins
	 */
	public function cleanup_expired_logins() {
		global $wpdb;

		// Log cleanup start for debugging
		error_log( 'Versatile Temp Login: Starting cleanup at ' . current_time( 'mysql' ) );

		// update is_active to false for expired logins
		$update_is_active = $wpdb->query(
			$wpdb->prepare(
				"UPDATE {$this->table_name} SET is_active = 0 WHERE expires_at <= NOW() AND is_active = 1",
			)
		);

		// Delete expired temporary logins
		$deleted_count = $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$this->table_name} WHERE expires_at <= NOW()",
			)
		);
		error_log( "Versatile Temp Login: Deleted {$deleted_count} expired logins" );

		// Clean up temporary users
		$temp_users = get_users(
			array(
				'meta_key'   => 'versatile_temp_user',
				'meta_value' => true,
			)
		);

		$cleaned_users = 0;
		foreach ( $temp_users as $user ) {
			$temp_login_id = get_user_meta( $user->ID, 'versatile_temp_login_id', true );

			// Check if associated temp login still exists
			$temp_login_exists = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$this->table_name} WHERE id = %d",
					$temp_login_id
				)
			);

			// If temp login doesn't exist, delete the user
			if ( ! $temp_login_exists ) {
				wp_delete_user( $user->ID );
				++$cleaned_users;
			}
		}

		error_log( "Versatile Temp Login: Cleaned up {$cleaned_users} temporary users" );
		error_log( 'Versatile Temp Login: Cleanup completed at ' . current_time( 'mysql' ) );
	}

	/**
	 * Maybe cleanup expired logins (fallback for when cron doesn't work)
	 */
	public function maybe_cleanup_expired_logins() {
		// Only run cleanup every 5 minutes to avoid performance issues
		// if ( ! defined( 'DOING_CRON' ) || ! DOING_CRON ) {
		$last_cleanup = get_option( 'versatile_last_temp_login_cleanup', 0 );
		$current_time = time();

		if ( ( $current_time - $last_cleanup ) > 3 ) { // 5 minutes
			update_option( 'versatile_last_temp_login_cleanup', $current_time );
			$this->cleanup_expired_logins();
		}
	}

	/**
	 * Get temporary login activity logs
	 */
	public function get_temp_login_activity() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'temp_login_id',
						'value'    => isset( $_GET['temp_login_id'] ) ? wp_unslash( $_GET['temp_login_id'] ) : '', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|numeric',
					),
					array(
						'name'     => 'page',
						'value'    => isset( $_GET['page'] ) ? wp_unslash( $_GET['page'] ) : '1', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|numeric',
					),
					array(
						'name'     => 'per_page',
						'value'    => isset( $_GET['per_page'] ) ? wp_unslash( $_GET['per_page'] ) : '10', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'if_input|numeric',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$error_message = versatile_grab_error_message( $sanitized_data['errors'] );
				return $this->json_response( $error_message ?? 'Error: Invalid parameters!', $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'] ?? 'Error: Request verification failed', array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			global $wpdb;

			$page     = max( 1, intval( $verified_data->page ) );
			$per_page = max( 1, min( 100, intval( $verified_data->per_page ) ) );
			$offset   = ( $page - 1 ) * $per_page;

			// Get total count
			$total_entries = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT COUNT(*) FROM {$this->activity_table_name} WHERE temp_login_id = %d",
					$verified_data->temp_login_id
				)
			);

			// Get paginated results
			$results = $wpdb->get_results(
				$wpdb->prepare(
					"SELECT * FROM {$this->activity_table_name} WHERE temp_login_id = %d ORDER BY created_at DESC LIMIT %d OFFSET %d",
					$verified_data->temp_login_id,
					$per_page,
					$offset
				)
			);

			// Format results
			$activities = array();
			foreach ( $results as $result ) {
				$activities[] = array(
					'id'            => intval( $result->id ),
					'temp_login_id' => intval( $result->temp_login_id ),
					'action'        => $result->action,
					'description'   => $result->description,
					'ip_address'    => $result->ip_address,
					'user_agent'    => $result->user_agent,
					'created_at'    => $result->created_at,
				);
			}

			$response_data = array(
				'current_page'  => $page,
				'activities'    => $activities,
				'per_page'      => $per_page,
				'total_entries' => intval( $total_entries ),
				'total_pages'   => ceil( $total_entries / $per_page ),
			);

			return $this->json_response( __( 'Activity logs retrieved successfully', 'versatile-toolkit' ), $response_data, 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to retrieve activity logs', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Parse datetime string to MySQL format
	 * Handles both ISO 8601 format and other common formats
	 *
	 * @param string $datetime_string The datetime string to parse.
	 * @return string|false MySQL formatted datetime string or false on failure.
	 */
	private function parse_datetime( $datetime_string ) {
		if ( empty( $datetime_string ) ) {
			return false;
		}

		try {
			// First, try to parse with specific format for dd/mm/yyyy, HH:mm:ss
			$datetime = \DateTime::createFromFormat( 'd/m/Y, H:i:s', $datetime_string );
			// If that fails, try the standard DateTime constructor
			if ( ! $datetime ) {
				$datetime = new \DateTime( $datetime_string );
			}
			// Convert to WordPress timezone
			$wp_timezone = wp_timezone();
			$datetime->setTimezone( $wp_timezone );
			// Return in MySQL format
			return $datetime->format( 'Y-m-d H:i:s' );
		} catch ( \Exception $e ) {
			// Fallback to strtotime if DateTime fails
			$timestamp = strtotime( $datetime_string );
			if ( false !== $timestamp ) {
				return gmdate( 'Y-m-d H:i:s', $timestamp );
			}
			return false;
		}
	}

	/**
	 * Manual cleanup for testing purposes
	 */
	public function manual_cleanup_temp_logins() {
		try {
			// Simple nonce check
			if ( ! isset( $_REQUEST['versatile_nonce'] ) || ! wp_verify_nonce( $_REQUEST['versatile_nonce'], 'versatile' ) ) {  // phpcs:ignore
				return $this->json_response( __( 'Security check failed', 'versatile-toolkit' ), array(), 403 );
			}

			if ( ! current_user_can( 'manage_options' ) ) {
				return $this->json_response( __( 'You do not have permission to access this feature.', 'versatile-toolkit' ), array(), 403 );
			}

			// Run cleanup
			$this->cleanup_expired_logins();

			return $this->json_response( __( 'Manual cleanup completed successfully', 'versatile-toolkit' ), array(), 200 );

		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: Failed to run manual cleanup', 'versatile-toolkit' ), array(), 500 );
		}
	}

	/**
	 * Cleanup expired temporary logins
	 *
	 * @param int $user_id The user ID.
	 */
	public function versatile_cleanup_temp_user( $user_id ) {
		$user = get_userdata( $user_id );
		if ( $user ) {
			wp_delete_user( $user_id );
		}
	}
}

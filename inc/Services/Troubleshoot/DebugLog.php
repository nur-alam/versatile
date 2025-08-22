<?php
/**
 * Debug Log Service
 *
 * @package Versatile\Services\Troubleshoot
 * @subpackage Versatile\Services\Troubleshoot\DebugLog
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Troubleshoot;

use Versatile\Traits\JsonResponse;

/**
 * Debug Log class for handling debug logging functionality.
 *
 * This class provides methods and functionality for managing debug logs,
 * including file path handling and log operations.
 *
 * @since 1.0.0
 */
class DebugLog {


	use JsonResponse;

	/**
	 * Debug log file path constant.
	 */
	const DEBUG_LOG_FILE_PATH = 'debug.log';

	/**
	 * Debug log file name constant.
	 */
	const DEBUG_LOG_FILE_NAME = 'debug.log';

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'wp_ajax_versatile_toggle_debug_log', array( $this, 'toggle_debug_log' ) );
		add_action( 'wp_ajax_versatile_get_debug_log_status', array( $this, 'get_debug_log_status' ) );
		add_action( 'wp_ajax_versatile_get_debug_log_content', array( $this, 'get_debug_log_content' ) );
		add_action( 'wp_ajax_versatile_clear_debug_log', array( $this, 'clear_debug_log' ) );
		add_action( 'wp_ajax_versatile_download_debug_log', array( $this, 'download_debug_log' ) );
		add_action( 'wp_ajax_versatile_refresh_debug_log', array( $this, 'refresh_debug_log' ) );
	}

	/**
	 * Get the debug log file path.
	 *
	 * @return string
	 */
	public function get_debug_log_path() {
		return WP_CONTENT_DIR . '/' . self::DEBUG_LOG_FILE_PATH;
	}

	/**
	 * Check if debug logging is enabled.
	 *
	 * @return bool
	 */
	public function is_debug_enabled() {
		return defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG;
	}

	/**
	 * Toggle debug logging on/off.
	 */
	public function toggle_debug_log() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'enable',
						'value'    => $_POST['enable'] ?? 'false', // phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				$this->json_response( 'Invalid input data', 'error', 400 );
			}

			$request_verify = versatile_verify_request( $sanitized_data );

			if ( ! $request_verify['success'] ) {
				$this->json_response( $request_verify['message'] ?? __( 'Invalid input data', 'versatile-toolkit' ), 'error', 400 );
			}

			$verified_data = (object) $request_verify['data'];
			$enable        = 'true' === $verified_data->enable;

			$result = $this->update_wp_config_debug_settings( $enable );

			$this->json_response( 'Debug logging ' . ( $result ? 'enabled' : 'disabled' ) . ' successfully', 'success', 200 );
		} catch ( \Throwable $th ) {
			$this->json_response( __( 'Error toggling debug log', 'versatile-toolkit' ), 'error', 400 );
		}
	}

	/**
	 * Get debug log status.
	 */
	public function get_debug_log_status() {
		try {
			$request_verify = versatile_verify_request( $_POST ); // phpcs:ignore

			if ( ! $request_verify['success'] ) {
				wp_send_json_error( array( 'message' => $request_verify['message'] ) );
			}

			$log_path    = $this->get_debug_log_path();
			$file_exists = file_exists( $log_path );
			$file_size   = $file_exists ? filesize( $log_path ) : 0;

			$data = array(
				'enabled'             => $this->is_debug_enabled_from_config(),
				'file_exists'         => $file_exists,
				'file_size'           => $file_size,
				'file_size_formatted' => $file_exists ? size_format( $file_size ) : '0 B',
				'last_modified'       => $file_exists ? filemtime( $log_path ) : 0,
			);
			return $this->json_response( 'Debug log status retrieved successfully', $data, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error getting debug log status', 'versatile-toolkit' ), 400 );
		}
	}

	/**
	 * Check if debug logging is enabled by reading wp-config.php file directly.
	 * This method reads the actual file content instead of relying on constants.
	 *
	 * @return bool
	 */
	public function is_debug_enabled_from_config() {
		$wp_config_path = ABSPATH . 'wp-config.php';

		if ( ! file_exists( $wp_config_path ) || ! is_readable( $wp_config_path ) ) {
			// Fallback to constants if wp-config.php is not readable
			return $this->is_debug_enabled();
		}

		$wp_config_content = file_get_contents( $wp_config_path );

		if ( false === $wp_config_content ) {
			// Fallback to constants if file reading fails
			return $this->is_debug_enabled();
		}

		// Remove comments and whitespace for more accurate parsing
		$lines        = explode( "\n", $wp_config_content );
		$active_lines = array();

		foreach ( $lines as $line ) {
			$line = trim( $line );
			// Skip empty lines and comments
			if ( ! empty( $line ) && ! str_starts_with( $line, '//' ) && ! str_starts_with( $line, '#' ) ) {
				$active_lines[] = $line;
			}
		}

		$clean_content = implode( "\n", $active_lines );

		// Check for WP_DEBUG = true (handle various formats and spacing)
		$wp_debug_enabled = preg_match( "/define\s*\(\s*['\"]WP_DEBUG['\"]\s*,\s*true\s*\)/i", $clean_content );

		// Check for WP_DEBUG_LOG = true (handle various formats and spacing)
		$wp_debug_log_enabled = preg_match( "/define\s*\(\s*['\"]WP_DEBUG_LOG['\"]\s*,\s*true\s*\)/i", $clean_content );

		// Both must be true for debug logging to be enabled
		return $wp_debug_enabled && $wp_debug_log_enabled;
	}

	/**
	 * Get debug log content with pagination.
	 */
	public function get_debug_log_content() {
		try {
			$build_array_for_validation = array();

			if (! empty($_GET['search'])) { // phpcs:ignore
				$build_array_for_validation[] = array(
					'name'     => 'search',
					'value'    => wp_unslash($_GET['search']), // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => '',
				);
			}

			if (! empty($_GET['sortKey'])) { // phpcs:ignore
				$build_array_for_validation[] = array(
					'name'     => 'sortKey',
					'value'    => wp_unslash($_GET['sortKey']), // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => '',
				);
			}

			if (! empty($_GET['order'])) { // phpcs:ignore
				$build_array_for_validation[] = array(
					'name'     => 'order',
					'value'    => wp_unslash($_GET['order']), // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => '',
				);
			}

			if (! empty($_GET['page'])) { // phpcs:ignore
				$build_array_for_validation[] = array(
					'name'     => 'page',
					'value'    => wp_unslash($_GET['page']), // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => '',
				);
			}

			if (! empty($_GET['per_page'])) { // phpcs:ignore
				$build_array_for_validation[] = array(
					'name'     => 'per_page',
					'value'    => wp_unslash($_GET['per_page']), // phpcs:ignore
					'sanitize' => 'sanitize_text_field',
					'rules'    => '',
				);
			}

			$sanitized_data = versatile_sanitization_validation(
				$build_array_for_validation
			);

			if ( ! $sanitized_data['success'] ) {
				$this->json_response( __( 'Invalid input data', 'versatile-toolkit' ), null, 400 );
			}

			$request_verify = versatile_verify_request( $sanitized_data );

			if ( ! $request_verify['success'] ) {
				$this->json_response( $request_verify['message'] ?? __( 'Invalid input data', 'versatile-toolkit' ), null, 400 );
			}

			$verified_data = (object) $request_verify['data'];
			$log_path      = $this->get_debug_log_path();

			if ( ! file_exists( $log_path ) ) {
				$data = array(
					'entries'       => array(),
					'total_entries' => 0,
					'current_page'  => 1,
					'total_pages'   => 0,
				);
				$this->json_response( __( 'Debug log file not found', 'versatile-toolkit' ), $data, 400 );
			}

			$page     = isset( $verified_data->page ) ? (int) $verified_data->page : 1;
			$per_page = isset( $verified_data->per_page ) ? (int) $verified_data->per_page : 20;

			$lines = file( $log_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES );

			// Parse complete error entries (multi-line support)
			$error_entries = $this->parse_complete_error_entries( $lines );
			$total_entries = count( $error_entries );
			$total_pages   = ceil( $total_entries / $per_page );

			// Reverse entries to show newest first
			$error_entries = array_reverse( $error_entries );

			$start          = ( $page - 1 ) * $per_page;
			$parsed_entries = array_slice( $error_entries, $start, $per_page );

			$data = array(
				'entries'       => $parsed_entries,
				'total_entries' => $total_entries,
				'current_page'  => $page,
				'total_pages'   => $total_pages,
				'per_page'      => $per_page,
			);

			$this->json_response( 'success', $data, 200 );
		} catch ( \Throwable $th ) {
			$this->json_response( __( 'Error getting debug log content', 'versatile-toolkit' ), 400 );
		}
	}

	/**
	 * Parse complete error entries from log lines, handling multi-line errors.
	 *
	 * @param array $lines Array of log lines.
	 * @return array Array of parsed error entries.
	 */
	private function parse_complete_error_entries( $lines ) {
		$error_entries = array();
		$current_error = null;
		$entry_id      = 1;

		foreach ( $lines as $line_number => $line ) {
			// Check if this line starts a new error entry
			if ( preg_match( '/^\[([^\]]+)\]\s+(PHP\s+)?(Notice|Warning|Error|Fatal\s+error|Parse\s+error|Deprecated|Strict\s+Standards|WordPress\s+database\s+error):/i', $line, $matches ) ) {
				// Save previous error if exists
				if ( null !== $current_error ) {
					$error_entries[] = $current_error;
				}

				// Start new error entry
				$current_error = $this->parse_log_entry( $line, $entry_id++ );
			} elseif ( null !== $current_error ) {
				// This line is part of the current error (stack trace, continuation, etc.)
				// Skip automatic update messages and other non-error lines
				if ( ! preg_match( '/^\[([^\]]+)\]\s+(Automatic\s+updates|WordPress\s+database\s+error)/i', $line ) ) {
					$current_error['message']  .= "\n" . trim( $line );
					$current_error['raw_line'] .= "\n" . $line;
				}
			}
		}

		// Don't forget the last error
		if ( null !== $current_error ) {
			$error_entries[] = $current_error;
		}

		return $error_entries;
	}

	/**
	 * Parse a single log entry.
	 *
	 * @param string $line The log line to parse.
	 * @param int    $line_number The line number.
	 * @return array|null Parsed log entry or null if parsing fails.
	 */
	private function parse_log_entry( $line, $line_number ) {
		// Pattern to match WordPress debug log format: [timestamp] Type: Message in /path/file.php on line 123
		$pattern = '/^\[([^\]]+)\]\s+(PHP\s+)?(Notice|Warning|Error|Fatal\s+error|Parse\s+error|Deprecated|Strict\s+Standards|WordPress\s+database\s+error):\s+(.+?)(?:\s+in\s+(.+?)\s+on\s+line\s+(\d+))?$/i';

		if ( preg_match( $pattern, $line, $matches ) ) {
			$timestamp = $matches[1];
			$type      = trim( ( $matches[2] ?? '' ) . $matches[3] );
			$message   = $matches[4];
			$file      = $matches[5] ?? '';
			$line_num  = $matches[6] ?? '';

			// Determine severity level
			$severity = $this->get_log_severity( $type );

			// Extract stack trace if present (usually in the message for fatal errors)
			$stack_trace = '';
			if ( strpos( $message, 'Stack trace:' ) !== false ) {
				$parts       = explode( 'Stack trace:', $message, 2 );
				$message     = trim( $parts[0] );
				$stack_trace = isset( $parts[1] ) ? trim( $parts[1] ) : '';
			}

			return array(
				'id'          => $line_number,
				'timestamp'   => $timestamp,
				'type'        => $type,
				'severity'    => $severity,
				'message'     => $message,
				'file'        => $file,
				'line'        => $line_num,
				'stack_trace' => $stack_trace,
				'raw_line'    => $line,
			);
		}

		// If it doesn't match the standard format, treat as generic log entry
		return array(
			'id'          => $line_number,
			'timestamp'   => '',
			'type'        => 'Unknown',
			'severity'    => 'info',
			'message'     => $line,
			'file'        => '',
			'line'        => '',
			'stack_trace' => '',
			'raw_line'    => $line,
		);
	}

	/**
	 * Get severity level for log type.
	 *
	 * @param string $type Log type.
	 * @return string Severity level.
	 */
	private function get_log_severity( $type ) {
		$type_lower = strtolower( $type );

		if ( strpos( $type_lower, 'fatal' ) !== false || strpos( $type_lower, 'parse' ) !== false ) {
			return 'error';
		} elseif ( strpos( $type_lower, 'error' ) !== false ) {
			return 'error';
		} elseif ( strpos( $type_lower, 'warning' ) !== false ) {
			return 'warning';
		} elseif ( strpos( $type_lower, 'notice' ) !== false || strpos( $type_lower, 'deprecated' ) !== false ) {
			return 'notice';
		} else {
			return 'info';
		}
	}

	/**
	 * Clear debug log file.
	 */
	public function clear_debug_log() {
		try {
			$request_verify = versatile_verify_request( $_POST ); // phpcs:ignore

			if ( ! $request_verify['success'] ) {
				$this->json_response( $request_verify['message'], 400 );
			}

			$log_path = $this->get_debug_log_path();

			if ( file_exists( $log_path ) ) {
				$result = file_put_contents( $log_path, '' );
				if ( false !== $result ) {
					$this->json_response( __( 'Debug log cleared successfully', 'versatile-toolkit' ), 200 );
				} else {
					$this->json_response( __( 'Failed to clear debug log', 'versatile-toolkit' ), 400 );
				}
			} else {
				$this->json_response( __( 'Debug log file does not exist', 'versatile-toolkit' ), 400 );
			}
		} catch ( \Throwable $th ) {
			$this->json_response( __( 'Error clearing debug log', 'versatile-toolkit' ), 400 );
		}
	}

	/**
	 * Download debug log file.
	 */
	public function download_debug_log() {
		try {
			$plugin_info  = versatile_get_plugin_data();
			$nonce_key    = $plugin_info['nonce_key'];
			$nonce_action = $plugin_info['nonce_action'];

			// Verify nonce for GET request
			if ( ! isset( $_GET[ $nonce_key ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET[ $nonce_key ] ) ), $nonce_action ) ) {
				$this->json_response( 'Security check failed', 400 );
			}

			// Check user permissions
			if ( ! current_user_can( 'manage_options' ) ) {
				$this->json_response( 'Insufficient permissions', 400 );
			}

			$log_path = $this->get_debug_log_path();

			if ( ! file_exists( $log_path ) ) {
				$this->json_response( __( 'Debug log file not found', 'versatile-toolkit' ), 400 );
			}

			$filename = 'debug-log-' . gmdate( 'Y-m-d-H-i-s' ) . '.log';

			header( 'Content-Type: application/octet-stream' );
			header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
			header( 'Content-Length: ' . filesize( $log_path ) );

			readfile( $log_path );
			exit;
		} catch ( \Throwable $th ) {
			$this->json_response( __( 'Error downloading debug log', 'versatile-toolkit' ), 400 );
		}
	}

	/**
	 * Update wp-config.php debug settings.
	 *
	 * @param bool $enable Whether to enable debug logging.
	 * @return bool Success status.
	 */
	private function update_wp_config_debug_settings( $enable ) {
		$wp_config_path = ABSPATH . 'wp-config.php';

		if ( ! file_exists( $wp_config_path ) || ! is_writable( $wp_config_path ) ) {
			return false;
		}

		$wp_config_content = file_get_contents( $wp_config_path );

		// Define the debug constants and their values based on enable/disable
		$debug_constants = array(
			'WP_DEBUG'         => $enable,
			'WP_DEBUG_LOG'     => $enable,
			'WP_DEBUG_DISPLAY' => ! $enable, // Opposite of enable - we don't want to display errors on frontend
		);

		// First, remove all duplicate entries for each debug constant
		// foreach ( $debug_constants as $constant => $value ) {
		// $wp_config_content = $this->remove_duplicate_constants( $wp_config_content, $constant );
		// }

		// Then, add/update each debug constant with the new value
		foreach ( $debug_constants as $constant => $value ) {
			$wp_config_content = $this->update_debug_constant( $wp_config_content, $constant, $value );
		}

		return file_put_contents( $wp_config_path, $wp_config_content ) !== false;
	}

	/**
	 * Remove all duplicate instances of a WordPress constant from wp-config.php content.
	 *
	 * @param string $content The wp-config.php content.
	 * @param string $constant The constant name (e.g., 'WP_DEBUG').
	 * @return string Updated content with duplicates removed.
	 */
	private function remove_duplicate_constants( $content, $constant ) {
		// Pattern to match all instances of the constant (both conditional and direct definitions)
		$patterns = array(
			// Pattern 1: Conditional definitions like if ( ! defined( 'WP_DEBUG' ) ) { define( 'WP_DEBUG', true ); }
			"/if\s*\(\s*!\s*defined\s*\(\s*['\"]" . preg_quote( $constant, '/' ) . "['\"]\s*\)\s*\)\s*\{\s*define\s*\(\s*['\"]" . preg_quote( $constant, '/' ) . "['\"]\s*,\s*(true|false)\s*\)\s*;\s*\}/i",
			// Pattern 2: Direct definitions like define( 'WP_DEBUG', false );
			"/define\s*\(\s*['\"]" . preg_quote( $constant, '/' ) . "['\"]\s*,\s*(true|false)\s*\)\s*;/i",
		);

		$matches_found = array();
		$total_matches = 0;

		// Count all matches for each pattern
		foreach ( $patterns as $pattern ) {
			preg_match_all( $pattern, $content, $matches, PREG_OFFSET_CAPTURE );
			$total_matches  += count( $matches[0] );
			$matches_found[] = $matches[0];
		}

		// If we have more than one match, remove all instances
		if ( $total_matches > 1 ) {
			foreach ( $patterns as $pattern ) {
				$content = preg_replace( $pattern, '', $content );
			}

			// Clean up any extra blank lines left behind
			$content = preg_replace( "/\n\s*\n\s*\n/", "\n\n", $content );
		}

		return $content;
	}

	/**
	 * Update a specific debug constant in wp-config.php content.
	 *
	 * @param string $content The wp-config.php content.
	 * @param string $constant The constant name (e.g., 'WP_DEBUG').
	 * @param bool   $value The value to set (true or false).
	 * @return string Updated content.
	 */
	private function update_debug_constant( $content, $constant, $value ) {
		$value_str = $value ? 'true' : 'false';

		// Pattern 1: Handle conditional definitions like if ( ! defined( 'WP_DEBUG' ) ) { define( 'WP_DEBUG', true ); }
		$conditional_pattern = "/if\s*\(\s*!\s*defined\s*\(\s*['\"]" . preg_quote( $constant, '/' ) . "['\"]\s*\)\s*\)\s*\{\s*define\s*\(\s*['\"]" . preg_quote( $constant, '/' ) . "['\"]\s*,\s*(true|false)\s*\)\s*;\s*\}/i";

		if ( preg_match( $conditional_pattern, $content ) ) {
			// Replace the conditional definition
			$replacement = "if ( ! defined( '{$constant}' ) ) { define( '{$constant}', {$value_str} ); }";
			$content     = preg_replace( $conditional_pattern, $replacement, $content );
			return $content;
		}

		// Pattern 2: Handle direct definitions like define( 'WP_DEBUG', false );
		$direct_pattern = "/define\s*\(\s*['\"]" . preg_quote( $constant, '/' ) . "['\"]\s*,\s*(true|false)\s*\)\s*;/i";

		if ( preg_match( $direct_pattern, $content ) ) {
			// Replace existing direct definition
			$replacement = "define( '{$constant}', {$value_str} );";
			$content     = preg_replace( $direct_pattern, $replacement, $content );
			return $content;
		}

		// Pattern 3: If no existing definition found, add it before "/* That's all, stop editing! Happy publishing. */"
		$stop_editing_comment = "/* That's all, stop editing! Happy publishing. */";
		if ( false !== strpos( $content, $stop_editing_comment ) ) {
			$new_define = "define( '{$constant}', {$value_str} );\n";
			$content    = str_replace( $stop_editing_comment, $new_define . $stop_editing_comment, $content );
		} else {
			// Fallback: add at the end of the file if the comment is not found
			$content .= "\ndefine( '{$constant}', {$value_str} );\n";
		}

		return $content;
	}

	/**
	 * Refresh debug log status (same as get_debug_log_status but for explicit refresh calls).
	 */
	public function refresh_debug_log() {
		$this->get_debug_log_status();
	}
}

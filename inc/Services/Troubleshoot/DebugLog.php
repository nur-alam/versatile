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
						'value'    => $_POST['enable'] ?? 'false',
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				wp_send_json_error( array( 'message' => 'Invalid input data' ) );
			}

			$request_verify = versatile_verify_request( $sanitized_data );

			if ( ! $request_verify['success'] ) {
				wp_send_json_error( array( 'message' => $request_verify['message'] ) );
			}

			$verified_data = (object) $request_verify['data'];
			$enable        = $verified_data->enable === 'true';

			$result = $this->update_wp_config_debug_settings( $enable );

			wp_send_json_success(
				array(
					'enabled' => $result,
					'message' => $result ? __( 'Debug logging enabled successfully', 'versatile-toolkit' ) : __( 'Debug logging disabled successfully', 'versatile-toolkit' ),
				)
			);
		} catch ( \Throwable $th ) {
			wp_send_json_error( array( 'message' => __( 'Error toggling debug log', 'versatile-toolkit' ) ) );
		}
	}

	/**
	 * Get debug log status.
	 */
	public function get_debug_log_status() {
		try {
			$request_verify = versatile_verify_request( $_POST );

			if ( ! $request_verify['success'] ) {
				wp_send_json_error( array( 'message' => $request_verify['message'] ) );
			}

			$log_path    = $this->get_debug_log_path();
			$file_exists = file_exists( $log_path );
			$file_size   = $file_exists ? filesize( $log_path ) : 0;

			wp_send_json_success(
				array(
					'enabled'             => $this->is_debug_enabled(),
					'file_exists'         => $file_exists,
					'file_size'           => $file_size,
					'file_size_formatted' => $file_exists ? size_format( $file_size ) : '0 B',
					'last_modified'       => $file_exists ? filemtime( $log_path ) : null,
				)
			);
		} catch ( \Throwable $th ) {
			wp_send_json_error( array( 'message' => __( 'Error getting debug log status', 'versatile-toolkit' ) ) );
		}
	}

	/**
	 * Get debug log content with pagination.
	 */
	public function get_debug_log_content() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'page',
						'value'    => wp_unslash( $_POST['page'] ?? '1' ),
						'sanitize' => 'sanitize_text_field',
						'rules'    => '',
					),
					array(
						'name'     => 'per_page',
						'value'    => wp_unslash( $_POST['per_page'] ?? '50' ),
						'sanitize' => 'sanitize_text_field',
						'rules'    => '',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				wp_send_json_error( array( 'message' => 'Invalid input data' ) );
			}

			$request_verify = versatile_verify_request( $sanitized_data );

			if ( ! $request_verify['success'] ) {
				wp_send_json_error( array( 'message' => $request_verify['message'] ) );
			}

			$verified_data = (object) $request_verify['data'];
			$log_path      = $this->get_debug_log_path();

			if ( ! file_exists( $log_path ) ) {
				wp_send_json_success(
					array(
						'entries'      => array(),
						'total_lines'  => 0,
						'current_page' => 1,
						'total_pages'  => 0,
					)
				);
			}

			$page     = max( 1, intval( $verified_data->page ) );
			$per_page = max( 10, min( 100, intval( $verified_data->per_page ) ) );

			$lines       = file( $log_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES );
			$total_lines = count( $lines );
			$total_pages = ceil( $total_lines / $per_page );

			// Reverse lines to show newest first
			$lines = array_reverse( $lines );

			$start      = ( $page - 1 ) * $per_page;
			$page_lines = array_slice( $lines, $start, $per_page );

			// Parse log entries
			$parsed_entries = array();
			foreach ( $page_lines as $index => $line ) {
				$parsed_entry = $this->parse_log_entry( $line, $start + $index + 1 );
				if ( $parsed_entry ) {
					$parsed_entries[] = $parsed_entry;
				}
			}

			wp_send_json_success(
				array(
					'entries'      => $parsed_entries,
					'total_lines'  => $total_lines,
					'current_page' => $page,
					'total_pages'  => $total_pages,
					'per_page'     => $per_page,
				)
			);
		} catch ( \Throwable $th ) {
			wp_send_json_error( array( 'message' => __( 'Error getting debug log content', 'versatile-toolkit' ) ) );
		}
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
			$request_verify = versatile_verify_request( $_POST );

			if ( ! $request_verify['success'] ) {
				wp_send_json_error( array( 'message' => $request_verify['message'] ) );
			}

			$log_path = $this->get_debug_log_path();

			if ( file_exists( $log_path ) ) {
				$result = file_put_contents( $log_path, '' );
				if ( $result !== false ) {
					wp_send_json_success(
						array(
							'message' => __( 'Debug log cleared successfully', 'versatile-toolkit' ),
						)
					);
				} else {
					wp_send_json_error(
						array(
							'message' => __( 'Failed to clear debug log', 'versatile-toolkit' ),
						)
					);
				}
			} else {
				wp_send_json_success(
					array(
						'message' => __( 'Debug log file does not exist', 'versatile-toolkit' ),
					)
				);
			}
		} catch ( \Throwable $th ) {
			wp_send_json_error( array( 'message' => __( 'Error clearing debug log', 'versatile-toolkit' ) ) );
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
			if ( ! wp_verify_nonce( $_GET[ $nonce_key ] ?? '', $nonce_action ) ) {
				wp_die( 'Security check failed' );
			}

			// Check user permissions
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_die( 'Insufficient permissions' );
			}

			$log_path = $this->get_debug_log_path();

			if ( ! file_exists( $log_path ) ) {
				wp_die( 'Debug log file not found' );
			}

			$filename = 'debug-log-' . date( 'Y-m-d-H-i-s' ) . '.log';

			header( 'Content-Type: application/octet-stream' );
			header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
			header( 'Content-Length: ' . filesize( $log_path ) );

			readfile( $log_path );
			exit;
		} catch ( \Throwable $th ) {
			wp_die( 'Error downloading debug log' );
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

		if ( $enable ) {
			// Enable debug settings
			$patterns = array(
				"/define\s*\(\s*['\"]WP_DEBUG['\"]\s*,\s*false\s*\)\s*;/i" => "define( 'WP_DEBUG', true );",
				"/define\s*\(\s*['\"]WP_DEBUG_LOG['\"]\s*,\s*false\s*\)\s*;/i" => "define( 'WP_DEBUG_LOG', true );",
				"/define\s*\(\s*['\"]WP_DEBUG_DISPLAY['\"]\s*,\s*true\s*\)\s*;/i" => "define( 'WP_DEBUG_DISPLAY', false );",
			);

			foreach ( $patterns as $pattern => $replacement ) {
				$wp_config_content = preg_replace( $pattern, $replacement, $wp_config_content );
			}

			// Add debug settings if they don't exist
			if ( ! preg_match( "/define\s*\(\s*['\"]WP_DEBUG['\"]/i", $wp_config_content ) ) {
				$wp_config_content = str_replace(
					"/* That's all, stop editing! Happy publishing. */",
					"define( 'WP_DEBUG', true );\ndefine( 'WP_DEBUG_LOG', true );\ndefine( 'WP_DEBUG_DISPLAY', false );\n\n/* That's all, stop editing! Happy publishing. */",
					$wp_config_content
				);
			}
		} else {
			// Disable debug settings
			$patterns = array(
				"/define\s*\(\s*['\"]WP_DEBUG['\"]\s*,\s*true\s*\)\s*;/i" => "define( 'WP_DEBUG', false );",
				"/define\s*\(\s*['\"]WP_DEBUG_LOG['\"]\s*,\s*true\s*\)\s*;/i" => "define( 'WP_DEBUG_LOG', false );",
			);

			foreach ( $patterns as $pattern => $replacement ) {
				$wp_config_content = preg_replace( $pattern, $replacement, $wp_config_content );
			}
		}

		return file_put_contents( $wp_config_path, $wp_config_content ) !== false;
	}
}

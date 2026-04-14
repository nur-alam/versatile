<?php
/**
 * Initialize the plugin
 *
 * @package Versatile\Core
 * @subpackage Versatile\Init
 * @author  Versatile<versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services;

defined( 'ABSPATH' ) || exit;

use Versatile\Services\MaintenanceMode\MaintenanceMode;
use Versatile\Services\Troubleshoot\TroubleshootInit;
use Versatile\Services\Comingsoon\ComingsoonMood;
use Versatile\Services\QuickAct\QuickAct;
use Versatile\Services\Templogin\Templogin;
use Versatile\Database\TempLoginTable;
use Versatile\Traits\JsonResponse;

/**
 * The Init class initializes plugin dependencies by creating instances
 * of the classes
 */
class ServiceInit {

	use JsonResponse;

	/**
	 * Initialize the plugin dependencies
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$new_table = new TempLoginTable();
		$new_table->create_table();

		$versatile_service_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

		// Troubleshoot enable_troubleshoot
		if ( $versatile_service_list['troubleshoot']['enable'] ) {
			new TroubleshootInit();
		}

		// Mood services
		if ( $versatile_service_list['maintenance']['enable'] ) {
			new MaintenanceMode();
		}
		if ( $versatile_service_list['comingsoon']['enable'] ) {
			new ComingsoonMood();
		}

		// Templogin service
		if ( $versatile_service_list['templogin']['enable'] ) {
			new Templogin();
		}

		// Quick Act service (formerly Quick Pick).
		if ( ! empty( $versatile_service_list['quickact']['enable'] ) ) {
			new QuickAct();
		}

		add_action( 'wp_ajax_versatile_get_service_list', array( $this, 'versatile_get_service_list' ) );
		add_action( 'wp_ajax_versatile_get_enable_service_list', array( $this, 'versatile_get_enable_service_list' ) );
		add_action( 'wp_ajax_versatile_update_service_status', array( $this, 'versatile_update_service_status' ) );
		add_action( 'wp_ajax_versatile_get_mood_info', array( $this, 'get_mood_info' ) );

		// TODO: uncomment this when we have a way to migrate the data from the old version to the new version
		// add_action( 'load-plugins.php', array( __CLASS__, 'sync_on_plugin_admin_pages' ), 1 );
		// add_action( 'load-update-core.php', array( __CLASS__, 'sync_on_plugin_admin_pages' ), 1 );
		// add_action( 'upgrader_process_complete', array( __CLASS__, 'sync_after_plugin_upgrade' ), 10, 2 );
	}

	/**
	 * Versatile_get_service_list description
	 *
	 * @return array description
	 */
	public function versatile_get_service_list() {
		try {
			// action & nonce sanitization & validation by default don't have to pass
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$addon_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			return $this->json_response( __( 'Service list retrieved successfully!', 'versatile-toolkit' ), $addon_list, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while retrieving service list', 'versatile-toolkit' ), array(), 400 );
		}
	}

	/**
	 * Get only enabled services list
	 *
	 * @return array JSON response with enabled services only
	 */
	public function versatile_get_enable_service_list() {
		try {
			// action & nonce sanitization & validation by default, don't need to pass
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$addon_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			// Filter only enabled services
			$enabled_services = array_filter(
				$addon_list,
				function ( $service ) {
					return isset( $service['enable'] ) && true === $service['enable'];
				}
			);

			return $this->json_response( __( 'Enabled services retrieved successfully!', 'versatile-toolkit' ), $enabled_services, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while retrieving enabled services', 'versatile-toolkit' ), array(), 400 );
		}
	}

	/**
	 * Update service status (enable/disable)
	 *
	 * @return array JSON response
	 */
	public function versatile_update_service_status() {
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'service_key',
						'value'    => isset($_POST['service_key']) ? $_POST['service_key'] : '', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|string',
					),
					array(
						'name'     => 'enable',
						'value'    => isset($_POST['enable']) ? $_POST['enable'] : 'false', //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'boolean',
					),
				)
			);

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$verified_data = (object) $verify_request['data'];

			$service_key = $verified_data->service_key;
			$enable      = $verified_data->enable;

			// Get current service list
			$service_list = get_option( VERSATILE_SERVICE_LIST, VERSATILE_DEFAULT_SERVICE_LIST );

			// Check if service exists
			if ( ! isset( $service_list[ $service_key ] ) ) {
				return $this->json_response( __( 'Error: Service not found', 'versatile-toolkit' ), array(), 404 );
			}

			// Update the service status
			$service_list[ $service_key ]['enable'] = filter_var( $enable, FILTER_VALIDATE_BOOLEAN );

			// Save updated service list
			$updated = update_option( VERSATILE_SERVICE_LIST, $service_list );

			if ( $updated ) {
				$status_text   = $enable ? 'enabled' : 'disabled';
				$service_label = $service_list[ $service_key ]['label'];

				return $this->json_response(
					sprintf( '%s has been %s successfully!', $service_label, $status_text ),
					$service_list,
					200
				);
			} else {
				return $this->json_response( __( 'Error: Failed to update service status', 'versatile-toolkit' ), array(), 500 );
			}
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: ' . $th->getMessage(), array(), 500 );
		}
	}

	/**
	 * Get mood info description.
	 *
	 * @return array description
	 */
	public function get_mood_info() {
		try {
			// action & nonce sanitization & validation by default, don't need to pass
			$sanitized_data = versatile_sanitization_validation();

			if ( ! $sanitized_data['success'] ) {
				return $this->json_response( $sanitized_data['message'], $sanitized_data['errors'], 400 );
			}

			$verify_request = versatile_verify_request( $sanitized_data );

			if ( ! $verify_request['success'] ) {
				return $this->json_response( $verify_request['message'], array(), $verify_request['code'] );
			}

			$current_mood_info = get_option( VERSATILE_MOOD_LIST, VERSATILE_DEFAULT_MOOD_LIST );
			return $this->json_response( __( 'Maintenance Mood info retrieved successfully!', 'versatile-toolkit' ), $current_mood_info, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( __( 'Error: while retrieving maintenance mood info', 'versatile-toolkit' ), array(), 400 );
		}
	}

	/**
	 * Merge defaults into the stored service list when it differs; may update the option.
	 *
	 * Invoked at most once per request (unless forced) from the daily check, Plugins /
	 * Updates admin screens, or after this plugin updates.
	 *
	 * @param bool $force When true, run even if this request already ran a non-forced sync (e.g. after upgrader).
	 * @return void
	 */
	public static function run_service_list_sync( bool $force = false ): void {
		static $synced = false;
		if ( $synced && ! $force ) {
			return;
		}
		$synced = true;

		self::sync_service_list_with_defaults();
		// update_option( VERSATILE_SERVICE_LIST_LAST_SYNC_OPTION, time(), false );
	}

	/**
	 * Plugins or Dashboard → Updates screen: refresh merged service list.
	 *
	 * @return void
	 */
	public static function sync_on_plugin_admin_pages(): void {
		self::run_service_list_sync();
	}

	/**
	 * After any plugin update: re-merge when this plugin was in the set.
	 *
	 * @param \WP_Upgrader $upgrader_object Upgrader instance.
	 * @param array        $options         Hook payload.
	 * @return void
	 */
	public static function sync_after_plugin_upgrade( $upgrader_object, array $options ): void {
		if ( ! isset( $options['action'], $options['type'] ) || 'update' !== $options['action'] || 'plugin' !== $options['type'] ) {
			return;
		}
		$plugins = isset( $options['plugins'] ) ? (array) $options['plugins'] : array();
		if ( ! in_array( VERSATILE_PLUGIN_BASENAME, $plugins, true ) ) {
			return;
		}
		self::run_service_list_sync( true );
	}

	/**
	 * Merge stored service list with code defaults; update the option when it changed.
	 *
	 * @return void
	 */
	private static function sync_service_list_with_defaults(): void {
		$stored = get_option( VERSATILE_SERVICE_LIST, array() );
		if ( ! is_array( $stored ) ) {
			$stored = array();
		}

		$defaults = VERSATILE_DEFAULT_SERVICE_LIST;
		// Drop non-array values so a corrupt option row cannot replace a whole default branch.
		$stored = array_filter( $stored, 'is_array' );
		// Defaults first, then stored: saved settings win; new keys from defaults appear; keys only in DB are kept.
		$merged = array_replace_recursive( $defaults, $stored );

		if ( serialize( $merged ) !== serialize( $stored ) ) { // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
			update_option( VERSATILE_SERVICE_LIST, $merged );
		}
	}
}

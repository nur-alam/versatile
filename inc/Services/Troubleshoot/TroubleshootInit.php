<?php
/**
 * Troubleshoot Service
 *
 * @package Versatile\Services\Troubleshoot
 * @subpackage Versatile\Services\Troubleshoot\TroubleshootInit
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\Troubleshoot;

use Versatile\Helpers\VersatileInput;
use Versatile\Traits\JsonResponse;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * DisablePlugin init
 */
class TroubleshootInit {

	use JsonResponse;

	/**
	 * DisablePlugin constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_versatile_plugin_list', array( $this, 'get_plugin_list' ) );
		add_action( 'wp_ajax_versatile_get_disable_plugin_list', array( $this, 'get_disable_plugin_list' ) );
		add_action( 'wp_ajax_versatile_save_disable_plugin_list', array( $this, 'save_disable_plugin_list' ) );
		add_action( 'wp_ajax_versatile_add_my_ip', array( $this, 'add_my_ip' ) );
	}

	/**
	 * Disable_plugin description
	 *
	 * @return array
	 */
	public function save_disable_plugin_list() {
		$this->versatile_create_mu_plugin();
		try {
			$sanitized_data = versatile_sanitization_validation(
				array(
					array(
						'name'     => 'chosen_plugins',
						'value'    => isset($_POST['chosen_plugins']) ? $_POST['chosen_plugins'] : array(), //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => '',
					),
					array(
						'name'     => 'ip_tags',
						'value'    => isset($_POST['ip_tags']) ? $_POST['ip_tags'] : array(), //phpcs:ignore
						'sanitize' => 'sanitize_text_field',
						'rules'    => 'required|array',
					),
				)
			);

			// Check if sanitization was successful
			if ( ! $sanitized_data->success ) {
				return $this->json_response( $sanitized_data->message, array(), $sanitized_data->code );
			}

			$request_verify = versatile_verify_request( (array) $sanitized_data );

			if ( ! $request_verify->success ) {
				return $this->json_response( $request_verify->message, array(), $request_verify->code );
			}

			// Convert object to array for easier handling
			$params = array(
				'chosen_plugins' => $sanitized_data->chosen_plugins,
				'ip_tags'        => $sanitized_data->ip_tags,
			);

			if ( ! empty( $params['chosen_plugins'] ) && in_array( 'versatile-toolkit/versatile-toolkit.php', $params['chosen_plugins'], true ) ) {
				$filter_chosen_plugins    = array_filter(
					$params['chosen_plugins'],
					function ( $item ) {
						return 'versatile-toolkit/versatile-toolkit.php' !== $item;
					}
				);
				$params['chosen_plugins'] = array_values( $filter_chosen_plugins );
			}

			// Save to options table
			update_option( VERSATILE_DISABLE_PLUGIN_LIST, $params );
			return $this->json_response( 'Disable plugin list saved', array(), 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while saving list', array(), 400 );
		}
	}

	/**
	 * Get_disable_plugin_list description
	 *
	 * @return  [type]  [return description]
	 */
	public function get_disable_plugin_list() {
		$disable_plugin_list = get_option( VERSATILE_DISABLE_PLUGIN_LIST );
		return $this->json_response( 'Disable plugin list saved', $disable_plugin_list, 200 );
	}

	/**
	 * Get plugin list
	 */
	public function get_plugin_list() {
		try {
			$all_plugins = get_plugins();

			// Create array of plugin names only
			$plugin_list = array();

			foreach ( $all_plugins as $plugin_file => $plugin ) {
				if ( isset( $plugin['Name'] ) ) {
					if ( 'versatile-toolkit/versatile-toolkit.php' === $plugin_file ) {
						continue;
					}

					$plugin_list[] = array(
						'slug'  => $plugin_file,
						'label' => $plugin['Name'],
					);
				}
			}

			return $this->json_response( '', $plugin_list, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while fetching plugin list', $plugin_list, 400 );
		}
	}

	/**
	 * Add my ip function
	 *
	 * @return string id address.
	 */
	public function add_my_ip() {
		try {
			$ip_address = versatile_get_client_ip();
			$data       = array(
				'ip' => $ip_address,
			);
			return $this->json_response( 'System IP address added', $data, 200 );
		} catch ( \Throwable $th ) {
			return $this->json_response( 'Error: while retrieving IP address', array(), 400 );
		}
	}

	/**
	 * Versatile create mu plugin description.
	 *
	 * @return void
	 */
	public function versatile_create_mu_plugin() {
		try {
			$mu_plugin_file = VERSATILE_MU_PLUGIN_DIR . '/MuVersatileToolkit.php';

			if ( file_exists( $mu_plugin_file ) ) {
				return;
			}

			$template_file = VERSATILE_PLUGIN_DIR . 'inc/Services/Troubleshoot/MuVersatileToolkit.php';

			if ( ! file_exists( VERSATILE_MU_PLUGIN_DIR ) ) {
				wp_mkdir_p( VERSATILE_MU_PLUGIN_DIR );
			}

			if ( ! file_exists( $mu_plugin_file ) ) {
				copy( $template_file, $mu_plugin_file );
			}
		} catch ( \Throwable $th ) {
			// throw $th;
			return;
		}
	}
}

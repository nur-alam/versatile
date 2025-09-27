<?php
/**
 * Versatile Helper Class
 *
 * @package Versatile\Helpers
 * @subpackage Versatile\Helpers\VersatileHelper
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Helpers;

use SampleTest;

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Versatile Helper class.
 */
class VersatileHelper {

	/**
	 * Convert date to specified timezone.
	 *
	 * @param string $date     Date in 'Y-m-d H:i:s' format.
	 * @return string Converted date in 'Y-m-d H:i:s' format.
	 */
	public static function convert_to_wp_timezone( $date ) {
		$wp_timezone        = wp_timezone_string();
		$date_with_timezone = new \DateTime( $date );
		$date_with_timezone->setTimezone( new \DateTimeZone( $wp_timezone ) );
		return $date_with_timezone->format( 'Y-m-d H:i:s' );
	}
}

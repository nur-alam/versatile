<?php
/**
 * Versatile SMTP Service
 *
 * @package Versatile\Services
 * @subpackage Versatile\Services\Smtp
 * @author Versatile Toolkit
 * @since 1.0.12
 */

namespace Versatile\Services\Smtp;

/**
 * Versatile SMTP Service
 */
class VersatileSmtp {

	/**
	 * Versatile SMTP Service constructor.
	 */
	public function __construct() {
		new PhpMailerConfig();
		new SmtpConfig();
	}
}

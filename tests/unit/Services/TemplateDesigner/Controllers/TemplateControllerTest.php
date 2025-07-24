<?php
/**
 * TemplateController Test
 *
 * @package Versatile\Tests\Unit\Services\TemplateDesigner\Controllers
 * @subpackage Versatile\Tests\Unit\Services\TemplateDesigner\Controllers\TemplateControllerTest
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Tests\Unit\Services\TemplateDesigner\Controllers;

use PHPUnit\Framework\TestCase;
use Versatile\Services\TemplateDesigner\Controllers\TemplateController;

/**
 * Test TemplateController functionality
 */
class TemplateControllerTest extends TestCase {

	/**
	 * TemplateController instance
	 *
	 * @var TemplateController
	 */
	private $controller;

	/**
	 * Set up test environment
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->controller = new TemplateController();
	}

	/**
	 * Test template validation
	 */
	public function test_validate_template() {
		// Test valid template data
		$valid_data = array(
			'name'        => 'Test Template',
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => array(
				array(
					'id'         => 'element_1',
					'type'       => 'text',
					'position'   => array( 'x' => 100, 'y' => 50 ),
					'size'       => array( 'width' => 300, 'height' => 60 ),
					'properties' => array( 'content' => 'Test content' ),
					'styles'     => array( 'color' => '#333333' ),
					'content'    => 'Test content',
				),
			),
			'styles'      => 'body { background: #fff; }',
			'settings'    => array( 'responsive' => true ),
		);

		$result = $this->controller->validate_template( $valid_data );
		$this->assertTrue( $result['success'] );

		// Test invalid template data - missing name
		$invalid_data = array(
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => array(),
		);

		$result = $this->controller->validate_template( $invalid_data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'Template name is required', $result['errors'] );
	}

	/**
	 * Test template validation with invalid type
	 */
	public function test_validate_template_invalid_type() {
		$data = array(
			'name'     => 'Test Template',
			'type'     => 'invalid_type',
			'elements' => array(),
		);

		$result = $this->controller->validate_template( $data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'Template type must be one of: maintenance, comingsoon, both', $result['errors'] );
	}

	/**
	 * Test template validation with invalid elements
	 */
	public function test_validate_template_invalid_elements() {
		$data = array(
			'name'     => 'Test Template',
			'type'     => 'maintenance',
			'elements' => array(
				array(
					// Missing required 'id' field
					'type'     => 'text',
					'position' => array( 'x' => 100, 'y' => 50 ),
				),
			),
		);

		$result = $this->controller->validate_template( $data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'Element at index 0 must have an ID', $result['errors'] );
	}

	/**
	 * Test template validation with dangerous CSS
	 */
	public function test_validate_template_dangerous_css() {
		$data = array(
			'name'     => 'Test Template',
			'type'     => 'maintenance',
			'elements' => array(),
			'styles'   => 'body { background: javascript:alert("xss"); }',
		);

		$result = $this->controller->validate_template( $data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'CSS contains dangerous javascript: protocol', $result['errors'] );
	}

	/**
	 * Test template validation with long name
	 */
	public function test_validate_template_long_name() {
		$data = array(
			'name'     => str_repeat( 'a', 256 ), // 256 characters, exceeds limit
			'type'     => 'maintenance',
			'elements' => array(),
		);

		$result = $this->controller->validate_template( $data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'Template name must be 255 characters or less', $result['errors'] );
	}

	/**
	 * Test template validation with invalid element position
	 */
	public function test_validate_template_invalid_position() {
		$data = array(
			'name'     => 'Test Template',
			'type'     => 'maintenance',
			'elements' => array(
				array(
					'id'       => 'element_1',
					'type'     => 'text',
					'position' => array( 'x' => 'invalid' ), // Invalid position
				),
			),
		);

		$result = $this->controller->validate_template( $data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'Element at index 0 has invalid position data', $result['errors'] );
	}

	/**
	 * Test template validation with invalid element size
	 */
	public function test_validate_template_invalid_size() {
		$data = array(
			'name'     => 'Test Template',
			'type'     => 'maintenance',
			'elements' => array(
				array(
					'id'       => 'element_1',
					'type'     => 'text',
					'position' => array( 'x' => 100, 'y' => 50 ),
					'size'     => array( 'width' => 0, 'height' => 50 ), // Invalid size
				),
			),
		);

		$result = $this->controller->validate_template( $data );
		$this->assertFalse( $result['success'] );
		$this->assertContains( 'Element at index 0 has invalid size data', $result['errors'] );
	}

	/**
	 * Test get_templates_by_type method
	 */
	public function test_get_templates_by_type() {
		$result = $this->controller->get_templates_by_type( 'maintenance' );
		$this->assertTrue( $result['success'] );
		$this->assertArrayHasKey( 'data', $result );
		$this->assertArrayHasKey( 'templates', $result['data'] );
	}

	/**
	 * Test get_active_templates method
	 */
	public function test_get_active_templates() {
		$result = $this->controller->get_active_templates();
		$this->assertTrue( $result['success'] );
		$this->assertArrayHasKey( 'data', $result );
		$this->assertArrayHasKey( 'templates', $result['data'] );
	}

	/**
	 * Test search_templates method
	 */
	public function test_search_templates() {
		$result = $this->controller->search_templates( 'test' );
		$this->assertTrue( $result['success'] );
		$this->assertArrayHasKey( 'data', $result );
		$this->assertArrayHasKey( 'templates', $result['data'] );
	}

	/**
	 * Test get_statistics method
	 */
	public function test_get_statistics() {
		$result = $this->controller->get_statistics();
		$this->assertTrue( $result['success'] );
		$this->assertArrayHasKey( 'data', $result );
	}

	/**
	 * Test check_database_health method
	 */
	public function test_check_database_health() {
		$result = $this->controller->check_database_health();
		$this->assertTrue( $result['success'] );
	}
}
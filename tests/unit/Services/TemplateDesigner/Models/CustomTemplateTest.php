<?php
/**
 * Unit tests for CustomTemplate model
 *
 * @package Versatile\Tests\Unit\Services\TemplateDesigner\Models
 * @subpackage Versatile\Tests\Unit\Services\TemplateDesigner\Models\CustomTemplateTest
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Tests\Unit\Services\TemplateDesigner\Models;

use PHPUnit\Framework\TestCase;
use Versatile\Services\TemplateDesigner\Models\CustomTemplate;

/**
 * CustomTemplate model test class
 */
class CustomTemplateTest extends TestCase {

	/**
	 * Test template construction with valid data
	 */
	public function test_constructor_with_valid_data() {
		$data = array(
			'id'          => 1,
			'name'        => 'Test Template',
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => array(
				array(
					'id'       => 'element_1',
					'type'     => 'text',
					'position' => array( 'x' => 100, 'y' => 50 ),
					'size'     => array( 'width' => 300, 'height' => 60 ),
					'content'  => 'Hello World',
				),
			),
			'styles'      => '.test { color: red; }',
			'settings'    => array( 'theme' => 'dark' ),
			'is_active'   => true,
		);

		$template = new CustomTemplate( $data );

		$this->assertEquals( 1, $template->id );
		$this->assertEquals( 'Test Template', $template->name );
		$this->assertEquals( 'A test template', $template->description );
		$this->assertEquals( 'maintenance', $template->type );
		$this->assertIsArray( $template->elements );
		$this->assertEquals( '.test { color: red; }', $template->styles );
		$this->assertIsArray( $template->settings );
		$this->assertTrue( $template->is_active );
	}

	/**
	 * Test template construction with empty data
	 */
	public function test_constructor_with_empty_data() {
		$template = new CustomTemplate();

		$this->assertNull( $template->id );
		$this->assertEquals( '', $template->name );
		$this->assertEquals( '', $template->description );
		$this->assertEquals( 'both', $template->type );
		$this->assertIsArray( $template->elements );
		$this->assertEmpty( $template->elements );
		$this->assertEquals( '', $template->styles );
		$this->assertIsArray( $template->settings );
		$this->assertEmpty( $template->settings );
		$this->assertFalse( $template->is_active );
	}

	/**
	 * Test template validation with valid data
	 */
	public function test_validate_with_valid_data() {
		$data = array(
			'name'     => 'Valid Template',
			'type'     => 'maintenance',
			'elements' => array(
				array(
					'id'       => 'element_1',
					'type'     => 'text',
					'position' => array( 'x' => 100, 'y' => 50 ),
					'size'     => array( 'width' => 300, 'height' => 60 ),
				),
			),
			'settings' => array( 'theme' => 'light' ),
		);

		$template = new CustomTemplate( $data );
		$result   = $template->validate();

		$this->assertTrue( $result['valid'] );
		$this->assertEmpty( $result['errors'] );
	}

	/**
	 * Test template validation with missing name
	 */
	public function test_validate_with_missing_name() {
		$template = new CustomTemplate( array( 'type' => 'maintenance' ) );
		$result   = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Template name is required', $result['errors'] );
	}

	/**
	 * Test template validation with invalid type
	 */
	public function test_validate_with_invalid_type() {
		$template = new CustomTemplate(
			array(
				'name' => 'Test Template',
				'type' => 'invalid_type',
			)
		);
		$result = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Template type must be one of: maintenance, comingsoon, both', $result['errors'] );
	}

	/**
	 * Test template validation with invalid elements
	 */
	public function test_validate_with_invalid_elements() {
		$template = new CustomTemplate(
			array(
				'name'     => 'Test Template',
				'type'     => 'maintenance',
				'elements' => 'not_an_array',
			)
		);
		$result = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Template elements must be an array', $result['errors'] );
	}

	/**
	 * Test template validation with element missing ID
	 */
	public function test_validate_with_element_missing_id() {
		$template = new CustomTemplate(
			array(
				'name'     => 'Test Template',
				'type'     => 'maintenance',
				'elements' => array(
					array(
						'type' => 'text',
					),
				),
			)
		);
		$result = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element at index 0 must have an ID', $result['errors'] );
	}

	/**
	 * Test template validation with dangerous CSS
	 */
	public function test_validate_with_dangerous_css() {
		$template = new CustomTemplate(
			array(
				'name'   => 'Test Template',
				'type'   => 'maintenance',
				'styles' => 'body { background: url(javascript:alert("xss")); }',
			)
		);
		$result = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'CSS contains dangerous javascript: protocol', $result['errors'] );
	}

	/**
	 * Test template serialization
	 */
	public function test_serialize() {
		$data = array(
			'id'          => 1,
			'name'        => 'Test Template',
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => array(
				array(
					'id'   => 'element_1',
					'type' => 'text',
				),
			),
			'styles'      => '.test { color: red; }',
			'settings'    => array( 'theme' => 'dark' ),
			'is_active'   => true,
		);

		$template   = new CustomTemplate( $data );
		$serialized = $template->serialize();

		$this->assertEquals( 1, $serialized['id'] );
		$this->assertEquals( 'Test Template', $serialized['name'] );
		$this->assertEquals( 'A test template', $serialized['description'] );
		$this->assertEquals( 'maintenance', $serialized['type'] );
		$this->assertIsString( $serialized['elements'] );
		$this->assertEquals( '.test { color: red; }', $serialized['styles'] );
		$this->assertIsString( $serialized['settings'] );
		$this->assertEquals( 1, $serialized['is_active'] );
	}

	/**
	 * Test template deserialization
	 */
	public function test_deserialize() {
		$data = array(
			'id'          => '1',
			'name'        => 'Test Template',
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => wp_json_encode(
				array(
					array(
						'id'   => 'element_1',
						'type' => 'text',
					),
				)
			),
			'styles'      => '.test { color: red; }',
			'settings'    => wp_json_encode( array( 'theme' => 'dark' ) ),
			'is_active'   => '1',
		);

		$template = new CustomTemplate();
		$template->deserialize( $data );

		$this->assertEquals( 1, $template->id );
		$this->assertEquals( 'Test Template', $template->name );
		$this->assertEquals( 'A test template', $template->description );
		$this->assertEquals( 'maintenance', $template->type );
		$this->assertIsArray( $template->elements );
		$this->assertEquals( '.test { color: red; }', $template->styles );
		$this->assertIsArray( $template->settings );
		$this->assertTrue( $template->is_active );
	}

	/**
	 * Test element sanitization
	 */
	public function test_element_sanitization() {
		$data = array(
			'name'     => 'Test Template',
			'elements' => array(
				array(
					'id'         => '<script>alert("xss")</script>',
					'type'       => 'text<script>',
					'position'   => array( 'x' => '100', 'y' => '50' ),
					'size'       => array( 'width' => '300', 'height' => '60' ),
					'properties' => array(
						'color'    => '#ff0000',
						'fontSize' => '16px',
					),
					'content'    => '<p>Safe content</p><script>alert("xss")</script>',
				),
			),
		);

		$template = new CustomTemplate( $data );

		$this->assertStringNotContainsString( '<script>', $template->elements[0]['id'] );
		$this->assertStringNotContainsString( '<script>', $template->elements[0]['type'] );
		$this->assertEquals( 100, $template->elements[0]['position']['x'] );
		$this->assertEquals( 50, $template->elements[0]['position']['y'] );
		$this->assertEquals( 300, $template->elements[0]['size']['width'] );
		$this->assertEquals( 60, $template->elements[0]['size']['height'] );
		$this->assertStringContainsString( '<p>Safe content</p>', $template->elements[0]['content'] );
		$this->assertStringNotContainsString( '<script>', $template->elements[0]['content'] );
	}

	/**
	 * Test CSS sanitization
	 */
	public function test_css_sanitization() {
		$dangerous_css = 'body { background: url(javascript:alert("xss")); } .test { expression(alert("xss")); }';
		$template      = new CustomTemplate(
			array(
				'name'   => 'Test Template',
				'styles' => $dangerous_css,
			)
		);

		$this->assertStringNotContainsString( 'javascript:', $template->styles );
		$this->assertStringNotContainsString( 'expression(', $template->styles );
	}

	/**
	 * Test type sanitization
	 */
	public function test_type_sanitization() {
		$template = new CustomTemplate( array( 'type' => 'invalid_type' ) );
		$this->assertEquals( 'both', $template->type );

		$template = new CustomTemplate( array( 'type' => 'maintenance' ) );
		$this->assertEquals( 'maintenance', $template->type );

		$template = new CustomTemplate( array( 'type' => 'comingsoon' ) );
		$this->assertEquals( 'comingsoon', $template->type );
	}

	/**
	 * Test to_array method
	 */
	public function test_to_array() {
		$data = array(
			'id'          => 1,
			'name'        => 'Test Template',
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => array(),
			'styles'      => '.test { color: red; }',
			'settings'    => array( 'theme' => 'dark' ),
			'is_active'   => true,
		);

		$template = new CustomTemplate( $data );
		$array    = $template->to_array();

		$this->assertEquals( $data['id'], $array['id'] );
		$this->assertEquals( $data['name'], $array['name'] );
		$this->assertEquals( $data['description'], $array['description'] );
		$this->assertEquals( $data['type'], $array['type'] );
		$this->assertEquals( $data['elements'], $array['elements'] );
		$this->assertEquals( $data['styles'], $array['styles'] );
		$this->assertEquals( $data['settings'], $array['settings'] );
		$this->assertEquals( $data['is_active'], $array['is_active'] );
	}

	/**
	 * Test from_array static method
	 */
	public function test_from_array() {
		$data = array(
			'id'          => 1,
			'name'        => 'Test Template',
			'description' => 'A test template',
			'type'        => 'maintenance',
			'elements'    => array(),
			'styles'      => '.test { color: red; }',
			'settings'    => array( 'theme' => 'dark' ),
			'is_active'   => true,
		);

		$template = CustomTemplate::from_array( $data );

		$this->assertInstanceOf( CustomTemplate::class, $template );
		$this->assertEquals( $data['id'], $template->id );
		$this->assertEquals( $data['name'], $template->name );
		$this->assertEquals( $data['description'], $template->description );
		$this->assertEquals( $data['type'], $template->type );
	}

	/**
	 * Test position validation
	 */
	public function test_position_validation() {
		$template = new CustomTemplate(
			array(
				'name'     => 'Test Template',
				'elements' => array(
					array(
						'id'       => 'element_1',
						'type'     => 'text',
						'position' => array( 'x' => 'invalid', 'y' => 50 ),
					),
				),
			)
		);
		$result = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element at index 0 has invalid position data', $result['errors'] );
	}

	/**
	 * Test size validation
	 */
	public function test_size_validation() {
		$template = new CustomTemplate(
			array(
				'name'     => 'Test Template',
				'elements' => array(
					array(
						'id'   => 'element_1',
						'type' => 'text',
						'size' => array( 'width' => 0, 'height' => 50 ),
					),
				),
			)
		);
		$result = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element at index 0 has invalid size data', $result['errors'] );
	}

	/**
	 * Test long template name validation
	 */
	public function test_long_name_validation() {
		$long_name = str_repeat( 'a', 256 );
		$template  = new CustomTemplate( array( 'name' => $long_name ) );
		$result    = $template->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Template name must be 255 characters or less', $result['errors'] );
	}
}
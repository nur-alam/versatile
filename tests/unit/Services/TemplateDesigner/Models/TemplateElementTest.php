<?php
/**
 * Unit tests for TemplateElement model
 *
 * @package Versatile\Tests\Unit\Services\TemplateDesigner\Models
 * @subpackage Versatile\Tests\Unit\Services\TemplateDesigner\Models\TemplateElementTest
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Tests\Unit\Services\TemplateDesigner\Models;

use PHPUnit\Framework\TestCase;
use Versatile\Services\TemplateDesigner\Models\TemplateElement;

/**
 * TemplateElement model test class
 */
class TemplateElementTest extends TestCase {

	/**
	 * Test element construction with valid data
	 */
	public function test_constructor_with_valid_data() {
		$data = array(
			'id'         => 'element_1',
			'type'       => 'text',
			'properties' => array(
				'content' => 'Hello World',
				'color'   => '#000000',
			),
			'position'   => array( 'x' => 100, 'y' => 50 ),
			'size'       => array( 'width' => 300, 'height' => 60 ),
			'styles'     => array( 'font-size' => '16px' ),
			'content'    => 'Test content',
		);

		$element = new TemplateElement( $data );

		$this->assertEquals( 'element_1', $element->id );
		$this->assertEquals( 'text', $element->type );
		$this->assertIsArray( $element->properties );
		$this->assertEquals( 'Hello World', $element->properties['content'] );
		$this->assertIsArray( $element->position );
		$this->assertEquals( 100, $element->position['x'] );
		$this->assertEquals( 50, $element->position['y'] );
		$this->assertIsArray( $element->size );
		$this->assertEquals( 300, $element->size['width'] );
		$this->assertEquals( 60, $element->size['height'] );
		$this->assertIsArray( $element->styles );
		$this->assertEquals( 'Test content', $element->content );
	}

	/**
	 * Test element construction with empty data
	 */
	public function test_constructor_with_empty_data() {
		$element = new TemplateElement();

		$this->assertEquals( '', $element->id );
		$this->assertEquals( '', $element->type );
		$this->assertIsArray( $element->properties );
		$this->assertEmpty( $element->properties );
		$this->assertIsArray( $element->position );
		$this->assertEquals( 0, $element->position['x'] );
		$this->assertEquals( 0, $element->position['y'] );
		$this->assertIsArray( $element->size );
		$this->assertEquals( 100, $element->size['width'] );
		$this->assertEquals( 50, $element->size['height'] );
		$this->assertIsArray( $element->styles );
		$this->assertEmpty( $element->styles );
		$this->assertEquals( '', $element->content );
	}

	/**
	 * Test element validation with valid data
	 */
	public function test_validate_with_valid_data() {
		$element = new TemplateElement(
			array(
				'id'         => 'element_1',
				'type'       => 'text',
				'properties' => array( 'content' => 'Hello World' ),
				'position'   => array( 'x' => 100, 'y' => 50 ),
				'size'       => array( 'width' => 300, 'height' => 60 ),
			)
		);
		$result = $element->validate();

		$this->assertTrue( $result['valid'] );
		$this->assertEmpty( $result['errors'] );
	}

	/**
	 * Test element validation with missing ID
	 */
	public function test_validate_with_missing_id() {
		$element = new TemplateElement( array( 'type' => 'text' ) );
		$result  = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element ID is required', $result['errors'] );
	}

	/**
	 * Test element validation with invalid ID
	 */
	public function test_validate_with_invalid_id() {
		$element = new TemplateElement(
			array(
				'id'   => 'invalid id with spaces',
				'type' => 'text',
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element ID must contain only alphanumeric characters, hyphens, and underscores', $result['errors'] );
	}

	/**
	 * Test element validation with missing type
	 */
	public function test_validate_with_missing_type() {
		$element = new TemplateElement( array( 'id' => 'element_1' ) );
		$result  = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element type is required', $result['errors'] );
	}

	/**
	 * Test element validation with invalid type
	 */
	public function test_validate_with_invalid_type() {
		$element = new TemplateElement(
			array(
				'id'   => 'element_1',
				'type' => 'invalid_type',
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertStringContainsString( 'Element type must be one of:', $result['errors'][0] );
	}

	/**
	 * Test element validation with invalid position
	 */
	public function test_validate_with_invalid_position() {
		$element = new TemplateElement(
			array(
				'id'       => 'element_1',
				'type'     => 'text',
				'position' => array( 'x' => 'invalid', 'y' => 50 ),
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element position must have valid x and y coordinates', $result['errors'] );
	}

	/**
	 * Test element validation with invalid size
	 */
	public function test_validate_with_invalid_size() {
		$element = new TemplateElement(
			array(
				'id'   => 'element_1',
				'type' => 'text',
				'size' => array( 'width' => 0, 'height' => 50 ),
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( 'Element size must have valid width and height values greater than 0', $result['errors'] );
	}

	/**
	 * Test element validation with missing required property
	 */
	public function test_validate_with_missing_required_property() {
		$element = new TemplateElement(
			array(
				'id'         => 'element_1',
				'type'       => 'text',
				'properties' => array(), // Missing required 'content' property
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( "Property 'content' is required for element type 'text'", $result['errors'] );
	}

	/**
	 * Test element validation with invalid property type
	 */
	public function test_validate_with_invalid_property_type() {
		$element = new TemplateElement(
			array(
				'id'         => 'element_1',
				'type'       => 'heading',
				'properties' => array(
					'content' => 'Test Heading',
					'level'   => 'invalid', // Should be integer
				),
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( "Property 'level' must be a number", $result['errors'] );
	}

	/**
	 * Test element validation with property out of range
	 */
	public function test_validate_with_property_out_of_range() {
		$element = new TemplateElement(
			array(
				'id'         => 'element_1',
				'type'       => 'heading',
				'properties' => array(
					'content' => 'Test Heading',
					'level'   => 7, // Should be 1-6
				),
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( "Property 'level' must be at most 6", $result['errors'] );
	}

	/**
	 * Test element sanitization
	 */
	public function test_element_sanitization() {
		$element = new TemplateElement(
			array(
				'id'         => '<script>alert("xss")</script>',
				'type'       => 'text',
				'properties' => array(
					'content' => 'Safe content',
					'color'   => '#ff0000',
				),
				'position'   => array( 'x' => '100', 'y' => '50' ),
				'size'       => array( 'width' => '300', 'height' => '60' ),
				'styles'     => array( 'font-size' => '16px' ),
				'content'    => '<p>Safe content</p><script>alert("xss")</script>',
			)
		);

		$this->assertStringNotContainsString( '<script>', $element->id );
		$this->assertEquals( 100, $element->position['x'] );
		$this->assertEquals( 50, $element->position['y'] );
		$this->assertEquals( 300, $element->size['width'] );
		$this->assertEquals( 60, $element->size['height'] );
		$this->assertStringContainsString( '<p>Safe content</p>', $element->content );
		$this->assertStringNotContainsString( '<script>', $element->content );
	}

	/**
	 * Test get element types
	 */
	public function test_get_element_types() {
		$types = TemplateElement::get_element_types();

		$this->assertIsArray( $types );
		$this->assertArrayHasKey( 'text', $types );
		$this->assertArrayHasKey( 'heading', $types );
		$this->assertArrayHasKey( 'image', $types );
		$this->assertArrayHasKey( 'button', $types );
		$this->assertArrayHasKey( 'countdown', $types );

		// Test text element structure
		$this->assertArrayHasKey( 'name', $types['text'] );
		$this->assertArrayHasKey( 'description', $types['text'] );
		$this->assertArrayHasKey( 'properties', $types['text'] );
		$this->assertIsArray( $types['text']['properties'] );
	}

	/**
	 * Test to_array method
	 */
	public function test_to_array() {
		$data = array(
			'id'         => 'element_1',
			'type'       => 'text',
			'properties' => array( 'content' => 'Hello World' ),
			'position'   => array( 'x' => 100, 'y' => 50 ),
			'size'       => array( 'width' => 300, 'height' => 60 ),
			'styles'     => array( 'font-size' => '16px' ),
			'content'    => 'Test content',
		);

		$element = new TemplateElement( $data );
		$array   = $element->to_array();

		$this->assertEquals( $data['id'], $array['id'] );
		$this->assertEquals( $data['type'], $array['type'] );
		$this->assertEquals( $data['properties'], $array['properties'] );
		$this->assertEquals( $data['position'], $array['position'] );
		$this->assertEquals( $data['size'], $array['size'] );
		$this->assertEquals( $data['styles'], $array['styles'] );
		$this->assertEquals( $data['content'], $array['content'] );
	}

	/**
	 * Test from_array static method
	 */
	public function test_from_array() {
		$data = array(
			'id'         => 'element_1',
			'type'       => 'text',
			'properties' => array( 'content' => 'Hello World' ),
			'position'   => array( 'x' => 100, 'y' => 50 ),
			'size'       => array( 'width' => 300, 'height' => 60 ),
			'styles'     => array( 'font-size' => '16px' ),
			'content'    => 'Test content',
		);

		$element = TemplateElement::from_array( $data );

		$this->assertInstanceOf( TemplateElement::class, $element );
		$this->assertEquals( $data['id'], $element->id );
		$this->assertEquals( $data['type'], $element->type );
		$this->assertEquals( $data['properties'], $element->properties );
	}

	/**
	 * Test get default properties
	 */
	public function test_get_default_properties() {
		$defaults = TemplateElement::get_default_properties( 'text' );

		$this->assertIsArray( $defaults );
		$this->assertArrayHasKey( 'fontSize', $defaults );
		$this->assertEquals( '16px', $defaults['fontSize'] );
		$this->assertArrayHasKey( 'fontFamily', $defaults );
		$this->assertEquals( 'Arial', $defaults['fontFamily'] );

		// Test invalid type
		$invalid_defaults = TemplateElement::get_default_properties( 'invalid_type' );
		$this->assertIsArray( $invalid_defaults );
		$this->assertEmpty( $invalid_defaults );
	}

	/**
	 * Test type sanitization
	 */
	public function test_type_sanitization() {
		$element = new TemplateElement( array( 'type' => 'invalid_type' ) );
		$this->assertEquals( '', $element->type );

		$element = new TemplateElement( array( 'type' => 'text' ) );
		$this->assertEquals( 'text', $element->type );
	}

	/**
	 * Test position sanitization
	 */
	public function test_position_sanitization() {
		// Test with string values
		$element = new TemplateElement(
			array(
				'position' => array( 'x' => '100', 'y' => '50' ),
			)
		);
		$this->assertEquals( 100, $element->position['x'] );
		$this->assertEquals( 50, $element->position['y'] );

		// Test with invalid data
		$element = new TemplateElement( array( 'position' => 'invalid' ) );
		$this->assertEquals( 0, $element->position['x'] );
		$this->assertEquals( 0, $element->position['y'] );
	}

	/**
	 * Test size sanitization
	 */
	public function test_size_sanitization() {
		// Test with string values
		$element = new TemplateElement(
			array(
				'size' => array( 'width' => '300', 'height' => '60' ),
			)
		);
		$this->assertEquals( 300, $element->size['width'] );
		$this->assertEquals( 60, $element->size['height'] );

		// Test with zero values (should be converted to minimum 1)
		$element = new TemplateElement(
			array(
				'size' => array( 'width' => 0, 'height' => -10 ),
			)
		);
		$this->assertEquals( 1, $element->size['width'] );
		$this->assertEquals( 1, $element->size['height'] );

		// Test with invalid data
		$element = new TemplateElement( array( 'size' => 'invalid' ) );
		$this->assertEquals( 100, $element->size['width'] );
		$this->assertEquals( 50, $element->size['height'] );
	}

	/**
	 * Test styles sanitization
	 */
	public function test_styles_sanitization() {
		$element = new TemplateElement(
			array(
				'styles' => array(
					'font_size'        => '16px', // Should be converted to font-size
					'color'            => '#ff0000',
					'invalid_property' => 'value', // Should be filtered out
					'background-color' => '#ffffff',
				),
			)
		);

		$this->assertArrayHasKey( 'font-size', $element->styles );
		$this->assertEquals( '16px', $element->styles['font-size'] );
		$this->assertArrayHasKey( 'color', $element->styles );
		$this->assertArrayHasKey( 'background-color', $element->styles );
		$this->assertArrayNotHasKey( 'invalid_property', $element->styles );
	}

	/**
	 * Test content sanitization
	 */
	public function test_content_sanitization() {
		$element = new TemplateElement(
			array(
				'content' => '<p>Safe content</p><script>alert("xss")</script>',
			)
		);

		$this->assertStringContainsString( '<p>Safe content</p>', $element->content );
		$this->assertStringNotContainsString( '<script>', $element->content );
	}

	/**
	 * Test button element validation
	 */
	public function test_button_element_validation() {
		$element = new TemplateElement(
			array(
				'id'         => 'button_1',
				'type'       => 'button',
				'properties' => array(
					'text' => 'Click Me',
					'url'  => 'https://example.com',
				),
			)
		);
		$result = $element->validate();

		$this->assertTrue( $result['valid'] );
		$this->assertEmpty( $result['errors'] );
	}

	/**
	 * Test countdown element validation
	 */
	public function test_countdown_element_validation() {
		$element = new TemplateElement(
			array(
				'id'         => 'countdown_1',
				'type'       => 'countdown',
				'properties' => array(
					'targetDate' => '2024-12-31 23:59:59',
				),
			)
		);
		$result = $element->validate();

		$this->assertTrue( $result['valid'] );
		$this->assertEmpty( $result['errors'] );
	}

	/**
	 * Test progress element validation with percentage constraint
	 */
	public function test_progress_element_validation() {
		// Valid percentage
		$element = new TemplateElement(
			array(
				'id'         => 'progress_1',
				'type'       => 'progress',
				'properties' => array(
					'percentage' => 75,
				),
			)
		);
		$result = $element->validate();

		$this->assertTrue( $result['valid'] );
		$this->assertEmpty( $result['errors'] );

		// Invalid percentage (too high)
		$element = new TemplateElement(
			array(
				'id'         => 'progress_2',
				'type'       => 'progress',
				'properties' => array(
					'percentage' => 150,
				),
			)
		);
		$result = $element->validate();

		$this->assertFalse( $result['valid'] );
		$this->assertContains( "Property 'percentage' must be at most 100", $result['errors'] );
	}
}
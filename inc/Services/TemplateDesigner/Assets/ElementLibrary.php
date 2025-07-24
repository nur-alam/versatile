<?php
/**
 * Element Library
 *
 * @package Versatile\Services\TemplateDesigner\Assets
 * @subpackage Versatile\Services\TemplateDesigner\Assets\ElementLibrary
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Services\TemplateDesigner\Assets;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * ElementLibrary provides available design elements for the template designer
 */
class ElementLibrary {

	/**
	 * Get all available design elements
	 *
	 * @return array Available elements
	 */
	public static function get_elements() {
		return array(
			'text'        => array(
				'label'       => 'Text Elements',
				'description' => 'Text-based elements for content display',
				'elements'    => array(
					'heading'   => array(
						'id'                => 'heading',
						'type'              => 'heading',
						'name'              => 'Heading',
						'category'          => 'Text',
						'default_properties' => array(
							'content'         => 'Heading Text',
							'fontSize'        => '32px',
							'fontWeight'      => 'bold',
							'color'           => '#1f2937',
							'textAlign'       => 'center',
							'backgroundColor' => 'transparent',
							'padding'         => '8px',
							'border'          => 'none',
							'borderRadius'    => '0px',
						),
						'default_size'      => array( 'width' => 300, 'height' => 60 ),
					),
					'paragraph' => array(
						'id'                => 'paragraph',
						'type'              => 'paragraph',
						'name'              => 'Paragraph',
						'category'          => 'Text',
						'default_properties' => array(
							'content'         => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
							'fontSize'        => '16px',
							'color'           => '#4b5563',
							'lineHeight'      => '1.5',
							'backgroundColor' => 'transparent',
							'padding'         => '8px',
							'border'          => 'none',
							'borderRadius'    => '0px',
							'textAlign'       => 'left',
						),
						'default_size'      => array( 'width' => 400, 'height' => 80 ),
					),
					'text'      => array(
						'id'                => 'text',
						'type'              => 'text',
						'name'              => 'Text',
						'category'          => 'Text',
						'default_properties' => array(
							'content'         => 'Text Element',
							'fontSize'        => '16px',
							'fontWeight'      => 'normal',
							'color'           => '#374151',
							'backgroundColor' => 'transparent',
							'padding'         => '8px',
							'border'          => 'none',
							'borderRadius'    => '0px',
							'textAlign'       => 'left',
						),
						'default_size'      => array( 'width' => 200, 'height' => 40 ),
					),
				),
			),
			'media'       => array(
				'label'       => 'Media Elements',
				'description' => 'Images, videos, and other media content',
				'elements'    => array(
					'image' => array(
						'id'                => 'image',
						'type'              => 'image',
						'name'              => 'Image',
						'category'          => 'Media',
						'default_properties' => array(
							'src'             => '',
							'alt'             => 'Image',
							'borderRadius'    => '0px',
							'backgroundColor' => 'transparent',
							'border'          => 'none',
						),
						'default_size'      => array( 'width' => 200, 'height' => 150 ),
					),
					'video' => array(
						'id'                => 'video',
						'type'              => 'video',
						'name'              => 'Video',
						'category'          => 'Media',
						'default_properties' => array(
							'src'             => '',
							'poster'          => '',
							'controls'        => true,
							'autoplay'        => false,
							'borderRadius'    => '8px',
							'backgroundColor' => '#000000',
						),
						'default_size'      => array( 'width' => 400, 'height' => 225 ),
					),
					'logo'  => array(
						'id'                => 'logo',
						'type'              => 'logo',
						'name'              => 'Logo',
						'category'          => 'Media',
						'default_properties' => array(
							'src'             => '',
							'alt'             => 'Company Logo',
							'maxWidth'        => '200px',
							'backgroundColor' => 'transparent',
						),
						'default_size'      => array( 'width' => 200, 'height' => 80 ),
					),
				),
			),
			'interactive' => array(
				'label'       => 'Interactive Elements',
				'description' => 'Buttons and interactive components',
				'elements'    => array(
					'button' => array(
						'id'                => 'button',
						'type'              => 'button',
						'name'              => 'Button',
						'category'          => 'Interactive',
						'default_properties' => array(
							'content'         => 'Click Me',
							'fontSize'        => '16px',
							'fontFamily'      => 'Arial',
							'color'           => '#ffffff',
							'backgroundColor' => '#3b82f6',
							'borderRadius'    => '6px',
							'border'          => 'none',
						),
						'default_size'      => array( 'width' => 120, 'height' => 40 ),
					),
				),
			),
			'layout'      => array(
				'label'       => 'Layout Elements',
				'description' => 'Structural elements for organizing content',
				'elements'    => array(
					'container' => array(
						'id'                => 'container',
						'type'              => 'container',
						'name'              => 'Container',
						'category'          => 'Layout',
						'default_properties' => array(
							'backgroundColor' => 'transparent',
							'border'          => '2px dashed #d1d5db',
							'borderRadius'    => '8px',
							'padding'         => '16px',
						),
						'default_size'      => array( 'width' => 300, 'height' => 200 ),
					),
					'spacer'    => array(
						'id'                => 'spacer',
						'type'              => 'spacer',
						'name'              => 'Spacer',
						'category'          => 'Layout',
						'default_properties' => array(
							'backgroundColor' => '#f3f4f6',
							'border'          => '1px solid #d1d5db',
						),
						'default_size'      => array( 'width' => 100, 'height' => 50 ),
					),
					'divider'   => array(
						'id'                => 'divider',
						'type'              => 'divider',
						'name'              => 'Divider',
						'category'          => 'Layout',
						'default_properties' => array(
							'backgroundColor' => 'transparent',
							'color'           => '#d1d5db',
							'orientation'     => 'horizontal',
						),
						'default_size'      => array( 'width' => 200, 'height' => 2 ),
					),
				),
			),
			'dynamic'     => array(
				'label'       => 'Dynamic Elements',
				'description' => 'Interactive and time-based elements',
				'elements'    => array(
					'countdown'    => array(
						'id'                => 'countdown',
						'type'              => 'countdown',
						'name'              => 'Countdown Timer',
						'category'          => 'Dynamic',
						'default_properties' => array(
							'targetDate'      => gmdate( 'c', time() + ( 7 * 24 * 60 * 60 ) ),
							'format'          => 'days:hours:minutes:seconds',
							'fontSize'        => '24px',
							'fontFamily'      => 'Arial',
							'color'           => '#1f2937',
							'backgroundColor' => 'transparent',
							'border'          => 'none',
							'borderRadius'    => '0px',
							'padding'         => '16px',
						),
						'default_size'      => array( 'width' => 400, 'height' => 80 ),
					),
					'progress-bar' => array(
						'id'                => 'progress-bar',
						'type'              => 'progress',
						'name'              => 'Progress Bar',
						'category'          => 'Dynamic',
						'default_properties' => array(
							'progress'        => 75,
							'backgroundColor' => '#e5e7eb',
							'fillColor'       => '#3b82f6',
							'height'          => '8px',
							'borderRadius'    => '4px',
							'showLabel'       => true,
						),
						'default_size'      => array( 'width' => 300, 'height' => 30 ),
					),
				),
			),
			'social'      => array(
				'label'       => 'Social Elements',
				'description' => 'Social media and contact elements',
				'elements'    => array(
					'social-links'     => array(
						'id'                => 'social-links',
						'type'              => 'social-links',
						'name'              => 'Social Links',
						'category'          => 'Social',
						'default_properties' => array(
							'platforms'       => array( 'facebook', 'twitter', 'instagram' ),
							'iconSize'        => '24px',
							'spacing'         => '12px',
							'backgroundColor' => 'transparent',
							'padding'         => '8px',
						),
						'default_size'      => array( 'width' => 200, 'height' => 50 ),
					),
					'contact-form'     => array(
						'id'                => 'contact-form',
						'type'              => 'contact-form',
						'name'              => 'Contact Form',
						'category'          => 'Social',
						'default_properties' => array(
							'fields'          => array(
								array(
									'type'     => 'text',
									'name'     => 'name',
									'label'    => 'Name',
									'required' => true,
								),
								array(
									'type'     => 'email',
									'name'     => 'email',
									'label'    => 'Email',
									'required' => true,
								),
								array(
									'type'     => 'textarea',
									'name'     => 'message',
									'label'    => 'Message',
									'required' => true,
								),
							),
							'buttonText'      => 'Send Message',
							'backgroundColor' => '#ffffff',
							'borderRadius'    => '12px',
							'padding'         => '24px',
							'border'          => '1px solid #e5e7eb',
						),
						'default_size'      => array( 'width' => 400, 'height' => 350 ),
					),
					'newsletter'       => array(
						'id'                => 'newsletter-signup',
						'type'              => 'newsletter',
						'name'              => 'Newsletter Signup',
						'category'          => 'Social',
						'default_properties' => array(
							'title'           => 'Stay Updated',
							'description'     => 'Get notified when we launch!',
							'placeholder'     => 'Enter your email',
							'buttonText'      => 'Subscribe',
							'backgroundColor' => '#f8fafc',
							'borderRadius'    => '8px',
							'padding'         => '20px',
						),
						'default_size'      => array( 'width' => 350, 'height' => 150 ),
					),
					'phone-contact'    => array(
						'id'                => 'phone-contact',
						'type'              => 'contact',
						'name'              => 'Phone Contact',
						'category'          => 'Social',
						'default_properties' => array(
							'phone'     => '+1 (555) 123-4567',
							'label'     => 'Call us:',
							'fontSize'  => '16px',
							'color'     => '#1f2937',
							'linkColor' => '#3b82f6',
						),
						'default_size'      => array( 'width' => 200, 'height' => 40 ),
					),
				),
			),
		);
	}

	/**
	 * Get elements by category
	 *
	 * @param string $category Element category.
	 * @return array Category elements
	 */
	public static function get_elements_by_category( $category ) {
		$all_elements = self::get_elements();
		
		if ( ! isset( $all_elements[ $category ] ) ) {
			return array();
		}
		
		return $all_elements[ $category ];
	}

	/**
	 * Get element definition by type
	 *
	 * @param string $type Element type.
	 * @return array|null Element definition or null if not found
	 */
	public static function get_element_definition( $type ) {
		$all_elements = self::get_elements();
		
		foreach ( $all_elements as $category => $category_data ) {
			if ( isset( $category_data['elements'][ $type ] ) ) {
				return $category_data['elements'][ $type ];
			}
		}
		
		return null;
	}

	/**
	 * Get all element types as a flat array
	 *
	 * @return array All element types
	 */
	public static function get_all_element_types() {
		$all_elements = self::get_elements();
		$types        = array();
		
		foreach ( $all_elements as $category => $category_data ) {
			foreach ( $category_data['elements'] as $element_type => $element_data ) {
				$types[] = $element_type;
			}
		}
		
		return $types;
	}

	/**
	 * Validate element data against its definition
	 *
	 * @param string $type Element type.
	 * @param array  $data Element data to validate.
	 * @return bool|WP_Error True if valid, WP_Error if invalid
	 */
	public static function validate_element_data( $type, $data ) {
		$definition = self::get_element_definition( $type );
		
		if ( ! $definition ) {
			return new \WP_Error( 'invalid_element_type', "Unknown element type: $type" );
		}
		
		// Basic validation - ensure required fields exist
		$required_fields = array( 'id', 'type', 'position', 'size', 'properties' );
		
		foreach ( $required_fields as $field ) {
			if ( ! isset( $data[ $field ] ) ) {
				return new \WP_Error( 'missing_field', "Missing required field: $field" );
			}
		}
		
		// Validate position and size are numeric
		if ( ! is_array( $data['position'] ) || ! isset( $data['position']['x'] ) || ! isset( $data['position']['y'] ) ) {
			return new \WP_Error( 'invalid_position', 'Position must be an object with x and y properties' );
		}
		
		if ( ! is_array( $data['size'] ) || ! isset( $data['size']['width'] ) || ! isset( $data['size']['height'] ) ) {
			return new \WP_Error( 'invalid_size', 'Size must be an object with width and height properties' );
		}
		
		return true;
	}
}
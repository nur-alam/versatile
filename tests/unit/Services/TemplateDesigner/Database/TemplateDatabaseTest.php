<?php
/**
 * TemplateDatabase Test
 *
 * @package Versatile\Tests\Unit\Services\TemplateDesigner\Database
 * @subpackage Versatile\Tests\Unit\Services\TemplateDesigner\Database\TemplateDatabaseTest
 * @author  Versatile<Versatile@gmail.com>
 * @since 1.0.0
 */

namespace Versatile\Tests\Unit\Services\TemplateDesigner\Database;

use PHPUnit\Framework\TestCase;
use Versatile\Services\TemplateDesigner\Database\TemplateDatabase;

/**
 * Test TemplateDatabase functionality
 */
class TemplateDatabaseTest extends TestCase {

	/**
	 * TemplateDatabase instance
	 *
	 * @var TemplateDatabase
	 */
	private $database;

	/**
	 * Set up test environment
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->database = new TemplateDatabase();
	}

	/**
	 * Test database health check
	 */
	public function test_check_table_health() {
		$result = $this->database->check_table_health();
		$this->assertTrue( $result['success'] );
	}

	/**
	 * Test get statistics
	 */
	public function test_get_statistics() {
		$stats = $this->database->get_statistics();
		
		$this->assertIsArray( $stats );
		$this->assertArrayHasKey( 'total_templates', $stats );
		$this->assertArrayHasKey( 'active_templates', $stats );
		$this->assertArrayHasKey( 'by_type', $stats );
		$this->assertArrayHasKey( 'recent_templates', $stats );
	}

	/**
	 * Test template name exists check
	 */
	public function test_template_name_exists() {
		// Test with non-existent name
		$exists = $this->database->template_name_exists( 'non_existent_template_name_12345' );
		$this->assertFalse( $exists );
	}

	/**
	 * Test get templates with empty result
	 */
	public function test_get_templates_empty() {
		$templates = $this->database->get_templates( array( 'search' => 'non_existent_search_term_12345' ) );
		$this->assertIsArray( $templates );
	}

	/**
	 * Test get templates count
	 */
	public function test_get_templates_count() {
		$count = $this->database->get_templates_count();
		$this->assertIsInt( $count );
		$this->assertGreaterThanOrEqual( 0, $count );
	}

	/**
	 * Test get templates with different filters
	 */
	public function test_get_templates_with_filters() {
		// Test with type filter
		$templates = $this->database->get_templates( array( 'type' => 'maintenance' ) );
		$this->assertIsArray( $templates );

		// Test with active filter
		$templates = $this->database->get_templates( array( 'is_active' => 1 ) );
		$this->assertIsArray( $templates );

		// Test with limit and offset
		$templates = $this->database->get_templates( array( 'limit' => 5, 'offset' => 0 ) );
		$this->assertIsArray( $templates );
		$this->assertLessThanOrEqual( 5, count( $templates ) );
	}

	/**
	 * Test get templates by type
	 */
	public function test_get_templates_by_type() {
		$templates = $this->database->get_templates_by_type( 'maintenance' );
		$this->assertIsArray( $templates );
	}

	/**
	 * Test get active templates
	 */
	public function test_get_active_templates() {
		$templates = $this->database->get_active_templates();
		$this->assertIsArray( $templates );
	}

	/**
	 * Test search templates
	 */
	public function test_search_templates() {
		$templates = $this->database->search_templates( 'test' );
		$this->assertIsArray( $templates );
	}

	/**
	 * Test optimize table
	 */
	public function test_optimize_table() {
		$result = $this->database->optimize_table();
		$this->assertTrue( $result['success'] );
	}

	/**
	 * Test bulk operations with empty arrays
	 */
	public function test_bulk_operations_empty() {
		// Test bulk update with empty array
		$result = $this->database->bulk_update_templates( array(), array( 'is_active' => 1 ) );
		$this->assertFalse( $result['success'] );

		// Test bulk delete with empty array
		$result = $this->database->bulk_delete_templates( array() );
		$this->assertFalse( $result['success'] );
	}
}
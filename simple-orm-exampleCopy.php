<?php
/**
 * Simple ORM Example - Building from Scratch
 * This demonstrates the core concepts in the simplest possible way
 */

// Step 1: Simple Query Builder
class SimpleQueryBuilder {
    private $table;
    private $wheres = [];
    
    public function __construct($table) {
        $this->table = $table;
    }
    
    public function where($column, $value) {
        $this->wheres[] = ['column' => $column, 'value' => $value];
        return $this; // Enable method chaining
    }
    
    public function toSQL() {
        $sql = "SELECT * FROM {$this->table}";
        
        if (!empty($this->wheres)) {
            $conditions = [];
            foreach ($this->wheres as $where) {
                $conditions[] = "{$where['column']} = '{$where['value']}'";
            }
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }
        
        return $sql;
    }
    
    public function get() {
        global $wpdb;
        $sql = $this->toSQL();
        echo "Generated SQL: " . $sql . "\n";
        // return $wpdb->get_results($sql);
        return []; // Placeholder for demo
    }
}

// Step 2: Simple Base Model
class SimpleBaseModel {
    protected $table;
    protected $attributes = [];
    protected $queryBuilder;
    
    public function __construct($attributes = []) {
        $this->attributes = $attributes;
        $this->queryBuilder = new SimpleQueryBuilder($this->table);
    }
    
    // Magic method to access attributes
    public function __get($key) {
        return $this->attributes[$key] ?? null;
    }
    
    // Static method for queries
    public static function where($column, $value) {
        $instance = new static();
        return $instance->queryBuilder->where($column, $value);
    }
}

// Step 3: Specific Model
class SimpleUserModel extends SimpleBaseModel {
    protected $table = 'wp_users';
    
    public function __construct($attributes = []) {
        parent::__construct($attributes);
    }
}

// Step 4: Usage Examples
echo "=== Simple ORM Demo ===\n\n";

// Example 1: Basic query
echo "Example 1: Basic Query\n";
$query = SimpleUserModel::where('status', 'active');
$results = $query->get();

// Example 2: Method chaining
echo "\nExample 2: Method Chaining\n";
$query = SimpleUserModel::where('status', 'active')->where('role', 'editor');
$results = $query->get();

// Example 3: Creating a model instance
echo "\nExample 3: Model Instance\n";
$user = new SimpleUserModel(['name' => 'John', 'email' => 'john@example.com']);
echo "User name: " . $user->name . "\n";
echo "User email: " . $user->email . "\n";

echo "\n=== Demo Complete ===\n";

/**
 * Key Concepts Demonstrated:
 * 
 * 1. METHOD CHAINING: Each method returns $this
 * 2. SEPARATION OF CONCERNS: QueryBuilder handles SQL, Model handles data
 * 3. MAGIC METHODS: __get() makes $user->name work
 * 4. STATIC METHODS: Allow Model::where() syntax
 * 5. INHERITANCE: SimpleUserModel extends SimpleBaseModel
 */
?>
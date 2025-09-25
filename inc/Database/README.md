# Laravel-like ORM for WordPress

This ORM provides a clean, Laravel-inspired interface for database operations in your WordPress plugin.

## Quick Start

### 1. Create a Model

```php
<?php
namespace Versatile\Services\YourService;

use Versatile\Database\Model;

class YourModel extends Model {
    
    protected $fillable = [
        'name', 'email', 'status', 'created_at'
    ];
    
    protected $hidden = [
        'password', 'secret_key'
    ];
    
    public function get_table_name(): string {
        global $wpdb;
        return $wpdb->prefix . self::PREFIX . 'your_table';
    }
    
    public function get_table_schema(): string {
        $table_name = $this->get_table_name();
        return "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            status varchar(50) DEFAULT 'active',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        )";
    }
}
```

### 2. Basic Operations

#### Create Records
```php
// Create single record
$user = YourModel::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'status' => 'active'
]);

// Create or update
$user = YourModel::updateOrCreate(
    ['email' => 'john@example.com'], // Search criteria
    ['name' => 'John Updated', 'status' => 'active'] // Values to update/create
);
```

#### Read Records
```php
// Find by ID
$user = YourModel::find(1);

// Find or throw exception
$user = YourModel::findOrFail(1);

// Get all records
$users = YourModel::all();

// Get first record
$user = YourModel::query()->where('status', 'active')->first();
```

#### Update Records
```php
// Update single model
$user = YourModel::find(1);
$user->name = 'Updated Name';
$user->save();

// Or use fill method
$user->fill(['name' => 'Updated Name', 'status' => 'inactive']);
$user->save();

// Update multiple records
YourModel::query()
    ->where('status', 'pending')
    ->update(['status' => 'active']);
```

#### Delete Records
```php
// Delete single model
$user = YourModel::find(1);
$user->delete();

// Delete multiple records
YourModel::query()
    ->where('status', 'inactive')
    ->delete();
```

### 3. Query Builder

#### Basic Queries
```php
// Simple where
$users = YourModel::query()
    ->where('status', 'active')
    ->get();

// Multiple conditions
$users = YourModel::query()
    ->where('status', 'active')
    ->where('created_at', '>', '2024-01-01')
    ->get();

// Different operators
$users = YourModel::query()
    ->where('age', '>=', 18)
    ->where('score', '<', 100)
    ->get();
```

#### Advanced Queries
```php
// LIKE queries
$users = YourModel::query()
    ->whereLike('name', 'John')
    ->get();

// IN queries
$users = YourModel::query()
    ->whereIn('status', ['active', 'pending'])
    ->get();

// NULL queries
$users = YourModel::query()
    ->whereNull('deleted_at')
    ->get();

// OR conditions
$users = YourModel::query()
    ->where('status', 'active')
    ->orWhere(function($query) {
        $query->where('name', 'John')
              ->where('email', 'john@example.com');
    })
    ->get();
```

#### Ordering and Limiting
```php
// Order by
$users = YourModel::query()
    ->orderBy('created_at', 'DESC')
    ->orderBy('name', 'ASC')
    ->get();

// Limit and offset
$users = YourModel::query()
    ->limit(10)
    ->offset(20)
    ->get();

// Pagination
$result = YourModel::query()
    ->where('status', 'active')
    ->paginate(20, 1); // 20 per page, page 1

// Returns:
// [
//     'data' => [...], // Array of models
//     'total' => 150,
//     'per_page' => 20,
//     'current_page' => 1,
//     'last_page' => 8,
//     'from' => 1,
//     'to' => 20
// ]
```

### 4. Model Scopes

Create reusable query scopes in your model:

```php
class YourModel extends Model {
    
    // Scope for active records
    public static function active() {
        return static::query()->where('status', 'active');
    }
    
    // Scope for recent records
    public static function recent($days = 7) {
        return static::query()
            ->where('created_at', '>', date('Y-m-d H:i:s', strtotime("-{$days} days")));
    }
    
    // Scope for search
    public static function search($term) {
        return static::query()
            ->orWhere(function($query) use ($term) {
                $query->whereLike('name', $term)
                      ->whereLike('email', $term);
            });
    }
}

// Usage
$activeUsers = YourModel::active()->get();
$recentUsers = YourModel::recent(30)->get();
$searchResults = YourModel::search('john')->get();

// Chain scopes
$results = YourModel::active()
    ->recent(7)
    ->orderBy('created_at', 'DESC')
    ->paginate(10);
```

### 5. Model Methods

Add custom methods to your models:

```php
class YourModel extends Model {
    
    // Check if model is active
    public function isActive(): bool {
        return $this->status === 'active';
    }
    
    // Activate the model
    public function activate(): bool {
        $this->status = 'active';
        return $this->save();
    }
    
    // Get formatted name
    public function getFormattedName(): string {
        return ucwords($this->name);
    }
    
    // Custom validation
    public function validate(): array {
        $errors = [];
        
        if (empty($this->name)) {
            $errors[] = 'Name is required';
        }
        
        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email format';
        }
        
        return $errors;
    }
}

// Usage
$user = YourModel::find(1);
if ($user->isActive()) {
    echo $user->getFormattedName();
}

$errors = $user->validate();
if (empty($errors)) {
    $user->save();
}
```

### 6. Converting Your Existing Code

#### Before (Raw SQL)
```php
public function get_users($filters) {
    global $wpdb;
    
    $where_conditions = ['1=1'];
    $where_values = [];
    
    if (!empty($filters['search'])) {
        $where_conditions[] = '(name LIKE %s OR email LIKE %s)';
        $search_term = '%' . $wpdb->esc_like($filters['search']) . '%';
        $where_values[] = $search_term;
        $where_values[] = $search_term;
    }
    
    if (!empty($filters['status'])) {
        $where_conditions[] = 'status = %s';
        $where_values[] = $filters['status'];
    }
    
    $where_clause = implode(' AND ', $where_conditions);
    $query = "SELECT * FROM {$this->table_name} WHERE {$where_clause}";
    
    if (!empty($where_values)) {
        $results = $wpdb->get_results($wpdb->prepare($query, $where_values));
    } else {
        $results = $wpdb->get_results($query);
    }
    
    return $results;
}
```

#### After (Using ORM)
```php
public function get_users($filters) {
    $query = YourModel::query();
    
    if (!empty($filters['search'])) {
        $query->orWhere(function($q) use ($filters) {
            $q->whereLike('name', $filters['search'])
              ->whereLike('email', $filters['search']);
        });
    }
    
    if (!empty($filters['status'])) {
        $query->where('status', $filters['status']);
    }
    
    return $query->get();
}
```

### 7. Best Practices

1. **Use Fillable Arrays**: Always define `$fillable` to prevent mass assignment vulnerabilities
2. **Hide Sensitive Data**: Use `$hidden` to exclude sensitive fields from `toArray()` output
3. **Create Scopes**: Use static methods for reusable query logic
4. **Validate Data**: Add validation methods to your models
5. **Use Transactions**: For complex operations, wrap in database transactions
6. **Index Your Tables**: Add proper indexes in your table schema

### 8. Performance Tips

- Use `select()` to limit columns when you don't need all data
- Use `count()` instead of `get()` when you only need the count
- Use pagination for large datasets
- Add database indexes for frequently queried columns
- Use `first()` instead of `get()[0]` when you need only one record

This ORM will make your database operations much cleaner and more maintainable throughout your versatile-toolkit project!
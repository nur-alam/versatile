# Laravel Eloquent-Style ORM for WordPress

This guide explains how to use the Laravel Eloquent-style ORM implementation in your WordPress plugin.

## Overview

The ORM consists of three main components:
- `BaseModel` - The base model class that provides core functionality
- `QueryBuilder` - Handles fluent query building
- `TempLoginModel` - Example model extending BaseModel

## Basic Usage

### 1. Finding Records

```php
// Find by primary key
$tempLogin = TempLoginModel::find(1);

// Find by token (custom method)
$tempLogin = TempLoginModel::findByToken('abc123');

// Get first record matching criteria
$tempLogin = TempLoginModel::where('role', 'editor')->first();
```

### 2. Creating Records

```php
// Create and save in one step
$tempLogin = TempLoginModel::create([
    'token' => TempLoginModel::generateToken(),
    'role' => 'editor',
    'display_name' => 'John Doe',
    'email' => 'john@example.com',
    'expires_at' => date('Y-m-d H:i:s', strtotime('+1 day')),
    'is_active' => 1
]);

// Or create instance and save manually
$tempLogin = new TempLoginModel([
    'display_name' => 'Jane Doe',
    'email' => 'jane@example.com'
]);
$tempLogin->save();
```

### 3. Updating Records

```php
// Update specific record
$tempLogin = TempLoginModel::find(1);
if ($tempLogin) {
    $tempLogin->update([
        'display_name' => 'Updated Name',
        'role' => 'administrator'
    ]);
}

// Or update attributes and save
$tempLogin->display_name = 'New Name';
$tempLogin->save();
```

### 4. Deleting Records

```php
$tempLogin = TempLoginModel::find(1);
if ($tempLogin) {
    $tempLogin->delete();
}
```

## Query Builder Methods

### Where Clauses

```php
// Basic where
TempLoginModel::where('role', 'editor')->get();

// Where with operator
TempLoginModel::where('login_count', '>', 5)->get();

// Multiple where clauses (AND)
TempLoginModel::where('role', 'editor')
              ->where('is_active', 1)
              ->get();

// Or where clauses
TempLoginModel::where('role', 'editor')
              ->orWhere('role', 'administrator')
              ->get();

// Like queries
TempLoginModel::where('display_name', 'like', '%admin%')->get();
TempLoginModel::where('email', 'like', '%@gmail.com')->get();
```

### Ordering

```php
// Order by single column
TempLoginModel::orderBy('created_at', 'desc')->get();

// Order by multiple columns
TempLoginModel::orderBy('role', 'asc')
              ->orderBy('created_at', 'desc')
              ->get();

// Using alias
TempLoginModel::orderby('id')->get(); // defaults to ASC
```

### Limiting and Pagination

```php
// Limit results
TempLoginModel::limit(10)->get();

// Offset (skip records)
TempLoginModel::offset(20)->get();

// Pagination
TempLoginModel::limit(10)->offset(20)->get(); // Page 3, 10 per page
```

### Complex Queries

```php
// Combine multiple methods
$results = TempLoginModel::where('role', 'editor')
                         ->where('display_name', 'like', '%admin%')
                         ->where('email', 'like', '%admin%')
                         ->orderBy('id')
                         ->limit(10)
                         ->offset(10)
                         ->get();
```

### Counting Records

```php
// Count all records
$total = TempLoginModel::count();

// Count with conditions
$activeCount = TempLoginModel::where('is_active', 1)->count();
```

## Model Scopes

Scopes are pre-defined query constraints that you can reuse:

```php
// Get only active temp logins
$activeLogins = TempLoginModel::active()->get();

// Get only expired temp logins  
$expiredLogins = TempLoginModel::expired()->get();
```

## Custom Methods

The TempLoginModel includes several custom methods:

```php
// Generate a unique token
$token = TempLoginModel::generateToken();

// Check if temp login is active
$tempLogin = TempLoginModel::find(1);
if ($tempLogin && $tempLogin->isActive()) {
    echo "Temp login is active and not expired";
}

// Get login URL
$loginUrl = $tempLogin->getLoginUrl();
```

## Creating Your Own Models

To create a new model, extend the BaseModel class:

```php
<?php
namespace Versatile\Models;

class YourModel extends BaseModel {
    
    // Define the table name
    protected $table = 'your_table_name';
    
    // Define fillable attributes
    protected $fillable = [
        'column1',
        'column2',
        'column3'
    ];
    
    // Add custom methods
    public static function findByCustomField($value) {
        return static::where('custom_field', $value)->first();
    }
}
```

## Available Operators

The query builder supports these operators:
- `=` (equals)
- `!=` or `<>` (not equals)
- `>` (greater than)
- `>=` (greater than or equal)
- `<` (less than)
- `<=` (less than or equal)
- `LIKE` (pattern matching)

## Data Types

The ORM automatically handles data type formatting:
- Integers are formatted as `%d`
- Floats are formatted as `%f`
- Everything else is formatted as `%s`

## Security

All queries are automatically prepared using WordPress's `$wpdb->prepare()` method, protecting against SQL injection attacks.

## Error Handling

Wrap database operations in try-catch blocks:

```php
try {
    $tempLogin = TempLoginModel::create($data);
    echo "Success!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
```

## Performance Tips

1. Use `first()` instead of `get()` when you only need one record
2. Use `count()` for counting instead of `get()` and `count()`
3. Add indexes to frequently queried columns
4. Use `limit()` for large datasets
5. Consider caching for frequently accessed data

## Integration with WordPress

The ORM integrates seamlessly with WordPress:
- Uses WordPress database connection (`$wpdb`)
- Respects WordPress table prefixes
- Uses WordPress security functions
- Compatible with WordPress coding standards


## Explanaiton of is_mysql_function() function inside QueryBuilder
Examples that would match (return true):
Check for function patterns (word followed by parentheses)
```php
if (preg_match('/^[A-Z_][A-Z0-9_]*\s*\(/i', $value)) {
    return true;
}
```
```php
$examples_match = [
    'NOW()',           // Current timestamp function
    'COUNT(*)',        // Aggregate function
    'UPPER(name)',     // String function
    'DATE_FORMAT(',    // Date function (partial)
    'MY_CUSTOM_FUNC(', // Custom function
    'CONCAT (',        // Function with space before parenthesis
    '_private_func(',  // Function starting with underscore
];
```

## Examples that would NOT match (return false):
```php
$examples_no_match = [
    '123ABC(',         // Starts with number
    'some-func(',      // Contains hyphen
    'func',            // No parenthesis
    'UPPER',           // No parenthesis
    '(SELECT',         // Starts with parenthesis
    'user.name',       // Regular column reference
];
```

##  Practical usage in QueryBuilder:
$queryBuilder = new QueryBuilder();
-

##  This would be treated as a function (not escaped):
$queryBuilder->where('created_at', '>', 'NOW()');
// Generates: WHERE created_at > NOW()

##  This would be treated as a regular value (escaped):
$queryBuilder->where('name', '=', 'John');
##  Generates: WHERE name = 'John'

##  Function with parameters:
$queryBuilder->where('date_column', '=', 'DATE_FORMAT(NOW(), "%Y-%m-%d")');
##  Generates: WHERE date_column = DATE_FORMAT(NOW(), "%Y-%m-%d")
The regex ensures that MySQL functions aren't incorrectly quoted or escaped, which would break the SQL query. It's a safety mechanism to preserve function calls while still protecting against SQL injection for regular string values.


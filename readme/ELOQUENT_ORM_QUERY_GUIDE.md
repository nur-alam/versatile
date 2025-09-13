# Query Example of Orm

# Select query
```php
$temp_logins = TempLoginModel::select('id', 'display_name', 'email')->get();
```

# Find and update
```php
$yo  = TempLoginModel::find(3);
$yo->login_count = rand(1, 100);
$yo->save();
```

# Conditionally build query
```php
$query = TempLoginModel::where( 'role', '=', $verified_data->role );
if ('expired' === $verified_data->status) {
    $query->whereRaw('expires_at <= NOW()');
} else {
    $query->where('is_active', '=', $verified_data->status);
}

$query->limit($per_page)->offset($offset);

$results = $query->get();

$total_entries = TempLoginModel::count();
```

# Create 
```php
$create = TempLoginModel::create(array(
	'token'        => wp_generate_password(32, false),
	'role'         => 'editor',
	'display_name' => 'pinTanek Lara',
	'email'        => 'sadfkobyj@mailinatorabd.com',
	'expires_at'   => '2026-09-04 10:33:39',
	'redirect_url' => 'http://localhost:10050/wp-admin/',
	'ip_address'   => '127.0.0.1',
	'created_at'   => '2025-09-04 04:33:39',
	'last_login'   => '2025-09-07 18:43:42',
	'login_count'  => wp_rand( 101, 200),
	'is_active'    => '1',
));
```

```php
$total_entries = TempLoginModel::where( 'role', '=', 'administrator' )->count();

$results = TempLoginModel::where( 'role', '=', $verified_data->role )
    ->where(function($query) use ($verified_data) {
        $query->where('display_name', $verified_data->search)
              ->orWhere('email', $verified_data->search);
    })
    // ->orderBy('created_at', 'asc')
    ->orderBy([
        'created_at'=> 'asc',
        'id'=> 'asc'
    ])
    ->limit($per_page)
    ->offset($offset)
    ->get();
```
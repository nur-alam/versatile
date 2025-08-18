🎯 New Features
1. Selective Default Actions
// Only view action
```javascript
const defaultActionHandlers = {
  onView: (row) => console.log('View:', row)
};
```

```javascript
// Only view and delete
const defaultActionHandlers = {
  onView: (row) => console.log('View:', row),
  onDelete: (row) => console.log('Delete:', row)
};
```

```javascript
// Only view and edit
const defaultActionHandlers = {
  onView: (row) => console.log('View:', row),
  onEdit: (row) => console.log('Edit:', row)
};
```
2. Actions as Links
```javascript
const defaultActionConfigs = {
  view: {
    asLink: true,
    href: (row) => `/users/${row.id}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: ExternalLink,
    text: 'View Profile'
  }
};
```
3. Custom Text, Icons, and Styling
```javascript
const defaultActionConfigs = {
  view: {
    icon: Settings,           // Custom icon
    text: 'Details',         // Custom text
    size: 'lg',              // Custom size
    variant: 'outline',      // Custom variant
    className: 'border-blue-200 text-blue-700 hover:bg-blue-50'
  },
  edit: {
    text: 'Edit User',       // Text only (no icon)
    className: 'px-3 py-1 bg-green-100 text-green-700 rounded'
  },
  delete: {
    icon: Trash2,            // Icon only (no text)
    className: 'h-8 w-8 p-0 text-red-500 hover:bg-red-50'
  }
};
```

4. Dynamic Properties
```javascript
const defaultActionConfigs = {
  view: {
    href: (row) => `/users/${row.slug || row.id}`,
    ariaLabel: (row) => `View ${row.name}'s profile`,
    title: (row) => `Open ${row.name} in new tab`,
    disabled: (row) => row.status === 'inactive'
  }
};
```

5. Mixed Buttons and Links

```javascript
const defaultActionConfigs = {
  view: {
    asLink: true,            // Link to view page
    href: (row) => `/view/${row.id}`,
    target: '_blank'
  },
  edit: {
    // Button for inline editing
    onClick: (row) => openEditModal(row)
  },
  delete: {
    // Button with confirmation
    onClick: (row) => {
      if (confirm(`Delete ${row.name}?`)) {
        deleteUser(row.id);
      }
    }
  }
};
```
🚀 Usage Patterns
Simple (Legacy Compatible)
```jsx
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={{
    onView: (row) => handleView(row),
    onDelete: (row) => handleDelete(row)
  }}
/>
```
Advanced Configuration
```jsx
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionConfigs={{
    view: {
      asLink: true,
      href: (row) => `/users/${row.id}`,
      target: '_blank',
      icon: ExternalLink,
      text: 'View',
      className: 'px-2 py-1 bg-blue-100 text-blue-700 rounded'
    },
    edit: {
      icon: Settings,
      onClick: (row) => handleEdit(row),
      disabled: (row) => row.role === 'admin'
    }
  }}
/>
```
Fully Custom (Override)
```jsx
<ServerDataTable
  columns={[
    ...columns,
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => <CustomActionComponent row={row} />
    }
  ]}
/>
```
The system now supports everything you requested:

✅ Selective actions (view only, view+delete, view+edit, etc.)
✅ Actions as buttons or links
✅ Custom text, icons, sizes, variants
✅ Custom classNames for styling
✅ Link properties (target, rel, href)
✅ Dynamic properties based on row data
✅ Conditional enabling/disabling
✅ Backward compatibility with simple handlers
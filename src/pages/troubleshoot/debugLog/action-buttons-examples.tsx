import { Eye, Edit, Trash2, Download, Share, Settings, Copy, ExternalLink, Users, FileText } from 'lucide-react';
import { DefaultActionConfigs, DefaultActionHandlers } from './data-table';

// Example 1: Simple handlers (only specific actions)
export const viewOnlyActions = <T,>(): DefaultActionHandlers<T> => ({
  onView: (row) => console.log('View:', row)
});

export const viewAndDeleteActions = <T,>(): DefaultActionHandlers<T> => ({
  onView: (row) => console.log('View:', row),
  onDelete: (row) => console.log('Delete:', row)
});

export const viewAndEditActions = <T,>(): DefaultActionHandlers<T> => ({
  onView: (row) => console.log('View:', row),
  onEdit: (row) => console.log('Edit:', row)
});

// Example 2: Advanced configurations with custom styling
export const customStyledActions = <T extends { id: React.Key; name?: string }>(): DefaultActionConfigs<T> => ({
  view: {
    icon: Eye,
    text: 'View',
    size: 'sm',
    variant: 'outline',
    className: 'h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50',
    onClick: (row) => console.log('View:', row),
    ariaLabel: 'View details'
  },
  edit: {
    icon: Settings,
    text: 'Edit',
    size: 'sm',
    variant: 'ghost',
    className: 'h-7 px-2 text-xs text-green-600 hover:bg-green-50',
    onClick: (row) => console.log('Edit:', row),
    ariaLabel: 'Edit item'
  },
  delete: {
    icon: Trash2,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-red-500 hover:bg-red-50',
    onClick: (row) => console.log('Delete:', row),
    ariaLabel: (row) => `Delete ${row.name || row.id}`
  }
});

// Example 3: Actions as links
export const linkActions = <T extends { id: React.Key; slug?: string }>(): DefaultActionConfigs<T> => ({
  view: {
    asLink: true,
    href: (row) => `/items/${row.slug || row.id}`,
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: ExternalLink,
    text: 'View',
    className: 'inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200',
    ariaLabel: 'View in new tab'
  },
  edit: {
    asLink: true,
    href: (row) => `/items/${row.slug || row.id}/edit`,
    icon: Edit,
    text: 'Edit',
    className: 'inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200',
    ariaLabel: 'Edit item'
  }
});

// Example 4: Mixed buttons and links
export const mixedActions = <T extends { id: React.Key; name?: string; status?: string }>(): DefaultActionConfigs<T> => ({
  view: {
    // Link to view page
    asLink: true,
    href: (row) => `/view/${row.id}`,
    target: '_blank',
    icon: ExternalLink,
    className: 'h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center',
    ariaLabel: 'View in new tab'
  },
  edit: {
    // Button for inline editing
    icon: Edit,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-green-600 hover:bg-green-50',
    onClick: (row) => console.log('Inline edit:', row),
    ariaLabel: 'Edit inline',
    disabled: (row) => row.status === 'locked'
  },
  delete: {
    // Button with confirmation
    icon: Trash2,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-red-600 hover:bg-red-50',
    onClick: (row) => {
      if (confirm(`Delete ${row.name || row.id}?`)) {
        console.log('Delete confirmed:', row);
      }
    },
    ariaLabel: (row) => `Delete ${row.name || row.id}`,
    disabled: (row) => row.status === 'protected'
  }
});

// Example 5: Icon-only vs text-only vs icon+text
export const variousFormats = <T,>(): DefaultActionConfigs<T> => ({
  view: {
    // Icon only
    icon: Eye,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-blue-600 hover:bg-blue-50',
    onClick: (row) => console.log('View:', row),
    ariaLabel: 'View item'
  },
  edit: {
    // Text only
    text: 'Edit',
    size: 'sm',
    variant: 'outline',
    className: 'h-7 px-2 text-xs',
    onClick: (row) => console.log('Edit:', row),
    ariaLabel: 'Edit item'
  },
  delete: {
    // Icon + text
    icon: Trash2,
    text: 'Delete',
    size: 'sm',
    variant: 'destructive',
    className: 'h-7 px-2 text-xs',
    onClick: (row) => console.log('Delete:', row),
    ariaLabel: 'Delete item'
  }
});

// Example 6: Conditional actions based on row data
export const conditionalActions = <T extends { role?: string; status?: string }>(): DefaultActionConfigs<T> => ({
  view: {
    icon: Eye,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-blue-600 hover:bg-blue-50',
    onClick: (row) => console.log('View:', row),
    ariaLabel: 'View item'
  },
  edit: {
    icon: Edit,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-green-600 hover:bg-green-50',
    onClick: (row) => console.log('Edit:', row),
    ariaLabel: 'Edit item',
    disabled: (row) => row.role === 'viewer' // Disable edit for viewers
  },
  delete: {
    icon: Trash2,
    size: 'sm',
    variant: 'ghost',
    className: 'h-8 w-8 p-0 text-red-600 hover:bg-red-50',
    onClick: (row) => console.log('Delete:', row),
    ariaLabel: 'Delete item',
    disabled: (row) => row.status === 'published' || row.role === 'admin' // Disable delete for published items or admins
  }
});

// Usage examples:

/*
// Example 1: Simple handlers (only show specific actions)
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionHandlers={viewOnlyActions()}
/>

// Example 2: View and delete only
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionHandlers={viewAndDeleteActions()}
/>

// Example 3: Custom styled actions
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionConfigs={customStyledActions()}
/>

// Example 4: Actions as links
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionConfigs={linkActions()}
/>

// Example 5: Mixed buttons and links
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionConfigs={mixedActions()}
/>

// Example 6: Various formats (icon-only, text-only, icon+text)
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionConfigs={variousFormats()}
/>

// Example 7: Conditional actions
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  fetchData={fetchData}
  searchParams={searchParams}
  defaultActionConfigs={conditionalActions()}
/>

// Example 8: Fully custom render (override everything)
const customColumns = [
  ...columns,
  {
    key: 'actions',
    header: 'Actions',
    render: (row) => (
      <div className="flex gap-1">
        <Button onClick={() => handleCustomAction(row)}>
          Custom Action
        </Button>
      </div>
    )
  }
];
*/
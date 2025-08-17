import { Eye, Edit, Trash2, Download, Share, Settings, Copy, ExternalLink } from 'lucide-react';
import { ActionButton } from './data-table';

// Example: Basic CRUD actions
export const basicCrudActions = <T,>(): ActionButton<T>[] => [
  {
    key: 'view',
    icon: Eye,
    onClick: (row) => console.log('View:', row),
    title: 'View',
    ariaLabel: 'View item',
    colorScheme: 'blue'
  },
  {
    key: 'edit',
    icon: Edit,
    onClick: (row) => console.log('Edit:', row),
    title: 'Edit',
    ariaLabel: 'Edit item',
    colorScheme: 'green'
  },
  {
    key: 'delete',
    icon: Trash2,
    onClick: (row) => console.log('Delete:', row),
    title: 'Delete',
    ariaLabel: 'Delete item',
    colorScheme: 'red'
  }
];

// Example: File management actions
export const fileManagementActions = <T,>(): ActionButton<T>[] => [
  {
    key: 'download',
    icon: Download,
    onClick: (row) => console.log('Download:', row),
    title: 'Download',
    ariaLabel: 'Download file',
    colorScheme: 'blue'
  },
  {
    key: 'share',
    icon: Share,
    onClick: (row) => console.log('Share:', row),
    title: 'Share',
    ariaLabel: 'Share file',
    colorScheme: 'purple'
  },
  {
    key: 'copy',
    icon: Copy,
    onClick: (row) => console.log('Copy:', row),
    title: 'Copy Link',
    ariaLabel: 'Copy file link',
    colorScheme: 'gray'
  }
];

// Example: Custom styled actions
export const customStyledActions = <T,>(): ActionButton<T>[] => [
  {
    key: 'settings',
    icon: Settings,
    onClick: (row) => console.log('Settings:', row),
    title: 'Settings',
    ariaLabel: 'Open settings',
    className: 'inline-flex items-center justify-center w-8 h-8 rounded-lg text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-indigo-200'
  },
  {
    key: 'external',
    icon: ExternalLink,
    onClick: (row) => console.log('External:', row),
    title: 'Open External',
    ariaLabel: 'Open in new tab',
    className: 'inline-flex items-center justify-center w-8 h-8 rounded-lg text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm'
  }
];

// Example: Conditional actions based on row data
export const conditionalActions = <T extends { status?: string }>(row: T): ActionButton<T>[] => {
  const baseActions: ActionButton<T>[] = [
    {
      key: 'view',
      icon: Eye,
      onClick: (row) => console.log('View:', row),
      title: 'View',
      ariaLabel: 'View item',
      colorScheme: 'blue'
    }
  ];

  // Add edit action only if status is not 'locked'
  if (row.status !== 'locked') {
    baseActions.push({
      key: 'edit',
      icon: Edit,
      onClick: (row) => console.log('Edit:', row),
      title: 'Edit',
      ariaLabel: 'Edit item',
      colorScheme: 'green'
    });
  }

  // Add delete action only if status is 'draft'
  if (row.status === 'draft') {
    baseActions.push({
      key: 'delete',
      icon: Trash2,
      onClick: (row) => console.log('Delete:', row),
      title: 'Delete',
      ariaLabel: 'Delete item',
      colorScheme: 'red'
    });
  }

  return baseActions;
};

// Usage examples:
/*
// Basic usage with predefined actions
<ServerDataTable
  columns={columns}
  fetchData={fetchData}
  searchParams={searchParams}
  actionButtons={basicCrudActions()}
/>

// File management table
<ServerDataTable
  columns={columns}
  fetchData={fetchData}
  searchParams={searchParams}
  actionButtons={fileManagementActions()}
/>

// Custom styled actions
<ServerDataTable
  columns={columns}
  fetchData={fetchData}
  searchParams={searchParams}
  actionButtons={customStyledActions()}
/>

// Conditional actions (you'd need to modify the table to pass row data to action generator)
// This would require updating the table component to support dynamic actions per row
*/
import { Download, Share, Copy, ExternalLink, Settings, Mail, Phone, FileText, Users } from 'lucide-react';
import { DefaultActionHandlers, DefaultActionConfigs, AdditionalAction } from './data-table';

// Example 1: Simple approach - Default actions + Download button
export const simpleWithDownload = <T extends { id: React.Key; name?: string }>() => {
  const defaultActionHandlers: DefaultActionHandlers<T> = {
    onView: (row) => console.log('View:', row),
    onEdit: (row) => console.log('Edit:', row),
    onDelete: (row) => console.log('Delete:', row)
  };

  const additionalActions: AdditionalAction<T>[] = [
    {
      key: 'download',
      icon: Download,
      onClick: (row) => {
        console.log('Download:', row);
        alert(`Downloading data for: ${row.name || row.id}`);
      },
      ariaLabel: 'Download data',
      title: 'Download user data',
      className: 'h-8 w-8 p-0 text-purple-600 hover:bg-purple-50'
    }
  ];

  return { defaultActionHandlers, additionalActions };
};

// Example 2: Only View + Delete + Download (no Edit)
export const viewDeleteDownload = <T extends { id: React.Key; name?: string }>() => {
  const defaultActionHandlers: DefaultActionHandlers<T> = {
    onView: (row) => console.log('View:', row),
    // No onEdit - edit button won't show
    onDelete: (row) => console.log('Delete:', row)
  };

  const additionalActions: AdditionalAction<T>[] = [
    {
      key: 'download',
      icon: Download,
      onClick: (row) => console.log('Download:', row),
      ariaLabel: 'Download data',
      className: 'h-8 w-8 p-0 text-purple-600 hover:bg-purple-50'
    }
  ];

  return { defaultActionHandlers, additionalActions };
};

// Example 3: Multiple additional actions with different styles
export const multipleAdditionalActions = <T extends { id: React.Key; name?: string; email?: string }>() => {
  const defaultActionHandlers: DefaultActionHandlers<T> = {
    onView: (row) => console.log('View:', row),
    onEdit: (row) => console.log('Edit:', row),
    onDelete: (row) => console.log('Delete:', row)
  };

  const additionalActions: AdditionalAction<T>[] = [
    // Download button
    {
      key: 'download',
      icon: Download,
      onClick: (row) => console.log('Download:', row),
      ariaLabel: 'Download data',
      title: 'Download user data',
      className: 'h-8 w-8 p-0 text-purple-600 hover:bg-purple-50'
    },
    // Share button
    {
      key: 'share',
      icon: Share,
      onClick: (row) => console.log('Share:', row),
      ariaLabel: 'Share user',
      title: 'Share user profile',
      className: 'h-8 w-8 p-0 text-orange-600 hover:bg-orange-50'
    },
    // Copy button
    {
      key: 'copy',
      icon: Copy,
      onClick: (row) => {
        const text = `${row.name || row.id} - ${row.email || ''}`;
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      },
      ariaLabel: 'Copy user info',
      title: 'Copy to clipboard',
      className: 'h-8 w-8 p-0 text-gray-600 hover:bg-gray-50'
    },
    // Email button (as link)
    {
      key: 'email',
      icon: Mail,
      asLink: true,
      href: (row) => `mailto:${row.email}`,
      ariaLabel: 'Send email',
      title: 'Send email to user',
      className: 'h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center'
    }
  ];

  return { defaultActionHandlers, additionalActions };
};

// Example 4: Additional actions with text + icons
export const actionsWithText = <T extends { id: React.Key; name?: string }>() => {
  const defaultActionHandlers: DefaultActionHandlers<T> = {
    onView: (row) => console.log('View:', row),
    onEdit: (row) => console.log('Edit:', row),
    onDelete: (row) => console.log('Delete:', row)
  };

  const additionalActions: AdditionalAction<T>[] = [
    {
      key: 'download',
      icon: Download,
      text: 'Download',
      size: 'sm',
      variant: 'outline',
      onClick: (row) => console.log('Download:', row),
      ariaLabel: 'Download data',
      className: 'h-7 px-2 text-xs border-purple-200 text-purple-700 hover:bg-purple-50'
    },
    {
      key: 'share',
      icon: Share,
      text: 'Share',
      size: 'sm',
      variant: 'ghost',
      onClick: (row) => console.log('Share:', row),
      ariaLabel: 'Share user',
      className: 'h-7 px-2 text-xs text-orange-600 hover:bg-orange-50'
    }
  ];

  return { defaultActionHandlers, additionalActions };
};

// Example 5: Conditional additional actions
export const conditionalAdditionalActions = <T extends { id: React.Key; name?: string; role?: string; status?: string }>() => {
  const defaultActionHandlers: DefaultActionHandlers<T> = {
    onView: (row) => console.log('View:', row),
    onEdit: (row) => console.log('Edit:', row),
    onDelete: (row) => console.log('Delete:', row)
  };

  const additionalActions: AdditionalAction<T>[] = [
    {
      key: 'download',
      icon: Download,
      onClick: (row) => console.log('Download:', row),
      ariaLabel: 'Download data',
      className: 'h-8 w-8 p-0 text-purple-600 hover:bg-purple-50',
      disabled: (row) => row.status === 'inactive' // Disable for inactive users
    },
    {
      key: 'settings',
      icon: Settings,
      onClick: (row) => console.log('Settings:', row),
      ariaLabel: 'User settings',
      className: 'h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-50',
      disabled: (row) => row.role !== 'admin' // Only show for admins
    },
    {
      key: 'report',
      icon: FileText,
      onClick: (row) => console.log('Generate report:', row),
      ariaLabel: 'Generate report',
      title: (row) => `Generate report for ${row.name}`,
      className: 'h-8 w-8 p-0 text-green-600 hover:bg-green-50'
    }
  ];

  return { defaultActionHandlers, additionalActions };
};

// Example 6: Mix of buttons and links as additional actions
export const mixedAdditionalActions = <T extends { id: React.Key; name?: string; slug?: string }>() => {
  const defaultActionHandlers: DefaultActionHandlers<T> = {
    onView: (row) => console.log('View:', row),
    onEdit: (row) => console.log('Edit:', row),
    onDelete: (row) => console.log('Delete:', row)
  };

  const additionalActions: AdditionalAction<T>[] = [
    // Button action
    {
      key: 'download',
      icon: Download,
      onClick: (row) => console.log('Download:', row),
      ariaLabel: 'Download data',
      className: 'h-8 w-8 p-0 text-purple-600 hover:bg-purple-50'
    },
    // Link action (external)
    {
      key: 'external',
      icon: ExternalLink,
      asLink: true,
      href: (row) => `/external/users/${row.slug || row.id}`,
      target: '_blank',
      rel: 'noopener noreferrer',
      ariaLabel: 'View external profile',
      title: 'Open in external system',
      className: 'h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center justify-center'
    },
    // Link with text
    {
      key: 'profile',
      icon: Users,
      text: 'Profile',
      asLink: true,
      href: (row) => `/profile/${row.slug || row.id}`,
      className: 'inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  ];

  return { defaultActionHandlers, additionalActions };
};

// Usage examples:
/*
// Example 1: Simple with download
const { defaultActionHandlers, additionalActions } = simpleWithDownload<DebugRow>();
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={defaultActionHandlers}
  additionalActions={additionalActions}
/>

// Example 2: View + Delete + Download only
const config = viewDeleteDownload<DebugRow>();
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={config.defaultActionHandlers}
  additionalActions={config.additionalActions}
/>

// Example 3: Multiple additional actions
const multiConfig = multipleAdditionalActions<DebugRow>();
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={multiConfig.defaultActionHandlers}
  additionalActions={multiConfig.additionalActions}
/>

// Example 4: Actions with text
const textConfig = actionsWithText<DebugRow>();
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={textConfig.defaultActionHandlers}
  additionalActions={textConfig.additionalActions}
/>

// Example 5: Conditional actions
const conditionalConfig = conditionalAdditionalActions<DebugRow>();
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={conditionalConfig.defaultActionHandlers}
  additionalActions={conditionalConfig.additionalActions}
/>

// Example 6: Mixed buttons and links
const mixedConfig = mixedAdditionalActions<DebugRow>();
<ServerDataTable
  columns={[...columns, { key: 'actions', header: 'Actions' }]}
  defaultActionHandlers={mixedConfig.defaultActionHandlers}
  additionalActions={mixedConfig.additionalActions}
/>
*/
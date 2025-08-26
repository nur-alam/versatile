import React from 'react';

export interface TableSkeletonColumn {
  key: string;
  type?: 'id' | 'type' | 'message' | 'timestamp' | 'actions' | 'default';
}

export interface TableSkeletonProps {
  columns: TableSkeletonColumn[];
  rows?: number;
  className?: string;
  animate?: boolean;
}

export function TableSkeleton({ 
  columns, 
  rows = 10, 
  className = '', 
  animate = true 
}: TableSkeletonProps) {
  const getSkeletonForColumn = (columnType: string) => {
    switch (columnType) {
      case 'id':
        // Row number skeleton - small width
        return <div className="h-4 bg-slate-200 rounded w-6"></div>;
      
      case 'type':
        // Type badge skeleton - medium width with rounded corners
        return <div className="h-6 bg-slate-200 rounded-full w-16"></div>;
      
      case 'message':
        // Message skeleton - full width with multiple lines effect
        return (
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        );
      
      case 'timestamp':
        // Timestamp skeleton - medium width
        return <div className="h-4 bg-slate-200 rounded w-32"></div>;
      
      case 'actions':
        // Action button skeleton - small button-like shape
        return <div className="h-6 bg-slate-200 rounded-lg w-[80%]"></div>;
      
      default:
        // Default skeleton for any other columns
        return <div className="h-4 bg-slate-200 rounded w-24"></div>;
    }
  };

  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr 
          key={`skeleton-${index}`} 
          className={`border-t border-slate-100 ${animate ? 'animate-pulse' : ''} ${className}`}
        >
          {columns.map((col, colIndex) => (
            <td key={`skeleton-${index}-${colIndex}`} className="px-4 py-3">
              {getSkeletonForColumn(col.type || col.key)}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
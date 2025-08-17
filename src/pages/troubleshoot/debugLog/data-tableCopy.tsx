import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Eye, Edit, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Server-side DataTable
 * - Tailwind-styled, accessible, server-side table
 * - Features: sorting, search, pagination (delegated to server)
 * - Reusable: pass `columns` and a `fetchData` function
 *
 * Usage:
 * <ServerDataTable
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email', sortable: true },
 *     { key: 'role', header: 'Role', sortable: true },
 *   ]}
 *   fetchData={({ page, pageSize, search, sortKey, order }) => {
 *     // Replace with real API call
 *     return fetch(`/api/users?page=${page}&pageSize=${pageSize}&search=${search}&sortKey=${sortKey}&order=${order}`)
 *       .then(r => r.json());
 *   }}
 * />
 */

const buildNavigationParams = (page: number, perPage: number, search: string, sortKey: string, order: string) => {
  return {
    pathname: '/troubleshoot/debug-log',
    search: `?${buildQueryParams(page, perPage, search, sortKey, order)}`
  };
};

const buildQueryParams = (page: number, perPage: number, search: string, sortKey: string, order: string) => {
  const params = new URLSearchParams();
  if (page > 1) {
    params.append('paged', page.toString());
  }
  if (perPage && perPage !== 10) {
    params.append('per_page', perPage.toString());
  }
  if (search) {
    params.append('search', search);
  }
  if (sortKey) {
    params.append('sort_key', sortKey);
  }
  if (order) {
    params.append('sort_dir', order);
  }
  return params.toString();
  // return `paged=${page}&per_page=${perPage}${query ? `&search=${query}` : ''}${sortKey ? `&sort_key=${sortKey}` : ''}${order ? `&sort_dir=${order}` : ''}`
};

function SortIcon({ order }: { order: string }) {
  return (
    <span aria-hidden className="inline-flex flex-col leading-none ml-1">
      {order === '' && <ArrowDown className="h-3 w-3" />}
      {order === 'asc' && <ArrowUp className="h-3 w-3" />}
      {order === 'desc' && <ArrowDown className="h-3 w-3" />}
    </span>
  );
}

function getColorSchemeClasses(colorScheme: ActionButton<any>['colorScheme'] = 'gray') {
  const schemes = {
    blue: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-300',
    green: 'text-green-600 hover:bg-green-50 focus:ring-green-300',
    red: 'text-red-600 hover:bg-red-50 focus:ring-red-300',
    gray: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-300',
    yellow: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-300',
    purple: 'text-purple-600 hover:bg-purple-50 focus:ring-purple-300',
  };
  return schemes[colorScheme];
}

// Helper function to parse URL parameters
const parseUrlParams = (urlParams: URLSearchParams) => {
  return {
    page: parseInt(urlParams.get('paged') || '1'),
    pageSize: parseInt(urlParams.get('per_page') || '10'),
    search: urlParams.get('search') || '',
    sortKey: urlParams.get('sort_key') || '',
    order: urlParams.get('order') || ''
  };
};

export type Column<T> = {
  key: keyof T | 'actions';
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row?: T) => React.ReactNode;
  sortKey?: string;
};

export type ActionButton<T> = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  title: string;
  ariaLabel: string;
  className?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'gray' | 'yellow' | 'purple';
};

export type ActionHandlers<T> = {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

type ServerDataTableProps<TData extends { id: React.Key }, TFetchData, TSearchParams> = {
  columns: Column<TData>[];
  fetchData: TFetchData;
  searchParams: TSearchParams;
  actionHandlers?: ActionHandlers<TData>;
  actionButtons?: ActionButton<TData>[];
};

export type TFetchDataPromise<TData> = (...args: any[]) => Promise<{ data: TData[], total: number, totalPages: number }>

export function ServerDataTableCopy<TData extends { id: React.Key }, TFetchData extends TFetchDataPromise<TData>, TSearchParams>({ columns, fetchData, searchParams, actionHandlers, actionButtons }: ServerDataTableProps<TData, TFetchData, TSearchParams>) {

  const navigate = useNavigate();
  const urlParams = searchParams as URLSearchParams;

  // Parse initial URL parameters
  const initialParams = parseUrlParams(urlParams);

  const [query, setSearch] = useState(initialParams.search);
  const [page, setPage] = useState(initialParams.page);
  const [pageSize, setPageSize] = useState(initialParams.pageSize);
  const [sort, setSort] = useState({ key: initialParams.sortKey, order: initialParams.order });
  const [totalPages, setTotalPages] = useState(0);

  // Sync local state with URL parameters when they change
  useEffect(() => {
    const newParams = parseUrlParams(urlParams);

    setPage(newParams.page);
    setPageSize(newParams.pageSize);
    setSearch(newParams.search);
    setSort({ key: newParams.sortKey, order: newParams.order });
  }, [searchParams]);

  const [rows, setRows] = useState<TData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchData({ page, pageSize, search: query, sortKey: sort.key, order: sort.order })
      .then((res: { data: TData[], total: number, totalPages: number }) => {
        // expect { data: [], total: number, totalPages: number }
        setRows(res.data);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 0);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize, query, sort]);

  function toggleSort(key: string) {
    setSort((prev) => {
      if (prev.key !== key) return { key, order: "asc" };
      if (prev.order === "asc") return { key, order: "desc" };
      // if (prev.order === "desc") return { key: null, order: null };
      return { key, order: "asc" };
    });
  }

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setSearch(e.target.value);
              navigate(buildNavigationParams(page, pageSize, e.target.value, sort.key, sort.order));
            }}
            placeholder="Search..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm shadow-sm outline-none focus:border-slate-300"
            aria-label="Search table"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M10 4a6 6 0 104.472 10.03l4.249 4.249 1.414-1.414-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" /></svg>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Rows per page</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              navigate(buildNavigationParams(page, Number(e.target.value), query, sort.key, sort.order));
            }}
            className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm shadow-sm"
          >
            {[5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-slate-600">
                {columns.map((col) => {
                  const isSorted = sort.key === col.key;
                  const ariaSort = isSorted ? (sort.order === "asc" ? "ascending" : "descending") : "none";
                  const thBase = "px-4 py-3 font-semibold";
                  if (col.sortable) {
                    return (
                      <th key={String(col.key)} scope="col" aria-sort={ariaSort} className={thBase}>
                        <button
                          className="group inline-flex items-center rounded-lg px-2 py-0.5 hover:bg-[#edeff1] focus:outline-none focus:ring-2 focus:ring-slate-300"
                          onClick={() => toggleSort(String(col.key))}
                          aria-label={`Sort by ${col.header}`}
                        >
                          <span>{col.header}</span>
                          <SortIcon order={isSorted ? sort.order : ""} />
                        </button>
                      </th>
                    );
                  }
                  return (
                    <th key={String(col.key)} scope="col" className={thBase}>{col.header}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                rows.map((row: TData) => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-slate-700">
                        {col.key === 'actions' ? (
                          <div className="flex items-center gap-2">
                            {/* Render custom action buttons if provided */}
                            {actionButtons?.map((action) => {
                              const IconComponent = action.icon;
                              const colorClasses = getColorSchemeClasses(action.colorScheme);
                              const baseClasses = "inline-flex items-center justify-center w-8 h-8 rounded-lg focus:outline-none focus:ring-2";
                              const finalClasses = action.className 
                                ? `${baseClasses} ${action.className}` 
                                : `${baseClasses} ${colorClasses}`;
                              
                              return (
                                <button
                                  key={action.key}
                                  onClick={() => action.onClick(row)}
                                  className={finalClasses}
                                  title={action.title}
                                  aria-label={action.ariaLabel}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </button>
                              );
                            })}
                            
                            {/* Fallback to legacy actionHandlers if no actionButtons provided */}
                            {!actionButtons && actionHandlers?.onView && (
                              <button
                                onClick={() => actionHandlers.onView!(row)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                title="View"
                                aria-label="View item"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            {!actionButtons && actionHandlers?.onEdit && (
                              <button
                                onClick={() => actionHandlers.onEdit!(row)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300"
                                title="Edit"
                                aria-label="Edit item"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {!actionButtons && actionHandlers?.onDelete && (
                              <button
                                onClick={() => actionHandlers.onDelete!(row)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                                title="Delete"
                                aria-label="Delete item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ) : col.render ? (
                          col.render(row[col.key as keyof TData], row)
                        ) : (
                          String(row[col.key as keyof TData] ?? '')
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-600">
            Showing <span className="font-semibold">{rows.length ? (page - 1) * pageSize + 1 : 0}</span>–
            <span className="font-semibold">{(page - 1) * pageSize + rows.length}</span> of
            <span className="font-semibold"> {total}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
              onClick={() => {
                setPage(1);
                navigate(buildNavigationParams(1, pageSize, query, sort.key, sort.order));
              }}
              disabled={page === 1}
            >
              « First
            </button>
            <button
              className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
              onClick={() => {
                const prevPage = Math.max(1, page - 1);
                setPage(prevPage);
                navigate(buildNavigationParams(prevPage, pageSize, query, sort.key, sort.order));
              }}
              disabled={page === 1}
            >
              <ArrowLeft className="inline h-4 w-4" /> Prev
            </button>
            <span className="mx-2 text-sm text-slate-700">Page {page} / {totalPages}</span>
            <button
              className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
              onClick={() => {
                const nextPage = Math.min(totalPages, page + 1);
                setPage(nextPage);
                navigate(buildNavigationParams(nextPage, pageSize, query, sort.key, sort.order));
              }}
              aria-label="Next page"
              disabled={page === totalPages}
            >
              Next <ArrowRight className="inline h-4 w-4" />
            </button>
            <button
              className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
              onClick={() => {
                setPage(totalPages);
                navigate(buildNavigationParams(totalPages, pageSize, query, sort.key, sort.order));
              }}
              disabled={page === totalPages}
            >
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
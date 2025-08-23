import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Eye, Edit, Trash2, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { __ } from "@wordpress/i18n";

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
  params.append('paged', page.toString());
  params.append('per_page', perPage?.toString());
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
{/* <ArrowDownAZ />
<ArrowUpAZ /> */}
function SortIcon({ order }: { order: string }) {
  return (
    <span aria-hidden className="inline-flex flex-col leading-none ml-1">
      {order === '' && <ArrowUpAZ className="h-3 w-3" />}
      {order === 'asc' && <ArrowUpAZ className="h-3 w-3" />}
      {order === 'desc' && <ArrowDownAZ className="h-3 w-3" />}
    </span>
  );
}

// Helper function to parse URL parameters
const parseUrlParams = (urlParams: URLSearchParams) => {
  return {
    page: parseInt(urlParams.get('paged') || '1'),
    perPage: parseInt(urlParams.get('per_page') || '10'),
    search: urlParams.get('search') || '',
    sortKey: urlParams.get('sort_key') || '',
    order: urlParams.get('order') || ''
  };
};

export type Column<T> = {
  key: keyof T | 'actions';
  header: string;
  sortable?: boolean;
  render?: (row: T, key: keyof T) => React.ReactNode;
  sortKey?: string;
};

type ServerDataTableProps<TData extends { id: React.Key }, TFetchData, TSearchParams> = {
  columns: Column<TData>[];
  fetchData: TFetchData;
  searchParams: TSearchParams;
};

export type TFetchDataPromise<TData> = (...args: any[]) => Promise<{ data: TData[], total: number, totalPages: number }>

export function ServerDataTable<TData extends { id: React.Key }, TFetchData extends TFetchDataPromise<TData>, TSearchParams>({ columns, fetchData, searchParams }: ServerDataTableProps<TData, TFetchData, TSearchParams>) {

  const navigate = useNavigate();
  const urlParams = searchParams as URLSearchParams;

  // Parse initial URL parameters
  const initialParams = parseUrlParams(urlParams);

  const [query, setSearch] = useState(initialParams.search);
  const [page, setPage] = useState(initialParams.page);
  const [perPage, setPerPage] = useState(initialParams.perPage || 10);
  const [sort, setSort] = useState({ key: initialParams.sortKey, order: initialParams.order });
  const [totalPages, setTotalPages] = useState(0);

  // Sync local state with URL parameters when they change
  useEffect(() => {
    const newParams = parseUrlParams(urlParams);

    setPage(newParams.page);
    setPerPage(newParams.perPage || 10);
    setSearch(newParams.search);
    setSort({ key: newParams.sortKey, order: newParams.order });
  }, [searchParams]);

  const [rows, setRows] = useState<TData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchData({ page, perPage, search: query, sortKey: sort.key, order: sort.order })
      .then((res: { data: TData[], total: number, totalPages: number }) => {
        // expect { data: [], total: number, totalPages: number }
        setRows(res.data);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 0);
      })
      .finally(() => setLoading(false));
  }, [page, perPage, query, sort]);

  console.log(rows);

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
      {/* Table Controls */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md">
        </div>
        <div className="flex items-center gap-2">
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
                          className="group inline-flex items-center rounded-lg px-1 py-0.5 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
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
                    {__('Loading...', 'versatile-toolkit')}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                    {__('No results found.', 'versatile-toolkit')}
                  </td>
                </tr>
              ) : (

                rows.map((row: TData, index: number) => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-3 text-slate-700">
                        {col.render ? (
                          col.render(row, col.key as keyof TData)
                        ) : (
                          row[col.key as keyof TData] === row.id ? (
                            index + 1
                          ) : (
                            String(row[col.key as keyof TData] ?? '')
                          )
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
          {/* per page dropdown, showing total */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-600">
              Showing <span className="font-semibold">{rows.length ? (page - 1) * perPage + 1 : 0}</span>–
              <span className="font-semibold">{(page - 1) * perPage + rows.length}</span> of
              <span className="font-semibold"> {total}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">{__('Per page', 'versatile-toolkit')}</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  navigate(buildNavigationParams(page, Number(e.target.value), query, sort.key, sort.order));
                }}
                className="rounded-xl border !border-slate-200 bg-white px-2 py-1.5 text-sm shadow-sm"
              >
                {[5, 10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => {
                const prevPage = Math.max(1, page - 1);
                setPage(prevPage);
                navigate(buildNavigationParams(prevPage, perPage, query, sort.key, sort.order));
              }}
              disabled={page === 1}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {(() => {
                const pages = [];
                const maxVisiblePages = 3;
                let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2)); 2
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1); 4

                // Adjust start if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                // First page + ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-medium ${1 === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      onClick={() => {
                        setPage(1);
                        navigate(buildNavigationParams(1, perPage, query, sort.key, sort.order));
                      }}
                    >
                      1
                    </button>
                  );

                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }
                }

                // Visible page range
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-medium ${i === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      onClick={() => {
                        setPage(i);
                        navigate(buildNavigationParams(i, perPage, query, sort.key, sort.order));
                      }}
                    >
                      {i}
                    </button>
                  );
                }

                // Last page + ellipsis if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 text-slate-400">
                        ...
                      </span>
                    );
                  }

                  pages.push(
                    <button
                      key={totalPages}
                      className={`min-w-[40px] h-10 rounded-lg text-sm font-medium ${totalPages === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      onClick={() => {
                        setPage(totalPages);
                        navigate(buildNavigationParams(totalPages, perPage, query, sort.key, sort.order));
                      }}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            {/* Next Button */}
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => {
                const nextPage = Math.min(totalPages, page + 1);
                setPage(nextPage);
                navigate(buildNavigationParams(nextPage, perPage, query, sort.key, sort.order));
              }}
              disabled={page === totalPages}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* pagination */}
          {/* <div className="flex items-center gap-1">
            <button
              className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
              onClick={() => {
                setPage(1);
                navigate(buildNavigationParams(1, perPage, query, sort.key, sort.order));
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
                navigate(buildNavigationParams(prevPage, perPage, query, sort.key, sort.order));
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
                navigate(buildNavigationParams(nextPage, perPage, query, sort.key, sort.order));
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
                navigate(buildNavigationParams(totalPages, perPage, query, sort.key, sort.order));
              }}
              disabled={page === totalPages}
            >
              Last »
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}


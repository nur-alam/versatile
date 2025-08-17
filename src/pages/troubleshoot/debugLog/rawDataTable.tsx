import React, { useEffect, useMemo, useState } from "react";

/**
 * DataTable
 * - Tailwind-styled, accessible, client-side table
 * - Features: sorting, global search, pagination, page size, sticky header, empty state
 * - Reusable: pass `columns` and `data` as props
 *
 * Usage:
 * <DataTable
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email', sortable: true },
 *     { key: 'role', header: 'Role', sortable: true },
 *     { key: 'createdAt', header: 'Created', sortable: true, render: (v) => new Date(v).toLocaleDateString() },
 *   ]}
 *   data={[{ id: 1, name: 'Alice', email: 'a@a.com', role: 'Admin', createdAt: '2025-01-01' }]}
 * />
 */

function classNames(...cls) {
	return cls.filter(Boolean).join(" ");
}

function useDebouncedValue(value, delay = 300) {
	const [v, setV] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setV(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return v;
}

function getValue(obj, path) {
	// supports simple keys like "user.name"
	return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function highlight(text, query) {
	if (!query) return text;
	const s = String(text);
	const idx = s.toLowerCase().indexOf(query.toLowerCase());
	if (idx === -1) return s;
	const before = s.slice(0, idx);
	const match = s.slice(idx, idx + query.length);
	const after = s.slice(idx + query.length);
	return (
		<>
			{before}
			<mark className="rounded bg-yellow-200 px-0.5">{match}</mark>
			{after}
		</>
	);
}

function SortIcon({ dir }) {
	return (
		<span aria-hidden className="inline-flex flex-col leading-none ml-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className={classNames(
					"h-3 w-3 transition-opacity",
					dir === "asc" ? "opacity-100" : "opacity-30"
				)}
				fill="currentColor"
			>
				<path d="M7 14l5-5 5 5H7z" />
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				className={classNames(
					"h-3 w-3 -mt-0.5 transition-opacity",
					dir === "desc" ? "opacity-100" : "opacity-30"
				)}
				fill="currentColor"
			>
				<path d="M7 10l5 5 5-5H7z" />
			</svg>
		</span>
	);
}

export function DataTable({ columns, data, initialPageSize = 10, searchableKeys }) {
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [sort, setSort] = useState({ key: null, dir: null }); // dir: 'asc' | 'desc'

	const debouncedQuery = useDebouncedValue(query, 300);

	// Compute searchable keys default
	const searchKeys = useMemo(() => {
		if (Array.isArray(searchableKeys) && searchableKeys.length) return searchableKeys;
		return columns.map((c) => c.key);
	}, [searchableKeys, columns]);

	const filtered = useMemo(() => {
		if (!debouncedQuery) return data;
		const q = debouncedQuery.toLowerCase();
		return data.filter((row) =>
			searchKeys.some((k) => String(getValue(row, k) ?? "").toLowerCase().includes(q))
		);
	}, [data, debouncedQuery, searchKeys]);

	const sorted = useMemo(() => {
		if (!sort.key || !sort.dir) return filtered;
		const { key, dir } = sort;
		const copy = [...filtered];
		copy.sort((a, b) => {
			const av = getValue(a, key);
			const bv = getValue(b, key);
			// basic comparer
			if (av == null && bv == null) return 0;
			if (av == null) return dir === "asc" ? -1 : 1;
			if (bv == null) return dir === "asc" ? 1 : -1;
			const na = Number(av);
			const nb = Number(bv);
			const bothNumber = !Number.isNaN(na) && !Number.isNaN(nb);
			const cmp = bothNumber ? na - nb : String(av).localeCompare(String(bv));
			return dir === "asc" ? cmp : -cmp;
		});
		return copy;
	}, [filtered, sort]);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const paged = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sorted.slice(start, start + pageSize);
	}, [sorted, currentPage, pageSize]);

	// Reset to first page when filters change
	useEffect(() => setPage(1), [debouncedQuery, pageSize]);

	function toggleSort(key) {
		setSort((prev) => {
			if (prev.key !== key) return { key, dir: "asc" };
			if (prev.dir === "asc") return { key, dir: "desc" };
			if (prev.dir === "desc") return { key: null, dir: null }; // remove sort
			return { key, dir: "asc" };
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
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search..."
						className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 pr-9 text-sm shadow-sm outline-none ring-0 focus:border-slate-300"
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
						onChange={(e) => setPageSize(Number(e.target.value))}
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
									const ariaSort = isSorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
									const thBase = "px-4 py-3 font-semibold";
									if (col.sortable) {
										return (
											<th key={col.key} scope="col" aria-sort={ariaSort} className={thBase}>
												<button
													className="group inline-flex items-center rounded-lg px-1 py-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
													onClick={() => toggleSort(col.key)}
													aria-label={`Sort by ${col.header}`}
												>
													<span>{col.header}</span>
													<SortIcon dir={isSorted ? sort.dir : undefined} />
												</button>
											</th>
										);
									}
									return (
										<th key={col.key} scope="col" className={thBase}>{col.header}</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{paged.length === 0 ? (
								<tr>
									<td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
										No results found.
									</td>
								</tr>
							) : (
								paged.map((row, i) => (
									<tr key={row.id ?? i} className="border-t border-slate-100 hover:bg-slate-50/60">
										{columns.map((col) => {
											const raw = getValue(row, col.key);
											const display = col.render ? col.render(raw, row) : raw;
											return (
												<td key={col.key} className="px-4 py-3 text-slate-700">
													{typeof display === "string" || typeof display === "number"
														? highlight(display, debouncedQuery)
														: display}
												</td>
											);
										})}
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Footer */}
				<div className="flex flex-col gap-3 border-t border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-xs text-slate-600">
						Showing <span className="font-semibold">{paged.length ? (currentPage - 1) * pageSize + 1 : 0}</span>–
						<span className="font-semibold">{(currentPage - 1) * pageSize + paged.length}</span> of
						<span className="font-semibold"> {sorted.length}</span>
					</div>
					<div className="flex items-center gap-1">
						<button
							className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
							onClick={() => setPage(1)}
							disabled={currentPage === 1}
						>
							« First
						</button>
						<button
							className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
						>
							‹ Prev
						</button>
						<span className="mx-2 text-sm text-slate-700">Page {currentPage} / {totalPages}</span>
						<button
							className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						>
							Next ›
						</button>
						<button
							className="rounded-xl px-3 py-1.5 text-sm shadow-sm border border-slate-200 disabled:opacity-40"
							onClick={() => setPage(totalPages)}
							disabled={currentPage === totalPages}
						>
							Last »
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// Demo component with sample data
export default function DataTableDemo() {
	const columns = [
		{ key: "name", header: "Name", sortable: true },
		{ key: "email", header: "Email", sortable: true },
		{ key: "role", header: "Role", sortable: true },
		{ key: "createdAt", header: "Created", sortable: true, render: (v) => new Date(v).toLocaleDateString() },
	];

	const data = useMemo(
		() => [
			{ id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", createdAt: "2025-01-11" },
			{ id: 2, name: "Bob Chen", email: "bob@example.com", role: "Editor", createdAt: "2025-02-02" },
			{ id: 3, name: "Carlos Diaz", email: "carlos@example.com", role: "Viewer", createdAt: "2024-12-20" },
			{ id: 4, name: "Dana Kapoor", email: "dana@example.com", role: "Editor", createdAt: "2025-03-15" },
			{ id: 5, name: "Evelyn Ng", email: "evelyn@example.com", role: "Admin", createdAt: "2025-04-08" },
			{ id: 6, name: "Farhan Ali", email: "farhan@example.com", role: "Viewer", createdAt: "2025-04-22" },
			{ id: 7, name: "Grace Lee", email: "grace@example.com", role: "Editor", createdAt: "2024-11-30" },
			{ id: 8, name: "Hiro Tanaka", email: "hiro@example.com", role: "Viewer", createdAt: "2025-05-10" },
			{ id: 9, name: "Imran Hossain", email: "imran@example.com", role: "Admin", createdAt: "2025-05-28" },
			{ id: 10, name: "Julia Martins", email: "julia@example.com", role: "Viewer", createdAt: "2025-06-05" },
			{ id: 11, name: "Kamal Perera", email: "kamal@example.com", role: "Editor", createdAt: "2025-06-20" },
			{ id: 12, name: "Lena Schmidt", email: "lena@example.com", role: "Viewer", createdAt: "2025-07-03" },
			{ id: 13, name: "Mohammad Faisal", email: "faisal@example.com", role: "Admin", createdAt: "2025-07-18" },
			{ id: 14, name: "Nadia Rahman", email: "nadia@example.com", role: "Editor", createdAt: "2025-07-30" },
			{ id: 15, name: "Omar Khaled", email: "omar@example.com", role: "Viewer", createdAt: "2025-08-01" },
			{ id: 16, name: "Priya Singh", email: "priya@example.com", role: "Editor", createdAt: "2025-08-09" },
			{ id: 17, name: "Qi Zhang", email: "qi@example.com", role: "Viewer", createdAt: "2025-08-11" },
			{ id: 18, name: "Rafiul Islam", email: "rafiul@example.com", role: "Admin", createdAt: "2025-08-13" },
			{ id: 19, name: "Sara Cohen", email: "sara@example.com", role: "Viewer", createdAt: "2025-08-14" },
			{ id: 20, name: "Tarek Aziz", email: "tarek@example.com", role: "Editor", createdAt: "2025-08-15" },
		],
		[]
	);

	return (
		<div className="mx-auto max-w-6xl p-6">
			<h1 className="mb-4 text-2xl font-bold tracking-tight">Users</h1>
			<p className="mb-6 text-slate-600">Sortable, searchable, paginated table built with Tailwind and React.</p>
			<DataTable columns={columns} data={data} initialPageSize={10} />
		</div>
	);
}

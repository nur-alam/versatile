import { useSearchParams } from 'react-router-dom';
import { ServerDataTable, Column, TFetchDataPromise } from '@/pages/troubleshoot/debugLog/data-table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Download, ExternalLink, Settings, Share, Copy } from 'lucide-react';

export type DebugRow = {
	key?: React.Key;
	id: number;
	name: string;
	email: string;
	role: string;
	createdAt: string;
};

export type DebugLogSearchParams = {
	page?: number;
	pageSize?: number;
	search?: string;
	sortKey?: string;
	order?: string;
};

const debugLog = () => {
	// Use React Router's useSearchParams for hash-based routing
	const [searchParams] = useSearchParams();

	const columns = [
		{ key: "id", header: "ID", sortable: true },
		{ key: "name", header: "Name", sortable: true },
		{ key: "email", header: "Email", sortable: true },
		{
			key: "role", header: "Role", sortable: true,
			render: (row, key) => {
				console.log('role', row);
				console.log('role', key);
				return row['key'] === 'Admin' ? 'Administrator' : 'Subscriber';
			}
		},
		{ key: "createdAt", header: "Created", sortable: true, render: (row, value?: string) => new Date(value || '').toLocaleDateString() || '' },
		{
			key: 'actions', header: 'Actions',
			render: (row, key) => {
				return <div className="flex gap-1">
					<Button
						size="sm"
						variant="ghost"
						onClick={() => {
							console.log('View:', row);
							alert(`Viewing user: ${row.name}`);
						}}
						aria-label={`View ${row.name}`}
						className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
					>
						<Eye className="h-4 w-4" />
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => {
							console.log('Download:', row);
							alert(`Downloading data for: ${row.name}`);
						}}
						aria-label={`Download ${row.name} data`}
						className="h-8 w-8 p-0 text-purple-600 hover:bg-purple-50"
					>
						<Download className="h-4 w-4" />
					</Button>
				</div>
			}
		}
	] as Column<DebugRow>[];

	// Dummy API simulation
	function fetchData({ page, pageSize, search, sortKey, order }: DebugLogSearchParams): Promise<{ data: DebugRow[], total: number, totalPages: number }> {
		console.log('fetchData', { page, pageSize, search, sortKey, order });
		return new Promise((resolve) => {
			setTimeout(() => {
				let all = Array.from({ length: 30 }).map((_, i) => ({
					id: i + 1,
					name: `User ${i + 1}`,
					email: `user${i + 1}@example.com`,
					role: ["Admin", "Editor", "Viewer"][i % 3],
					createdAt: new Date(2025, i % 12, (i % 28) + 1).toISOString() || '',
				}));

				// search
				if (search) {
					all = all.filter((u) =>
						u.name.toLowerCase().includes(search.toLowerCase()) ||
						u.email.toLowerCase().includes(search.toLowerCase())
					);
				}

				// sort
				if (sortKey && order) {
					all.sort((a, b) => {
						const av = a[sortKey as keyof typeof a] || '';
						const bv = b[sortKey as keyof typeof b] || '';
						const cmp = String(av).localeCompare(String(bv));
						return order === "asc" ? cmp : -cmp;
					});
				}

				// pagination
				const total = all.length;
				const start = ((page || 1) - 1) * (pageSize || 10);
				const data = all.slice(start, start + (pageSize || 10));
				const totalPages = Math.ceil(total / (pageSize || 10));

				resolve({ data: data as DebugRow[], total, totalPages });
			}, 500);
		});
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<h1 className="mb-4 text-2xl font-bold tracking-tight">Debug Log</h1>
			<p className="mb-6 text-slate-600">Server-side pagination, search, and sorting with Tailwind + React.</p>
			{/* Example 1: Automatic default actions (no configuration needed) */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-semibold">Example 1: Automatic Default Actions</h2>
				<p className="mb-4 text-sm text-gray-600">Just add actions column - view, edit, delete buttons appear automatically with built-in handlers</p>
				<ServerDataTable<DebugRow, TFetchDataPromise<DebugRow>, typeof searchParams>
					columns={columns}
					fetchData={fetchData}
					searchParams={searchParams}
				/>
			</div>
		</div>
	);
}

export default debugLog;
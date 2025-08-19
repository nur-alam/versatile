import { useSearchParams } from 'react-router-dom';
import { ServerDataTable, Column, TFetchDataPromise } from '@/pages/troubleshoot/debugLog/data-table';
import { ViewLog } from '@/pages/troubleshoot/debugLog/view-log';
import config from '@/config';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import toast from 'react-hot-toast';

export type DebugRow = {
	id: number;
	type: string;
	message: string;
	severity: string;
	timestamp: string;
};

export type DebugLogSearchParams = {
	page?: number;
	perPage?: number;
	search?: string;
	sortKey?: string;
	order?: string;
};

export type DebugLogData = {
	current_page: number;
	entries: DebugRow[];
	per_page: number;
	total_lines: number;
	total_pages: number;
}

const debugLog = () => {
	// Use React Router's useSearchParams for hash-based routing
	const [searchParams] = useSearchParams();
	const loadLogContent = async ({ page, perPage, search, sortKey, order }: DebugLogSearchParams): Promise<{ data: DebugRow[], total: number, totalPages: number }> => {
		try {
			const params = new URLSearchParams({
				action: 'versatile_get_debug_log_content',
				versatile_nonce: config.nonce_value,
				page: String(page),
				per_page: String(perPage),
				search: String(search).trim(),
				sortKey: String(sortKey).trim(),
				order: String(order?.trim()?.toLowerCase()),
			});
			const response = await fetch(`${config.ajax_url}?${params}`);
			const responseData = await response.json() as VersatileResponseType<DebugLogData>;
			if (responseData.status_code === 200) {
				const data = responseData.data as DebugLogData;
				return { data: data.entries, total: data?.total_lines, totalPages: data?.total_pages };
			} else {
				toast.error(responseData.message || 'Error fetching debug log content');
				return { data: [], total: 0, totalPages: 0 };
			}
		} catch (error: any) {
			toast.error('Error fetching debug log content: ', error?.message || 'Unknown error');
			return { data: [], total: 0, totalPages: 0 };
		}
	};

	const columns = [
		{ key: "id", header: "No" },
		{ key: "type", header: "Type" },
		{ key: "message", header: "Message" },
		{ key: "severity", header: "Severity" },
		{
			key: "timestamp", header: "Timestamp",
			render: (row, value?: string) => new Date(value || '').toLocaleString() || ''
		},
		{
			key: 'actions', header: 'Actions',
			render: (row, key) => <ViewLog row={row} key={key} />
		}
	] as Column<DebugRow>[];

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
					fetchData={loadLogContent}
					searchParams={searchParams}
				/>
			</div>
		</div>
	);
}

export default debugLog;
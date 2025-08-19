import { useSearchParams } from 'react-router-dom';
import { ServerDataTable, Column, TFetchDataPromise } from '@/pages/troubleshoot/debugLog/data-table';
import { ViewLog } from '@/pages/troubleshoot/debugLog/view-log';
import config from '@/config';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';

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

	// Debug log settings state
	const [debugStatus, setDebugStatus] = useState(false);
	const [logFileInfo, setLogFileInfo] = useState({
		size: '0 KB',
		lastModified: 'Never',
		exists: false
	});
	const [isAutoRefresh, setIsAutoRefresh] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
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
			<div className='bg-white p-6 rounded-lg border border-slate-200 mt-3'>
				<div className="space-y-6">
					{/* Header */}
					<div className="border-b border-slate-200 pb-4">
						<h2 className="text-xl font-semibold text-slate-800">{__('Debug Log Settings', 'versatile-toolkit')}</h2>
						<p className="text-sm text-slate-600 mt-1">{__('Manage WordPress debug logging configuration and log file operations', 'versatile-toolkit')}</p>
					</div>

					{/* Debug Logging Status */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
								<div className="flex items-center space-x-3">
									<div className={`w-3 h-3 rounded-full ${debugStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
									<div>
										<h3 className="font-medium text-slate-800">{__('Debug Logging Status', 'versatile-toolkit')}</h3>
										<p className="text-sm text-slate-600">
											{debugStatus ? __('Debug logging is currently enabled', 'versatile-toolkit') : __('Debug logging is currently disabled', 'versatile-toolkit')}
										</p>
									</div>
								</div>
								<span className={`px-3 py-1 rounded-full text-xs font-medium ${debugStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
									}`}>
									{debugStatus ? __('Enabled', 'versatile-toolkit') : __('Disabled', 'versatile-toolkit')}
								</span>
							</div>

							{/* Control Buttons */}
							<div className="flex space-x-3">
								<button
									onClick={() => setDebugStatus(true)}
									disabled={debugStatus || isLoading}
									className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${debugStatus || isLoading
											? 'bg-slate-100 text-slate-400 cursor-not-allowed'
											: 'bg-green-600 text-white hover:bg-green-700'
										}`}
								>
									{isLoading ? __('Processing...', 'versatile-toolkit') : __('Enable Debug Log', 'versatile-toolkit')}
								</button>
								<button
									onClick={() => setDebugStatus(false)}
									disabled={!debugStatus || isLoading}
									className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${!debugStatus || isLoading
											? 'bg-slate-100 text-slate-400 cursor-not-allowed'
											: 'bg-red-600 text-white hover:bg-red-700'
										}`}
								>
									{isLoading ? __('Processing...', 'versatile-toolkit') : __('Disable Debug Log', 'versatile-toolkit')}
								</button>
							</div>
						</div>

						{/* Log File Information */}
						<div className="space-y-4">
							<div className="p-4 bg-slate-50 rounded-lg border">
								<h3 className="font-medium text-slate-800 mb-3">{__('Log File Information', 'versatile-toolkit')}</h3>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-sm text-slate-600">{__('File Status:', 'versatile-toolkit')}</span>
										<span className={`text-sm font-medium ${logFileInfo.exists ? 'text-green-600' : 'text-red-600'}`}>
											{logFileInfo.exists ? __('Exists', 'versatile-toolkit') : __('Not Found', 'versatile-toolkit')}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-slate-600">{__('File Size:', 'versatile-toolkit')}</span>
										<span className="text-sm font-medium text-slate-800">{logFileInfo.size}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-slate-600">{__('Last Modified:', 'versatile-toolkit')}</span>
										<span className="text-sm font-medium text-slate-800">{logFileInfo.lastModified}</span>
									</div>
								</div>
							</div>

							{/* Auto Refresh Toggle */}
							<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
								<div className="flex items-center space-x-2">
									<svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span className="text-sm font-medium text-blue-800">{__('Auto Refresh', 'versatile-toolkit')}</span>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={isAutoRefresh}
										onChange={(e) => setIsAutoRefresh(e.target.checked)}
										className="sr-only peer"
									/>
									<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="border-t border-slate-200 pt-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							<button
								onClick={() => {/* Refresh log logic */ }}
								disabled={isLoading}
								className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								<span className="text-sm font-medium">{__('Refresh Log', 'versatile-toolkit')}</span>
							</button>

							<button
								onClick={() => {/* Download log logic */ }}
								disabled={!logFileInfo.exists || isLoading}
								className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<span className="text-sm font-medium">{__('Download Log', 'versatile-toolkit')}</span>
							</button>

							<button
								onClick={() => {/* Clear log logic */ }}
								disabled={!logFileInfo.exists || isLoading}
								className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
								<span className="text-sm font-medium">{__('Clear Log', 'versatile-toolkit')}</span>
							</button>

							<button
								onClick={() => setIsAutoRefresh(false)}
								disabled={!isAutoRefresh || isLoading}
								className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
								</svg>
								<span className="text-sm font-medium">{__('Stop Auto Refresh', 'versatile-toolkit')}</span>
							</button>
						</div>
					</div>

					{/* Info Alert */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div className="text-sm text-blue-800">
								<p className="font-medium mb-1">{__('Debug Log Information', 'versatile-toolkit')}</p>
								<p>{__('Debug logging helps identify issues in your WordPress site. When enabled, errors and warnings are logged to wp-content/debug.log file. Remember to disable debug logging on production sites for security and performance reasons.', 'versatile-toolkit')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Example 1: Automatic default actions (no configuration needed) */}
			<div className="my-8">
				{/* <h2 className="mb-4 text-lg font-semibold">{__('Example 1: Automatic Default Actions', 'versatile-toolkit')}</h2>
				<p className="mb-4 text-sm text-gray-600">{__('Just add actions column - view, edit, delete buttons appear automatically with built-in handlers', 'versatile-toolkit')}</p> */}
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
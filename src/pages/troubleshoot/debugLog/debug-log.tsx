import { useSearchParams } from 'react-router-dom';
import { ServerDataTable, Column, TFetchDataPromise } from '@/pages/troubleshoot/debugLog/data-table';
import { ViewLog } from '@/pages/troubleshoot/debugLog/view-log';
import config from '@/config';
import { VersatileResponseType } from '@/utils/versatile-declaration';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import {
	useDebugLogStatus,
	useToggleDebugLog,
	useClearDebugLog,
	useDownloadDebugLog,
	formatFileInfo,
	debugLogApi,
	DebugRow,
	DebugLogSearchParams,
	DebugLogData
} from '@/services/debug-log-services';



const debugLog = () => {
	// Use React Router's useSearchParams for hash-based routing
	const [searchParams] = useSearchParams();

	// Auto refresh state
	const [isAutoRefresh, setIsAutoRefresh] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// React Query hooks
	const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useDebugLogStatus();
	const toggleMutation = useToggleDebugLog();
	const clearMutation = useClearDebugLog();
	const downloadMutation = useDownloadDebugLog();

	// Derived state
	const debugStatus = statusData?.enabled || false;
	const logFileInfo = statusData ? formatFileInfo(statusData) : {
		size: '0 KB',
		lastModified: 'Never',
		exists: false
	};
	const isLoading = statusLoading || toggleMutation.isPending || clearMutation.isPending;

	// Auto refresh effect
	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (isAutoRefresh) {
			interval = setInterval(() => {
				// Refresh both status and log content
				// refetchStatus();
				setRefreshTrigger(prev => prev + 1); // Trigger log content refresh
			}, 5000); // Refresh every 5 seconds
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isAutoRefresh]);

	// Handler functions
	const handleToggleDebugLog = (enable: boolean) => {
		toggleMutation.mutate(enable);
	};

	const handleRefreshLog = () => {
		refetchStatus();
		setRefreshTrigger(prev => prev + 1); // Trigger log content refresh
		toast.success(__('Debug log status and content refreshed', 'versatile-toolkit'));
	};

	const handleDownloadLog = () => {
		if (!logFileInfo.exists) {
			toast.error(__('No log file to download', 'versatile-toolkit'));
			return;
		}
		debugLogApi.downloadLog();
	};

	const handleClearLog = () => {
		if (!logFileInfo.exists) {
			toast.error(__('No log file to clear', 'versatile-toolkit'));
			return;
		}

		if (window.confirm(__('Are you sure you want to clear the debug log? This action cannot be undone.', 'versatile-toolkit'))) {
			clearMutation.mutate(undefined, {
				onSuccess: () => {
					refetchStatus();
					setRefreshTrigger(prev => prev + 1);
				}
			});
		}
	};

	const handleStopAutoRefresh = () => {
		setIsAutoRefresh(false);
		toast.success(__('Auto refresh stopped', 'versatile-toolkit'));
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
					{/* Debug Logging Status */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="space-y-3 relative">
							{!statusLoading ? (
								<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
									<div className="flex items-center space-x-3">
										<div className={`w-3 h-3 rounded-full ${debugStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
										<div>
											<div className='flex gap-2'>
												<h3 className="font-medium text-slate-800">{__('Debug Logging Status', 'versatile-toolkit')}</h3>
												<span className={`px-3 py-1 rounded-full text-xs font-medium ${debugStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
													}`}>
													{debugStatus ? __('Enabled', 'versatile-toolkit') : __('Disabled', 'versatile-toolkit')}
												</span>
											</div>
											<p className="text-sm text-slate-600">
												{debugStatus ? __('Debug logging is currently enabled', 'versatile-toolkit') : __('Debug logging is currently disabled', 'versatile-toolkit')}
											</p>
										</div>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={debugStatus}
											onClick={(e: React.MouseEvent<HTMLInputElement>) => handleToggleDebugLog((e.target as HTMLInputElement).checked)}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
							) : (
								<div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border animate-pulse">
									<div className="flex items-center space-x-3">
										<div className="w-3 h-3 rounded-full bg-slate-300 animate-pulse"></div>
										<div className="space-y-2">
											<div className="flex gap-2 items-center">
												<div className="h-4 bg-slate-300 rounded w-32 animate-pulse"></div>
												<div className="h-6 bg-slate-300 rounded-full w-16 animate-pulse"></div>
											</div>
											<div className="h-3 bg-slate-300 rounded w-48 animate-pulse"></div>
										</div>
									</div>
									<div className="w-11 h-6 bg-slate-300 rounded-full animate-pulse"></div>
								</div>
							)}

							{/* Auto Refresh Toggle */}
							{!isLoading ? (
								<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
									<div className="flex items-center space-x-2">
										<svg className={`w-4 h-4 text-blue-600 ${isAutoRefresh ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
										</svg>
										<span className="text-sm font-medium text-blue-800">
											{__('Auto Refresh', 'versatile-toolkit')}
											{isAutoRefresh && <span className="ml-1 text-xs">({__('Active', 'versatile-toolkit')})</span>}
										</span>
									</div>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={isAutoRefresh}
											onChange={(e) => {
												setIsAutoRefresh(e.target.checked);
												if (!e.target.checked) {
													handleStopAutoRefresh();
												}
											}}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
									</label>
								</div>
							) : (
								<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
									<div className="flex items-center space-x-2">
										<div className="w-4 h-4 bg-blue-300 rounded animate-pulse"></div>
										<div className="flex items-center space-x-1">
											<div className="h-4 bg-blue-300 rounded w-20 animate-pulse"></div>
											<div className="h-3 bg-blue-300 rounded w-12 animate-pulse"></div>
										</div>
									</div>
									<div className="w-11 h-6 bg-blue-300 rounded-full animate-pulse"></div>
								</div>
							)}

						</div>

						{/* Log File Information */}
						<div className="space-y-3 h-[140px]">
							{isLoading ? (
								<div className="p-4 bg-slate-50 rounded-lg border">
									<div className="h-9 bg-slate-200 rounded animate-pulse mb-3"></div>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
											<div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
										</div>
										<div className="flex justify-between items-center">
											<div className="h-4 bg-slate-200 rounded animate-pulse w-16"></div>
											<div className="h-4 bg-slate-200 rounded animate-pulse w-12"></div>
										</div>
										<div className="flex justify-between items-center">
											<div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
											<div className="h-4 bg-slate-200 rounded animate-pulse w-32"></div>
										</div>
									</div>
								</div>
							) : (
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
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="my-8">
				<div className=' bg-white rounded-lg border p-2 flex items-center justify-between'>
					<h3 className="font-medium text-slate-800 text-lg">{__('Debug Log', 'versatile-toolkit')}</h3>
					<div className="flex flex-wrap items-center gap-3">
						<button
							onClick={handleRefreshLog}
							disabled={isLoading}
							className="flex items-center justify-center space-x-3 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							<span className="text-xs">{__('Refresh Log', 'versatile-toolkit')}</span>
						</button>

						<button
							onClick={handleDownloadLog}
							disabled={!logFileInfo.exists || isLoading}
							className="flex items-center justify-center space-x-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<span className="text-xs">{__('Download Log', 'versatile-toolkit')}</span>
						</button>

						<button
							onClick={handleClearLog}
							disabled={!logFileInfo.exists || isLoading}
							className="flex items-center justify-center space-x-2 px-2 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							<span className="text-xs">{__('Clear Log', 'versatile-toolkit')}</span>
						</button>
					</div>
				</div>
				<ServerDataTable<DebugRow, TFetchDataPromise<DebugRow>, typeof searchParams>
					key={refreshTrigger} // Force re-render when refreshTrigger changes
					columns={columns}
					fetchData={debugLogApi.loadLogContent}
					searchParams={searchParams}
				/>
			</div>
		</div>
	);
}

export default debugLog;
import { useSearchParams } from 'react-router-dom';
import { ServerDataTable, Column, TFetchDataPromise } from '@/pages/troubleshoot/debugLog/data-table';
import { ViewLog } from '@/pages/troubleshoot/debugLog/view-log';
import DebugLogSettings from '@/pages/troubleshoot/debugLog/debug-log-settings';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import {
	useDebugLogStatus,
	useToggleDebugLog,
	useClearDebugLog,
	formatFileInfo,
	debugLogApi,
	DebugRow
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

	const handleToggleAutoRefresh = (enable: boolean) => {
		setIsAutoRefresh(enable);
	};

	const columns = [
		{ key: "id", header: "No" },
		{ key: "type", header: "Type" },
		{
			key: "message", header: "Message",
			render: (row, value?: string) => {
				return <>{row['raw_line'].substring(0, 200)}...</>;
			}
		},
		// { key: "severity", header: "Severity" },
		{
			key: "timestamp", header: "Timestamp",
			render: (row) => {
				const timestamp = row['timestamp'];
				if (!timestamp) return 'Invalid Date';

				try {
					// Parse the format "18-Aug-2025 20:01:25 UTC"
					// Convert to ISO format for proper parsing
					const cleanTimestamp = timestamp.replace(' UTC', '');
					const date = new Date(cleanTimestamp + ' UTC');
					// Convert to local time and format
					return date.toLocaleString();
				} catch (error) {
					console.error('Error parsing timestamp:', timestamp, error);
					return 'Invalid Date';
				}
			}
		},
		{
			key: 'actions', header: 'Actions',
			render: (row, key) => <ViewLog row={row} key={key} />
		}
	] as Column<DebugRow>[];

	return (
		<div className="mx-auto max-w-6xl p-6">
			<div className='bg-white p-6 rounded-lg border border-slate-200 mt-3'>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className={`w-3 h-3 rounded-full ${debugStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
						<div>
							<h3 className="font-medium text-slate-800">{__('Debug Logging', 'versatile-toolkit')}</h3>
							<p className="text-sm text-slate-600">
								{debugStatus ? __('Currently enabled', 'versatile-toolkit') : __('Currently disabled', 'versatile-toolkit')}
								{isAutoRefresh && <span className="ml-2 text-blue-600">• {__('Auto refresh active', 'versatile-toolkit')}</span>}
							</p>
						</div>
					</div>
					<Sheet>
						<SheetTrigger asChild>
							<button className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								<span className="text-sm">{__('Settings', 'versatile-toolkit')}</span>
							</button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>{__('Debug Log Settings', 'versatile-toolkit')}</SheetTitle>
							</SheetHeader>
							<div className="mt-6">
								<DebugLogSettings
									debugStatus={debugStatus}
									logFileInfo={logFileInfo}
									isAutoRefresh={isAutoRefresh}
									isLoading={isLoading}
									statusLoading={statusLoading}
									onToggleDebugLog={handleToggleDebugLog}
									onToggleAutoRefresh={handleToggleAutoRefresh}
									onStopAutoRefresh={handleStopAutoRefresh}
								/>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
			<div className="my-8">
				<div className=' bg-white rounded-lg border p-2 flex items-center justify-between'>
					<h3 className="font-medium text-slate-800 text-lg">{__('Debug Log', 'versatile-toolkit')}</h3>
					<div className="flex flex-wrap items-center gap-3">
						<button
							title={__('Refresh Log', 'versatile-toolkit')}
							onClick={handleRefreshLog}
							disabled={isLoading}
							className="flex items-center justify-center space-x-3 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							{/* <span className="text-xs">{__('Refresh Log', 'versatile-toolkit')}</span> */}
						</button>

						<button
							title={__('Download Log', 'versatile-toolkit')}
							onClick={handleDownloadLog}
							disabled={!logFileInfo.exists || isLoading}
							className="flex items-center justify-center space-x-2 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							{/* <span className="text-xs">{__('Download Log', 'versatile-toolkit')}</span> */}
						</button>

						<button
							title={__('Clear Log', 'versatile-toolkit')}
							onClick={handleClearLog}
							disabled={!logFileInfo.exists || isLoading}
							className="flex items-center justify-center space-x-2 px-2 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							{/* <span className="text-xs">{__('Clear Log', 'versatile-toolkit')}</span> */}
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
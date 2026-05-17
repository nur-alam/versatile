import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Column, ServerDataTable, TFetchDataPromise } from '@/pages/troubleshoot/debugLog/data-table';
import DebugLogSettings from '@/pages/troubleshoot/debugLog/debug-log-settings';
import { ViewLog } from '@/pages/troubleshoot/debugLog/view-log';
import {
	debugLogApi,
	DebugRow,
	DebugLogSearchParams,
	formatFileInfo,
	useClearDebugLog,
	useDebugLogStatus,
	useToggleDebugLog,
} from '@/services/debug-log-services';
import { useGetPluginList, useGetThemeList } from '@/services/versatile-services';
import { LogTypeDisplay } from '@/utils/log-type-utils';
import { __ } from '@wordpress/i18n';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

type LogSourceListItem = {
	slug: string;
	label: string;
};

type LogSourceOption = {
	value: string;
	label: string;
	group: 'general' | 'plugin' | 'theme';
};

const normalizePluginSourceSlug = (pluginSlug: string) => {
	const [rootSegment = pluginSlug] = pluginSlug.split('/');
	return rootSegment.replace(/\.php$/i, '').toLowerCase();
};

const formatSourceType = (sourceType?: string) => {
	switch (sourceType) {
		case 'plugin':
			return __('Plugin', 'versatile-toolkit');
		case 'theme':
			return __('Theme', 'versatile-toolkit');
		case 'mu-plugin':
			return __('MU Plugin', 'versatile-toolkit');
		case 'wordpress-core':
			return __('WordPress Core', 'versatile-toolkit');
		default:
			return __('Unknown', 'versatile-toolkit');
	}
};

const debugLog = () => {
	// Use React Router's useSearchParams for hash-based routing
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	// Auto refresh state
	const [isAutoRefresh, setIsAutoRefresh] = useState(false);
	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [selectedSource, setSelectedSource] = useState('all');
	const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);

	// React Query hooks
	const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useDebugLogStatus();
	const toggleMutation = useToggleDebugLog();
	const clearMutation = useClearDebugLog();
	const { data: pluginListData } = useGetPluginList();
	const { data: themeListData } = useGetThemeList();

	// Derived state
	const debugStatus = statusData?.enabled || false;
	const logFileInfo = statusData
		? formatFileInfo(statusData)
		: {
				size: '0 KB',
				lastModified: 'Never',
				exists: false,
			};
	const isLoading = statusLoading || toggleMutation.isPending || clearMutation.isPending;

	// Auto refresh effect
	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (isAutoRefresh) {
			interval = setInterval(() => {
				// Refresh both status and log content
				// refetchStatus();
				setRefreshTrigger((prev) => prev + 1); // Trigger log content refresh
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
		setRefreshTrigger((prev) => prev + 1); // Trigger log content refresh
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

		if (
			window.confirm(
				__('Are you sure you want to clear the debug log? This action cannot be undone.', 'versatile-toolkit'),
			)
		) {
			clearMutation.mutate(undefined, {
				onSuccess: () => {
					refetchStatus();
					setRefreshTrigger((prev) => prev + 1);
				},
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

	const handleSourceFilterChange = (sourceValue: string) => {
		setSelectedSource(sourceValue);
		setIsSourceFilterOpen(false);

		const nextParams = new URLSearchParams(searchParams);
		nextParams.set('paged', '1');

		navigate({
			pathname: '/troubleshoot/debug-log',
			search: `?${nextParams.toString()}`,
		});
	};

	const { generalOptions, pluginOptions, themeOptions } = useMemo(() => {
		const pluginMap = new Map<string, string>();
		const themeMap = new Map<string, string>();

		((pluginListData?.data as LogSourceListItem[] | undefined) ?? []).forEach((plugin) => {
			pluginMap.set(`plugin:${normalizePluginSourceSlug(plugin.slug)}`, plugin.label);
		});

		((themeListData?.data as LogSourceListItem[] | undefined) ?? []).forEach((theme) => {
			themeMap.set(`theme:${theme.slug.toLowerCase()}`, theme.label);
		});

		return {
			generalOptions: [
				{ value: 'all', label: __('All Sources', 'versatile-toolkit'), group: 'general' as const },
				{
					value: 'wordpress-core',
					label: __('WordPress Core', 'versatile-toolkit'),
					group: 'general' as const,
				},
				{ value: 'unknown', label: __('Unknown', 'versatile-toolkit'), group: 'general' as const },
			],
			pluginOptions: Array.from(pluginMap.entries()).map(
				([value, label]) => ({ value, label, group: 'plugin' as const }) satisfies LogSourceOption,
			),
			themeOptions: Array.from(themeMap.entries()).map(
				([value, label]) => ({ value, label, group: 'theme' as const }) satisfies LogSourceOption,
			),
		};
	}, [pluginListData, themeListData]);

	const selectedSourceOption = useMemo(
		() => [...generalOptions, ...pluginOptions, ...themeOptions].find((option) => option.value === selectedSource),
		[generalOptions, pluginOptions, selectedSource, themeOptions],
	);

	const fetchLogContent = useCallback(
		(params: DebugLogSearchParams) => debugLogApi.loadLogContent({ ...params, source: selectedSource }),
		[selectedSource],
	);

	const columns = [
		{ key: 'id', header: 'No' },
		{
			key: 'type',
			header: 'Type',
			render: (row) => {
				return <LogTypeDisplay type={row['type']} />;
			},
		},
		{
			key: 'message',
			header: 'Description',
			render: (row) => {
				const messagePreview =
					row['raw_line'].length > 200 ? `${row['raw_line'].substring(0, 200)}...` : row['raw_line'];
				return <>{messagePreview}</>;
			},
		},
		{
			key: 'log_from',
			header: 'Log From',
			render: (row) => {
				return (
					<div className="vt-min-w-[11rem]">
						<Badge variant="success" className="vt-font-medium">
							{row['log_from'] || __('Unknown', 'versatile-toolkit')}
						</Badge>
						{/* <div className="vt-text-xs vt-text-slate-500">{formatSourceType(row['source_type'])}</div> */}
					</div>
				);
			},
		},
		// { key: "severity", header: "Severity" },
		{
			key: 'timestamp',
			header: 'Timestamp',
			render: (row) => {
				const timestamp = row['timestamp'];
				if (!timestamp) return 'Invalid Date';

				try {
					// Parse the format "18-Aug-2025 20:01:25 UTC"
					// Convert to ISO format for proper parsing
					const cleanTimestamp = timestamp.replace(' UTC', '');
					const date = new Date(cleanTimestamp + ' UTC');
					// Convert to local time and format
					return date.toLocaleString(undefined, { hour12: true });
				} catch (error) {
					console.error('Error parsing timestamp:', timestamp, error);
					return 'Invalid Date';
				}
			},
		},
		{
			key: 'actions',
			header: 'Actions',
			render: (row, key) => <ViewLog row={row} key={key} />,
		},
	] as Column<DebugRow>[];

	return (
		<div className="vt-mx-auto vt-max-w-6xl vt-p-6">
			{statusLoading ? (
				<div className="vt-bg-white vt-p-6 vt-rounded-lg vt-border vt-border-slate-200 vt-mt-3">
					<div className="vt-flex vt-items-center vt-justify-between vt-animate-pulse">
						<div className="vt-flex vt-items-center vt-space-x-4">
							<div className="vt-w-3 vt-h-3 vt-rounded-full vt-bg-slate-300"></div>
							<div>
								<div className="vt-h-5 vt-bg-slate-300 vt-rounded vt-w-32 vt-mb-2"></div>
								<div className="vt-h-3 vt-bg-slate-200 vt-rounded vt-w-24"></div>
							</div>
						</div>
						<div className="vt-h-9 vt-bg-slate-300 vt-rounded-lg vt-w-20"></div>
					</div>
				</div>
			) : (
				<div className="vt-bg-white vt-p-6 vt-rounded-lg vt-border vt-border-slate-200 vt-mt-3">
					<div className="vt-flex vt-items-center vt-justify-between">
						<div className="vt-flex vt-items-center vt-space-x-4">
							<div
								className={`vt-w-3 vt-h-3 vt-rounded-full ${debugStatus ? 'vt-bg-green-500' : 'vt-bg-red-500'}`}
							></div>
							<div>
								<h3 className="vt-font-medium vt-text-slate-800">
									{__('Debug Logging', 'versatile-toolkit')}
								</h3>
								<p className="vt-text-sm vt-text-slate-600">
									{debugStatus
										? __('Currently enabled', 'versatile-toolkit')
										: __('Currently disabled', 'versatile-toolkit')}
									{isAutoRefresh && (
										<span className="vt-ml-2 vt-text-blue-600">
											• {__('Auto refresh active', 'versatile-toolkit')}
										</span>
									)}
								</p>
							</div>
						</div>
						<Sheet>
							<SheetTrigger asChild>
								<button className="vt-flex vt-items-center vt-space-x-2 vt-px-3 vt-py-2 vt-bg-slate-100 vt-text-slate-700 vt-rounded-lg hover:vt-bg-slate-200 vt-transition-colors">
									<svg
										className="vt-w-4 vt-h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span className="vt-text-sm">{__('Settings', 'versatile-toolkit')}</span>
								</button>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>{__('Debug Log Settings', 'versatile-toolkit')}</SheetTitle>
								</SheetHeader>
								<div className="vt-mt-6">
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
			)}
			<div className="vt-my-8">
				<div className=" vt-bg-white vt-rounded-lg vt-border vt-p-2 vt-flex vt-items-center vt-justify-between">
					<h3 className="vt-font-medium vt-text-slate-800 vt-text-lg">
						{__('Debug Log', 'versatile-toolkit')}
					</h3>
					<div className="vt-flex vt-flex-wrap vt-items-center vt-gap-3">
						<Popover open={isSourceFilterOpen} onOpenChange={setIsSourceFilterOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={isSourceFilterOpen}
									aria-label={__('Filter debug logs by source', 'versatile-toolkit')}
									className="vt-min-w-[12rem] vt-max-w-[20rem] vt-justify-between vt-gap-2 vt-bg-white vt-font-normal"
								>
									<span className="vt-truncate">
										{selectedSourceOption?.label || __('Select source...', 'versatile-toolkit')}
									</span>
									<ChevronsUpDown className="vt-h-4 vt-w-4 vt-shrink-0 vt-opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="vt-w-[20rem] vt-p-0" align="start">
								<Command>
									<CommandInput placeholder={__('Search source...', 'versatile-toolkit')} />
									<CommandList>
										<CommandEmpty>{__('No source found.', 'versatile-toolkit')}</CommandEmpty>
										<CommandGroup>
											{generalOptions.map((option) => (
												<CommandItem
													key={option.value}
													value={option.label}
													onSelect={() => handleSourceFilterChange(option.value)}
												>
													<Check
														className={cn(
															'vt-mr-2 vt-h-4 vt-w-4',
															selectedSource === option.value ? 'vt-opacity-100' : 'vt-opacity-0',
														)}
													/>
													{option.label}
												</CommandItem>
											))}
										</CommandGroup>
										{pluginOptions.length > 0 && (
											<CommandGroup heading={__('Plugins', 'versatile-toolkit')}>
												{pluginOptions.map((option) => (
													<CommandItem
														key={option.value}
														value={option.label}
														onSelect={() => handleSourceFilterChange(option.value)}
													>
														<Check
															className={cn(
																'vt-mr-2 vt-h-4 vt-w-4',
																selectedSource === option.value
																	? 'vt-opacity-100'
																	: 'vt-opacity-0',
															)}
														/>
														{option.label}
													</CommandItem>
												))}
											</CommandGroup>
										)}
										{themeOptions.length > 0 && (
											<CommandGroup heading={__('Themes', 'versatile-toolkit')}>
												{themeOptions.map((option) => (
													<CommandItem
														key={option.value}
														value={option.label}
														onSelect={() => handleSourceFilterChange(option.value)}
													>
														<Check
															className={cn(
																'vt-mr-2 vt-h-4 vt-w-4',
																selectedSource === option.value
																	? 'vt-opacity-100'
																	: 'vt-opacity-0',
															)}
														/>
														{option.label}
													</CommandItem>
												))}
											</CommandGroup>
										)}
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
						<button
							title={__('Refresh Log', 'versatile-toolkit')}
							onClick={handleRefreshLog}
							disabled={isLoading}
							className="vt-flex vt-items-center vt-justify-center vt-space-x-3 vt-px-2 vt-py-1 vt-bg-blue-500 vt-text-white vt-rounded-lg hover:vt-bg-blue-700 disabled:vt-bg-slate-300 disabled:vt-cursor-not-allowed vt-transition-colors"
						>
							<svg className="vt-w-4 vt-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							{/* <span className="vt-text-xs">{__('Refresh Log', 'versatile-toolkit')}</span> */}
						</button>

						<button
							title={__('Download Log', 'versatile-toolkit')}
							onClick={handleDownloadLog}
							disabled={!logFileInfo.exists || isLoading}
							className="vt-flex vt-items-center vt-justify-center vt-space-x-2 vt-px-2 vt-py-1 vt-bg-green-600 vt-text-white vt-rounded-lg hover:vt-bg-green-700 disabled:vt-bg-slate-300 disabled:vt-cursor-not-allowed vt-transition-colors"
						>
							<svg className="vt-w-4 vt-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							{/* <span className="vt-text-xs">{__('Download Log', 'versatile-toolkit')}</span> */}
						</button>

						<button
							title={__('Clear Log', 'versatile-toolkit')}
							onClick={handleClearLog}
							disabled={!logFileInfo.exists || isLoading}
							className="vt-flex vt-items-center vt-justify-center vt-space-x-2 vt-px-2 vt-py-1 vt-bg-yellow-600 vt-text-white vt-rounded-lg hover:vt-bg-yellow-700 disabled:vt-bg-slate-300 disabled:vt-cursor-not-allowed vt-transition-colors"
						>
							<svg className="vt-w-4 vt-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							{/* <span className="vt-text-xs">{__('Clear Log', 'versatile-toolkit')}</span> */}
						</button>
					</div>
				</div>
				<ServerDataTable<DebugRow, TFetchDataPromise<DebugRow>, typeof searchParams>
					key={`${refreshTrigger}-${selectedSource}`} // Force re-render when refreshTrigger or source filter changes
					columns={columns}
					fetchData={fetchLogContent}
					searchParams={searchParams}
				/>
			</div>
		</div>
	);
};

export default debugLog;

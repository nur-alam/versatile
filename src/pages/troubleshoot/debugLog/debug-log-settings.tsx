import { __ } from '@wordpress/i18n';

interface DebugLogSettingsProps {
	debugStatus: boolean;
	logFileInfo: {
		size: string;
		lastModified: string;
		exists: boolean;
	};
	isAutoRefresh: boolean;
	isLoading: boolean;
	statusLoading: boolean;
	onToggleDebugLog: (enable: boolean) => void;
	onToggleAutoRefresh: (enable: boolean) => void;
	onStopAutoRefresh: () => void;
}

const DebugLogSettings = ({
	debugStatus,
	logFileInfo,
	isAutoRefresh,
	isLoading,
	statusLoading,
	onToggleDebugLog,
	onToggleAutoRefresh,
	onStopAutoRefresh
}: DebugLogSettingsProps) => {
	return (
		<div className="space-y-6">
			{/* Debug Logging Status */}
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
								onClick={(e: React.MouseEvent<HTMLInputElement>) => onToggleDebugLog((e.target as HTMLInputElement).checked)}
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
									onToggleAutoRefresh(e.target.checked);
									if (!e.target.checked) {
										onStopAutoRefresh();
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
			<div className="space-y-3">
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
	);
};

export default DebugLogSettings;

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
	onStopAutoRefresh,
}: DebugLogSettingsProps) => {
	return (
		<div className="vt-space-y-6">
			{/* Debug Logging Status */}
			<div className="vt-space-y-3 vt-relative">
				{!statusLoading ? (
					<div className="vt-flex vt-items-center vt-justify-between vt-p-3 vt-bg-slate-50 vt-rounded-lg vt-border">
						<div className="vt-flex vt-items-center vt-space-x-3">
							<div
								className={`vt-w-3 vt-h-3 vt-rounded-full ${debugStatus ? 'vt-bg-green-500' : 'vt-bg-red-500'}`}
							></div>
							<div>
								<div className="vt-flex vt-gap-2">
									<h3 className="vt-font-medium vt-text-slate-800">
										{__('Debug Logging Status', 'versatile-toolkit')}
									</h3>
									<span
										className={`vt-px-3 vt-py-1 vt-rounded-full vt-text-xs vt-font-medium ${
											debugStatus
												? 'vt-bg-green-100 vt-text-green-800'
												: 'vt-bg-red-100 vt-text-red-800'
										}`}
									>
										{debugStatus
											? __('Enabled', 'versatile-toolkit')
											: __('Disabled', 'versatile-toolkit')}
									</span>
								</div>
								<p className="vt-text-sm vt-text-slate-600">
									{debugStatus
										? __('Debug logging is currently enabled', 'versatile-toolkit')
										: __('Debug logging is currently disabled', 'versatile-toolkit')}
								</p>
							</div>
						</div>
						<label className="vt-relative vt-inline-flex vt-items-center vt-cursor-pointer">
							<input
								type="checkbox"
								checked={debugStatus}
								onClick={(e: React.MouseEvent<HTMLInputElement>) =>
									onToggleDebugLog((e.target as HTMLInputElement).checked)
								}
								className="vt-sr-only vt-peer"
							/>
							<div className="vt-w-11 vt-h-6 vt-bg-slate-300 peer-focus:vt-outline-none vt-rounded-full vt-peer peer-checked:after:vt-translate-x-full peer-checked:after:vt-border-white after:vt-content-[''] after:vt-absolute after:vt-top-[2px] after:vt-left-[2px] after:vt-bg-white after:vt-border-slate-300 after:vt-border after:vt-rounded-full after:vt-h-5 after:vt-w-5 after:vt-transition-all peer-checked:vt-bg-blue-600"></div>
						</label>
					</div>
				) : (
					<div className="vt-flex vt-items-center vt-justify-between vt-p-4 vt-bg-slate-50 vt-rounded-lg vt-border vt-animate-pulse">
						<div className="vt-flex vt-items-center vt-space-x-3">
							<div className="vt-w-3 vt-h-3 vt-rounded-full vt-bg-slate-300 vt-animate-pulse"></div>
							<div className="vt-space-y-2">
								<div className="vt-flex vt-gap-2 vt-items-center">
									<div className="vt-h-4 vt-bg-slate-300 vt-rounded vt-w-32 vt-animate-pulse"></div>
									<div className="vt-h-6 vt-bg-slate-300 vt-rounded-full vt-w-16 vt-animate-pulse"></div>
								</div>
								<div className="vt-h-3 vt-bg-slate-300 vt-rounded vt-w-48 vt-animate-pulse"></div>
							</div>
						</div>
						<div className="vt-w-11 vt-h-6 vt-bg-slate-300 vt-rounded-full vt-animate-pulse"></div>
					</div>
				)}

				{/* Auto Refresh Toggle */}
				{!isLoading ? (
					<div className="vt-flex vt-items-center vt-justify-between vt-p-3 vt-bg-blue-50 vt-rounded-lg vt-border vt-border-blue-200">
						<div className="vt-flex vt-items-center vt-space-x-2">
							<svg
								className={`vt-w-4 vt-h-4 vt-text-blue-600 ${isAutoRefresh ? 'vt-animate-spin' : ''}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							<span className="vt-text-sm vt-font-medium vt-text-blue-800">
								{__('Auto Refresh', 'versatile-toolkit')}
								{isAutoRefresh && (
									<span className="vt-ml-1 vt-text-xs">({__('Active', 'versatile-toolkit')})</span>
								)}
							</span>
						</div>
						<label className="vt-relative vt-inline-flex vt-items-center vt-cursor-pointer">
							<input
								type="checkbox"
								checked={isAutoRefresh}
								onChange={(e) => {
									onToggleAutoRefresh(e.target.checked);
									if (!e.target.checked) {
										onStopAutoRefresh();
									}
								}}
								className="vt-sr-only vt-peer"
							/>
							<div className="vt-w-11 vt-h-6 vt-bg-slate-300 peer-focus:vt-outline-none vt-rounded-full vt-peer peer-checked:after:vt-translate-x-full peer-checked:after:vt-border-white after:vt-content-[''] after:vt-absolute after:vt-top-[2px] after:vt-left-[2px] after:vt-bg-white after:vt-border-slate-300 after:vt-border after:vt-rounded-full after:vt-h-5 after:vt-w-5 after:vt-transition-all peer-checked:vt-bg-blue-600"></div>
						</label>
					</div>
				) : (
					<div className="vt-flex vt-items-center vt-justify-between vt-p-3 vt-bg-blue-50 vt-rounded-lg vt-border vt-border-blue-200 vt-animate-pulse">
						<div className="vt-flex vt-items-center vt-space-x-2">
							<div className="vt-w-4 vt-h-4 vt-bg-blue-300 vt-rounded vt-animate-pulse"></div>
							<div className="vt-flex vt-items-center vt-space-x-1">
								<div className="vt-h-4 vt-bg-blue-300 vt-rounded vt-w-20 vt-animate-pulse"></div>
								<div className="vt-h-3 vt-bg-blue-300 vt-rounded vt-w-12 vt-animate-pulse"></div>
							</div>
						</div>
						<div className="vt-w-11 vt-h-6 vt-bg-blue-300 vt-rounded-full vt-animate-pulse"></div>
					</div>
				)}
			</div>

			{/* Log File Information */}
			<div className="vt-space-y-3">
				{isLoading ? (
					<div className="vt-p-3 vt-bg-slate-50 vt-rounded-lg vt-border">
						<div className="vt-h-9 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-mb-3"></div>
						<div className="vt-space-y-2">
							<div className="vt-flex vt-justify-between vt-items-center">
								<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-w-20"></div>
								<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-w-16"></div>
							</div>
							<div className="vt-flex vt-justify-between vt-items-center">
								<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-w-16"></div>
								<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-w-12"></div>
							</div>
							<div className="vt-flex vt-justify-between vt-items-center">
								<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-w-24"></div>
								<div className="vt-h-4 vt-bg-slate-200 vt-rounded vt-animate-pulse vt-w-32"></div>
							</div>
						</div>
					</div>
				) : (
					<div className="vt-p-4 vt-bg-slate-50 vt-rounded-lg vt-border">
						<h3 className="vt-font-medium vt-text-slate-800 vt-mb-3">
							{__('Log File Information', 'versatile-toolkit')}
						</h3>
						<div className="vt-space-y-2">
							<div className="vt-flex vt-justify-between vt-items-center">
								<span className="vt-text-sm vt-text-slate-600">
									{__('File Status:', 'versatile-toolkit')}
								</span>
								<span
									className={`vt-text-sm vt-font-medium ${logFileInfo.exists ? 'vt-text-green-600' : 'vt-text-red-600'}`}
								>
									{logFileInfo.exists
										? __('Exists', 'versatile-toolkit')
										: __('Not Found', 'versatile-toolkit')}
								</span>
							</div>
							<div className="vt-flex vt-justify-between vt-items-center">
								<span className="vt-text-sm vt-text-slate-600">
									{__('File Size:', 'versatile-toolkit')}
								</span>
								<span className="vt-text-sm vt-font-medium vt-text-slate-800">{logFileInfo.size}</span>
							</div>
							<div className="vt-flex vt-justify-between vt-items-center">
								<span className="vt-text-sm vt-text-slate-600">
									{__('Last Modified:', 'versatile-toolkit')}
								</span>
								<span className="vt-text-sm vt-font-medium vt-text-slate-800">
									{logFileInfo.lastModified}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DebugLogSettings;

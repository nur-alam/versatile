import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
	getQuickactPlugins,
	QuickactPluginItem,
	useQuickactServices,
} from '@/entries/quickact/services/quickact-services';
import { useDebouncedValue } from '@/entries/quickact/useDebouncedValue';
import { __ } from '@wordpress/i18n';
import { EllipsisVertical, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PluginsSection = () => {
	const [plugins, setPlugins] = useState<QuickactPluginItem[]>([]);
	const [isPluginsLoading, setIsPluginsLoading] = useState(false);
	const [pendingPluginFile, setPendingPluginFile] = useState<string | null>(null);
	const [pendingPluginDelete, setPendingPluginDelete] = useState<string | null>(null);
	const [pluginSearch, setPluginSearch] = useState('');
	const debouncedPluginSearch = useDebouncedValue(pluginSearch, 300);
	const { mutateAsync, isPending } = useQuickactServices();

	const loadPlugins = useCallback(async () => {
		setIsPluginsLoading(true);
		try {
			const list = await getQuickactPlugins();
			setPlugins(list);
		} finally {
			setIsPluginsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadPlugins();
	}, [loadPlugins]);

	const handlePluginToggle = async (pluginFile: string, shouldActivate: boolean) => {
		setPendingPluginFile(pluginFile);
		try {
			await mutateAsync({
				action: shouldActivate ? 'versatile_quickact_plugin_activate' : 'versatile_quickact_plugin_deactivate',
				plugin_file: pluginFile,
			});
			setPlugins((prevPlugins) =>
				prevPlugins.map((plugin) =>
					plugin.file === pluginFile ? { ...plugin, is_active: shouldActivate } : plugin,
				),
			);
		} finally {
			setPendingPluginFile(null);
		}
	};

	const handlePluginDelete = async (pluginFile: string) => {
		if (!window.confirm(__('Are you sure you want to delete this plugin?', 'versatile-toolkit'))) {
			return;
		}
		setPendingPluginDelete(pluginFile);
		try {
			await mutateAsync({
				action: 'versatile_quickact_plugin_delete',
				plugin_file: pluginFile,
			});
			setPlugins((prevPlugins) => prevPlugins.filter((plugin) => plugin.file !== pluginFile));
		} finally {
			setPendingPluginDelete(null);
		}
	};

	const filteredPlugins = useMemo(() => {
		const q = debouncedPluginSearch.trim().toLowerCase();
		if (!q) {
			return plugins;
		}
		return plugins.filter((plugin) => {
			const haystack = `${plugin.name} ${plugin.file} ${plugin.version || ''}`.toLowerCase();
			return haystack.includes(q);
		});
	}, [plugins, debouncedPluginSearch]);

	return (
		<div className="vt-quickact-section">
			<div className="vt-quickact-section-head">
				<div className="vt-quickact-section-title">{__('Plugin List', 'versatile-toolkit')}</div>
				<div className="vt-max-w-max vt-relative">
					<Search className="vt-absolute vt-left-3 vt-top-1/2 vt-transform -vt-translate-y-1/2 vt-text-gray-400 vt-w-4 vt-h-4" />
					<Input
						type="search"
						value={pluginSearch}
						className="vt-w-max vt-pl-8 vt-h-5"
						onChange={(e) => setPluginSearch(e.target.value)}
						placeholder={__('Search plugins…', 'versatile-toolkit')}
						autoComplete="off"
						aria-label={__('Search plugins', 'versatile-toolkit')}
						disabled={isPluginsLoading}
					/>
				</div>
			</div>
			{isPluginsLoading && (
				<div style={{ minHeight: '300px' }}>{__('Loading plugins...', 'versatile-toolkit')}</div>
			)}
			{!isPluginsLoading && plugins.length === 0 && (
				<div style={{ minHeight: '300px' }}>{__('No plugins found.', 'versatile-toolkit')}</div>
			)}
			{!isPluginsLoading && plugins.length > 0 && filteredPlugins.length === 0 && (
				<div style={{ minHeight: '120px' }}>{__('No plugins match your search.', 'versatile-toolkit')}</div>
			)}
			<div className="vt-quickact-section-list">
				{filteredPlugins.map((plugin) => (
					<div
						key={plugin.file}
						className={`vt-quickact-row ${plugin.is_active ? 'vt-quickact-row-active' : ''}`}
					>
						<div className="vt-quickact-row-body">
							<div className="vt-quickact-row-title">{plugin.name}</div>
							<div className="vt-quickact-row-meta">
								{plugin.file} {plugin.version ? `(${plugin.version})` : ''}
							</div>
						</div>
						<div className="vt-flex vt-gap-1 vt-items-center">
							<Button
								type="button"
								className="vt-w-[60px]"
								size="xs"
								variant="secondary"
								disabled={isPending}
								onClick={() => void handlePluginToggle(plugin.file, !plugin.is_active)}
							>
								<ButtonLoader
									isLoading={pendingPluginFile === plugin.file}
									loadingText="loading"
									size="xs"
								>
									{plugin.is_active
										? __('Deactivate', 'versatile-toolkit')
										: __('Activate', 'versatile-toolkit')}
								</ButtonLoader>
							</Button>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="ghost"
										size="xs"
										className="vt-h-6 vt-w-6 vt-p-0"
										disabled={plugin.is_active}
										onClick={(e) => e.stopPropagation()}
										onPointerDown={(e) => e.stopPropagation()}
									>
										<EllipsisVertical
											className={`vt-h-4 vt-w-4 ${plugin.is_active ? 'vt-text-gray-400' : 'vt-text-gray-700'}`}
										/>
										<span className="vt-sr-only">{__('Open menu', 'versatile-toolkit')}</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="vt-w-max vt-p-1" align="end">
									<div className="vt-flex vt-flex-col vt-gap-1">
										{!plugin.is_active && (
											<Button
												type="button"
												className="vt-justify-start vt-text-destructive hover:vt-text-destructive"
												size="xs"
												variant="ghost"
												disabled={isPending}
												onClick={() => void handlePluginDelete(plugin.file)}
											>
												<ButtonLoader
													isLoading={pendingPluginDelete === plugin.file}
													loadingText="loading"
													size="xs"
												>
													<Trash2 className="vt-mr-2 vt-h-3 vt-w-3" />
													<span>{__('Delete', 'versatile-toolkit')}</span>
												</ButtonLoader>
											</Button>
										)}
										{/* Add more future buttons here */}
									</div>
								</PopoverContent>
							</Popover>
						</div>
						{/* plugin delete button */}
					</div>
				))}
			</div>
		</div>
	);
};

export default PluginsSection;

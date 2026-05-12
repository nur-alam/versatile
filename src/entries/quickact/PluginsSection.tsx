import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	getQuickactPlugins,
	QuickactPluginItem,
	useQuickactServices,
} from '@/entries/quickact/services/quickact-services';
import { useDebouncedValue } from '@/entries/quickact/useDebouncedValue';
import { __ } from '@wordpress/i18n';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const PluginsSection = () => {
	const [plugins, setPlugins] = useState<QuickactPluginItem[]>([]);
	const [isPluginsLoading, setIsPluginsLoading] = useState(false);
	const [pendingPluginFile, setPendingPluginFile] = useState<string | null>(null);
	const [pluginSearch, setPluginSearch] = useState('');
	const debouncedPluginSearch = useDebouncedValue(pluginSearch, 300);
	const { mutateAsync } = useQuickactServices();

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
						type='search'
						value={pluginSearch}
						className="vt-pl-8 vt-h-5"
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
				<div style={{ minHeight: '120px' }}>
					{__('No plugins match your search.', 'versatile-toolkit')}
				</div>
			)}
			<div className='vt-quickact-section-list'>
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
						<Button
							type="button"
							className="vt-w-[60px]"
							size="xs"
							variant="secondary"
							disabled={pendingPluginFile === plugin.file}
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
					</div>
				))}
			</div>
		</div >
	);
};

export default PluginsSection;

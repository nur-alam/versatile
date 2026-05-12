import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import {
	getQuickactPlugins,
	QuickactPluginItem,
	useQuickactServices,
} from '@/entries/quickact/services/quickact-services';
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from 'react';

const PluginsSection = () => {
	const [plugins, setPlugins] = useState<QuickactPluginItem[]>([]);
	const [isPluginsLoading, setIsPluginsLoading] = useState(false);
	const [pendingPluginFile, setPendingPluginFile] = useState<string | null>(null);
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

	return (
		<div className="vt-quickact-section">
			<div className="vt-quickact-section-title">
				<div>
				{__('Plugin List', 'versatile-toolkit')}
				</div>
				<div>
					// plugin search input
				</div>
			</div>
			{isPluginsLoading && (
				<div style={{ minHeight: '300px' }}>{__('Loading plugins...', 'versatile-toolkit')}</div>
			)}
			{!isPluginsLoading && plugins.length === 0 && (
				<div style={{ minHeight: '300px' }}>{__('No plugins found.', 'versatile-toolkit')}</div>
			)}
			{plugins.map((plugin) => (
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
	);
};

export default PluginsSection;

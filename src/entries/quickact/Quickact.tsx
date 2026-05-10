import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import {
	getQuickactPlugins,
	getQuickactThemes,
	QuickactPluginItem,
	QuickactThemeItem,
	useQuickactServices,
} from '@/entries/quickact/services/quickact-services';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from 'react';
import TopActions from './TopActions';

type SidebarSection = 'plugins' | 'themes' | 'settings';

const Quickact = () => {
	const [activeSection, setActiveSection] = useState<SidebarSection>('plugins');
	const [plugins, setPlugins] = useState<QuickactPluginItem[]>([]);
	const [themes, setThemes] = useState<QuickactThemeItem[]>([]);
	const [isPluginsLoading, setIsPluginsLoading] = useState(false);
	const [isThemesLoading, setIsThemesLoading] = useState(false);
	const [pendingPluginFile, setPendingPluginFile] = useState<string | null>(null);
	const [pendingThemeStylesheet, setPendingThemeStylesheet] = useState<string | null>(null);
	const { mutateAsync, isPending } = useQuickactServices();

	const loadPlugins = async () => {
		setIsPluginsLoading(true);
		try {
			const list = await getQuickactPlugins();
			setPlugins(list);
		} finally {
			setIsPluginsLoading(false);
		}
	};

	const loadThemes = async () => {
		setIsThemesLoading(true);
		try {
			const list = await getQuickactThemes();
			setThemes(list);
		} finally {
			setIsThemesLoading(false);
		}
	};

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

	const handleThemeToggle = async (stylesheet: string, shouldActivate: boolean) => {
		setPendingThemeStylesheet(stylesheet);
		try {
			await mutateAsync({
				action: shouldActivate ? 'versatile_quickact_theme_activate' : 'versatile_quickact_theme_deactivate',
				stylesheet,
			});
			setThemes((prevThemes) =>
				prevThemes.map((theme) => {
					if (theme.stylesheet === stylesheet) {
						return { ...theme, is_active: shouldActivate };
					}
					// Only one theme can be active at a time.
					if (shouldActivate) {
						return { ...theme, is_active: false };
					}
					return theme;
				}),
			);
		} finally {
			setPendingThemeStylesheet(null);
		}
	};

	const handlePermalinkReset = async () => {
		await mutateAsync({
			action: 'versatile_reset_permalinks',
		});
	};

	useEffect(() => {
		void loadPlugins();
	}, []);

	useEffect(() => {
		if (activeSection === 'themes' && themes.length === 0) {
			void loadThemes();
		}
	}, [activeSection, themes.length]);

	return (
		<div
			className="vt-quickact-trigger"
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
			}}
			onMouseDown={(event) => {
				event.preventDefault();
				event.stopPropagation();
			}}
		>
			<div>
				{__('Quick Actions', 'versatile-toolkit')}
				<span className="vt-quickact-arrow" aria-hidden="true">
					▼
				</span>
			</div>
			<div className="vt-quickact-menu-wrapper">
				<TopActions />
				<div className="vt-quickact-menu vt-pt-3">
					<div className="vt-quickact-sidebar vt-border-r">
						<button
							type="button"
							className={`vt-quickact-nav-btn${activeSection === 'plugins' ? ' vt-quickact-nav-btn-active' : ''}`}
							onClick={() => setActiveSection('plugins')}
						>
							{__('Plugins', 'versatile-toolkit')}
						</button>
						<button
							type="button"
							className={`vt-quickact-nav-btn${activeSection === 'themes' ? ' vt-quickact-nav-btn-active' : ''}`}
							onClick={() => setActiveSection('themes')}
						>
							{__('Themes', 'versatile-toolkit')}
						</button>
						<button
							type="button"
							className={`vt-quickact-nav-btn${activeSection === 'settings' ? ' vt-quickact-nav-btn-active' : ''}`}
							onClick={() => setActiveSection('settings')}
						>
							{__('Settings', 'versatile-toolkit')}
						</button>
					</div>

					<div className="vt-quickact-content vt-pl-3">
						{activeSection === 'plugins' && (
							<div className="vt-quickact-section">
								<div className="vt-quickact-section-title">{__('Plugin List', 'versatile-toolkit')}</div>
								{isPluginsLoading && (
									<div style={{ minHeight: '300px' }}>
										{__('Loading plugins...', 'versatile-toolkit')}
									</div>
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
											size='xs'
											variant='secondary'
											disabled={pendingPluginFile === plugin.file}
											onClick={() => handlePluginToggle(plugin.file, !plugin.is_active)}
										>
											<ButtonLoader
												isLoading={pendingPluginFile === plugin.file}
												loadingText='loading'
												size='xs'
											>
												{plugin.is_active
													? __('Deactivate', 'versatile-toolkit')
													: __('Activate', 'versatile-toolkit')}
											</ButtonLoader>
										</Button>
									</div>
								))}
							</div>
						)}

						{activeSection === 'themes' && (
							<div className="vt-quickact-section">
								<div className="vt-quickact-section-title">{__('Theme List', 'versatile-toolkit')}</div>
								{isThemesLoading && (
									<div style={{ minHeight: '300px' }}>{__('Loading themes...', 'versatile-toolkit')}</div>
								)}
								{!isThemesLoading && themes.length === 0 && (
									<div style={{ minHeight: '300px' }}>{__('No themes found.', 'versatile-toolkit')}</div>
								)}
								{themes.map((theme) => (
									<div
										key={theme.stylesheet}
										className={`vt-quickact-row${theme.is_active ? ' vt-quickact-row-active' : ''}`}
									>
										<div className="vt-quickact-row-body">
											<div className="vt-quickact-row-title">{theme.name}</div>
											<div className="vt-quickact-row-meta">
												{theme.stylesheet} {theme.version ? `(${theme.version})` : ''}
											</div>
										</div>
										<Button
											type="button"
											className="vt-w-[60px]"
											size='xs'
											variant='secondary'
											disabled={pendingThemeStylesheet === theme.stylesheet}
											onClick={() => handleThemeToggle(theme.stylesheet, !theme.is_active)}
										>
											<ButtonLoader
												isLoading={pendingThemeStylesheet === theme.stylesheet}
												loadingText={'loading'}
												size="xs"
											>
												{theme.is_active
													? __('Deactivate', 'versatile-toolkit')
													: __('Activate', 'versatile-toolkit')}
											</ButtonLoader>
										</Button>
									</div>
								))}
							</div>
						)}

						{activeSection === 'settings' && (
							<div className="vt-quickact-section">
								<div className="vt-quickact-section-title">{__('Settings', 'versatile-toolkit')}</div>
								<div className="vt-quickact-row vt-quickact-row-comfortable">
									<div className="vt-quickact-row-body">
										<div className="vt-quickact-row-title">
											{__('Permalink Reset', 'versatile-toolkit')}
										</div>
										<div className="vt-quickact-row-meta">
											{__('Flush and regenerate rewrite rules.', 'versatile-toolkit')}
										</div>
									</div>
									<Button variant='softBlue' size='softBlue' type="button" disabled={isPending} onClick={handlePermalinkReset}>
										<ButtonLoader
											isLoading={isPending}
											loadingText={__('loading', 'versatile-toolkit')}
											size="sm"
										>
											{__('Reset', 'versatile-toolkit')}
										</ButtonLoader>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Quickact;

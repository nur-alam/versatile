import {
	getQuickactPlugins,
	getQuickactThemes,
	QuickactPluginItem,
	QuickactThemeItem,
	useQuickactServices
} from '@/entries/quickact/services/quickact-services'
import { __ } from '@wordpress/i18n'
import React, { useEffect, useState } from 'react'

type SidebarSection = 'plugins' | 'themes' | 'settings'

const Quickact = () => {
	const [activeSection, setActiveSection] = useState<SidebarSection>('plugins')
	const [plugins, setPlugins] = useState<QuickactPluginItem[]>([])
	const [themes, setThemes] = useState<QuickactThemeItem[]>([])
	const [isPluginsLoading, setIsPluginsLoading] = useState(false)
	const [isThemesLoading, setIsThemesLoading] = useState(false)
	const { mutateAsync, isPending } = useQuickactServices()

	const loadPlugins = async () => {
		setIsPluginsLoading(true)
		try {
			const list = await getQuickactPlugins()
			setPlugins(list)
		} finally {
			setIsPluginsLoading(false)
		}
	}

	const loadThemes = async () => {
		setIsThemesLoading(true)
		try {
			const list = await getQuickactThemes()
			setThemes(list)
		} finally {
			setIsThemesLoading(false)
		}
	}

	const handlePluginToggle = async (pluginFile: string, shouldActivate: boolean) => {
		await mutateAsync({
			action: shouldActivate ? 'versatile_quickact_plugin_activate' : 'versatile_quickact_plugin_deactivate',
			plugin_file: pluginFile,
		})
		await loadPlugins()
	}

	const handleThemeToggle = async (stylesheet: string, shouldActivate: boolean) => {
		await mutateAsync({
			action: shouldActivate ? 'versatile_quickact_theme_activate' : 'versatile_quickact_theme_deactivate',
			stylesheet,
		})
		await loadThemes()
	}

	const handlePermalinkReset = async () => {
		await mutateAsync({
			action: 'versatile_reset_permalinks',
		})
	}

	useEffect(() => {
		void loadPlugins()
	}, [])

	useEffect(() => {
		if (activeSection === 'themes' && themes.length === 0) {
			void loadThemes()
		}
	}, [activeSection, themes.length])

	return (
		<div
			className='versatile-quickact-trigger'
			onClick={(event) => {
				event.preventDefault()
				event.stopPropagation()
			}}
			onMouseDown={(event) => {
				event.preventDefault()
				event.stopPropagation()
			}}
		>
			<div>
				{__('Quick Actions', 'versatile-toolkit')}
				<span className='versatile-quickact-arrow' aria-hidden="true">▼</span>
			</div>
			<div className='versatile-quickact-menu'>
				<div className='versatile-quickact-sidebar'>
					<button
						type='button'
						className={`versatile-quickact-nav-btn${activeSection === 'plugins' ? ' versatile-quickact-nav-btn-active' : ''}`}
						onClick={() => setActiveSection('plugins')}
					>
						{__('Plugins', 'versatile-toolkit')}
					</button>
					<button
						type='button'
						className={`versatile-quickact-nav-btn${activeSection === 'themes' ? ' versatile-quickact-nav-btn-active' : ''}`}
						onClick={() => setActiveSection('themes')}
					>
						{__('Themes', 'versatile-toolkit')}
					</button>
					<button
						type='button'
						className={`versatile-quickact-nav-btn${activeSection === 'settings' ? ' versatile-quickact-nav-btn-active' : ''}`}
						onClick={() => setActiveSection('settings')}
					>
						{__('Settings', 'versatile-toolkit')}
					</button>
				</div>

				<div className='versatile-quickact-content'>
					{activeSection === 'plugins' && (
						<div className='versatile-quickact-section'>
							<div className='versatile-quickact-section-title'>{__('Plugin List', 'versatile-toolkit')}</div>
							{isPluginsLoading && <div>{__('Loading plugins...', 'versatile-toolkit')}</div>}
							{!isPluginsLoading && plugins.length === 0 && <div>{__('No plugins found.', 'versatile-toolkit')}</div>}
							{plugins.map((plugin) => (
								<div key={plugin.file} className='versatile-quickact-row'>
									<div className='versatile-quickact-row-body'>
										<div className='versatile-quickact-row-title'>{plugin.name}</div>
										<div className='versatile-quickact-row-meta'>
											{plugin.file} {plugin.version ? `(${plugin.version})` : ''}
										</div>
									</div>
									<button
										type='button'
										className='versatile-quickact-btn'
										disabled={isPending}
										onClick={() => handlePluginToggle(plugin.file, !plugin.is_active)}
									>
										{plugin.is_active
											? __('Deactivate', 'versatile-toolkit')
											: __('Activate', 'versatile-toolkit')}
									</button>
								</div>
							))}
						</div>
					)}

					{activeSection === 'themes' && (
						<div className='versatile-quickact-section'>
							<div className='versatile-quickact-section-title'>{__('Theme List', 'versatile-toolkit')}</div>
							{isThemesLoading && <div>{__('Loading themes...', 'versatile-toolkit')}</div>}
							{!isThemesLoading && themes.length === 0 && <div>{__('No themes found.', 'versatile-toolkit')}</div>}
							{themes.map((theme) => (
								<div key={theme.stylesheet} className='versatile-quickact-row'>
									<div className='versatile-quickact-row-body'>
										<div className='versatile-quickact-row-title'>{theme.name}</div>
										<div className='versatile-quickact-row-meta'>
											{theme.stylesheet} {theme.version ? `(${theme.version})` : ''}
										</div>
									</div>
									<button
										type='button'
										className='versatile-quickact-btn'
										disabled={isPending}
										onClick={() => handleThemeToggle(theme.stylesheet, !theme.is_active)}
									>
										{theme.is_active
											? __('Deactivate', 'versatile-toolkit')
											: __('Activate', 'versatile-toolkit')}
									</button>
								</div>
							))}
						</div>
					)}

					{activeSection === 'settings' && (
						<div className='versatile-quickact-section'>
							<div className='versatile-quickact-section-title'>{__('Settings', 'versatile-toolkit')}</div>
							<div className='versatile-quickact-row versatile-quickact-row-comfortable'>
								<div className='versatile-quickact-row-body'>
									<div className='versatile-quickact-row-title'>{__('Permalink Reset', 'versatile-toolkit')}</div>
									<div className='versatile-quickact-row-meta'>{__('Flush and regenerate rewrite rules.', 'versatile-toolkit')}</div>
								</div>
								<button
									type='button'
									className='versatile-quickact-btn'
									disabled={isPending}
									onClick={handlePermalinkReset}
								>
									{__('Reset', 'versatile-toolkit')}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Quickact

import {
	getQuickpickPlugins,
	getQuickpickThemes,
	QuickpickPluginItem,
	QuickpickThemeItem,
	useQuickpickServices
} from '@/entries/quickpick/services/quickpick-services'
import { __ } from '@wordpress/i18n'
import React, { useEffect, useState } from 'react'

type SidebarSection = 'plugins' | 'themes' | 'settings'

const Quickpick = () => {
	const [activeSection, setActiveSection] = useState<SidebarSection>('plugins')
	const [plugins, setPlugins] = useState<QuickpickPluginItem[]>([])
	const [themes, setThemes] = useState<QuickpickThemeItem[]>([])
	const [isPluginsLoading, setIsPluginsLoading] = useState(false)
	const [isThemesLoading, setIsThemesLoading] = useState(false)
	const { mutateAsync, isPending } = useQuickpickServices()

	const loadPlugins = async () => {
		setIsPluginsLoading(true)
		try {
			const list = await getQuickpickPlugins()
			setPlugins(list)
		} finally {
			setIsPluginsLoading(false)
		}
	}

	const loadThemes = async () => {
		setIsThemesLoading(true)
		try {
			const list = await getQuickpickThemes()
			setThemes(list)
		} finally {
			setIsThemesLoading(false)
		}
	}

	const handlePluginToggle = async (pluginFile: string, shouldActivate: boolean) => {
		await mutateAsync({
			action: shouldActivate ? 'versatile_quickpick_plugin_activate' : 'versatile_quickpick_plugin_deactivate',
			plugin_file: pluginFile,
		})
		await loadPlugins()
	}

	const handleThemeToggle = async (stylesheet: string, shouldActivate: boolean) => {
		await mutateAsync({
			action: shouldActivate ? 'versatile_quickpick_theme_activate' : 'versatile_quickpick_theme_deactivate',
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
			className='versatile-quickpick-trigger'
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
				<span className='versatile-quickpick-arrow' aria-hidden="true">▼</span>
			</div>
			<div className='versatile-quickpick-menu'>
				<div className='versatile-quickpick-sidebar'>
					<button
						type='button'
						className={`versatile-quickpick-nav-btn${activeSection === 'plugins' ? ' versatile-quickpick-nav-btn-active' : ''}`}
						onClick={() => setActiveSection('plugins')}
					>
						{__('Plugins', 'versatile-toolkit')}
					</button>
					<button
						type='button'
						className={`versatile-quickpick-nav-btn${activeSection === 'themes' ? ' versatile-quickpick-nav-btn-active' : ''}`}
						onClick={() => setActiveSection('themes')}
					>
						{__('Themes', 'versatile-toolkit')}
					</button>
					<button
						type='button'
						className={`versatile-quickpick-nav-btn${activeSection === 'settings' ? ' versatile-quickpick-nav-btn-active' : ''}`}
						onClick={() => setActiveSection('settings')}
					>
						{__('Settings', 'versatile-toolkit')}
					</button>
				</div>

				<div className='versatile-quickpick-content'>
					{activeSection === 'plugins' && (
						<div className='versatile-quickpick-section'>
							<div className='versatile-quickpick-section-title'>{__('Plugin List', 'versatile-toolkit')}</div>
							{isPluginsLoading && <div>{__('Loading plugins...', 'versatile-toolkit')}</div>}
							{!isPluginsLoading && plugins.length === 0 && <div>{__('No plugins found.', 'versatile-toolkit')}</div>}
							{plugins.map((plugin) => (
								<div key={plugin.file} className='versatile-quickpick-row'>
									<div className='versatile-quickpick-row-body'>
										<div className='versatile-quickpick-row-title'>{plugin.name}</div>
										<div className='versatile-quickpick-row-meta'>
											{plugin.file} {plugin.version ? `(${plugin.version})` : ''}
										</div>
									</div>
									<button
										type='button'
										className='versatile-quickpick-btn'
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
						<div className='versatile-quickpick-section'>
							<div className='versatile-quickpick-section-title'>{__('Theme List', 'versatile-toolkit')}</div>
							{isThemesLoading && <div>{__('Loading themes...', 'versatile-toolkit')}</div>}
							{!isThemesLoading && themes.length === 0 && <div>{__('No themes found.', 'versatile-toolkit')}</div>}
							{themes.map((theme) => (
								<div key={theme.stylesheet} className='versatile-quickpick-row'>
									<div className='versatile-quickpick-row-body'>
										<div className='versatile-quickpick-row-title'>{theme.name}</div>
										<div className='versatile-quickpick-row-meta'>
											{theme.stylesheet} {theme.version ? `(${theme.version})` : ''}
										</div>
									</div>
									<button
										type='button'
										className='versatile-quickpick-btn'
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
						<div className='versatile-quickpick-section'>
							<div className='versatile-quickpick-section-title'>{__('Settings', 'versatile-toolkit')}</div>
							<div className='versatile-quickpick-row versatile-quickpick-row-comfortable'>
								<div className='versatile-quickpick-row-body'>
									<div className='versatile-quickpick-row-title'>{__('Permalink Reset', 'versatile-toolkit')}</div>
									<div className='versatile-quickpick-row-meta'>{__('Flush and regenerate rewrite rules.', 'versatile-toolkit')}</div>
								</div>
								<button
									type='button'
									className='versatile-quickpick-btn'
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

export default Quickpick
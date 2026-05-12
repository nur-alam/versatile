import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import PluginsSection from './PluginsSection';
import QuickSettings from './QuickSettings';
import ThemesSection from './ThemesSection';
import TopActions from './TopActions';

type SidebarSection = 'plugins' | 'themes' | 'settings';

const isInsideQuickactMenu = (target: EventTarget | null) => {
	if (!(target instanceof Element)) {
		return false;
	}
	return Boolean(target.closest('.vt-quickact-menu-wrapper'));
};

const Quickact = () => {
	const [activeSection, setActiveSection] = useState<SidebarSection>('plugins');

	return (
		<div
			className="vt-quickact-trigger"
			onClick={(event) => {
				if (isInsideQuickactMenu(event.target)) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();
			}}
			onMouseDown={(event) => {
				if (isInsideQuickactMenu(event.target)) {
					return;
				}
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
						{/* <button
							type="button"
							className={`vt-quickact-nav-btn${activeSection === 'settings' ? ' vt-quickact-nav-btn-active' : ''}`}
							onClick={() => setActiveSection('settings')}
						>
							{__('Settings', 'versatile-toolkit')}
						</button> */}
					</div>

					<div className="vt-quickact-content vt-pl-3">
						<div hidden={activeSection !== 'plugins'}>
							<PluginsSection />
						</div>

						<div hidden={activeSection !== 'themes'}>
							<ThemesSection />
						</div>

						<div hidden={activeSection !== 'settings'}>
							<QuickSettings />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Quickact;

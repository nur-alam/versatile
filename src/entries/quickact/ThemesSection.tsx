import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import {
	getQuickactThemes,
	QuickactThemeItem,
	useQuickactServices,
} from '@/entries/quickact/services/quickact-services';
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from 'react';

const ThemesSection = () => {
	const [themes, setThemes] = useState<QuickactThemeItem[]>([]);
	const [isThemesLoading, setIsThemesLoading] = useState(false);
	const [pendingThemeStylesheet, setPendingThemeStylesheet] = useState<string | null>(null);
	const { mutateAsync } = useQuickactServices();

	const loadThemes = useCallback(async () => {
		setIsThemesLoading(true);
		try {
			const list = await getQuickactThemes();
			setThemes(list);
		} finally {
			setIsThemesLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadThemes();
	}, [loadThemes]);

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

	return (
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
						size="xs"
						variant="secondary"
						disabled={pendingThemeStylesheet === theme.stylesheet}
						onClick={() => void handleThemeToggle(theme.stylesheet, !theme.is_active)}
					>
						<ButtonLoader
							isLoading={pendingThemeStylesheet === theme.stylesheet}
							loadingText="loading"
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
	);
};

export default ThemesSection;

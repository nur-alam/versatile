import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	getQuickactThemes,
	QuickactThemeItem,
	useQuickactServices,
} from '@/entries/quickact/services/quickact-services';
import { useDebouncedValue } from '@/entries/quickact/useDebouncedValue';
import { __ } from '@wordpress/i18n';
import { Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ThemesSection = () => {
	const [themes, setThemes] = useState<QuickactThemeItem[]>([]);
	const [isThemesLoading, setIsThemesLoading] = useState(false);
	const [pendingThemeStylesheet, setPendingThemeStylesheet] = useState<string | null>(null);
	const [themeSearch, setThemeSearch] = useState('');
	const debouncedThemeSearch = useDebouncedValue(themeSearch, 300);
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

	const handleThemeDelete = async (stylesheet: string) => {
		if (!window.confirm(__('Are you sure you want to delete this theme?', 'versatile-toolkit'))) {
			return;
		}
		setPendingThemeStylesheet(stylesheet);
		try {
			await mutateAsync({
				action: 'versatile_quickact_theme_delete',
				stylesheet,
			});
			setThemes((prevThemes) => prevThemes.filter((theme) => theme.stylesheet !== stylesheet));
		} finally {
			setPendingThemeStylesheet(null);
		}
	};

	const filteredThemes = useMemo(() => {
		const q = debouncedThemeSearch.trim().toLowerCase();
		if (!q) {
			return themes;
		}
		return themes.filter((theme) => {
			const haystack = `${theme.name} ${theme.stylesheet} ${theme.version || ''}`.toLowerCase();
			return haystack.includes(q);
		});
	}, [themes, debouncedThemeSearch]);

	return (
		<div className="vt-quickact-section">
			<div className="vt-quickact-section-head">
				<div className="vt-quickact-section-title">{__('Theme List', 'versatile-toolkit')}</div>
				<div className="vt-max-w-max vt-relative">
					<Search className="vt-absolute vt-left-3 vt-top-1/2 vt-transform -vt-translate-y-1/2 vt-text-gray-400 vt-w-4 vt-h-4" />
					<Input
						type="search"
						className="vt-w-max vt-pl-8 vt-h-5"
						value={themeSearch}
						onChange={(e) => setThemeSearch(e.target.value)}
						placeholder={__('Search themes…', 'versatile-toolkit')}
						autoComplete="off"
						aria-label={__('Search themes', 'versatile-toolkit')}
						disabled={isThemesLoading}
					/>
				</div>
			</div>
			{isThemesLoading && (
				<div style={{ minHeight: '300px' }}>{__('Loading themes...', 'versatile-toolkit')}</div>
			)}
			{!isThemesLoading && themes.length === 0 && (
				<div style={{ minHeight: '300px' }}>{__('No themes found.', 'versatile-toolkit')}</div>
			)}
			{!isThemesLoading && themes.length > 0 && filteredThemes.length === 0 && (
				<div style={{ minHeight: '120px' }}>{__('No themes match your search.', 'versatile-toolkit')}</div>
			)}
			<div className="vt-quickact-section-list">
				{filteredThemes.map((theme) => (
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
						<div className="vt-flex vt-gap-1">
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
							{!theme.is_active && (
								<Button
									type="button"
									className="vt-w-6 vt-px-0"
									size="xs"
									variant="destructive"
									disabled={pendingThemeStylesheet === theme.stylesheet}
									onClick={() => void handleThemeDelete(theme.stylesheet)}
									title={__('Delete theme', 'versatile-toolkit')}
								>
									<Trash2 className="vt-w-3 vt-h-3" />
								</Button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ThemesSection;

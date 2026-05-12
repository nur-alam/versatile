import ButtonLoader from '@/components/loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import { useQuickactServices } from '@/entries/quickact/services/quickact-services';
import { __ } from '@wordpress/i18n';

const QuickSettings = () => {
	const { mutateAsync, isPending } = useQuickactServices();

	const handlePermalinkReset = async () => {
		await mutateAsync({
			action: 'versatile_reset_permalinks',
		});
	};

	return (
		<div className="vt-quickact-section">
			<div className="vt-quickact-section-title">{__('Settings', 'versatile-toolkit')}</div>
			<div className="vt-quickact-row vt-quickact-row-comfortable">
				<div className="vt-quickact-row-body">
					<div className="vt-quickact-row-title">{__('Permalink Reset', 'versatile-toolkit')}</div>
					<div className="vt-quickact-row-meta">
						{__('Flush and regenerate rewrite rules.', 'versatile-toolkit')}
					</div>
				</div>
				<Button
					variant="softBlue"
					size="softBlue"
					type="button"
					disabled={isPending}
					onClick={() => void handlePermalinkReset()}
				>
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
	);
};

export default QuickSettings;

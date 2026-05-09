import { __ } from '@wordpress/i18n';
import { useQuickactServices } from './services/quickact-services';

const TopActions = () => {
	const { mutateAsync, isPending } = useQuickactServices();

	const handlePermalinkReset = async () => {
		await mutateAsync({
			action: 'versatile_reset_permalinks',
		});
	};

	return (
		<div>
			<h2>Top Action</h2>
			<div>
				<button
					type="button"
					className="vt-versatile-quickact-btn"
					disabled={isPending}
					onClick={handlePermalinkReset}
				>
					{__('Reset', 'versatile-toolkit')}
				</button>
			</div>
		</div>
	);
};

export default TopActions;

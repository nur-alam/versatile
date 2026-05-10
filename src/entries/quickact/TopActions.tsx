import { __ } from '@wordpress/i18n';
import { useQuickactServices } from './services/quickact-services';
import { Button } from '@/components/ui/button';
import { ButtonLoader } from '@/components/loader';

const TopActions = () => {
	const { mutateAsync, isPending } = useQuickactServices();

	const handlePermalinkReset = async () => {
		await mutateAsync({
			action: 'versatile_reset_permalinks',
		});
	};

	const handleClearCache = async () => {
		await mutateAsync({
			action: 'versatile_clear_cache',
		});
	};

	const handleClearTransients = async () => {
		await mutateAsync({
			action: 'versatile_clear_transients',
		});
	};

	return (
		<div className='vt-border-b vt-border-gray-200 vt-pb-3 vt-flex vt-gap-1 vt-justify-between vt-items-center'>
			<h2 className='vt-mr-2 vt-text-sm vt-font-medium vt-text-gray-500'>{__('Top Actions', 'versatile-toolkit')}</h2>
			<div className='vt-flex vt-gap-2 vt-justify-between'>
				<Button
					type="button"
					variant="softBlue"
					size='softBlue'
					disabled={isPending}
					onClick={handlePermalinkReset}
				>
					<ButtonLoader
						isLoading={isPending}
						loadingText={__('Resetting...', 'versatile-toolkit')}
						size="xs"
					>
						{__('Reset Permalink', 'versatile-toolkit')}
					</ButtonLoader>
				</Button>
				{/* <button
					type="button"
					// size='sm'
					// variant='ghost'
					// className="vt-versatile-quickact-btn"
					className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200 hover:vt-bg-blue-100"
					disabled={isPending}
					onClick={handleClearCache}
				>
					{__('Clear Cache', 'versatile-toolkit')}
				</button>
				<button
					type="button"
					// size='sm'
					// variant='outline'
					// className="vt-versatile-quickact-btn"
					className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200 hover:vt-bg-blue-100"
					disabled={isPending}
					onClick={handleClearTransients}
				>
					{__('Clear Transients', 'versatile-toolkit')}
				</button> */}
			</div>
		</div>
	);
};

export default TopActions;

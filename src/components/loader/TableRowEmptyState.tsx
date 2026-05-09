import { EmptyStateIcon } from '@/icons';
import { __ } from '@wordpress/i18n';
import { TableCell, TableRow } from '../ui/table';

const TableRowEmptyState = ({ colSpan = 9, title = '', description = '' }) => {
	return (
		<TableRow>
			<TableCell colSpan={colSpan} className="vt-text-center vt-py-12">
				<div className="vt-flex vt-flex-col vt-items-center vt-space-y-3 vt-text-muted-foreground">
					<EmptyStateIcon className="vt-w-12 vt-h-12" />
					<div className="vt-space-y-1">
						<p className="vt-text-lg vt-font-medium">
							{title || __('Empty!! No data found', 'versatile-toolkit')}
						</p>
						{description && <p className="vt-text-sm">{description}</p>}
					</div>
				</div>
			</TableCell>
		</TableRow>
	);
};

export default TableRowEmptyState;

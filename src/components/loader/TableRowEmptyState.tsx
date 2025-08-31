import React from 'react'
import { TableCell, TableRow } from '../ui/table'
import { EmptyStateIcon } from '@/icons'
import { __ } from '@wordpress/i18n'

const TableRowEmptyState = ({ colSpan = 9, title = '', description = '' }) => {
	return (
		<TableRow>
			<TableCell colSpan={colSpan} className="text-center py-12">
				<div className="flex flex-col items-center space-y-3 text-muted-foreground">
					<EmptyStateIcon className="w-12 h-12" />
					<div className="space-y-1">
						<p className="text-lg font-medium">
							{title || __('Empty!! No data found', 'versatile-toolkit')}
						</p>
						{description && (
							<p className="text-sm">
								{description}
							</p>
						)}
					</div>
				</div>
			</TableCell>
		</TableRow>
	)
}

export default TableRowEmptyState
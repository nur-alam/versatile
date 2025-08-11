import { useQuickpickServices } from '@/entries/quickpick/services/quickpick-services'
import { __ } from '@wordpress/i18n'
import React, { useState, useRef, useEffect, MouseEvent } from 'react'

type MenuItem = {
	id: string
	label: string
	action: string
}

const menuItems = [
	{ id: '1', label: 'Reset Permalinks', action: 'versatile_reset_permalinks' },
	{ id: '2', label: 'Update Permalinks', action: 'versatile_update_permalinks' },
	{ id: '3', label: 'Update Permalinks', action: 'versatile_update_permalinks' },
	{ id: '4', label: 'Update Permalinks', action: 'versatile_update_permalinks' },
]

const Quickpick = () => {
	const quickpickServicesMutation = useQuickpickServices();

	const handleClick = async (value: MenuItem, event?: MouseEvent) => {
		event?.preventDefault();
		if (quickpickServicesMutation.isPending) return;
		await quickpickServicesMutation.mutateAsync({
			action: value.action,
		});
	}

	return (
		<div className='quickpick-trigger group relative'>
			<div>
				{__('Quick Actions', 'versatile-toolkit')}
				<span className='quickpick-arrow !ml-2' aria-hidden="true">▼</span>
			</div>
			<div className='quickpick-menu flex-col gap-2 hidden group-hover:flex absolute top-full left-0 border' style={{ padding: '0px 10px 10px 10px' }}>
				{menuItems.map((item, index) => (
					<div key={item.id}
						onClick={(event) => handleClick(item, event)}
					// style={{ pointerEvents: quickpickServicesMutation.isPending ? 'none' : 'auto' }}
					>
						<span
							className={`quickpick-menu-item text-color-white ${quickpickServicesMutation.isPending ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'}`}
						>
							{item.label}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default Quickpick
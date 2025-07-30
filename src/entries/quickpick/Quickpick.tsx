import { useQuickpickServices } from '@/entries/quickpick/services/quickpick-services'
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
	console.log('quick load');
	const [isOpen, setIsOpen] = useState(false)
	const [focusedIndex, setFocusedIndex] = useState(-1)
	const menuRef = useRef<HTMLUListElement>(null)

	const quickpickServicesMutation = useQuickpickServices();

	const handleClick = async (value: MenuItem, event?: MouseEvent) => {
		event?.preventDefault();
		await quickpickServicesMutation.mutateAsync({
			action: value.action,
		});
	}

	return (
		<div className='quickpick-root-menu'>
			<div
				className='quickpick-trigger group relative'
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls="quickpick-menu"
			>
				Quick Actions
				<span className='quickpick-arrow' aria-hidden="true">▼</span>
				<div className='quickpick-menu flex-col gap-2 group-hover:flex absolute top-full left-0 bg-white border p-4'>
					{menuItems.map((item, index) => (
						<div key={item.id} role="none"
							onClick={(event) => handleClick(item, event)}
						>
							<span
								role="menuitem"
								className={`quickpick-menu-item  cursor-pointer`}
							>
								{item.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Quickpick
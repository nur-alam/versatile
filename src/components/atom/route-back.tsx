import { __ } from '@wordpress/i18n'
import { ChevronLeft, MoveLeft } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const routeBack = ({ link = '/' }: { link?: string }) => {
	return (
		<>
			<Link to={link} className='flex items-center justify-center text-slate-700 bg-slate-200 hover:bg-slate-300 px-2 rounded-sm transition-colors'>
				<MoveLeft className='w-4' />
			</Link>
		</>
	)
}

export default routeBack	

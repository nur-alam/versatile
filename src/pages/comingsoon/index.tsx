import React from 'react'
import { __ } from '@wordpress/i18n'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ComingsoonMode from '@pages/comingsoon/comingsoon-settings'

const Comingsoon = () => {
	return (
		<div className="p-4 space-y-6">
			<h2 className='flex items-center gap-2 text-2xl'>
				<Link to={'/'}>
					<ArrowLeft />
				</Link>
				{__('Comingsoon Mood', 'tukitaki')}
			</h2>
			<ComingsoonMode />
		</div>
	)
}

export default Comingsoon
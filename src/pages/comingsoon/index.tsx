import { __ } from '@wordpress/i18n'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Comingsoon = () => {
	return (
		<div className="p-4 space-y-6">
			<h2 className='flex items-center gap-2 text-2xl'>
				<Link to={'/'}>
					<ArrowLeft />
				</Link>
				{__('Comingsoon Mood', 'tukitaki')}
			</h2>
		</div>
	)
}

export default Comingsoon
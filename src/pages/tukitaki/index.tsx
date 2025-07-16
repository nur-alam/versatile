import React from 'react'
import { __ } from '@wordpress/i18n'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const Dashboard = () => {
	return (
		<>
			<div className='mt-10 flex flex-wrap gap-2'>
				<Card style={{ width: '300px' }}>
					<Link to={'/troubleshoot'}>
						<CardHeader>
							<CardTitle className='text-2xl'>{__('Troubleshooting', 'tukitaki')}</CardTitle>
						</CardHeader>
						<CardContent>
							{__('This plugin will perform a number of checks on your WordPress installation', 'tukitaki')}
						</CardContent>
					</Link>
				</Card>
				<Card style={{ width: '300px' }}>
					<Link to={'/maintenance'}>
						<CardHeader>
							<CardTitle className='text-2xl'>{__('Maintenance Mood', 'tukitaki')}</CardTitle>
						</CardHeader>
						<CardContent>
							{__('This plugin will perform a number of checks on your WordPress installation', 'tukitaki')}
						</CardContent>
					</Link>
				</Card>
				<Card style={{ width: '300px' }}>
					<Link to={'/comingsoon'}>
						<CardHeader>
							<CardTitle className='text-2xl'>{__('Coming Soon', 'tukitaki')}</CardTitle>
						</CardHeader>
						<CardContent>
							{__('This plugin will perform a number of checks on your WordPress installation', 'tukitaki')}
						</CardContent>
					</Link>
				</Card>
				{/* <div>
					<Link to={'/troubleshoot'}>
						<h3>Troubleshoot</h3>
						<p>This plugin will perform a number of checks on your WordPress installation to detect common configuration errors and known issues, and also allows plugins and themes to add their own checks.</p>
					</Link>
				</div> */}
			</div>
		</>
	)
}

export default Dashboard
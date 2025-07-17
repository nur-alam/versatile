import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAddonList } from '@/services/mood-services'

export type AddonItem = {
	label: string;
	enable: boolean;
	path: string;
	description: string;
};

export type AddonListType = {
	[key: string]: AddonItem;
};

const Dashboard = () => {
	const { data: addonListResponse, isLoading } = useGetAddonList();
	const addonList = addonListResponse?.data as AddonListType;

	console.log('addonList', addonList);

	return (
		<>
			<div className='mt-10 flex flex-wrap gap-3'>
				{
					isLoading ? <span className='text-2xl'>Loading</span> :
						Object.entries(addonList).map(([key, addon]) => (
							<Card key={key} className='w-[300px]'>
								<Link to={`/${addon.path}`} className='block p-3'>
									<CardHeader className='p-0'>
										<CardTitle className='text-xl'>{addon.label}</CardTitle>
									</CardHeader>
									<CardContent className='p-0 pt-2'>
										<p>
											{addon.description}
										</p>
										{/* {addon.enable ? (
											<span className='text-green-600 font-medium'>
												{__('Enabled', 'tukitaki')}
											</span>
										) : (
											<span className='text-red-600 font-medium'>
												{__('Disabled', 'tukitaki')}
											</span>
										)} */}
									</CardContent>
								</Link>
							</Card>
						))
				}
			</div>
		</>
	)
}

export default Dashboard
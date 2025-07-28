import { __ } from '@wordpress/i18n'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetEnableServiceList } from '@/services/mood-services'
import { ServiceListType } from '@/utils/versatile-declaration'


const Dashboard = () => {

	const { data: serviceListResponse, isLoading } = useGetEnableServiceList();
	const serviceList = serviceListResponse?.data as ServiceListType;

	return (
		<>
			<div className='mt-10 flex flex-wrap gap-3'>
				{
					isLoading ? <span className='text-xl'>{__('Loading', 'verstaile-toolkit')}</span> :
						Object.entries(serviceList)
							.filter(([key, addon]) => addon.enable) // Only show enabled services
							.map(([key, addon]) => (
								<Card key={key} className='w-[300px] hover:bg-gray-100'>
									<Link to={`/${addon.path}`} className='block p-3'>
										<CardHeader className='p-0'>
											<CardTitle className='text-xl'>{addon.label}</CardTitle>
										</CardHeader>
										<CardContent className='p-0 pt-2'>
											<p>
												{addon.description}
											</p>
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
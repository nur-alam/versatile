import { __ } from '@wordpress/i18n'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetEnableServiceList } from '@/services/mood-services'
import { ServiceListType } from '@/utils/versatile-declaration'
import { TextLoader, PageLoader, SkeletonLoader, SpinnerLoader } from '@/components/loader'


const Dashboard = () => {

	const { data: serviceListResponse, isLoading } = useGetEnableServiceList();
	const serviceList = serviceListResponse?.data as ServiceListType;

	return (
		<>
			<div className='mt-10 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3'>
				{
					isLoading ? <SkeletonLoader lines={3} height="h-[100px]" width="w-[900px]" /> :
						serviceList && Object.entries(serviceList)
							.filter(([key, addon]) => addon.enable) // Only show enabled services
							.map(([key, addon]) => (
								<Card key={key} className='hover:bg-gray-100 rounded-sm'>
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
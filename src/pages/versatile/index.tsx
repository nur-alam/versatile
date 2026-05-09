import { SkeletonLoader } from '@/components/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetEnableServiceList } from '@/services/mood-services';
import { ServiceListType } from '@/utils/versatile-declaration';
import { Link } from 'react-router-dom';

const Dashboard = () => {
	const { data: serviceListResponse, isLoading } = useGetEnableServiceList();
	const serviceList = serviceListResponse?.data as ServiceListType;

	return (
		<>
			<div className="vt-mt-10 vt-grid vt-grid-cols-[repeat(auto-fill,minmax(300px,1fr))] vt-gap-3">
				{isLoading ? (
					<SkeletonLoader lines={3} height="vt-h-[100px]" width="vt-w-[900px]" />
				) : (
					serviceList &&
					Object.entries(serviceList)
						.filter(([key, addon]) => addon.enable && key !== 'quickact')
						.map(([key, addon]) => (
							<Card key={key} className="hover:vt-bg-gray-100 vt-rounded-sm">
								<Link to={`/${addon.path}`} className="vt-block vt-p-3">
									<CardHeader className="vt-p-0">
										<CardTitle className="vt-text-xl">{addon.label}</CardTitle>
									</CardHeader>
									<CardContent className="vt-p-0 vt-pt-2">
										<p>{addon.description}</p>
									</CardContent>
								</Link>
							</Card>
						))
				)}
			</div>
		</>
	);
};

export default Dashboard;

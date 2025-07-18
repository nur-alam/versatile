import { useGetEnableServiceList } from '@services/mood-services';
import { ServiceListType } from '@utils/tukitaki-declaration';
import { Navigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
    children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const { data: serviceListResponse, isLoading } = useGetEnableServiceList();
    const serviceList = serviceListResponse?.data as ServiceListType;
    const location = useLocation();

    // Get current path from React Router location (works with HashRouter)
    const currentPath = location.pathname.replace('/', ''); // Remove leading slash

    if (isLoading) {
        return <div className='text-xl'>{__('Loading...', 'tukitaki')}</div>;
    }

    // Check if current service is enabled
    const currentService = Object.values(serviceList || {}).find(
        service => service.path === currentPath
    );

    console.log('Found service:', currentService);

    if (!currentService || !currentService.enable) {
        console.log('Service not found or disabled, redirecting...');
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
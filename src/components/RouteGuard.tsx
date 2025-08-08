import { useGetEnableServiceList } from '@/services/mood-services';
import { ServiceListType } from '@utils/versatile-declaration';
import { Navigate, useLocation } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { SkeletonLoader } from './loader';

interface RouteGuardProps {
    children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
    const { data: serviceListResponse, isLoading } = useGetEnableServiceList();
    const serviceList = serviceListResponse?.data as ServiceListType;
    const location = useLocation();

    // Get current path from React Router location (works with HashRouter)
    const currentPath = location.pathname.replace('/', ''); // Remove leading slash

    if (isLoading) {
        return <SkeletonLoader />; // Todo adjust this loader
    }

    // If no service list data, allow access (fallback)
    if (!serviceList) {
        return <>{children}</>;
    }

    // Check if current service is enabled
    const currentService = Object.values(serviceList).find(
        service => service.path === currentPath
    );

    if (!currentService) {
        return <Navigate to="/" replace />;
    }

    if (!currentService.enable) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
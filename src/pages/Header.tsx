import { useModalInteractions } from '@/hooks/useModalInteractions';
import { useGetServiceList, useUpdateServiceStatus } from '@/services/mood-services';
import { ServiceItem, ServiceListType } from '@/utils/versatile-declaration';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlignRight } from 'lucide-react';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();
    const location = useLocation();

    const { data: serviceListResponse, isLoading: servicesIsLoading } = useGetServiceList();
    const services = serviceListResponse?.data as ServiceListType;

    // Get current service based on the route
    const getCurrentService = () => {
        if (!services || location.pathname === '/') return null;

        // For HashRouter, we need to handle the path differently
        // Extract the base path (first segment after /)
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const basePath = pathSegments[0];

        const serviceEntry = Object.entries(services).find(([key, service]) => service.path === basePath);
        return serviceEntry ? serviceEntry[1] : null;
    };

    const currentService = getCurrentService();

    const updateServiceMutation = useUpdateServiceStatus();

    const toggleService = async (serviceKey: string, service: ServiceItem) => {
        updateServiceMutation.mutateAsync(
            {
                service_key: serviceKey,
                enable: !service.enable,
            },
            {
                onSuccess: () => {
                    // Invalidate and refetch both service lists
                    queryClient.invalidateQueries({ queryKey: ['getServiceList'] });
                    queryClient.invalidateQueries({ queryKey: ['getEnableServiceList'] });
                }
            }
        );
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const { handleBackdropClick } = useModalInteractions({
        isOpen: isMenuOpen,
        onClose: toggleMenu
    });

    return (
        <>
            <header className="bg-white border-b border-gray-200 py-4 pr-4 flex items-center justify-between relative">
                {/* Left side - Plugin Title */}
                <Link to="/" className="flex items-center text-blue-600 text-lg font-semibold">
                    {__('Versatile Toolkit', 'versatile-toolkit')}
                </Link>

                {/* Right side - Current Service and Toggle Menu Button */}
                <div className="flex items-center gap-3">
                    {/* Current Service Display */}
                    {currentService && (
                        <>
                            {
                                Object.keys(currentService?.menus || {}).map((menuKey) => {
                                    let linkPath = `/${currentService?.path}/${currentService?.menus?.[menuKey]?.slug}`;

                                    if (linkPath.endsWith("/")) {
                                        linkPath = linkPath.slice(0, -1);
                                    }

                                    return (
                                        <Link
                                            key={menuKey}
                                            to={linkPath}
                                            onClick={() => {
                                                console.log('Link clicked, navigating to:', linkPath);
                                            }}
                                            className={`text-sm font-medium rounded-md px-3 py-1 transition-colors duration-200 ${location.pathname === linkPath
                                                ? 'bg-blue-600 text-white border border-blue-700 hover:text-white focus:!text-white'
                                                : ' bg-blue-50 border border-blue-200'
                                                }`}
                                        >
                                            {currentService?.menus?.[menuKey]?.label}
                                        </Link>
                                    );
                                })
                            }
                        </>
                    )}

                    {!servicesIsLoading && services?.troubleshoot.enable && !currentService && (
                        <>
                            <Link to="/troubleshoot" className="text-sm font-medium rounded-md px-3 py-1 text-blue-700 bg-blue-50 border border-blue-200">
                                Deactivate Plugins
                            </Link>
                            <Link to="/troubleshoot/debug-log" className="text-sm font-medium rounded-md px-3 py-1 text-blue-700 bg-blue-50 border border-blue-200">
                                Debug Log
                            </Link>
                        </>
                    )}


                    <Sheet>
                        {/* Toggle Menu Button */}
                        <SheetTrigger asChild>
                            <button
                                // className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                                className="p-1 rounded-md bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                aria-label="Toggle menu"
                            >
                                {/* <AlignRight className='w-6 h-6 text-gray-600' /> */}
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>{__('Services', 'versatile-toolkit')}</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-3 mt-6">
                                {Object.entries(services || {}).map(([key, service]) => (
                                    <div
                                        key={service.label}
                                        onClick={() => toggleService(key, service)}
                                        className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                                    >
                                        <span className="text-blue-500 font-medium hover:text-blue-800 transition-colors duration-300">{service.label}</span>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={service.enable}
                                                onChange={() => { }} // Empty handler since parent div handles the click
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-[#c7c6c6] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>

                </div>
            </header>
        </>
    );
};

export default Header;
import { useModalInteractions } from '@/hooks/useModalInteractions';
import { useGetServiceList, useUpdateServiceStatus } from '@/services/mood-services';
import { ServiceItem, ServiceListType } from '@/utils/versatile-declaration';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';


const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: serviceListResponse } = useGetServiceList();
    const services = serviceListResponse?.data as ServiceListType;

    const updateServiceMutation = useUpdateServiceStatus();

    const toggleService = async (serviceKey: string, service: ServiceItem) => {
        console.log('serviceKey', serviceKey, 'service', service);
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
            <header className="bg-white border-b border-gray-200 px-1 py-4 flex items-center justify-between relative">
                {/* Left side - Plugin Title */}
                <div className="flex items-center">
                    {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.67188 16.373L7.44737 12.5388" stroke="#6374BB" stroke-width="1.5" />
                        <path d="M16.5191 3.93774L12.4375 7.46106" stroke="#6374BB" stroke-width="1.5" />
                        <path d="M16.5191 16.373L12.4375 12.5388" stroke="#6374BB" stroke-width="1.5" />
                        <path d="M3.67188 3.93774L7.44737 7.46106" stroke="#6374BB" stroke-width="1.5" />
                        <path d="M2.50003 5C3.88075 5 5.00005 3.88071 5.00005 2.5C5.00005 1.11929 3.88075 0 2.50003 0C1.1193 0 0 1.11929 0 2.5C0 3.88071 1.1193 5 2.50003 5Z" fill="#9CA3AF" />
                        <path d="M17.5 5C18.8808 5 20.0001 3.88071 20.0001 2.5C20.0001 1.11929 18.8808 0 17.5 0C16.1193 0 15 1.11929 15 2.5C15 3.88071 16.1193 5 17.5 5Z" fill="#9CA3AF" />
                        <path d="M2.50003 20C3.88075 20 5.00005 18.8807 5.00005 17.5C5.00005 16.1193 3.88075 15 2.50003 15C1.1193 15 0 16.1193 0 17.5C0 18.8807 1.1193 20 2.50003 20Z" fill="#9CA3AF" />
                        <path d="M17.5 20C18.8808 20 20.0001 18.8807 20.0001 17.5C20.0001 16.1193 18.8808 15 17.5 15C16.1193 15 15 16.1193 15 17.5C15 18.8807 16.1193 20 17.5 20Z" fill="#9CA3AF" />
                        <path d="M9.75004 13.5C11.8211 13.5 13.5001 11.8211 13.5001 9.75C13.5001 7.67893 11.8211 6 9.75004 6C7.67895 6 6 7.67893 6 9.75C6 11.8211 7.67895 13.5 9.75004 13.5Z" fill="#374151" />
                        <path d="M11.222 8.27273L10.2135 11H9.78738L8.77885 8.27273H9.2334L9.98624 10.446H10.0146L10.7675 8.27273H11.222Z" fill="white" />
                    </svg> */}
                    <h2 className="text-xl font-semibold text-gray-800">{__('Versatile Toolkit', 'versatile-toolkit')}</h2>
                </div>

                {/* Right side - Toggle Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6 text-gray-600"
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
            </header>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed z-[99999] inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu}
                />
            )}

            {/* Services Menu Popup */}
            {isMenuOpen && (
                <div className="fixed w-[500px] top-0 z-[99999] rounded-none right-0 h-screen bg-white shadow-lg border border-gray-200"
                    onClick={handleBackdropClick}
                >
                    <div className="p-4">
                        {/* Header with title and close button */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">{__('Services', 'versatile-toolkit')}</h3>
                            <button
                                onClick={toggleMenu}
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                aria-label="Close menu"
                            >
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
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3">
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
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
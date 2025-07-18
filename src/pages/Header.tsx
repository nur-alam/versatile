import { useGetServiceList, useUpdateServiceStatus } from '@/services/mood-services';
import { ServiceItem, ServiceListType } from '@/utils/tukitaki-declaration';
import { useQueryClient } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';


const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: serviceListResponse, isLoading } = useGetServiceList();
    const services = serviceListResponse?.data as ServiceListType;

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
                },
            }
        );
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="bg-white border-b border-gray-200 px-1 py-4 flex items-center justify-between relative">
                {/* Left side - Plugin Title */}
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-800">{__('Tukitaki', 'tukitaki')}</h1>
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
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu}
                />
            )}

            {/* Services Menu Popup */}
            {isMenuOpen && (
                <div className="fixed top-16 right-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-80">
                    <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">{__('Services', 'tukitaki')}</h3>
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
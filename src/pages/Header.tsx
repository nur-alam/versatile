import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useModalInteractions } from '@/hooks/useModalInteractions';
import { useGetServiceList, useUpdateServiceStatus } from '@/services/mood-services';
import { ServiceItem, ServiceListType } from '@/utils/versatile-declaration';
import { useQueryClient } from '@tanstack/react-query';
import { AlignJustify, X } from 'lucide-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
	console.log('Current Service:', currentService);

	const updateServiceMutation = useUpdateServiceStatus();

	const toggleService = (serviceKey: string, service: ServiceItem) => {
		updateServiceMutation.mutate(
			{
				service_key: serviceKey,
				enable: !service.enable,
			},
			{
				onSuccess: () => {
					if (serviceKey === 'quickact') {
						window.location.reload();
						return;
					}
					queryClient.invalidateQueries({ queryKey: ['getServiceList'] });
					queryClient.invalidateQueries({ queryKey: ['getEnableServiceList'] });
				},
			},
		);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const { handleBackdropClick } = useModalInteractions({
		isOpen: isMenuOpen,
		onClose: toggleMenu,
	});

	return (
		<>
			<header className="vt-bg-white vt-border-b vt-border-gray-200 vt-py-4 vt-flex vt-items-center vt-justify-between vt-relative">
				{/* Left side - Plugin Title */}
				<Link to="/" className="vt-flex vt-items-center vt-text-blue-600 vt-text-lg vt-font-semibold">
					{__('Versatile Toolkit', 'versatile-toolkit')}
				</Link>

				{/* Right side - Current Service and Toggle Menu Button */}
				<div className="vt-flex vt-items-center vt-gap-3">
					{/* Current Service Display */}
					{currentService && (
						<>
							{Object.keys(currentService?.menus || {}).map((menuKey) => {
								let linkPath = `/${currentService?.path}/${currentService?.menus?.[menuKey]?.slug}`;

								if (linkPath.endsWith('/')) {
									linkPath = linkPath.slice(0, -1);
								}

								return (
									<Link
										key={menuKey}
										to={linkPath}
										onClick={() => {
											console.log('Link clicked, navigating to:', linkPath);
										}}
										className={`vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-transition-colors vt-duration-200 ${location.pathname === linkPath
											? 'vt-bg-blue-600 vt-text-white vt-border vt-border-blue-700 hover:vt-text-white focus:!vt-text-white'
											: 'vt-bg-blue-50 vt-border vt-border-blue-200'
											}`}
									>
										{currentService?.menus?.[menuKey]?.label}
									</Link>
								);
							})}
						</>
					)}

					{/* Troubleshoot Links */}
					{!servicesIsLoading && services?.troubleshoot.enable && !currentService && (
						<>
							<Link
								to="/troubleshoot"
								className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200"
							>
								{__('Deactivate Plugins', 'versatile-toolkit')}
							</Link>
							<Link
								to="/troubleshoot/debug-log"
								className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200"
							>
								{__('Debug Log', 'versatile-toolkit')}
							</Link>
						</>
					)}

					{/* SMTP Link */}
					{/* {!servicesIsLoading && services?.smtp.enable && !currentService && (
						<>
							<Link
								to="/smtp/logs"
								className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200"
							>
								{__('Email Logs', 'versatile-toolkit')}
							</Link>
							<Link
								to="/smtp/connections"
								className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200"
							>
								{__('Email Connections', 'versatile-toolkit')}
							</Link>
							<Link
								to="/smtp/settings"
								className="vt-text-sm vt-font-medium vt-rounded-md vt-px-3 vt-py-1 vt-text-blue-700 vt-bg-blue-50 vt-border vt-border-blue-200"
							>
								{__('SMTP Settings', 'versatile-toolkit')}
							</Link>
						</>
					)} */}

					<Sheet>
						{/* Toggle Menu Button */}
						<SheetTrigger asChild>
							<button
								// className="vt-p-1 vt-rounded-md vt-bg-gray-200 hover:vt-bg-gray-300 vt-transition-colors vt-duration-200"
								className="vt-p-1 vt-rounded-md vt-bg-blue-100 hover:vt-bg-blue-200 vt-transition-colors vt-duration-200"
								aria-label={__('Toggle menu', 'versatile-toolkit')}
							>
								<AlignJustify className='vt-w-5 vt-h-5 vt-text-gray-600' />
							</button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>{__('Services', 'versatile-toolkit')}</SheetTitle>
							</SheetHeader>
							<div className="vt-space-y-3 vt-mt-6">
								{Object.entries(services || {}).map(([key, service]) => (
									<div
										key={service.label}
										onClick={() => toggleService(key, service)}
										className="vt-flex vt-items-center vt-justify-between vt-p-3 vt-rounded-md vt-border vt-border-gray-200 vt-bg-gray-50 hover:vt-bg-blue-100 hover:vt-border-blue-300 hover:vt-shadow-md vt-transition-all vt-duration-300 vt-cursor-pointer"
									>
										<span className="vt-text-blue-500 vt-font-medium hover:vt-text-blue-800 vt-transition-colors vt-duration-300">
											{service.label}
										</span>
										<div className="vt-relative vt-inline-flex vt-items-center vt-cursor-pointer">
											<input
												type="checkbox"
												checked={service.enable}
												onChange={() => { }} // Empty handler since parent div handles the click
												className="vt-sr-only vt-peer"
											/>
											<div className="vt-relative vt-w-11 vt-h-6 vt-bg-[#c7c6c6] peer-focus:vt-outline-none peer-focus:vt-ring-4 peer-focus:vt-ring-blue-300 vt-rounded-full vt-peer peer-checked:after:vt-translate-x-full peer-checked:after:vt-border-white after:vt-content-[''] after:vt-absolute after:vt-top-[2px] after:vt-left-[2px] after:vt-bg-white after:vt-border-gray-300 after:vt-border after:vt-rounded-full after:vt-h-5 after:vt-w-5 after:vt-transition-all peer-checked:vt-bg-blue-600"></div>
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

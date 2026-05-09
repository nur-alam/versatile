import React from 'react';

const TemplateLoader: React.FC = () => {
	return (
		<div className="vt-flex vt-items-center vt-justify-center vt-h-full vt-bg-gray-50 vt-rounded-lg vt-border vt-border-gray-200 vt-p-6">
			<div className="vt-bg-white vt-rounded-2xl vt-shadow-lg vt-p-6 vt-w-72 vt-text-center">
				<div className="vt-w-16 vt-h-16 vt-bg-gray-200 vt-rounded-full vt-mx-auto vt-mb-4 vt-animate-pulse"></div>
				<div className="vt-h-5 vt-bg-gray-300 vt-rounded vt-w-32 vt-mx-auto vt-mb-2 vt-animate-pulse"></div>
				<div className="vt-h-4 vt-bg-gray-200 vt-rounded vt-w-40 vt-mx-auto vt-mb-1 vt-animate-pulse"></div>
				<div className="vt-h-4 vt-bg-gray-100 vt-rounded vt-w-36 vt-mx-auto vt-animate-pulse"></div>
			</div>
		</div>
	);
};

export default TemplateLoader;

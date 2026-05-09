import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { ButtonLoaderProps } from './types';

const sizeClasses = {
	xs: 'vt-w-3 vt-h-3',
	sm: 'vt-w-4 vt-h-4',
	md: 'vt-w-4 vt-h-4',
	lg: 'vt-w-5 vt-h-5',
	xl: 'vt-w-6 vt-h-6',
};

const ButtonLoader = ({ isLoading, loadingText, children, size = 'sm', className }: ButtonLoaderProps) => {
	if (!isLoading) {
		return <>{children}</>;
	}

	const defaultLoadingText = __('Loading', 'versatile-toolkit');
	const displayText = loadingText || `${defaultLoadingText}...`;

	return (
		<div className={cn('vt-flex vt-items-center vt-gap-2', className)}>
			<div className={cn(sizeClasses[size], 'vt-animate-spin')}>
				<svg className="vt-w-full vt-h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeDasharray="31.416"
						strokeDashoffset="31.416"
						className="vt-opacity-25"
					/>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeDasharray="31.416"
						strokeDashoffset="23.562"
						className="vt-opacity-75"
					/>
				</svg>
			</div>
			<span>{displayText}</span>
		</div>
	);
};

export default ButtonLoader;

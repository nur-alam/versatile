import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { PageLoaderProps } from './types';

const sizeClasses = {
	xs: 'vt-w-6 vt-h-6 vt-text-xs',
	sm: 'vt-w-8 vt-h-8 vt-text-sm',
	md: 'vt-w-10 vt-h-10 vt-text-base',
	lg: 'vt-w-12 vt-h-12 vt-text-lg',
	xl: 'vt-w-16 vt-h-16 vt-text-xl',
};

const PageLoader = ({ text, size = 'lg', fullScreen = false, className }: PageLoaderProps) => {
	const loadingText = text || __('Loading', 'versatile-toolkit');

	const containerClasses = fullScreen
		? 'vt-fixed vt-inset-0 vt-bg-background/80 vt-backdrop-blur-sm vt-z-50'
		: 'vt-w-full vt-py-12';

	return (
		<div
			className={cn(
				containerClasses,
				'vt-flex vt-flex-col vt-items-center vt-justify-center vt-gap-4',
				className,
			)}
		>
			<div className={cn(sizeClasses[size], 'vt-animate-spin vt-text-primary')}>
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
			<p className={cn(sizeClasses[size].split(' ')[2], 'vt-text-muted-foreground vt-font-medium')}>
				{loadingText}...
			</p>
		</div>
	);
};

export default PageLoader;

import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { SpinnerLoaderProps } from './types';

const sizeClasses = {
	xs: 'vt- w-3 vt-h-3',
	sm: 'vt-w-4 vt-h-4',
	md: 'vt-w-5 vt-h-5',
	lg: 'vt-w-6 vt-h-6',
	xl: 'vt-w-8 vt-h-8',
};

const textSizeClasses = {
	xs: 'vt-text-xs',
	sm: 'vt-text-sm',
	md: 'vt-text-base',
	lg: 'vt-text-lg',
	xl: 'vt-text-xl',
};

const speedClasses = {
	slow: 'vt-animate-spin vt-duration-1000',
	normal: 'vt-animate-spin',
	fast: 'vt-animate-spin vt-duration-500',
};

const variantClasses = {
	default: 'vt-text-foreground',
	primary: 'vt-text-primary',
	secondary: 'vt-text-secondary',
	muted: 'vt-text-muted-foreground',
};

const SpinnerLoader = ({
	size = 'md',
	variant = 'default',
	className,
	text,
	showText = false,
	speed = 'normal',
}: SpinnerLoaderProps) => {
	const loadingText = text || __('Loading', 'versatile-toolkit');

	return (
		<div className={cn('vt-flex vt-items-center vt-gap-2', className)}>
			<div className={cn(sizeClasses[size], variantClasses[variant], speedClasses[speed])}>
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
			{showText && <span className={cn(textSizeClasses[size], variantClasses[variant])}>{loadingText}...</span>}
		</div>
	);
};

export default SpinnerLoader;

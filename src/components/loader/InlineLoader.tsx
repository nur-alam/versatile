import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { LoaderProps } from './types';

const sizeClasses = {
	xs: 'vt-w-3 vt-h-3 vt-text-xs',
	sm: 'w-4 h-4 text-sm',
	md: 'vt-w-5 vt-h-5 vt-text-base',
	lg: 'vt-w-6 vt-h-6 vt-text-lg',
	xl: 'vt-w-8 vt-h-8 vt-text-xl',
};

const variantClasses = {
	default: 'text-foreground',
	primary: 'text-primary',
	secondary: 'text-secondary',
	muted: 'text-muted-foreground',
};

const InlineLoader = ({ size = 'sm', variant = 'muted', className, text, showText = true }: LoaderProps) => {
	const loadingText = text || __('Loading', 'versatile-toolkit');

	return (
		<div className={cn('flex items-center gap-2 py-2', variantClasses[variant], className)}>
			<div className={cn(sizeClasses[size], 'animate-spin')}>
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
			{showText && <span className={sizeClasses[size].split(' ')[2]}>{loadingText}...</span>}
		</div>
	);
};

export default InlineLoader;

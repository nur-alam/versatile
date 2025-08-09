import { __ } from '@wordpress/i18n';
import { cn } from '@/lib/utils';
import { LoaderProps } from './types';

const sizeClasses = {
	xs: 'w-3 h-3 text-xs',
	sm: 'w-4 h-4 text-sm',
	md: 'w-5 h-5 text-base',
	lg: 'w-6 h-6 text-lg',
	xl: 'w-8 h-8 text-xl',
};

const variantClasses = {
	default: 'text-foreground',
	primary: 'text-primary',
	secondary: 'text-secondary',
	muted: 'text-muted-foreground',
};

const InlineLoader = ({
	size = 'sm',
	variant = 'muted',
	className,
	text,
	showText = true
}: LoaderProps) => {
	const loadingText = text || __('Loading', 'versatile-toolkit');

	return (
		<div className={cn(
			'flex items-center gap-2 py-2',
			variantClasses[variant],
			className
		)}>
			<div className={cn(sizeClasses[size], 'animate-spin')}>
				<svg
					className="w-full h-full"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeDasharray="31.416"
						strokeDashoffset="31.416"
						className="opacity-25"
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
						className="opacity-75"
					/>
				</svg>
			</div>
			{showText && (
				<span className={sizeClasses[size].split(' ')[2]}>
					{loadingText}...
				</span>
			)}
		</div>
	);
};

export default InlineLoader;
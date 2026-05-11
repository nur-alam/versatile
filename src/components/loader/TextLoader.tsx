import { cn } from '@/lib/utils';
import { __ } from '@wordpress/i18n';
import { LoaderProps } from './types';

const sizeClasses = {
	xs: 'vt-text-xs',
	sm: 'vt-text-sm',
	md: 'vt-text-base',
	lg: 'vt-text-lg',
	xl: 'vt-text-xl',
};

const variantClasses = {
	default: 'vt-text-foreground',
	primary: 'vt-text-primary',
	secondary: 'vt-text-secondary',
	muted: 'vt-text-muted-foreground',
};

interface TextLoaderProps extends LoaderProps {
	dots?: boolean;
}

const TextLoader = ({ size = 'md', variant = 'default', className, text, dots = true }: TextLoaderProps) => {
	const loadingText = text || __('Loading', 'versatile-toolkit');
	const displayText = dots ? `${loadingText}...` : loadingText;

	return (
		<span className={cn(sizeClasses[size], variantClasses[variant], 'vt-animate-pulse vt-text-current', className)}>
			{displayText}
		</span>
	);
};

export default TextLoader;

import { __ } from '@wordpress/i18n';
import { cn } from '@/lib/utils';
import { SpinnerLoaderProps } from './types';

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const speedClasses = {
  slow: 'animate-spin duration-1000',
  normal: 'animate-spin',
  fast: 'animate-spin duration-500',
};

const variantClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
};

const SpinnerLoader = ({ 
  size = 'md', 
  variant = 'default', 
  className, 
  text,
  showText = false,
  speed = 'normal'
}: SpinnerLoaderProps) => {
  const loadingText = text || __('Loading', 'versatile');

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        sizeClasses[size],
        variantClasses[variant],
        speedClasses[speed]
      )}>
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
        <span className={cn(
          textSizeClasses[size],
          variantClasses[variant]
        )}>
          {loadingText}...
        </span>
      )}
    </div>
  );
};

export default SpinnerLoader;
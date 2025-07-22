import { __ } from '@wordpress/i18n';
import { cn } from '@/lib/utils';
import { ButtonLoaderProps } from './types';

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

const ButtonLoader = ({ 
  isLoading, 
  loadingText, 
  children, 
  size = 'sm', 
  className 
}: ButtonLoaderProps) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  const defaultLoadingText = __('Loading', 'versatile');
  const displayText = loadingText || `${defaultLoadingText}...`;

  return (
    <div className={cn('flex items-center gap-2', className)}>
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
      <span>{displayText}</span>
    </div>
  );
};

export default ButtonLoader;
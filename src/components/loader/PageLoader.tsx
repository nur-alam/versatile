import { __ } from '@wordpress/i18n';
import { cn } from '@/lib/utils';
import { PageLoaderProps } from './types';

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const PageLoader = ({ 
  text, 
  size = 'lg', 
  fullScreen = false, 
  className 
}: PageLoaderProps) => {
  const loadingText = text || __('Loading', 'versatile-toolkit');

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50' 
    : 'w-full py-12';

  return (
    <div className={cn(
      containerClasses,
      'flex flex-col items-center justify-center gap-4',
      className
    )}>
      <div className={cn(sizeClasses[size], 'animate-spin text-primary')}>
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
      <p className={cn(
        sizeClasses[size].split(' ')[2],
        'text-muted-foreground font-medium'
      )}>
        {loadingText}...
      </p>
    </div>
  );
};

export default PageLoader;
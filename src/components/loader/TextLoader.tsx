import { __ } from '@wordpress/i18n';
import { cn } from '@/lib/utils';
import { LoaderProps } from './types';

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const variantClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
};

interface TextLoaderProps extends LoaderProps {
  dots?: boolean;
}

const TextLoader = ({ 
  size = 'md', 
  variant = 'default', 
  className, 
  text,
  dots = true
}: TextLoaderProps) => {
  const loadingText = text || __('Loading', 'versatile');
  const displayText = dots ? `${loadingText}...` : loadingText;

  return (
    <span className={cn(
      sizeClasses[size],
      variantClasses[variant],
      'animate-pulse',
      className
    )}>
      {displayText}
    </span>
  );
};

export default TextLoader;
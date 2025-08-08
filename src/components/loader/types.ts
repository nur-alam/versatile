export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'default' | 'primary' | 'secondary' | 'muted';

export interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  className?: string;
  text?: string;
  showText?: boolean;
}

export interface SpinnerLoaderProps extends LoaderProps {
  speed?: 'slow' | 'normal' | 'fast';
}

export interface ButtonLoaderProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  size?: LoaderSize;
  className?: string;
}

export interface SkeletonLoaderProps {
  lines?: number;
  rows?: number;
  width?: string;
  height?: string;
  className?: string;
  animate?: boolean;
}

export interface PageLoaderProps {
  text?: string;
  size?: LoaderSize;
  fullScreen?: boolean;
  className?: string;
}

export interface TemplateLoaderProps extends Omit<SkeletonLoaderProps, 'lines' | 'rows'> {
  count?: number;
  showPreview?: boolean;
  cardClassName?: string;
}
import { cn } from '@/lib/utils';
import { SkeletonLoaderProps } from './types';

const SkeletonLoader = ({
  lines = 1,
  rows = 1,
  height = 'h-4',
  width = 'w-[100px]',
  className,
  animate = true
}: SkeletonLoaderProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={cn('flex gap-2', width)}>
          {Array.from({ length: lines }).map((_, lineIndex) => (
            <div
              key={lineIndex}
              className={cn(
                'bg-muted rounded',
                height,
                animate && 'animate-pulse',
                // Vary the width for more realistic skeleton
                lineIndex === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
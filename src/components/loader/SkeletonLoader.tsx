import { cn } from '@/lib/utils';
import { SkeletonLoaderProps } from './types';

const SkeletonLoader = ({
	lines = 1,
	rows = 1,
	height = 'vt-h-4',
	width = 'vt-w-[100px]',
	className,
	animate = true,
}: SkeletonLoaderProps) => {
	return (
		<div className={cn('vt-flex vt-flex-col vt-gap-2', className)}>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} className={cn('vt-flex vt-gap-2', width)}>
					{Array.from({ length: lines }).map((_, lineIndex) => (
						<div
							key={lineIndex}
							className={cn(
								'vt-bg-muted vt-rounded',
								height,
								animate && 'vt-animate-pulse',
								// Vary the width for more realistic skeleton
								lineIndex === lines - 1 && lines > 1 ? 'vt-w-3/4' : 'vt-w-full',
							)}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default SkeletonLoader;

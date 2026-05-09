import { cn } from '@/lib/utils';
import SkeletonLoader from './SkeletonLoader';

interface MoodSkeletonProps {
	className?: string;
	animate?: boolean;
}

const MoodSkeleton = ({ className, animate = true }: MoodSkeletonProps) => {
	return (
		<div className={cn('space-y-6', className)}>
			{/* Header Section */}
			<div className="vt-flex vt-justify-between vt-items-center vt-pb-5">
				<div className="vt-flex vt-items-center vt-gap-2">
					<SkeletonLoader width="w-6" height="h-6" animate={animate} />
					<SkeletonLoader width="w-48" height="h-8" animate={animate} />
				</div>
				<div className="vt-flex vt-gap-5">
					<SkeletonLoader width="w-32" height="h-10" animate={animate} />
					<SkeletonLoader width="w-24" height="h-10" animate={animate} />
				</div>
			</div>

			{/* Template Selector Section */}
			<div className="vt-space-y-4">
				<SkeletonLoader width="w-32" height="h-5" animate={animate} />

				{/* Template Cards Grid */}
				<div className="vt-grid vt-grid-cols-6 vt-gap-4">
					{Array.from({ length: 6 }).map((_, index) => (
						<div key={index} className="vt-space-y-3">
							{/* Template Card */}
							<div
								className={cn(
									'vt-aspect-[4/3] vt-bg-muted vt-rounded-lg vt-border-2',
									animate && 'vt-animate-pulse',
								)}
							/>
							{/* Template Name */}
							<SkeletonLoader width="w-16" height="h-4" animate={animate} />
							{/* Template Description */}
							<SkeletonLoader rows={2} lines={1} width="w-full" height="h-3" animate={animate} />
							{/* Action Buttons */}
							<div className="vt-flex vt-gap-2">
								<SkeletonLoader width="w-12" height="h-6" animate={animate} />
								<SkeletonLoader width="w-14" height="h-6" animate={animate} />
							</div>
						</div>
					))}
				</div>

				<SkeletonLoader width="w-80" height="h-4" animate={animate} />
			</div>

			{/* Form Fields Section */}
			<div className="vt-flex vt-gap-10">
				{/* Left Column */}
				<div className="w-1/2 vt-space-y-6">
					{/* Enable Switch */}
					<div className="vt-space-y-2">
						<div className="vt-flex vt-items-center vt-gap-2">
							<SkeletonLoader width="w-40" height="h-5" animate={animate} />
							<SkeletonLoader width="w-12" height="h-6" animate={animate} />
						</div>
						<SkeletonLoader width="w-64" height="h-4" animate={animate} />
					</div>

					{/* Title Field */}
					<div className="vt-space-y-2">
						<SkeletonLoader width="w-12" height="h-5" animate={animate} />
						<SkeletonLoader width="w-full" height="h-10" animate={animate} />
						<SkeletonLoader width="w-72" height="h-4" animate={animate} />
					</div>

					{/* Subtitle Field */}
					<div className="vt-space-y-2">
						<SkeletonLoader width="w-16" height="h-5" animate={animate} />
						<SkeletonLoader width="w-full" height="h-10" animate={animate} />
						<SkeletonLoader width="w-48" height="h-4" animate={animate} />
					</div>

					{/* Description Field */}
					<div className="vt-space-y-2">
						<SkeletonLoader width="w-20" height="h-5" animate={animate} />
						<SkeletonLoader width="w-full" height="h-24" animate={animate} />
						<SkeletonLoader width="w-64" height="h-4" animate={animate} />
					</div>
				</div>

				{/* Right Column */}
				<div className="w-1/2 vt-space-y-6">
					{/* Background Image Field */}
					<div className="vt-space-y-2">
						<SkeletonLoader width="w-32" height="h-5" animate={animate} />
						<div className="vt-space-y-3">
							<SkeletonLoader width="w-48" height="h-10" animate={animate} />
							{/* Image Preview */}
							<div
								className={cn('vt-w-40 vt-h-32 vt-bg-muted vt-rounded-lg', animate && 'animate-pulse')}
							/>
							<SkeletonLoader width="w-24" height="h-4" animate={animate} />
							<SkeletonLoader width="w-80" height="h-4" animate={animate} />
						</div>
						<SkeletonLoader width="w-72" height="h-4" animate={animate} />
					</div>

					{/* Logo Field */}
					<div className="vt-space-y-2">
						<SkeletonLoader width="w-12" height="h-5" animate={animate} />
						<div className="vt-space-y-3">
							<SkeletonLoader width="w-32" height="h-10" animate={animate} />
							<SkeletonLoader width="w-16" height="h-4" animate={animate} />
						</div>
						<SkeletonLoader width="w-68" height="h-4" animate={animate} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MoodSkeleton;

import { cn } from '@/lib/utils';
import SkeletonLoader from './SkeletonLoader';

interface MoodSkeletonProps {
  className?: string;
  animate?: boolean;
}

const MoodSkeleton = ({ 
  className, 
  animate = true 
}: MoodSkeletonProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Section */}
      <div className="flex justify-between items-center pb-5">
        <div className="flex items-center gap-2">
          <SkeletonLoader width="w-6" height="h-6" animate={animate} />
          <SkeletonLoader width="w-48" height="h-8" animate={animate} />
        </div>
        <div className="flex gap-5">
          <SkeletonLoader width="w-32" height="h-10" animate={animate} />
          <SkeletonLoader width="w-24" height="h-10" animate={animate} />
        </div>
      </div>

      {/* Template Selector Section */}
      <div className="space-y-4">
        <SkeletonLoader width="w-32" height="h-5" animate={animate} />
        
        {/* Template Cards Grid */}
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              {/* Template Card */}
              <div className={cn(
                'aspect-[4/3] bg-muted rounded-lg border-2',
                animate && 'animate-pulse'
              )} />
              {/* Template Name */}
              <SkeletonLoader width="w-16" height="h-4" animate={animate} />
              {/* Template Description */}
              <SkeletonLoader rows={2} lines={1} width="w-full" height="h-3" animate={animate} />
              {/* Action Buttons */}
              <div className="flex gap-2">
                <SkeletonLoader width="w-12" height="h-6" animate={animate} />
                <SkeletonLoader width="w-14" height="h-6" animate={animate} />
              </div>
            </div>
          ))}
        </div>
        
        <SkeletonLoader width="w-80" height="h-4" animate={animate} />
      </div>

      {/* Form Fields Section */}
      <div className="flex gap-10">
        {/* Left Column */}
        <div className="w-1/2 space-y-6">
          {/* Enable Switch */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SkeletonLoader width="w-40" height="h-5" animate={animate} />
              <SkeletonLoader width="w-12" height="h-6" animate={animate} />
            </div>
            <SkeletonLoader width="w-64" height="h-4" animate={animate} />
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <SkeletonLoader width="w-12" height="h-5" animate={animate} />
            <SkeletonLoader width="w-full" height="h-10" animate={animate} />
            <SkeletonLoader width="w-72" height="h-4" animate={animate} />
          </div>

          {/* Subtitle Field */}
          <div className="space-y-2">
            <SkeletonLoader width="w-16" height="h-5" animate={animate} />
            <SkeletonLoader width="w-full" height="h-10" animate={animate} />
            <SkeletonLoader width="w-48" height="h-4" animate={animate} />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <SkeletonLoader width="w-20" height="h-5" animate={animate} />
            <SkeletonLoader width="w-full" height="h-24" animate={animate} />
            <SkeletonLoader width="w-64" height="h-4" animate={animate} />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/2 space-y-6">
          {/* Background Image Field */}
          <div className="space-y-2">
            <SkeletonLoader width="w-32" height="h-5" animate={animate} />
            <div className="space-y-3">
              <SkeletonLoader width="w-48" height="h-10" animate={animate} />
              {/* Image Preview */}
              <div className={cn(
                'w-40 h-32 bg-muted rounded-lg',
                animate && 'animate-pulse'
              )} />
              <SkeletonLoader width="w-24" height="h-4" animate={animate} />
              <SkeletonLoader width="w-80" height="h-4" animate={animate} />
            </div>
            <SkeletonLoader width="w-72" height="h-4" animate={animate} />
          </div>

          {/* Logo Field */}
          <div className="space-y-2">
            <SkeletonLoader width="w-12" height="h-5" animate={animate} />
            <div className="space-y-3">
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
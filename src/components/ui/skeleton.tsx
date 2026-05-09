import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('vt-animate-pulse vt-rounded-md vt-bg-primary/10', className)} {...props} />;
}

export { Skeleton };

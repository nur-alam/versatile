import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
	'vt-inline-flex vt-items-center vt-rounded-full vt-px-2.5 vt-py-0.5 vt-text-xs vt-font-semibold vt-transition-colors focus:vt-outline-none focus:vt-ring-2 focus:vt-ring-ring focus:vt-ring-offset-2',
	{
		variants: {
			variant: {
				default: 'vt-bg-primary vt-text-primary-foreground hover:vt-bg-primary/80',
				success: 'vt-bg-green-100 vt-text-green-800 hover:vt-bg-green-200/80',
				destructive: 'vt-bg-destructive vt-text-destructive-foreground hover:vt-bg-destructive/80',
				outline:
					'vt-text-foreground vt-border vt-border-input vt-bg-background hover:vt-bg-accent hover:vt-text-accent-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

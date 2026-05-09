import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
	'vt-inline-flex vt-items-center vt-justify-center vt-whitespace-nowrap vt-rounded-md vt-text-sm vt-font-medium vt-transition-colors focus-visible:vt-outline-none focus-visible:vt-ring-1 focus-visible:vt-ring-ring disabled:vt-pointer-events-none disabled:vt-opacity-50',
	{
		variants: {
			variant: {
				default: 'vt-bg-primary vt-text-primary-foreground vt-shadow hover:vt-bg-primary/90',
				destructive: 'vt-bg-destructive vt-text-destructive-foreground vt-shadow-sm hover:vt-bg-destructive/90',
				outline:
					'vt-border vt-border-input vt-bg-background vt-shadow-sm hover:vt-bg-accent hover:vt-text-accent-foreground',
				secondary: 'vt-bg-secondary vt-text-secondary-foreground vt-shadow-sm hover:vt-bg-slate-200',
				ghost: 'hover:vt-bg-accent hover:vt-text-accent-foreground',
				link: 'vt-text-primary vt-underline-offset-4 hover:vt-vt-underline',
			},
			size: {
				default: 'vt-h-9 vt-px-4 vt-py-2',
				xs: 'vt-h-6 vt-rounded-sm vt-px-3 vt-text-xs',
				sm: 'vt-h-8 vt-rounded-md vt-px-3 vt-text-xs',
				lg: 'vt-h-10 vt-rounded-md vt-px-8',
				icon: 'vt-h-9 vt-w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	},
);
Button.displayName = 'Button';

export { Button, buttonVariants };

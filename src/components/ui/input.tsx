import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'vt-flex vt-h-9 vt-rounded-md vt-border vt-border-input vt-bg-transparent vt-min-h-[unset] vt-px-3 vt-py-1 vt-text-base vt-shadow-sm vt-transition-colors file:vt-border-0 file:vt-bg-transparent file:vt-text-sm file:vt-font-medium file:vt-text-foreground placeholder:vt-text-muted-foreground focus-visible:vt-outline-none focus-visible:vt-ring-1 focus-visible:vt-ring-ring disabled:vt-cursor-not-allowed disabled:vt-opacity-50 md:vt-text-sm',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = 'Input';

export { Input };

import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					'vt-flex vt-min-h-[60px] vt-w-full vt-rounded-md vt-border vt-border-input vt-bg-transparent vt-px-3 vt-py-2 vt-text-base vt-shadow-sm vt-placeholder:text-muted-foreground focus-visible:vt-outline-none focus-visible:vt-ring-1 focus-visible:vt-ring-ring disabled:vt-cursor-not-allowed disabled:vt-opacity-50 md:text-sm',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = 'Textarea';

export { Textarea };

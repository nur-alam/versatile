import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer vt-h-4 vt-w-4 vt-shrink-0 vt-rounded-sm vt-border vt-border-primary vt-shadow focus-visible:vt-outline-none focus-visible:vt-ring-1 focus-visible:vt-ring-ring disabled:vt-cursor-not-allowed disabled:vt-opacity-50 data-[state=checked]:vt-bg-primary data-[state=checked]:vt-text-primary-foreground',
			className,
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className={cn('vt-flex vt-items-center vt-justify-center vt-text-current')}>
			<Check className="vt-h-4 vt-w-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

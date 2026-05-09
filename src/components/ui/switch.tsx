import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			'vt-peer vt-inline-flex vt-h-5 vt-w-9 vt-shrink-0 vt-cursor-pointer vt-items-center vt-rounded-full vt-border-2 vt-border-transparent vt-shadow-sm vt-transition-colors focus-visible:vt-outline-none focus-visible:vt-ring-2 focus-visible:vt-ring-ring focus-visible:vt-ring-offset-2 focus-visible:vt-ring-offset-background disabled:vt-cursor-not-allowed disabled:vt-opacity-50 data-[state=checked]:vt-bg-primary data-[state=unchecked]:vt-bg-input',
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				'vt-pointer-events-none vt-block vt-h-4 vt-w-4 vt-rounded-full vt-bg-background vt-shadow-lg vt-ring-0 vt-transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

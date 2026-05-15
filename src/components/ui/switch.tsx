import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			'vt-peer vt-inline-flex vt-h-6 vt-w-11 vt-shrink-0 vt-cursor-pointer vt-items-center vt-rounded-full vt-border-2 vt-border-transparent vt-transition-colors focus-visible:vt-outline-none focus-visible:vt-ring-4 focus-visible:vt-ring-blue-300 disabled:vt-cursor-not-allowed disabled:vt-opacity-50 data-[state=checked]:vt-bg-blue-600 data-[state=unchecked]:vt-bg-[#c7c6c6]',
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				'vt-pointer-events-none vt-block vt-h-5 vt-w-5 vt-rounded-full vt-bg-white vt-border vt-border-gray-300 vt-shadow-lg vt-ring-0 vt-transition-transform data-[state=checked]:vt-translate-x-5 data-[state=unchecked]:vt-translate-x-0',
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

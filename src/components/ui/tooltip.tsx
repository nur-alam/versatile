import { cn } from '@/lib/utils';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={cn(
			'vt-z-50 vt-overflow-hidden vt-rounded-md vt-bg-primary vt-px-3 vt-py-1.5 vt-text-xs vt-text-primary-foreground vt-animate-in vt-fade-in-0 vt-zoom-in-95 data-[state=closed]:vt-animate-out data-[state=closed]:vt-fade-out-0 data-[state=closed]:vt-zoom-out-95 data-[side=bottom]:vt-slide-in-from-top-2 data-[side=left]:vt-slide-in-from-right-2 data-[side=right]:vt-slide-in-from-left-2 data-[side=top]:vt-slide-in-from-bottom-2',
			className,
		)}
		{...props}
	/>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

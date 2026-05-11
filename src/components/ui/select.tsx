import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			'vt-flex vt-h-10 vt-items-center vt-justify-between vt-rounded-md vt-border vt-border-input vt-bg-background vt-px-3 vt-py-2 vt-text-sm vt-ring-offset-background placeholder:vt-text-muted-foreground focus:vt-outline-none focus:vt-ring-2 focus:vt-ring-ring focus:vt-ring-offset-2 disabled:vt-cursor-not-allowed disabled:vt-opacity-50',
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="vt-h-4 vt-w-4 vt-opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				'vt-relative vt-z-[100000] vt-min-w-[8rem] vt-overflow-hidden vt-rounded-md vt-border vt-bg-popover vt-text-popover-foreground vt-shadow-md data-[state=open]:vt-animate-in data-[state=closed]:vt-animate-out data-[state=closed]:vt-fade-out-0 data-[state=open]:vt-fade-in-0 data-[state=closed]:vt-zoom-out-95 data-[state=open]:vt-zoom-in-95 data-[side=bottom]:vt-slide-in-from-top-2 data-[side=left]:vt-slide-in-from-right-2 data-[side=right]:vt-slide-in-from-left-2 data-[side=top]:vt-slide-in-from-bottom-2',
				position === 'popper' &&
					'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				className,
			)}
			position={position}
			{...props}
		>
			<SelectPrimitive.Viewport
				className={cn(
					'vt-p-1',
					position === 'popper' &&
						'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			'vt-relative vt-flex vt-w-full vt-cursor-default vt-select-none vt-items-center vt-rounded-sm vt-py-1.5 vt-pl-8 vt-pr-2 vt-text-sm vt-outline-none focus:vt-bg-accent focus:vt-text-accent-foreground data-[disabled]:vt-pointer-events-none data-[disabled]:vt-opacity-50',
			className,
		)}
		{...props}
	>
		<span className="vt-absolute vt-left-2 vt-flex h-3.5 w-3.5 vt-items-center vt-justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="vt-h-4 vt-w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue };

'use client';

import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import * as React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			'vt-flex vt-h-full vt-w-full vt-flex-col vt-overflow-hidden vt-rounded-md vt-bg-popover vt-text-popover-foreground',
			className,
		)}
		{...props}
	/>
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent className="vt-overflow-hidden vt-p-0">
				<Command className="vt-flex vt-h-full vt-w-full vt-flex-col vt-overflow-hidden vt-rounded-md vt-bg-popover vt-text-popover-foreground [&_[cmdk-group-heading]]:vt-px-2 [&_[cmdk-group-heading]]:vt-font-medium [&_[cmdk-group-heading]]:vt-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:vt-pt-0 [&_[cmdk-group]]:vt-px-2 [&_[cmdk-input-wrapper]_svg]:vt-h-5 [&_[cmdk-input-wrapper]_svg]:vt-w-5 [&_[cmdk-input]]:vt-h-12 [&_[cmdk-item]]:vt-px-2 [&_[cmdk-item]]:vt-py-3 [&_[cmdk-item]_svg]:vt-h-5 [&_[cmdk-item]_svg]:vt-w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div className="vt-relative vt-flex vt-items-center vt-border-b vt-pb-2" cmdk-input-wrapper="">
		<Search className="vt-absolute vt-left-2 vt-h-4 vt-w-4 vt-shrink-0 vt-opacity-50" />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				'vt-flex vt-h-10 vt-w-full vt-rounded-md vt-bg-transparent vt-py-3 vt-pl-7 vt-text-sm vt-outline-none vt-placeholder:vt-text-muted-foreground disabled:vt-cursor-not-allowed disabled:vt-opacity-50',
				className,
			)}
			{...props}
		/>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn('vt-max-h-[300px] vt-pt-2 vt-overflow-y-auto vt-overflow-x-hidden', className)}
		{...props}
	/>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="vt-py-6 vt-text-center vt-text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			'vt-overflow-hidden vt-p-1 vt-text-foreground [&_[cmdk-group-heading]]:vt-px-2 [&_[cmdk-group-heading]]:vt-py-1.5 [&_[cmdk-group-heading]]:vt-text-xs [&_[cmdk-group-heading]]:vt-font-medium [&_[cmdk-group-heading]]:vt-text-muted-foreground',
			className,
		)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator ref={ref} className={cn('vt-mx-1 vt-h-px vt-bg-border', className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'vt-relative vt-flex vt-cursor-default vt-gap-2 vt-select-none vt-items-center vt-rounded-sm vt-px-2 vt-py-1.5 vt-text-sm vt-outline-none data-[disabled=true]:vt-pointer-events-none data-[selected=true]:vt-bg-accent data-[selected=true]:vt-text-accent-foreground data-[disabled=true]:vt-opacity-50 [&_svg]:vt-pointer-events-none [&_svg]:vt-size-4 [&_svg]:vt-shrink-0',
			className,
		)}
		{...props}
	/>
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn('vt-ml-auto vt-text-xs vt-tracking-widest vt- text-muted-foreground', className)}
			{...props}
		/>
	);
};
CommandShortcut.displayName = 'CommandShortcut';

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};

'use client';

import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { __ } from '@wordpress/i18n';
import { X } from 'lucide-react';
import * as React from 'react';

export const closeBtnClassName = 'vt-absolute vt-top-4 vt-right-4 vt-p-2 vt-rounded-md vt-text-sm vt-font-medium vt-transition-colors focus-visible:vt-outline-none focus-visible:vt-ring-1 focus-visible:vt-ring-ring disabled:vt-pointer-events-none disabled:vt-opacity-50 hover:vt-bg-accent hover:vt-text-accent-foreground';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			'vt-fixed vt-inset-0 vt-z-[99999] vt-bg-black/80 vt-data-[state=open]:vt-animate-in vt-data-[state=closed]:vt-animate-out vt-data-[state=closed]:vt-fade-out-0 vt-data-[state=open]:vt-fade-in-0',
			className,
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				'vt-fixed vt-left-[50%] vt-top-[50%] vt-grid vt-w-full vt-translate-x-[-50%] vt-translate-y-[-50%] vt-gap-4 vt-border vt-bg-background vt-p-6 vt-shadow-lg vt-duration-200 vt-data-[state=open]:vt-animate-in vt-data-[state=closed]:vt-animate-out vt-data-[state=closed]:vt-fade-out-0 vt-data-[state=open]:vt-fade-in-0 vt-data-[state=closed]:vt-zoom-out-95 vt-data-[state=open]:vt-zoom-in-95 vt-data-[state=closed]:vt-slide-out-to-left-1/2 vt-data-[state=closed]:vt-slide-out-to-top-[48%] vt-data-[state=open]:vt-slide-in-from-left-1/2 vt-data-[state=open]:vt-slide-in-from-top-[48%] sm:vt-rounded-lg',
				'vt-max-w-4xl vt-z-[99999]',
				className,
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className={closeBtnClassName}>
				<X size={16} />
				<span className="vt-sr-only">{__('Close', 'trigger')}</span>
			</DialogPrimitive.Close>	
		</DialogPrimitive.Content>
	</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('vt-flex vt-flex-col vt-space-y-1.5 vt-text-center sm:vt-text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('vt-flex vt-flex-col-reverse sm:vt-flex-row sm:vt-justify-end sm:vt-space-x-2', className)}
		{...props}
	/>
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn('vt-text-lg vt-font-semibold vt-leading-none vt-tracking-tight', className)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn('vt-text-sm vt-text-muted-foreground', className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { closeBtnClassName } from './dialog';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay
		className={cn(
			'vt-fixed vt-inset-0 vt-z-[99999] vt-bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className,
		)}
		{...props}
		ref={ref}
	/>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
	'vt-fixed vt-z-50 vt-gap-4 vt-bg-background vt-p-6 vt-shadow-lg vt-transition vt-ease-in-out data-[state=closed]:vt-duration-300 data-[state=open]:vt-duration-500 data-[state=open]:vt-animate-in data-[state=closed]:vt-animate-out',
	{
		variants: {
			side: {
				top: 'vt-inset-x-0 vt-top-0 vt-border-b data-[state=closed]:vt-slide-out-to-top data-[state=open]:vt-slide-in-from-top',
				bottom: 'vt-inset-x-0 vt-bottom-0 vt-border-t data-[state=closed]:vt-slide-out-to-bottom data-[state=open]:vt-slide-in-from-bottom',
				left: 'vt-inset-y-0 vt-left-0 vt-h-full vt-w-3/4 vt-border-r data-[state=closed]:vt-slide-out-to-left data-[state=open]:vt-slide-in-from-left sm:max-w-sm',
				right: 'vt-inset-y-0 vt-right-0 vt-h-full vt-w-3/4 vt-border-l data-[state=closed]:vt-slide-out-to-right data-[state=open]:vt-slide-in-from-right sm:max-w-sm',
			},
		},
		defaultVariants: {
			side: 'right',
		},
	},
);

interface SheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
	({ side = 'right', className, children, ...props }, ref) => (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				ref={ref}
				className={cn(sheetVariants({ side }), 'vt-z-[99999] sm:vt-max-w-[540px]', className)}
				{...props}
			>
				{/* 'vt-absolute vt-right-4 vt-top-4 vt-rounded-sm vt-opacity-70 vt-ring-offset-background vt-transition-opacity hover:vt-opacity-100 focus:vt-outline-none focus:vt-ring-2 focus:vt-ring-ring focus:vt-ring-offset-2 disabled:vt-pointer-events-none data-[state=open]:vt-bg-secondary' */}
				{/* <SheetPrimitive.Close className="vt-rounded-sm vt-absolute vt-top-2 vt-right-2 vt-p-2 vt-opacity-70 vt-transition-opacity hover:vt-opacity-100 hover:vt-bg-accent hover:vt-text-accent-foreground"> */}
				<SheetPrimitive.Close className={closeBtnClassName}>
					<X size={16} />
					<span className="vt-sr-only">Close</span>
				</SheetPrimitive.Close>
				{children}
			</SheetPrimitive.Content>
		</SheetPortal>
	),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('vt-flex vt-flex-col vt-space-y-2 vt-text-center sm:vt-text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn('vt-flex vt-flex-col-reverse sm:vt-flex-row sm:vt-justify-end sm:vt-space-x-2', className)}
		{...props}
	/>
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ref}
		className={cn('vt-text-lg vt-font-semibold vt-text-foreground', className)}
		{...props}
	/>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description ref={ref} className={cn('vt-text-sm vt-text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetOverlay,
	SheetPortal,
	SheetTitle,
	SheetTrigger,
};

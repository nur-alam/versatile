import { Button, ButtonProps } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import React from 'react';

export interface ConfirmationDialogProps {
	// Dialog state
	open: boolean;
	onOpenChange: (open: boolean) => void;

	// Content
	title?: React.ReactNode;
	description?: React.ReactNode;
	children?: React.ReactNode;

	// Icons and visual elements
	icon?: React.ReactNode;
	variant?: 'default' | 'danger' | 'warning' | 'success';

	// Actions
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;

	// Button customization
	confirmText?: React.ReactNode;
	cancelText?: React.ReactNode;
	confirmButtonProps?: Omit<ButtonProps, 'onClick'>;
	cancelButtonProps?: Omit<ButtonProps, 'onClick'>;

	// Loading state
	loading?: boolean;
	loadingText?: string;

	// Additional styling
	className?: string;
	contentClassName?: string;
	headerClassName?: string;
	footerClassName?: string;

	// Behavior
	closeOnConfirm?: boolean;
	preventCloseOnOutsideClick?: boolean;

	// Footer customization
	hideFooter?: boolean;
	footerContent?: React.ReactNode;

	// Custom components
	CustomHeader?: React.ComponentType<{ className?: string }>;
	CustomFooter?: React.ComponentType<{ className?: string }>;
}

const variantStyles = {
	default: {
		confirmButton: 'vt-bg-primary vt-hover:vt-bg-primary/90',
		icon: 'vt-text-primary',
	},
	danger: {
		confirmButton: 'vt-bg-destructive vt-hover:vt-bg-destructive/90 vt-text-destructive-foreground',
		icon: 'vt-text-destructive',
	},
	warning: {
		confirmButton: 'vt-bg-yellow-500 vt-hover:vt-bg-yellow-600 vt-text-white',
		icon: 'vt-text-yellow-500',
	},
	success: {
		confirmButton: 'vt-bg-green-500 vt-hover:vt-bg-green-600 vt-text-white',
		icon: 'vt-text-green-500',
	},
};

export const ConfirmationDialog = ({
	// Dialog state
	open,
	onOpenChange,

	// Content
	title = 'Confirm Action',
	description,
	children,

	// Icons and visual
	icon,
	variant = 'default',

	// Actions
	onConfirm,
	onCancel,

	// Button customization
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmButtonProps,
	cancelButtonProps,

	// Loading state
	loading = false,
	loadingText = 'Processing...',

	// Styling
	className,
	contentClassName,
	headerClassName,
	footerClassName,

	// Behavior
	closeOnConfirm = true,
	preventCloseOnOutsideClick = false,

	// Footer customization
	hideFooter = false,
	footerContent,

	// Custom components
	CustomHeader,
	CustomFooter,
}: ConfirmationDialogProps) => {
	const handleConfirm = async () => {
		try {
			await onConfirm();
			if (closeOnConfirm) {
				onOpenChange(false);
			}
		} catch (error) {
			console.error('Confirmation action failed:', error);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (preventCloseOnOutsideClick && open && !newOpen) {
			return;
		}
		onOpenChange(newOpen);
		if (!newOpen && onCancel) {
			onCancel();
		}
	};

	const variantStyle = variantStyles[variant];

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className={cn('sm:vt-max-w-[425px]', contentClassName, className)}>
				{CustomHeader ? (
					<CustomHeader className={headerClassName} />
				) : (
					<DialogHeader className={headerClassName}>
						<DialogTitle className="vt-flex vt-items-center vt-gap-2">
							{title}
						</DialogTitle>
						{description && <DialogDescription>{description}</DialogDescription>}
						{/* {icon && <div className="vt-mt-4">{icon}</div>}
						{!icon && (
							<Button type="button" variant="ghost" size="sm" onClick={(e) => handleOpenChange(false)}>
								<X size={16} />
							</Button>
						)} */}
					</DialogHeader>
				)}

				{children}

				{!hideFooter && (
					<DialogFooter className={footerClassName}>
						{footerContent || (
							<>
								<Button
									variant="outline"
									onClick={() => handleOpenChange(false)}
									disabled={loading}
									{...cancelButtonProps}
								>
									{cancelText}
								</Button>
								<Button
									className={cn(variantStyle.confirmButton)}
									disabled={loading}
									onClick={handleConfirm}
									{...confirmButtonProps}
								>
									{loading && <Loader2 className="vt-mr-2 vt-h-4 vt-w-4 vt-animate-spin" />}
									{loading ? loadingText : confirmText}
								</Button>
							</>
						)}
					</DialogFooter>
				)}

				{CustomFooter && <CustomFooter className={footerClassName} />}
			</DialogContent>
		</Dialog>
	);
};

// Compound components for flexible usage
ConfirmationDialog.Header = DialogHeader;
ConfirmationDialog.Footer = DialogFooter;
ConfirmationDialog.Title = DialogTitle;
ConfirmationDialog.Description = DialogDescription;

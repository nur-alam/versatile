import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ConfirmationDialogProps {
	// Dialog state
	open: boolean
	onOpenChange: (open: boolean) => void

	// Content
	title?: React.ReactNode
	description?: React.ReactNode
	children?: React.ReactNode

	// Icons and visual elements
	icon?: React.ReactNode
	variant?: 'default' | 'danger' | 'warning' | 'success'

	// Actions
	onConfirm: () => void | Promise<void>
	onCancel?: () => void

	// Button customization
	confirmText?: React.ReactNode
	cancelText?: React.ReactNode
	confirmButtonProps?: Omit<ButtonProps, 'onClick'>
	cancelButtonProps?: Omit<ButtonProps, 'onClick'>

	// Loading state
	loading?: boolean
	loadingText?: string

	// Additional styling
	className?: string
	contentClassName?: string
	headerClassName?: string
	footerClassName?: string

	// Behavior
	closeOnConfirm?: boolean
	preventCloseOnOutsideClick?: boolean

	// Footer customization
	hideFooter?: boolean
	footerContent?: React.ReactNode

	// Custom components
	CustomHeader?: React.ComponentType<{ className?: string }>
	CustomFooter?: React.ComponentType<{ className?: string }>
}

const variantStyles = {
	default: {
		confirmButton: 'bg-primary hover:bg-primary/90',
		icon: 'text-primary',
	},
	danger: {
		confirmButton: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
		icon: 'text-destructive',
	},
	warning: {
		confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
		icon: 'text-yellow-500',
	},
	success: {
		confirmButton: 'bg-green-500 hover:bg-green-600 text-white',
		icon: 'text-green-500',
	},
}

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
			await onConfirm()
			if (closeOnConfirm) {
				onOpenChange(false)
			}
		} catch (error) {
			console.error('Confirmation action failed:', error)
		}
	}

	const handleOpenChange = (newOpen: boolean) => {
		if (preventCloseOnOutsideClick && open && !newOpen) {
			return
		}
		onOpenChange(newOpen)
		if (!newOpen && onCancel) {
			onCancel()
		}
	}

	const variantStyle = variantStyles[variant]

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				className={cn(
					'sm:max-w-[425px]',
					contentClassName,
					className
				)}
			>
				{CustomHeader ? (
					<CustomHeader className={headerClassName} />
				) : (
					<DialogHeader className={headerClassName}>
						<DialogTitle className="flex items-center gap-2">
							{icon}
							{title}
						</DialogTitle>
						{description && (
							<DialogDescription>{description}</DialogDescription>
						)}
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
									{loading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{loading ? loadingText : confirmText}
								</Button>
							</>
						)}
					</DialogFooter>
				)}

				{CustomFooter && <CustomFooter className={footerClassName} />}
			</DialogContent>
		</Dialog>
	)
}

// Compound components for flexible usage
ConfirmationDialog.Header = DialogHeader
ConfirmationDialog.Footer = DialogFooter
ConfirmationDialog.Title = DialogTitle
ConfirmationDialog.Description = DialogDescription 
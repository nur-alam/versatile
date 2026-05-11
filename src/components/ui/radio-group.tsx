import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return <RadioGroupPrimitive.Root className={cn('vt-grid vt-gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				'vt-aspect-square vt-h-4 vt-w-4 vt-rounded-full vt-border vt-border-primary vt-text-primary vt-ring-offset-background focus:vt-outline-none focus-visible:vt-ring-2 focus-visible:vt-ring-ring focus-visible:vt-ring-offset-2 disabled:vt-cursor-not-allowed disabled:vt-opacity-50',
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="vt-flex vt-items-center vt-justify-center">
				<Circle className="vt-h-2.5 vt-w-2.5 vt-fill-current vt-text-current" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

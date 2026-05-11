import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="vt-toaster group"
			toastOptions={{
				classNames: {
					toast: 'group vt-toast group-[.toaster]:vt-bg-background group-[.toaster]:vt-text-foreground group-[.toaster]:vt-border-border group-[.toaster]:vt-shadow-lg',
					description: 'group-[.toast]:vt-text-muted-foreground',
					actionButton: 'group-[.toast]:vt-bg-primary group-[.toast]:vt-text-primary-foreground',
					cancelButton: 'group-[.toast]:vt-bg-muted group-[.toast]:vt-text-muted-foreground',
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };

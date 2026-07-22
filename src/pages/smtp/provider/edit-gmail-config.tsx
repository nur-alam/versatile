import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ConnectionType, useUpdateSmtpConfig } from '@/services/smtp-services';
import { GmailConfigFormValues, gmailConfigSchema } from '@/utils/form-validation/smtp-form-validation';
import { copyToClipboard } from '@/utils/utils';
import { redirectUrl } from '@/utils/versatile-declaration';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const EditGmailConfig = ({
	connection,
	onSuccess,
}: {
	connection: ConnectionType;
	onSuccess?: () => void;
}) => {
	const form = useForm<GmailConfigFormValues>({
		resolver: zodResolver(gmailConfigSchema),
		defaultValues: {
			provider: connection.provider,
			clientId: connection.clientId ?? '',
			clientSecret: connection.clientSecret ?? '',
			fromName: connection.fromName ?? '',
			fromEmail: connection.fromEmail ?? '',
		},
	});

	const updateSmtpConfigMutation = useUpdateSmtpConfig();

	const onSubmit = async (values: GmailConfigFormValues) => {
		await updateSmtpConfigMutation.mutateAsync(values);
		onSuccess?.();
	};

	const handleCopyRedirectUrl = async () => {
		try {
			await copyToClipboard(redirectUrl);
			toast.success(__('Redirect URI copied to clipboard!', 'versatile-toolkit'));
		} catch (error) {
			toast.error(__('Failed to copy redirect URI', 'versatile-toolkit'));
		}
	};

	const handleReconnectWithGmail = () => {
		toast(__('Google OAuth reconnection flow is not configured yet.', 'versatile-toolkit'));
	};

	return (
		<Form {...form}>
			<form
				className="vt-space-y-5 vt-mt-6"
				onSubmit={form.handleSubmit(onSubmit, (errors) => {
					console.log('form errors', errors);
				})}
			>
				<FormField
					control={form.control}
					name="fromName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('From Name', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input placeholder="Nur" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="fromEmail"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('From Email', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input placeholder="nuralam862@gmail.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<p className="vt-text-sm vt-text-muted-foreground">
					{__('Gmail requires the configured sender details and OAuth credentials to stay in sync before sending emails.', 'versatile-toolkit')}
				</p>

				<FormField
					control={form.control}
					name="clientId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('Client ID', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input placeholder="737022802575-th58sa7cfl265udpaeotj3omn8nnrpaa.apps.googleusercontent.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="clientSecret"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('Client Secret', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input type="password" placeholder="................................" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="vt-flex vt-justify-end vt-pt-2">
					<Button type="submit" disabled={updateSmtpConfigMutation.isPending}>
						{updateSmtpConfigMutation.isPending
							? __('Saving...', 'versatile-toolkit')
							: __('Save Changes', 'versatile-toolkit')}
					</Button>
				</div>

				<div className="vt-border-t vt-pt-6 vt-space-y-4">
					<div className="vt-space-y-3">
						<p className="vt-text-sm vt-font-medium vt-text-foreground">
							{__('Use this URI to your google cloud console', 'versatile-toolkit')}
						</p>
						<div className="vt-flex vt-items-center vt-gap-3 vt-rounded-lg vt-bg-muted vt-p-3">
							<div className="vt-flex-1">
								<Input value={redirectUrl} readOnly className="vt-bg-background" />
							</div>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={handleCopyRedirectUrl}
								aria-label={__('Copy redirect URI', 'versatile-toolkit')}
							>
								<Copy className="vt-h-4 vt-w-4" />
							</Button>
						</div>
					</div>

					<Button
						type="button"
						className="vt-w-full vt-bg-red-500 hover:vt-bg-red-600"
						onClick={handleReconnectWithGmail}
					>
						{__('Reconnect With Gmail', 'versatile-toolkit')}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default EditGmailConfig;

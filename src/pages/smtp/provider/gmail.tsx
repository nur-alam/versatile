import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateSmtpConfig } from '@/services/smtp-services';
import { GmailConfigFormValues, gmailConfigSchema } from '@/utils/form-validation/smtp-form-validation';
import { copyToClipboard } from '@/utils/utils';
import { EmailProviderOptionsType, redirectUrl } from '@/utils/versatile-declaration';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Copy } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Gmail = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	const form = useForm<GmailConfigFormValues>({
		resolver: zodResolver(gmailConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			clientId: '',
			clientSecret: '',
			fromName: '',
			fromEmail: '',
		},
	});

	const updateSmtpConfigMutation = useUpdateSmtpConfig();

	const onSubmit = async (values: GmailConfigFormValues) => {
		const newValues = { ...values, selectedProvider };
		await updateSmtpConfigMutation.mutateAsync(newValues);
	};

	const handleCopyRedirectUrl = async () => {
		try {
			await copyToClipboard(redirectUrl);
			toast.success(__('Redirect URI copied to clipboard!', 'versatile-toolkit'));
		} catch (error) {
			toast.error(__('Failed to copy redirect URI', 'versatile-toolkit'));
		}
	};

	const handleConnectWithGmail = () => {
		toast(__('Google OAuth connection flow is not configured yet.', 'versatile-toolkit'));
	};

	return (
		<div className="vt-flex vt-justify-center">
			<Card className="vt-w-full vt-h-full">
				<CardContent className="vt-p-4">
					<div className="vt-flex vt-justify-between vt-items-center vt-mb-5">
						<h2 className="vt-text-xl vt-font-semibold vt-text-primary">
							{__('Google Gmail Configuration', 'versatile-toolkit')}
						</h2>
					</div>

					<Form {...form}>
						<form
							className="vt-space-y-6"
							onSubmit={form.handleSubmit(onSubmit, (errors) => {
								console.log('form errors', errors);
							})}
						>
							<div className="vt-grid vt-gap-6">
								<FormField
									control={form.control}
									name="clientId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{__('Client ID', 'versatile-toolkit')}</FormLabel>
											<FormControl>
												<Input placeholder="admin" {...field} />
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
												<Input type="password" placeholder="••••" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="vt-border-t vt-pt-6">
									<div className="vt-grid vt-grid-cols-2 vt-gap-4">
										<FormField
											control={form.control}
											name="fromName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{__('From Name', 'versatile-toolkit')}</FormLabel>
													<FormControl>
														<Input placeholder="WordPress" {...field} />
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
														<Input placeholder="wordpress@example.com" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>

							<div className="vt-flex vt-justify-end">
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

								<Button type="button" className="vt-w-full" onClick={handleConnectWithGmail}>
									{__('Connect With Gmail', 'versatile-toolkit')}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Gmail;

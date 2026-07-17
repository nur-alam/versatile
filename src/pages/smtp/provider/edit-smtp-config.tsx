import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConnectionType, useUpdateSmtpConfig } from '@/services/smtp-services';
import { SmtpConfigFormValues, smtpConfigSchema } from '@/utils/form-validation/smtp-form-validation';
import { smtpSecurityOptionsMap } from '@/utils/versatile-declaration';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';

const EditSmtpConfig = ({
	connection,
	onSuccess,
}: {
	connection: ConnectionType;
	onSuccess?: () => void;
	}) => {
	console.log('edit connection', connection);
	const form = useForm<SmtpConfigFormValues>({
		resolver: zodResolver(smtpConfigSchema),
		defaultValues: {
			provider: connection.provider,
			fromName: connection.fromName ?? '',
			fromEmail: connection.fromEmail ?? '',
			smtpHost: connection.smtpHost ?? '',
			smtpPort: (connection.smtpPort as SmtpConfigFormValues['smtpPort']) ?? '587',
			smtpSecurity: (connection.smtpSecurity as SmtpConfigFormValues['smtpSecurity']) ?? 'tls',
			smtpUsername: connection.smtpUsername ?? '',
			smtpPassword: connection.smtpPassword ?? '',
		},
	});

	const updateSmtpConfigMutation = useUpdateSmtpConfig();

	const onSubmit = async (values: SmtpConfigFormValues) => {
		await updateSmtpConfigMutation.mutateAsync(values);
		onSuccess?.();
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
								<Input placeholder="nur@verspark.com" {...field} />
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
								<Input placeholder="nur@verspark.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpHost"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('SMTP Host', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input placeholder="smtp.hostinger.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpPort"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('SMTP Port', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input placeholder="587" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpSecurity"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('Security', 'versatile-toolkit')}</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger className="vt-w-full">
										<SelectValue placeholder={__('Select security type', 'versatile-toolkit')} />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="vt-w-full">
									{smtpSecurityOptionsMap.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpUsername"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('SMTP Username', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input placeholder="nur@verspark.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="smtpPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{__('SMTP Password', 'versatile-toolkit')}</FormLabel>
							<FormControl>
								<Input type="password" placeholder="................" {...field} />
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
			</form>
		</Form>
	);
};

export default EditSmtpConfig;

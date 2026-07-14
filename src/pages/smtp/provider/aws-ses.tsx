import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateSmtpConfig } from '@/services/smtp-services';
import { AwsSesConfigFormValues, awsSesConfigSchema } from '@/utils/form-validation/smtp-form-validation';
import { AwsSesRegionOptionsType, awsSesRegionOptionsMap, EmailProviderOptionsType } from '@/utils/versatile-declaration';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { useForm } from 'react-hook-form';

const AwsSes = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	const form = useForm<AwsSesConfigFormValues>({
		resolver: zodResolver(awsSesConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			accessKeyId: '',
			secretAccessKey: '',
			region: undefined,
			fromName: '',
			fromEmail: '',
		},
	});

	const updateSmtpConfigMutation = useUpdateSmtpConfig();

	const onSubmit = async (values: AwsSesConfigFormValues) => {
		const newValues = { ...values, selectedProvider };
		await updateSmtpConfigMutation.mutateAsync(newValues);
	};

	return (
		<div className="vt-flex vt-justify-center">
			<Card className="vt-w-full vt-h-full">
				<CardContent className="vt-p-6">
					<div className="vt-flex vt-justify-between vt-items-center vt-mb-5">
						<h2 className="vt-text-xl vt-font-semibold vt-text-primary">
							{__('Amazon SES Configuration', 'versatile-toolkit')}
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
									name="accessKeyId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{__('Access Key ID', 'versatile-toolkit')}</FormLabel>
											<FormControl>
												<Input placeholder="admin" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="secretAccessKey"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{__('Secret Access Key', 'versatile-toolkit')}</FormLabel>
											<FormControl>
												<Input type="password" placeholder="••••" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="region"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{__('Region', 'versatile-toolkit')}</FormLabel>
											<Select
												value={field.value}
												onValueChange={(value) => field.onChange(value as AwsSesRegionOptionsType)}
											>
												<FormControl>
													<SelectTrigger className="vt-w-full">
														<SelectValue placeholder={__('Select AWS region', 'versatile-toolkit')} />
													</SelectTrigger>
												</FormControl>
												<SelectContent className="vt-w-full">
													{awsSesRegionOptionsMap.map((item) => (
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
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default AwsSes;

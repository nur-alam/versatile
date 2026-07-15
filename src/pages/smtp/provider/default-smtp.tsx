import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SmtpConfigFormValues, smtpConfigSchema } from '@/utils/form-validation/smtp-form-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailProviderOptionsType, smtpSecurityOptionsMap } from '@/utils/versatile-declaration';
import { Button } from '@/components/ui/button';
import { useUpdateSmtpConfig } from '@/services/smtp-services';


const DefaultSmtp = ({ selectedProvider }: { selectedProvider: EmailProviderOptionsType }) => {
	const form = useForm<SmtpConfigFormValues>({
		resolver: zodResolver(smtpConfigSchema),
		defaultValues: {
			provider: selectedProvider,
			fromName: 'Versatile Toolkit',
			fromEmail: 'vers@versatile-toolkit.com',
			smtpHost: 'smtp.hostinger.com',
			smtpPort: '587',
			smtpSecurity: 'tls',
			smtpUsername: 'vers@versatile-toolkit.com',
			smtpPassword: 'vers@versatile-toolkit.com',
		}
	});

	const updateSmtpConfigMutation = useUpdateSmtpConfig();

	const onSubmit = async (values: SmtpConfigFormValues) => {
		const newValues = { ...values, selectedProvider }
		await updateSmtpConfigMutation.mutateAsync(newValues);
	}

	return (
		<div className="vt-flex vt-justify-center">
			<Card className="vt-w-full vt-h-full">
				<CardContent className="">
					<div className="vt-flex vt-justify-between vt-items-center vt-mb-5">
						<h2 className="vt-text-xl vt-font-semibold vt-text-primary">{__('Default SMTP', 'versatile-toolkit')}</h2>
					</div>
					<div>
						<Form {...form}>
							<form
								className="vt-space-y-6"
								onSubmit={
									form.handleSubmit(onSubmit, (errors) => {
										console.log('form errors', errors);
									})
								}
							>
								<div className='vt-grid vt-gap-4'>
									<FormField
										control={form.control}
										name="smtpHost"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{__("SMTP Host", "versatile-toolkit")}</FormLabel>
												<FormControl>
													<Input placeholder="smtp.hostinger.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className='vt-grid vt-grid-cols-2 vt-gap-4'>
										<FormField
											control={form.control}
											name="smtpPort"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{__("SMTP Port", "versatile-toolkit")}</FormLabel>
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
													<FormLabel>{__("SMTP Security", "versatile-toolkit")}</FormLabel>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<FormControl>
															<SelectTrigger className="vt-w-full">
																<SelectValue placeholder="Select security type" />
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
									</div>
									<FormField
										control={form.control}
										name="smtpUsername"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{__("SMTP Username", "versatile-toolkit")}</FormLabel>
												<FormControl>
													<Input placeholder="vers@versatile-toolkit.com" {...field} />
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
												<FormLabel>{__("SMTP Password", "versatile-toolkit")}</FormLabel>
												<FormControl>
													<Input type="password" placeholder="••••••••" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="vt-flex vt-gap-2 vt-justify-end">
									<Button
										type="submit"
										disabled={updateSmtpConfigMutation.isPending}
									>
										{updateSmtpConfigMutation.isPending ? __("Saving...", "versatile-toolkit") : __("Save Changes", "versatile-toolkit")}
									</Button>
								</div>
							</form>
						</Form>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default DefaultSmtp;

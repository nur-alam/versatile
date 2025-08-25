import { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { maintenanceMoodFormSchema, MaintenanceMoodFormValues } from '@/utils/schema-validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUpdateMaintenanceMood, useGetMoodInfo } from '@/services/mood-services';
import { Switch } from '@/components/ui/switch';
import MediaUploader from '@/components/MediaUploader';
import PreviewModal from '@/components/PreviewModal';
import TemplateSelector from '@/components/TemplateSelector';
import MoodSkeleton from '@/components/loader/MoodSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import RouteBack from '@/components/atom/route-back';

const MaintenanceSettings = () => {
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	const [formValues, setFormValues] = useState<MaintenanceMoodFormValues | undefined>(undefined);

	// Function to get latest form data when needed (no re-renders)
	const getLatestFormData = () => maintenanceMoodForm.getValues();

	const maintenanceMoodForm = useForm<MaintenanceMoodFormValues>({
		resolver: zodResolver(maintenanceMoodFormSchema),
		defaultValues: {
			enable_maintenance: true,
			show_subscribers_only: false,
			title: '',
			description: '',
			subtitle: '',
			template: 'classic',
			background_image: '',
			background_image_id: 0,
			logo: '',
			logo_id: 0
		}
	});

	const { handleSubmit } = maintenanceMoodForm;

	const updateMaintenanceMoodMutation = useUpdateMaintenanceMood();

	const onSubmit = async (values: MaintenanceMoodFormValues) => {
		try {
			await updateMaintenanceMoodMutation.mutateAsync(values);
		} catch (error) {
			console.error('Error submitting maintenance mood form:', error);
		}
	}

	// Fetching saved form data
	const { data: moodInfo, isLoading } = useGetMoodInfo();
	const maintenanceMoodInfo: MaintenanceMoodFormValues = moodInfo?.data['maintenance'];

	useEffect(() => {
		if (maintenanceMoodInfo) {
			maintenanceMoodForm.reset({
				enable_maintenance: moodInfo?.data['enable_maintenance'],
				show_subscribers_only: maintenanceMoodInfo.show_subscribers_only || false,
				title: maintenanceMoodInfo.title || '',
				description: maintenanceMoodInfo.description || '',
				subtitle: maintenanceMoodInfo.subtitle || '',
				template: maintenanceMoodInfo.template || 'classic',
				background_image: maintenanceMoodInfo.background_image || '',
				background_image_id: maintenanceMoodInfo.background_image_id || 0,
				logo: maintenanceMoodInfo.logo || '',
				logo_id: maintenanceMoodInfo.logo_id || 0
			});
			setIsFormInitialized(true);
		}
	}, [maintenanceMoodInfo]);

	return (
		<div className="">
			{(isLoading || !isFormInitialized) ? <MoodSkeleton /> :
				<ErrorBoundary
					onError={(error, errorInfo) => {
						console.error('Maintenance Settings Form Error:', error, errorInfo);
					}}
					fallback={
						<div className="p-6 border border-red-200 bg-red-50 rounded-md">
							<h3 className="text-lg font-medium text-red-700 mb-2">{__('Form Error', 'versatile-toolkit')}</h3>
							<p className="text-red-600">{__('There was a problem loading the maintenance settings form. Please try refreshing the page or contact support.', 'versatile-toolkit')}</p>
							<Button
								className="mt-4"
								onClick={() => window.location.reload()}
							>
								{__('Refresh Page', 'versatile-toolkit')}
							</Button>
						</div>
					}
				>
					<Form {...maintenanceMoodForm}>
						<form onSubmit={handleSubmit(onSubmit, (errors) => {
							console.error('Form validation errors:', errors);
						})}>
							<div className='flex justify-between pb-5'>
								<h2 className='flex items-center gap-2 text-2xl'>
									<RouteBack />
									{__('Maintenance Mood', 'versatile-toolkit')}
								</h2>
								<div className='flex gap-5'>
									<Button
										type="submit"
										disabled={updateMaintenanceMoodMutation.isPending}
									>
										{updateMaintenanceMoodMutation.isPending
											? __('Saving...', 'versatile-toolkit')
											: __('Save Settings', 'versatile-toolkit')
										}
									</Button>

									<ErrorBoundary
										fallback={
											<Button variant="outline" disabled>
												{__('Preview Unavailable', 'versatile-toolkit')}
											</Button>
										}
									>
										<PreviewModal
											type="maintenance"
											disabled={updateMaintenanceMoodMutation.isPending}
											getFormData={getLatestFormData}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div>
								<FormField
									control={maintenanceMoodForm.control}
									name="template"
									render={({ field, fieldState }) => (
										<FormItem className='mt-6'>
											<FormLabel className="text-foreground">
												{__('Choose Template', 'versatile-toolkit')}
											</FormLabel>
											<FormControl>
												<ErrorBoundary
													fallback={
														<div className="p-4 border border-red-200 bg-red-50 rounded-md">
															<p className="text-red-700 text-sm">{__('Template selector failed to load. Please try refreshing the page.', 'versatile-toolkit')}</p>
														</div>
													}
												>
													<TemplateSelector
														selectedTemplate={field.value || 'classic'}
														onTemplateSelect={field.onChange}
														type="maintenance"
														formData={formValues}
														getFormData={getLatestFormData}
													/>
												</ErrorBoundary>
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Select a design template for your maintenance page.', 'versatile-toolkit')}
												</FormDescription>
											}
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex gap-10 mt-5'>
								<div className='w-1/2'>
									<FormField
										control={maintenanceMoodForm.control}
										name="enable_maintenance"
										render={({ field, fieldState }) => (
											<FormItem>
												<div className='flex items-center gap-2'>
													<FormLabel className="text-foreground" htmlFor='enable_maintenance'>
														{__('Enable Maintenance Mood', 'versatile-toolkit')}
													</FormLabel>
													<FormControl>
														<Switch id='enable_maintenance'
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</div>
												{!fieldState.error &&
													<FormDescription>
														{__('Enable or disable maintenance mode for your site.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={maintenanceMoodForm.control}
										name="show_subscribers_only"
										render={({ field, fieldState }) => (
											<FormItem className='mt-6'>
												<div className='flex items-center gap-2'>
													<FormLabel className="text-foreground" htmlFor='show_subscribers_only'>
														{__('Show Only for Users', 'versatile-toolkit')}
													</FormLabel>
													<FormControl>
														<Switch id='show_subscribers_only'
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</div>
												{!fieldState.error &&
													<FormDescription>
														{__('When enabled, maintenance mode will only be shown to subscribers. Other users will see the normal site.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={maintenanceMoodForm.control}
										name="title"
										render={({ field, fieldState }) => (
											<FormItem className='mt-6'>
												<FormLabel className="text-foreground">
													{__('Title', 'versatile-toolkit')}
												</FormLabel>
												<FormControl>
													<Input placeholder={__('Enter maintenance title', 'versatile-toolkit')} {...field} />
												</FormControl>
												{!fieldState.error &&
													<FormDescription>
														{__('This will be displayed as the main heading.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={maintenanceMoodForm.control}
										name="subtitle"
										render={({ field, fieldState }) => (
											<FormItem className='mt-6'>
												<FormLabel className="text-foreground">{__('Subtitle', 'versatile-toolkit')}</FormLabel>
												<FormControl>
													<Input placeholder={__('Enter subtitle', 'versatile-toolkit')} {...field} />
												</FormControl>
												{!fieldState.error &&
													<FormDescription>
														{__('Optional subtitle under the title.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={maintenanceMoodForm.control}
										name="description"
										render={({ field, fieldState }) => (
											<FormItem className='mt-6'>
												<FormLabel className="text-foreground">{__('Description', 'versatile-toolkit')}</FormLabel>
												<FormControl>
													<Textarea placeholder={__('Describe what is happening...', 'versatile-toolkit')} {...field} />
												</FormControl>
												{!fieldState.error &&
													<FormDescription>
														{__('Provide more details about the maintenance.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='w-1/2'>
									<FormField
										control={maintenanceMoodForm.control}
										name="background_image"
										render={({ field, fieldState }) => (
											<FormItem className=''>
												<FormLabel className="text-foreground">{__('Background Image', 'versatile-toolkit')}</FormLabel>
												<FormControl>
													<ErrorBoundary
														fallback={
															<div className="p-4 border border-red-200 bg-red-50 rounded-md">
																<p className="text-red-700 text-sm">{__('Media uploader failed to load. Please try refreshing the page.', 'versatile-toolkit')}</p>
															</div>
														}
													>
														<MediaUploader
															value={field.value || ''}
															onChange={(url, id) => {
																field.onChange(url);
																setFormValues(maintenanceMoodForm.getValues());
															}}
															buttonText={__('Upload Background Image', 'versatile-toolkit')}
															allowedTypes={['image']}
														/>
													</ErrorBoundary>
												</FormControl>
												{!fieldState.error &&
													<FormDescription>
														{__('Upload a background image for the maintenance page.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={maintenanceMoodForm.control}
										name="logo"
										render={({ field, fieldState }) => (
											<FormItem className='mt-6'>
												<FormLabel className="text-foreground">{__('Logo', 'versatile-toolkit')}</FormLabel>
												<FormControl>
													<ErrorBoundary
														fallback={
															<div className="p-4 border border-red-200 bg-red-50 rounded-md">
																<p className="text-red-700 text-sm">{__('Media uploader failed to load. Please try refreshing the page.', 'versatile-toolkit')}</p>
															</div>
														}
													>
														<MediaUploader
															value={field.value || ''}
															onChange={(url, id) => {
																field.onChange(url);
																setFormValues(maintenanceMoodForm.getValues());
															}}
															buttonText={__('Upload Logo', 'versatile-toolkit')}
															allowedTypes={['image']}
														/>
													</ErrorBoundary>
												</FormControl>
												{!fieldState.error &&
													<FormDescription>
														{__('Upload a logo to display on the maintenance page.', 'versatile-toolkit')}
													</FormDescription>
												}
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</form>
					</Form>
				</ErrorBoundary>
			}
		</div>
	)
}

export default MaintenanceSettings
import React, { useEffect, useState } from 'react'
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
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MaintenanceSettings = () => {
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	const [formValues, setFormValues] = useState<MaintenanceMoodFormValues | null>(null);

	const maintenanceMoodForm = useForm<MaintenanceMoodFormValues>({
		resolver: zodResolver(maintenanceMoodFormSchema),
		defaultValues: {
			enable_maintenance: true,
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

	const { handleSubmit, watch } = maintenanceMoodForm;

	// Watch only background image and logo for live preview updates
	// const watchedValues = watch();
	const watchedValues = watch(['background_image', 'logo']);

	useEffect(() => {
		if (isFormInitialized) {
			// Use a timeout to debounce the updates and prevent infinite loops
			const timeoutId = setTimeout(() => {
				setFormValues(watchedValues);
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [JSON.stringify(watchedValues), isFormInitialized]);

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
			{(isLoading || !isFormInitialized) ? <span className="text-2xl">Loading...</span> :
				<Form {...maintenanceMoodForm}>
					<form onSubmit={handleSubmit(onSubmit, (errors) => {
						console.error('Form validation errors:', errors);
					})}>
						<div className='flex justify-between pb-5'>
							<h2 className='flex items-center gap-2 text-2xl'>
								<Link to={'/'}>
									<ArrowLeft />
								</Link>
								{__('Maintenance Mood', 'versatile')}
							</h2>
							<div className='flex gap-5'>
								<Button
									type="submit"
									disabled={updateMaintenanceMoodMutation.isPending}
								>
									{updateMaintenanceMoodMutation.isPending
										? __('Saving...', 'versatile')
										: __('Save Settings', 'versatile')
									}
								</Button>

								<PreviewModal
									type="maintenance"
									disabled={updateMaintenanceMoodMutation.isPending}
								/>
							</div>
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
													{__('Enable Maintenance Mood', 'versatile')}
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
													{__('This will be displayed as the main heading.', 'versatile')}
												</FormDescription>
											}
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={maintenanceMoodForm.control}
									name="template"
									render={({ field, fieldState }) => (
										<FormItem className='mt-6'>
											<FormLabel className="text-foreground">
												{__('Choose Template', 'versatile')}
											</FormLabel>
											<FormControl>
												<TemplateSelector
													selectedTemplate={field.value || 'classic'}
													onTemplateSelect={field.onChange}
													type="maintenance"
													formData={formValues}
												/>
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Select a design template for your maintenance page.', 'versatile')}
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
												{__('Title', 'versatile')}
											</FormLabel>
											<FormControl>
												<Input placeholder={__('Enter maintenance title', 'versatile')} {...field} />
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('This will be displayed as the main heading.', 'versatile')}
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
											<FormLabel className="text-foreground">{__('Subtitle', 'versatile')}</FormLabel>
											<FormControl>
												<Input placeholder={__('Enter subtitle', 'versatile')} {...field} />
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Optional subtitle under the title.', 'versatile')}
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
											<FormLabel className="text-foreground">{__('Description', 'versatile')}</FormLabel>
											<FormControl>
												<Textarea placeholder={__('Describe what is happening...', 'versatile')} {...field} />
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Provide more details about the maintenance.', 'versatile')}
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
											<FormLabel className="text-foreground">{__('Background Image', 'versatile')}</FormLabel>
											<FormControl>
												<MediaUploader
													value={field.value || ''}
													onChange={(url, id) => {
														field.onChange(url);
														maintenanceMoodForm.setValue('background_image_id', id);
													}}
													buttonText={__('Upload Background Image', 'versatile')}
													allowedTypes={['image']}
												/>
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Upload a background image for the maintenance page.', 'versatile')}
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
											<FormLabel className="text-foreground">{__('Logo', 'versatile')}</FormLabel>
											<FormControl>
												<MediaUploader
													value={field.value || ''}
													onChange={(url, id) => {
														field.onChange(url);
														maintenanceMoodForm.setValue('logo_id', id);
													}}
													buttonText={__('Upload Logo', 'versatile')}
													allowedTypes={['image']}
												/>
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Upload a logo to display on the maintenance page.', 'versatile')}
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
			}
		</div>
	)
}

export default MaintenanceSettings
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

const MaintenanceSettings = () => {
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	
	const maintenanceMoodForm = useForm<MaintenanceMoodFormValues>({
		resolver: zodResolver(maintenanceMoodFormSchema),
		defaultValues: {
			enable_maintenance: true,
			title: '',
			description: '',
			subtitle: '',
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
				title: maintenanceMoodInfo.title || '',
				description: maintenanceMoodInfo.description || '',
				subtitle: maintenanceMoodInfo.subtitle || '',
				background_image: maintenanceMoodInfo.background_image || '',
				background_image_id: maintenanceMoodInfo.background_image_id || 0,
				logo: maintenanceMoodInfo.logo || '',
				logo_id: maintenanceMoodInfo.logo_id || 0
			});
			setIsFormInitialized(true);
		}
	}, [maintenanceMoodInfo]);


	return (
		<div className="p-4 space-y-6">
			{(isLoading || !isFormInitialized) ? <span className="text-2xl">Loading...</span> :
				<Form {...maintenanceMoodForm}>
					<form onSubmit={handleSubmit(onSubmit, (errors) => {
						console.error('Form validation errors:', errors);
					})}>
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

						<FormField
							control={maintenanceMoodForm.control}
							name="background_image"
							render={({ field, fieldState }) => (
								<FormItem className='mt-6'>
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

						<Button 
							type="submit" 
							className='mt-6'
							disabled={updateMaintenanceMoodMutation.isPending}
						>
							{updateMaintenanceMoodMutation.isPending 
								? __('Saving...', 'versatile') 
								: __('Save Settings', 'versatile')
							}
						</Button>
					</form>
				</Form>
			}
		</div>
	)
}

export default MaintenanceSettings
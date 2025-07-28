import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { comingsoonMoodFormSchema, ComingsoonMoodFormValues } from '@/utils/schema-validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useGetMoodInfo, useUpdateComingsoonMood } from '@/services/mood-services';
import { Switch } from '@/components/ui/switch';
import MediaUploader from '@/components/MediaUploader';
import PreviewModal from '@/components/PreviewModal';

const ComingsoonMode = () => {
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	const comingsoonMoodFrom = useForm<ComingsoonMoodFormValues>({
		resolver: zodResolver(comingsoonMoodFormSchema),
		defaultValues: {
			enable_comingsoon: true,
			title: '',
			description: '',
			subtitle: '',
			background_image: '',
			background_image_id: 0,
			logo: '',
			logo_id: 0
		}
	});

	const { handleSubmit, control, formState: { errors } } = comingsoonMoodFrom;

	const updateComingsoonMoodMutation = useUpdateComingsoonMood();

	const onSubmit = async (values: ComingsoonMoodFormValues) => {
		try {
			await updateComingsoonMoodMutation.mutateAsync(values);
		} catch (error) {
			console.error('Error submitting maintenance mood form:', error);
		}
	}

	// Fetching saved form data
	const { data: moodInfo, isLoading, isSuccess } = useGetMoodInfo();
	const comingsoonMoodInfo: ComingsoonMoodFormValues = moodInfo?.data['comingsoon'];

	useEffect(() => {
		if (comingsoonMoodInfo) {
			comingsoonMoodFrom.reset({
				enable_comingsoon: moodInfo?.data['enable_comingsoon'],
				title: comingsoonMoodInfo.title,
				description: comingsoonMoodInfo.description,
				subtitle: comingsoonMoodInfo.subtitle,
				background_image: comingsoonMoodInfo.background_image || '',
				background_image_id: comingsoonMoodInfo.background_image_id || 0,
				logo: comingsoonMoodInfo.logo || '',
				logo_id: comingsoonMoodInfo.logo_id || 0
			});
			setIsFormInitialized(true);
		}
	}, [comingsoonMoodInfo]);

	return (
		<div className="p-4 space-y-6">
			{(isLoading || !isFormInitialized) ? <span className="text-2xl">Loading...</span> :
				<Form {...comingsoonMoodFrom}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='flex gap-10'>
							<div className='w-1/2'>
								<FormField
									control={comingsoonMoodFrom.control}
									name="enable_comingsoon"
									render={({ field, fieldState }) => (
										<FormItem>
											<div className='flex items-center gap-2'>
												<FormLabel className="text-foreground" htmlFor='enable_comingsoon'>
													{__('Enable Comingsoon Mood', 'versatile-toolkit')}
												</FormLabel>
												<FormControl>
													<Switch id='enable_comingsoon'
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</div>
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
									control={comingsoonMoodFrom.control}
									name="title"
									render={({ field, fieldState }) => (
										<FormItem className='mt-6'>
											<FormLabel className="text-foreground">
												{__('Title', 'versatile-toolkit')}
											</FormLabel>
											<FormControl>
												<Input placeholder={__('Enter comingsoon title', 'versatile-toolkit')} {...field} />
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
									control={comingsoonMoodFrom.control}
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
									control={comingsoonMoodFrom.control}
									name="description"
									render={({ field, fieldState }) => (
										<FormItem className='mt-6'>
											<FormLabel className="text-foreground">{__('Description', 'versatile-toolkit')}</FormLabel>
											<FormControl>
												<Textarea placeholder={__('Describe what is happening...', 'versatile-toolkit')} {...field} />
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Provide more details about the comingsoon.', 'versatile-toolkit')}
												</FormDescription>
											}
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='w-1/2'>
								<FormField
									control={comingsoonMoodFrom.control}
									name="background_image"
									render={({ field, fieldState }) => (
										<FormItem className='mt-6'>
											<FormLabel className="text-foreground">{__('Background Image', 'versatile-toolkit')}</FormLabel>
											<FormControl>
												<MediaUploader
													value={field.value || ''}
													onChange={(url, id) => {
														field.onChange(url);
														comingsoonMoodFrom.setValue('background_image_id', id);
													}}
													buttonText={__('Upload Background Image', 'versatile-toolkit')}
													allowedTypes={['image']}
												/>
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Upload a background image for the coming soon page.', 'versatile-toolkit')}
												</FormDescription>
											}
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={comingsoonMoodFrom.control}
									name="logo"
									render={({ field, fieldState }) => (
										<FormItem className='mt-6'>
											<FormLabel className="text-foreground">{__('Logo', 'versatile-toolkit')}</FormLabel>
											<FormControl>
												<MediaUploader
													value={field.value || ''}
													onChange={(url, id) => {
														field.onChange(url);
														comingsoonMoodFrom.setValue('logo_id', id);
													}}
													buttonText={__('Upload Logo', 'versatile-toolkit')}
													allowedTypes={['image']}
												/>
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Upload a logo to display on the coming soon page.', 'versatile-toolkit')}
												</FormDescription>
											}
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex gap-4 mt-6">
							<Button 
								type="submit" 
								disabled={updateComingsoonMoodMutation.isPending}
							>
								{updateComingsoonMoodMutation.isPending 
									? __('Saving...', 'versatile-toolkit') 
									: __('Save Settings', 'versatile-toolkit')
								}
							</Button>
							
							<PreviewModal 
								type="comingsoon"
								disabled={updateComingsoonMoodMutation.isPending}
							/>
						</div>
					</form>
				</Form>
			}
		</div>
	)
}

export default ComingsoonMode
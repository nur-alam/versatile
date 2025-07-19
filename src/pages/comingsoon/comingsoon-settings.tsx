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
						<FormField
							control={comingsoonMoodFrom.control}
							name="enable_comingsoon"
							render={({ field, fieldState }) => (
								<FormItem>
									<div className='flex items-center gap-2'>
										<FormLabel className="text-foreground" htmlFor='enable_comingsoon'>
											{__('Enable Comingsoon Mood', 'versatile')}
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
											{__('This will be displayed as the main heading.', 'versatile')}
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
										{__('Title', 'versatile')}
									</FormLabel>
									<FormControl>
										<Input placeholder={__('Enter comingsoon title', 'versatile')} {...field} />
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
							control={comingsoonMoodFrom.control}
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
							control={comingsoonMoodFrom.control}
							name="description"
							render={({ field, fieldState }) => (
								<FormItem className='mt-6'>
									<FormLabel className="text-foreground">{__('Description', 'versatile')}</FormLabel>
									<FormControl>
										<Textarea placeholder={__('Describe what is happening...', 'versatile')} {...field} />
									</FormControl>
									{!fieldState.error &&
										<FormDescription>
											{__('Provide more details about the comingsoon.', 'versatile')}
										</FormDescription>
									}
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={comingsoonMoodFrom.control}
							name="background_image"
							render={({ field, fieldState }) => (
								<FormItem className='mt-6'>
									<FormLabel className="text-foreground">{__('Background Image', 'versatile')}</FormLabel>
									<FormControl>
										<MediaUploader
											value={field.value || ''}
											onChange={(url, id) => {
												field.onChange(url);
												comingsoonMoodFrom.setValue('background_image_id', id);
											}}
											buttonText={__('Upload Background Image', 'versatile')}
											allowedTypes={['image']}
										/>
									</FormControl>
									{!fieldState.error &&
										<FormDescription>
											{__('Upload a background image for the coming soon page.', 'versatile')}
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
									<FormLabel className="text-foreground">{__('Logo', 'versatile')}</FormLabel>
									<FormControl>
										<MediaUploader
											value={field.value || ''}
											onChange={(url, id) => {
												field.onChange(url);
												comingsoonMoodFrom.setValue('logo_id', id);
											}}
											buttonText={__('Upload Logo', 'versatile')}
											allowedTypes={['image']}
										/>
									</FormControl>
									{!fieldState.error &&
										<FormDescription>
											{__('Upload a logo to display on the coming soon page.', 'versatile')}
										</FormDescription>
									}
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className='mt-6'>
							{__('Save Settings', 'versatile')}
						</Button>
					</form>
				</Form>
			}
		</div>
	)
}

export default ComingsoonMode
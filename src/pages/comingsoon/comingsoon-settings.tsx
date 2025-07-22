import { useEffect, useState } from 'react'
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
import TemplateSelector from '@/components/TemplateSelector';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ComingsoonMode = () => {
	const [isFormInitialized, setIsFormInitialized] = useState(false);
	const [formValues, setFormValues] = useState<ComingsoonMoodFormValues | null>(null);

	const comingsoonMoodFrom = useForm<ComingsoonMoodFormValues>({
		resolver: zodResolver(comingsoonMoodFormSchema),
		defaultValues: {
			enable_comingsoon: true,
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

	const { handleSubmit } = comingsoonMoodFrom;

	// Function to get latest form data when needed (no re-renders)
	const getLatestFormData = () => comingsoonMoodFrom.getValues();

	const updateComingsoonMoodMutation = useUpdateComingsoonMood();

	const onSubmit = async (values: ComingsoonMoodFormValues) => {
		try {
			await updateComingsoonMoodMutation.mutateAsync(values);
		} catch (error) {
			console.error('Error submitting maintenance mood form:', error);
		}
	}

	// Fetching saved form data
	const { data: moodInfo, isLoading } = useGetMoodInfo();
	const comingsoonMoodInfo: ComingsoonMoodFormValues = moodInfo?.data['comingsoon'];

	useEffect(() => {
		if (comingsoonMoodInfo) {
			comingsoonMoodFrom.reset({
				enable_comingsoon: moodInfo?.data['enable_comingsoon'],
				title: comingsoonMoodInfo.title || '',
				description: comingsoonMoodInfo.description || '',
				subtitle: comingsoonMoodInfo.subtitle || '',
				template: comingsoonMoodInfo.template || 'classic',
				background_image: comingsoonMoodInfo.background_image || '',
				background_image_id: comingsoonMoodInfo.background_image_id || 0,
				logo: comingsoonMoodInfo.logo || '',
				logo_id: comingsoonMoodInfo.logo_id || 0
			});
			setIsFormInitialized(true);
		}
	}, [comingsoonMoodInfo]);

	return (
		<div className="">
			{(isLoading || !isFormInitialized) ? <span className="text-2xl">Loading...</span> :
				<Form {...comingsoonMoodFrom}>
					<form onSubmit={handleSubmit(onSubmit, (errors) => {
						console.error('Form validation errors:', errors);
					})}>
						<div className='flex justify-between pb-5'>
							<h2 className='flex items-center gap-2 text-2xl'>
								<Link to={'/'}>
									<ArrowLeft />
								</Link>
								{__('Coming Soon Mode', 'versatile')}
							</h2>
							<div className='flex gap-5'>
								<Button
									type="submit"
									disabled={updateComingsoonMoodMutation.isPending}
								>
									{updateComingsoonMoodMutation.isPending
										? __('Saving...', 'versatile')
										: __('Save Settings', 'versatile')
									}
								</Button>

								<PreviewModal
									type="comingsoon"
									disabled={updateComingsoonMoodMutation.isPending}
									getFormData={getLatestFormData}
								/>
							</div>
						</div>
						<div>
							<FormField
								control={comingsoonMoodFrom.control}
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
												type="comingsoon"
												formData={formValues}
												getFormData={getLatestFormData}
											/>
										</FormControl>
										{!fieldState.error &&
											<FormDescription>
												{__('Select a design template for your coming soon page.', 'versatile')}
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
									control={comingsoonMoodFrom.control}
									name="enable_comingsoon"
									render={({ field, fieldState }) => (
										<FormItem>
											<div className='flex items-center gap-2'>
												<FormLabel className="text-foreground" htmlFor='enable_comingsoon'>
													{__('Enable Coming Soon Mode', 'versatile')}
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
													{__('Enable the coming soon page for your website.', 'versatile')}
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
												<Input placeholder={__('Enter coming soon title', 'versatile')} {...field} />
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
												<Textarea placeholder={__('Tell visitors what to expect...', 'versatile')} {...field} />
											</FormControl>
											{!fieldState.error &&
												<FormDescription>
													{__('Provide more details about your upcoming launch.', 'versatile')}
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
										<FormItem className=''>
											<FormLabel className="text-foreground">{__('Background Image', 'versatile')}</FormLabel>
											<FormControl>
												<MediaUploader
													value={field.value || ''}
													onChange={(url, id) => {
														field.onChange(url);
														setFormValues(comingsoonMoodFrom.getValues());
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
														setFormValues(comingsoonMoodFrom.getValues());
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
							</div>
						</div>
					</form>
				</Form>
			}
		</div>
	)
}

export default ComingsoonMode
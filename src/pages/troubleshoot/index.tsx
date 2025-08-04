import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button'
import MultipleSelector from '@pages/troubleshoot/multi-selector';
import TaggedInput from '@pages/troubleshoot/tag-input';
import ThemeSelector from '@pages/troubleshoot/theme-selector';

import { disablePluginFormSchema, DisablePluginFormValues, themeFormSchema, ThemeFormValues, ipv4Regex } from '@/utils/schema-validation'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { useDisablePlugin, useGetDisablePluginList, useGetActiveTheme } from '@/services/versatile-services';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TroubleShoot = () => {
	const { handleSubmit, control, formState: { errors } } = useForm<DisablePluginFormValues>({
		resolver: zodResolver(disablePluginFormSchema),
		defaultValues: {
			chosen_plugins: [],
			ip_tags: [],
		}
	});

	const { handleSubmit: handleThemeSubmit, control: themeControl, formState: { errors: themeErrors } } = useForm<ThemeFormValues>({
		resolver: zodResolver(themeFormSchema),
		defaultValues: {
			activeTheme: '',
		}
	});

	const disablePluginMutation = useDisablePlugin();

	const onSubmit = async (values: DisablePluginFormValues) => {
		await disablePluginMutation.mutateAsync({ ...values });
	}

	const { data: disablePluginData, isFetching, isLoading: disablePluginListLoading, isError: disablePluginListError } = useGetDisablePluginList();

	const chosenPluginList = disablePluginData?.data['chosen_plugins'];

	const chosenIpList = disablePluginData?.data['ip_tags'];

	useEffect(() => {
		if (chosenPluginList || chosenIpList) {
			// Set default values when data is loaded
			control._reset({
				chosen_plugins: chosenPluginList || [],
				ip_tags: chosenIpList || [],
			});
		}
	}, [chosenPluginList, chosenIpList, control]);

	return (
		<div className="p-4 space-y-6 max-w-[800px]">
			<h2 className='flex items-center gap-2 text-2xl'>
				<Link to={'/'}>
					<ArrowLeft />
				</Link>
				{__('Troubleshoot Settings', 'versatile-toolkit')}
			</h2>

			{/* Plugin Disable Section */}
			<div className="border rounded-lg p-4">
				<h3 className="text-lg font-semibold mb-2">{__('Disable Plugin by IP address', 'versatile-toolkit')}</h3>
				<p className="text-sm text-muted-foreground mb-4">{__('Select plugins to disable for specific IP addresses. This is useful for troubleshooting plugin conflicts.', 'versatile-toolkit')}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='min-h-[42px]'>
						{
							isFetching ? <span className='text-xl'>{__('Loading...', 'versatile-toolkit')}</span> : <Controller
								name='chosen_plugins'
								control={control}
								render={({ field }) => (
									<MultipleSelector
										selectedPlugin={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						}
						{errors.chosen_plugins && (
							<p className="text-red-500 text-sm mt-1">
								{errors?.chosen_plugins?.message}
							</p>
						)}
					</div>
					<div className='min-h-[64px] mt-2'>
						{
							isFetching ? <span className='text-xl'>{__('Loading...', 'versatile-toolkit')}</span> :
								<Controller
									name='ip_tags'
									control={control}
									render={({ field }) => (
										<TaggedInput
											tags={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
						}
						{errors.ip_tags && (
							<p className="text-red-500 text-sm mt-1">
								{errors?.ip_tags?.message}
							</p>
						)}
					</div>
					<Button type='submit' className='mt-6' disabled={disablePluginMutation.isPending}>
						{disablePluginMutation.isPending ? __('Saving...', 'versatile-toolkit') : __('Save Plugin Settings', 'versatile-toolkit')}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default TroubleShoot
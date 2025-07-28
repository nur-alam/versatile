import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button'
import MultipleSelector from '@pages/troubleshoot/multi-selector';
import TaggedInput from '@pages/troubleshoot/tag-input';
import ThemeSelector from '@pages/troubleshoot/theme-selector';

import { disablePluginFormSchema, DisablePluginFormValues, themeFormSchema, ThemeFormValues, ipv4Regex } from '@/utils/schema-validation'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { useDisablePlugin, useGetDisablePluginList, useGetActiveTheme, useSaveActiveTheme } from '@/services/versatile-services';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TroubleShoot = () => {
	const { handleSubmit, control, formState: { errors } } = useForm<DisablePluginFormValues>({
		resolver: zodResolver(disablePluginFormSchema),
		defaultValues: {
			chosenPlugins: [],
			ipTags: [],
		}
	});

	const { handleSubmit: handleThemeSubmit, control: themeControl, formState: { errors: themeErrors } } = useForm<ThemeFormValues>({
		resolver: zodResolver(themeFormSchema),
		defaultValues: {
			activeTheme: '',
		}
	});

	const disablePluginMutation = useDisablePlugin();
	const saveActiveThemeMutation = useSaveActiveTheme();

	const onSubmit = async (values: DisablePluginFormValues) => {
		await disablePluginMutation.mutateAsync({ ...values });
	}

	const onThemeSubmit = async (values: ThemeFormValues) => {
		await saveActiveThemeMutation.mutateAsync({ ...values });
	}

	const { data: disablePluginData, isFetching, isLoading: disablePluginListLoading, isError: disablePluginListError } = useGetDisablePluginList();
	const { data: activeThemeData, isFetching: isActiveThemeFetching } = useGetActiveTheme();

	const chosenPluginList = disablePluginData?.data['chosenPlugins'];

	const chosenIpList = disablePluginData?.data['ipTags'];
	const activeTheme = activeThemeData?.data['activeTheme'];

	useEffect(() => {
		if (chosenPluginList || chosenIpList) {
			// Set default values when data is loaded
			control._reset({
				chosenPlugins: chosenPluginList || [],
				ipTags: chosenIpList || [],
			});
		}
	}, [chosenPluginList, chosenIpList, control]);

	useEffect(() => {
		if (activeTheme) {
			// Set default theme value when data is loaded
			themeControl._reset({
				activeTheme: activeTheme,
			});
		}
	}, [activeTheme, themeControl]);

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
								name='chosenPlugins'
								control={control}
								render={({ field }) => (
									<MultipleSelector
										selectedPlugin={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						}
						{errors.chosenPlugins && (
							<p className="text-red-500 text-sm mt-1">
								{errors?.chosenPlugins?.message}
							</p>
						)}
					</div>
					<div className='min-h-[64px] mt-2'>
						{
							isFetching ? <span className='text-xl'>{__('Loading...', 'versatile-toolkit')}</span> :
								<Controller
									name='ipTags'
									control={control}
									render={({ field }) => (
										<TaggedInput
											tags={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
						}
						{errors.ipTags && (
							<p className="text-red-500 text-sm mt-1">
								{errors?.ipTags?.message}
							</p>
						)}
					</div>
					<Button type='submit' className='mt-6' disabled={disablePluginMutation.isPending}>
						{disablePluginMutation.isPending ? __('Saving...', 'versatile-toolkit') : __('Save Plugin Settings', 'versatile-toolkit')}
					</Button>
				</form>
			</div>

			{/* Theme Selector Section */}
			<div className="border rounded-lg p-4">
				<h3 className="text-lg font-semibold mb-2">{__('Switch Theme', 'versatile-toolkit')}</h3>
				<p className="text-sm text-muted-foreground mb-4">{__('Select and activate a theme.', 'versatile-toolkit')}</p>
				<form onSubmit={handleThemeSubmit(onThemeSubmit)}>
					<div className='min-h-[42px]'>
						{
							isActiveThemeFetching ? <span className='text-xl'>{__('Loading...', 'versatile-toolkit')}</span> : <Controller
								name='activeTheme'
								control={themeControl}
								render={({ field }) => (
									<ThemeSelector
										selectedTheme={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						}
						{themeErrors.activeTheme && (
							<p className="text-red-500 text-sm mt-1">
								{themeErrors?.activeTheme?.message}
							</p>
						)}
					</div>
					<Button type='submit' className='mt-6' disabled={saveActiveThemeMutation.isPending}>
						{saveActiveThemeMutation.isPending ? __('Activating...', 'versatile-toolkit') : __('Activate Theme', 'versatile-toolkit')}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default TroubleShoot
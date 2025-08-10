import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button'
import MultipleSelector from '@pages/troubleshoot/multi-selector';
import TaggedInput from '@pages/troubleshoot/tag-input';
import ThemeSelector from '@pages/troubleshoot/theme-selector';
import { InlineLoader, ButtonLoader } from '@/components/loader';
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
			chosen_plugins: [],
			ip_tags: [],
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

	// theme selector
	const { handleSubmit: handleThemeSubmit, control: themeControl, formState: { errors: themeErrors } } = useForm<ThemeFormValues>({
		resolver: zodResolver(themeFormSchema),
		defaultValues: {
			activeTheme: '',
		}
	});
	const saveActiveThemeMutation = useSaveActiveTheme();
	const onThemeSubmit = async (values: ThemeFormValues) => {
		await saveActiveThemeMutation.mutateAsync({ ...values });
	}

	const { data: activeThemeData, isFetching: isActiveThemeFetching } = useGetActiveTheme();
	const activeTheme = activeThemeData?.data['activeTheme'];

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
							isFetching ? <InlineLoader size="md" text={__('Loading plugins', 'versatile-toolkit')} /> :
								<Controller
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
							isFetching ? <InlineLoader size="md" text={__('Loading settings', 'versatile-toolkit')} /> :
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
						{disablePluginMutation.isPending ? __('Saving...', 'versatile-toolkit') : __('Save List', 'versatile-toolkit')}
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
							isActiveThemeFetching ? <InlineLoader size="md" text={__('Loading themes', 'versatile-toolkit')} /> : <Controller
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
						<ButtonLoader
							isLoading={saveActiveThemeMutation.isPending}
							loadingText={__('Activating', 'versatile-toolkit')}
						>
							{__('Activate Theme', 'versatile-toolkit')}
						</ButtonLoader>
					</Button>
				</form>
			</div>
			
		</div>
	);
};

export default TroubleShoot
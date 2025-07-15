import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button'
import MultipleSelector from './multi-selector';
import TaggedInput from './tag-input';

import { disablePluginFormSchema, DisablePluginFormValues, ipv4Regex } from '@/utils/schemaValidation'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { useDisablePlugin, useGetDisablePluginList } from '@/services/tukitaki-services';
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

	const disablePluginMutation = useDisablePlugin();

	const onSubmit = async (values: DisablePluginFormValues) => {
		await disablePluginMutation.mutateAsync({ ...values });
	}

	const { data: disablePluginData, isFetching, isLoading: disablePluginListLoading, isError: disablePluginListError } = useGetDisablePluginList();

	const chosenPluginList = disablePluginData?.data['chosenPlugins'];
	const chosenIpList = disablePluginData?.data['ipTags'];

	useEffect(() => {
		if (chosenPluginList || chosenIpList) {
			// Set default values when data is loaded
			control._reset({
				chosenPlugins: chosenPluginList || [],
				ipTags: chosenIpList || [],
			});
		}
	}, [chosenPluginList, chosenIpList, control]);

	return (
		<div className="p-4 space-y-6">
			<h2 className='flex items-center gap-2 text-2xl'>
				<Link to={'/'}>
					<ArrowLeft />
				</Link>
				{__('Tukitaki Dashboard', 'tukitaki')}
			</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='min-h-[42px]'>
					{
						isFetching ? 'Loading' : <Controller
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
							{errors.chosenPlugins.message}
						</p>
					)}
				</div>
				<div className='min-h-[64px] mt-2'>
					{
						isFetching ? 'Loading' :
							<Controller
								name='ipTags'
								control={control}
								render={({ field }) => (
									<TaggedInput
										tags={field.value}
										onChange={field.onChange}
										// actionBtn={<button>yo</button>}
										// actionBtn={
										// 	<Button
										// 		type="button"
										// 		size="sm"
										// 		className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 h-5"
										// 		onClick={addMyIp}
										// 	>
										// 		{__('Add My IP', 'tukitaki')}
										// 	</Button>
										// }
									// onChange={(newTags: string[]) => {
									// 	console.log('newTags', newTags);
									// 	const validTags = newTags.filter(tag => ipv4Regex.test(tag));
									// 	field.onChange(validTags);
									// }}
									/>
								)}
							/>
					}
					{errors.ipTags && (
						<p className="text-red-500 text-sm mt-1">
							{errors.ipTags[0]?.message}
						</p>
					)}
				</div>
				<Button type='submit' className='mt-2'>Submit</Button>
			</form>
		</div>
	);
};

export default TroubleShoot
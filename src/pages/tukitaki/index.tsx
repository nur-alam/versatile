import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import MultipleSelector from './multi-selector';
import TaggedInput from './tag-input';
import { Form } from '@/components/ui/form';

import { disablePluginFormSchema, DisablePluginFormValues, ipv4Regex } from '@/utils/schemaValidation'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { useDisablePlugin } from '@/services/connection-services';

const TukitakiDashboard = () => {
	// const navigate = useNavigate();

	const { handleSubmit, control, formState: { errors } } = useForm<DisablePluginFormValues>({
		resolver: zodResolver(disablePluginFormSchema),
		defaultValues: {
			chosenPlugins: [],
			ipTags: [],
		}
	});

	const disablePluginMutation = useDisablePlugin();

	const onSubmit = async (values: DisablePluginFormValues) => {
		console.log('Submitting', values);
		await disablePluginMutation.mutateAsync({ ...values });
	}

	return (
		<div className="p-4 space-y-6">
			<h2 className='text-2xl'>{__('Tukitaki Dashboard', 'tukitaki')}</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<Controller
						name='chosenPlugins'
						control={control}
						render={({ field }) => (
							<MultipleSelector
								selectedPlugin={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
					{errors.chosenPlugins && (
						<p className="text-red-500 text-sm mt-1">
							{errors.chosenPlugins.message}
						</p>
					)}
				</div>
				<div>
					<Controller
						name='ipTags'
						control={control}
						render={({ field }) => (
							<TaggedInput
								tags={field.value}
								onChange={field.onChange}
							// onChange={(newTags: string[]) => {
							// 	console.log('newTags', newTags);
							// 	const validTags = newTags.filter(tag => ipv4Regex.test(tag));
							// 	field.onChange(validTags);
							// }}
							/>
						)}
					/>
					{errors.ipTags && (
						<p className="text-red-500 text-sm mt-1">
							{errors.ipTags[0]?.message}
						</p>
					)}
				</div>
				<Button type='submit'>Submit</Button>
			</form>
		</div>
	);
};

export default TukitakiDashboard
import React from 'react'
import { __ } from '@wordpress/i18n'
import { MaintenanceMoodFormValues, maintenanceMoodFromSchema } from '@/utils/schemaValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useUpdateMaintenanceMood } from '@/services/maintenance-services';
import { Switch } from '@/components/ui/switch';

const MaintenanceSettings = () => {
	const maintenanceMoodFrom = useForm<MaintenanceMoodFormValues>({
		resolver: zodResolver(maintenanceMoodFromSchema),
		defaultValues: {
			enable_maintenance: true,
			title: '',
			description: '',
			subtitle: ''
		}
	});

	const { handleSubmit, control, formState: { errors } } = maintenanceMoodFrom;

	const updateMaintenanceMoodMutation = useUpdateMaintenanceMood();

	const onSubmit = async (values: MaintenanceMoodFormValues) => {
		await updateMaintenanceMoodMutation.mutateAsync(values);
		console.log('Maintenance mood form values', values);
	}

	return (
		<div className="p-4 space-y-6">
			<Form {...maintenanceMoodFrom}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormField
						control={maintenanceMoodFrom.control}
						name="enable_maintenance"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel className="text-foreground" htmlFor='enable_maintenance'>
									{__('Enable Maintenance Mood', 'tukitaki')}
								</FormLabel>
								<FormControl>
									<Switch id='enable_maintenance'
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								{!fieldState.error &&
									<FormDescription>
										{__('This will be displayed as the main heading.', 'tukitaki')}
									</FormDescription>
								}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={maintenanceMoodFrom.control}
						name="title"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel className="text-foreground">
									{__('Title', 'tukitaki')}
								</FormLabel>
								<FormControl>
									<Input placeholder={__('Enter maintenance title', 'tukitaki')} {...field} />
								</FormControl>
								{!fieldState.error &&
									<FormDescription>
										{__('This will be displayed as the main heading.', 'tukitaki')}
									</FormDescription>
								}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={maintenanceMoodFrom.control}
						name="subtitle"
						render={({ field, fieldState }) => (
							<FormItem className='mt-6'>
								<FormLabel className="text-foreground">{__('Subtitle', 'tukitaki')}</FormLabel>
								<FormControl>
									<Input placeholder={__('Enter subtitle', 'tukitaki')} {...field} />
								</FormControl>
								{!fieldState.error &&
									<FormDescription>
										{__('Optional subtitle under the title.', 'tukitaki')}
									</FormDescription>
								}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={maintenanceMoodFrom.control}
						name="description"
						render={({ field, fieldState }) => (
							<FormItem className='mt-6'>
								<FormLabel className="text-foreground">{__('Description', 'tukitaki')}</FormLabel>
								<FormControl>
									<Textarea placeholder={__('Describe what is happening...', 'tukitaki')} {...field} />
								</FormControl>
								{!fieldState.error &&
									<FormDescription>
										{__('Provide more details about the maintenance.', 'tukitaki')}
									</FormDescription>
								}
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className='mt-6'>
						{__('Save Settings', 'tukitaki')}
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default MaintenanceSettings
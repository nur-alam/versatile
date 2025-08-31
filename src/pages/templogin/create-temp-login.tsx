import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createTemploginFormSchema, CreateTemploginFormValues } from '@/utils/schema-validation'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import config from '@/config'
import { useAvailableRoles, useCreateTempLogin } from '@/services/temp-login-services'
import { InlineLoader } from '@/components/loader'

export const rolesOptions = [
	{ value: 'administrator', label: __('Administrator', 'versatile-toolkit') },
	{ value: 'editor', label: __('Editor', 'versatile-toolkit') },
	{ value: 'author', label: __('Author', 'versatile-toolkit') },
	{ value: 'contributor', label: __('Contributor', 'versatile-toolkit') },
	{ value: 'subscriber', label: __('Subscriber', 'versatile-toolkit') },
]

export const expiresAtOptions = [
	{ value: '1_hour', label: __('1 Hour', 'versatile-toolkit') },
	{ value: '3_hours', label: __('3 Hours', 'versatile-toolkit') },
	{ value: '6_hours', label: __('6 Hours', 'versatile-toolkit') },
	{ value: '12_hours', label: __('12 Hours', 'versatile-toolkit') },
	{ value: '1_day', label: __('1 Day', 'versatile-toolkit') },
	{ value: '3_days', label: __('3 Days', 'versatile-toolkit') },
	{ value: '1_week', label: __('1 Week', 'versatile-toolkit') },
	{ value: '2_weeks', label: __('2 Weeks', 'versatile-toolkit') },
	{ value: '1_month', label: __('1 Month', 'versatile-toolkit') },
	{ value: '3_months', label: __('3 Months', 'versatile-toolkit') },
	{ value: '6_months', label: __('6 Months', 'versatile-toolkit') },
	{ value: '1_year', label: __('1 Year', 'versatile-toolkit') },
];

const CreateTempLogin = () => {

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const createTemploginForm = useForm<CreateTemploginFormValues>({
		resolver: zodResolver(createTemploginFormSchema),
		defaultValues: {
			display_name: 'Nur',
			email: 'nuralam862@gmail.com',
			role: 'administrator',
			expires_at: '3_hours' as const,
			redirect_url: config.admin_url,
			ip_address: '127.0.0.1'
		}
	})

	const {
		handleSubmit,
		formState: { errors },
	} = createTemploginForm;

	const { data: availableRoles, isLoading: isAvailableRolesLoading } = useAvailableRoles();

	const { mutateAsync: createTempLogin } = useCreateTempLogin();

	const onCreateFormSubmit = async (values: CreateTemploginFormValues) => {
		await createTempLogin(values, {
			onSuccess: () => {
				setIsCreateModalOpen(false);
			}
		});
	}

	return (
		<>
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogTrigger asChild>
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						{__('Create Temp Login', 'versatile-toolkit')}
					</Button>
				</DialogTrigger>
				<DialogContent className='max-w-lg'>
					<DialogHeader>
						<DialogTitle>{__('Create Temporary Login', 'versatile-toolkit')}</DialogTitle>
					</DialogHeader>
					<Form {...createTemploginForm}>
						<form onSubmit={handleSubmit(onCreateFormSubmit, (error) => {
							console.log('Error', error);
						})}
							className='flex flex-col gap-5'
						>
							<FormField
								control={createTemploginForm.control}
								name="display_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground'>{__('Display Name', 'versatile-toolkit')}</FormLabel>
										<FormControl>
											<Input placeholder={__('Display Name', 'versatile-toolkit')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createTemploginForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground'>{__('Email', 'versatile-toolkit')}</FormLabel>
										<FormControl>
											<Input placeholder={__('Email', 'versatile-toolkit')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createTemploginForm.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground'>{__('Role', 'versatile-toolkit')}</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder={__('Select role', 'versatile-toolkit')} />
												</SelectTrigger>
												<SelectContent className='w-full max-h-60 scroll-auto'>
													{
														isAvailableRolesLoading ?
															<InlineLoader size="md" className='ml-2' text={__('Loading roles', 'versatile-toolkit')} />
															:
															Object.entries(availableRoles ?? {}).map(([key, value]) => (
																<SelectItem key={key} value={key}>{String(value)}</SelectItem>
															))
													}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createTemploginForm.control}
								name="expires_at"
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground'>{__('Expires At', 'versatile-toolkit')}</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder={__('Select expires at', 'versatile-toolkit')} />
												</SelectTrigger>
												<SelectContent className='w-full max-h-60 scroll'>
													{expiresAtOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createTemploginForm.control}
								name="redirect_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-foreground'>{__('Redirect URL', 'versatile-toolkit')}</FormLabel>
										<FormControl>
											<Input placeholder={__('Redirect URL', 'versatile-toolkit')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createTemploginForm.control}
								name="ip_address"
								render={({ field }) => (
									<FormItem className='text-foreground'>
										<FormLabel className='text-foreground'>{__('IP Address', 'versatile-toolkit')}</FormLabel>
										<FormControl>
											<Input placeholder={__('IP Address', 'versatile-toolkit')} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex justify-end'>
								<Button type="submit">{__('Create Temporary Login', 'versatile-toolkit')}</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

		</>
	)
}

export default CreateTempLogin

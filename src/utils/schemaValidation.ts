import { z } from 'zod';

// IPv4 regex
export const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const disablePluginFormSchema = z.object({
	chosenPlugins: z.array(z.string()).min(1, 'Select at least one plugin'),
	ipTags: z.array(
		z.string().refine((value) => ipv4Regex.test(value), {
			message: 'Invalid IP address',
		})
	),
});

export type DisablePluginFormValues = z.infer<typeof disablePluginFormSchema>;

export const maintenanceMoodFromSchema = z.object({
	enable_maintenance: z.boolean(),
	title: z.string().min(2, 'Title must be more than 2 characters'),
	description: z.string().min(2, 'Description must be more than 2 characters'),
	subtitle: z.string().min(2, 'Subtitle must be more than 2 characters'),
});

export type MaintenanceMoodFormValues = z.infer<typeof maintenanceMoodFromSchema>;

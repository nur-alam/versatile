import { z } from 'zod';

// IPv4 regex
export const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const disablePluginFormSchema = z.object({
	chosenPlugins: z.array(z.string()),
	ipTags: z.array(
		z.string().refine((value) => ipv4Regex.test(value), {
			message: 'Invalid IP address',
		})
	),
});

export type DisablePluginFormValues = z.infer<typeof disablePluginFormSchema>;

// Maintenance Mood
export const maintenanceMoodFormSchema = z.object({
	enable_maintenance: z.boolean(),
	title: z.string().min(2, 'Title must be more than 2 characters'),
	description: z.string().min(2, 'Description must be more than 2 characters'),
	subtitle: z.string().min(2, 'Subtitle must be more than 2 characters'),
});

export type MaintenanceMoodFormValues = z.infer<typeof maintenanceMoodFormSchema>;

// Comingsoon Mood
export const comingsoonMoodFormSchema = z.object({
	enable_comingsoon: z.boolean(),
	title: z.string().min(2, 'Title must be more than 2 characters'),
	description: z.string().min(2, 'Description must be more than 2 characters'),
	subtitle: z.string().min(2, 'Subtitle must be more than 2 characters'),
});

export type ComingsoonMoodFormValues = z.infer<typeof comingsoonMoodFormSchema>;

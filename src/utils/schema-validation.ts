import { z } from 'zod';

// IPv4 regex
export const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const disablePluginFormSchema = z.object({
	chosenPlugins: z.array(z.string()),
	ipTags: z.array(
		z.string().refine((value) => ipv4Regex.test(value), {
			message: 'Invalid IP address',
		})
	).min(1, { message: 'At least one IP address is required' }),
});

export type DisablePluginFormValues = z.infer<typeof disablePluginFormSchema>;

// Maintenance Mood
export const maintenanceMoodFormSchema = z.object({
	enable_maintenance: z.boolean(),
	title: z.string(),
	description: z.string(),
	subtitle: z.string(),
	background_image: z.string().optional(),
	background_image_id: z.coerce.number().optional(),
	logo: z.string().optional(),
	logo_id: z.coerce.number().optional(),
});

export type MaintenanceMoodFormValues = z.infer<typeof maintenanceMoodFormSchema>;

// Comingsoon Mood
export const comingsoonMoodFormSchema = z.object({
	enable_comingsoon: z.boolean(),
	title: z.string(),
	description: z.string(),
	subtitle: z.string(),
	background_image: z.string().optional(),
	background_image_id: z.coerce.number().optional(),
	logo: z.string().optional(),
	logo_id: z.coerce.number().optional(),
});

export type ComingsoonMoodFormValues = z.infer<typeof comingsoonMoodFormSchema>;

// Theme Selector
export const themeFormSchema = z.object({
	activeTheme: z.string().min(1, { message: 'Please select a theme' }),
});

export type ThemeFormValues = z.infer<typeof themeFormSchema>;

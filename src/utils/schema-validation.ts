import { z } from 'zod';

// IPv4 regex
export const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const disablePluginFormSchema = z.object({
	chosen_plugins: z.array(z.string()),
	ip_tags: z.array(
		z.string().refine((value) => ipv4Regex.test(value), {
			message: 'Invalid IP address',
		})
	).min(1, { message: 'At least one IP address is required' }),
});

export type DisablePluginFormValues = z.infer<typeof disablePluginFormSchema>;

// Maintenance Mood
export const maintenanceMoodFormSchema = z.object({
	enable_maintenance: z.boolean(),
	show_subscribers_only: z.boolean(),
	title: z.string().min(1, { message: 'Title is required' }).min(3, { message: 'Title must be at least 3 characters' }),
	description: z.string().min(1, { message: 'Description is required' }).min(10, { message: 'Description must be at least 10 characters' }),
	subtitle: z.string().min(1, { message: 'Subtitle is required' }).min(3, { message: 'Subtitle must be at least 3 characters' }),
	background_image: z.string().optional(),
	background_image_id: z.coerce.number().optional(),
	logo: z.string().optional(),
	logo_id: z.coerce.number().optional(),
	template: z.string().optional(),
});

export type MaintenanceMoodFormValues = z.infer<typeof maintenanceMoodFormSchema>;

// Comingsoon Mood
export const comingsoonMoodFormSchema = z.object({
	enable_comingsoon: z.boolean(),
	show_subscribers_only: z.boolean(),
	title: z.string().min(1, { message: 'Title is required' }).min(3, { message: 'Title must be at least 3 characters' }),
	description: z.string().min(1, { message: 'Description is required' }).min(10, { message: 'Description must be at least 10 characters' }),
	subtitle: z.string().min(1, { message: 'Subtitle is required' }).min(3, { message: 'Subtitle must be at least 3 characters' }),
	background_image: z.string().optional(),
	background_image_id: z.coerce.number().optional(),
	logo: z.string().optional(),
	logo_id: z.coerce.number().optional(),
	template: z.string().optional(),
});

export type ComingsoonMoodFormValues = z.infer<typeof comingsoonMoodFormSchema>;

// Theme Selector
export const themeFormSchema = z.object({
	activeTheme: z.string().min(1, { message: 'Please select a theme' }),
});

export type ThemeFormValues = z.infer<typeof themeFormSchema>;

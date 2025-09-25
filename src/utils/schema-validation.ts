import { z } from 'zod';

// IPv4 regex
export const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const disablePluginFormSchema = z.object({
	chosen_plugins: z.array(z.string()),
	ip_tags: z
		.array(
			z.string().refine((value) => ipv4Regex.test(value), {
				message: 'Invalid IP address',
			})
		)
		.min(1, { message: 'At least one IP address is required' }),
});

export type DisablePluginFormValues = z.infer<typeof disablePluginFormSchema>;

// Maintenance Mood
export const maintenanceMoodFormSchema = z.object({
	enable_maintenance: z.boolean(),
	show_subscribers_only: z.boolean(),
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.min(3, { message: 'Title must be at least 3 characters' }),
	description: z
		.string()
		.min(1, { message: 'Description is required' })
		.min(10, { message: 'Description must be at least 10 characters' }),
	subtitle: z
		.string()
		.min(1, { message: 'Subtitle is required' })
		.min(3, { message: 'Subtitle must be at least 3 characters' }),
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
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.min(3, { message: 'Title must be at least 3 characters' }),
	description: z
		.string()
		.min(1, { message: 'Description is required' })
		.min(10, { message: 'Description must be at least 10 characters' }),
	subtitle: z
		.string()
		.min(1, { message: 'Subtitle is required' })
		.min(3, { message: 'Subtitle must be at least 3 characters' }),
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

// Create Temporary Login

const expires_values = [
	'1_hour',
	'3_hours',
	'6_hours',
	'12_hours',
	'1_day',
	'3_days',
	'1_week',
	'2_weeks',
	'1_month',
	'3_months',
	'6_months',
	'1_year',
	'custom',
] as const;

export const createTemploginFormSchema = z.object({
	display_name: z.string().min(1, { message: 'Display name is required' }),
	email: z.string().email({ message: 'Invalid email address' }),
	role: z.string().min(1, { message: 'Please select a role' }),
	expires_at: z.enum(expires_values, { message: 'Please select an expiration time' }),
	redirect_url: z.string().url({ message: 'Invalid URL format' }),
	ip_address: z
		.string()
		.optional()
		.refine((value) => value ? ipv4Regex.test(value) : true, {
			message: 'Invalid IP address',
		}),
	// .min(1, { message: 'At least one IP address is required' }),
});

export type CreateTemploginFormValues = z.infer<typeof createTemploginFormSchema>;

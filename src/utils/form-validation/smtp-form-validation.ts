import { __ } from '@wordpress/i18n';
import { z } from 'zod';
import { emailProviderOptions, smtpSecurityOptions, smtpPortOptions } from '../versatile-declaration';

export const smtpConfigSchema = z.object({
	provider: z.enum(emailProviderOptions, { message: 'Invalid email provider' }),
	fromName: z.string().min(1, { message: 'From name is required' }),
	fromEmail: z.string().min(1, { message: 'From email is required' }),
	smtpHost: z.string().min(1, { message: 'SMTP host is required' }),
	smtpPort: z.enum(smtpPortOptions, { message: 'Invalid port' }),
	smtpSecurity: z.enum(smtpSecurityOptions, { message: 'Invalid security type' }),
	smtpUsername: z.string().min(1, { message: 'SMTP username is required' }),
	smtpPassword: z.string().min(1, { message: 'SMTP password is required' }),
});

export type SmtpConfigFormValues = z.infer<typeof smtpConfigSchema>;
